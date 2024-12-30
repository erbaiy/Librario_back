// src/dynamodb/dynamodb.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  ResourceNotFoundException,
  ScalarAttributeType,
  KeyType,
  BillingMode,
  ReturnValue,
} from '@aws-sdk/client-dynamodb';
import { getDynamoDBClient } from '../config/dynamodb.config';

@Injectable()
export class DynamoDBService implements OnModuleInit {
  private docClient: DynamoDBDocumentClient;
  private dynamoClient: DynamoDBClient;
  private readonly logger = new Logger(DynamoDBService.name);

  async onModuleInit() {
    this.dynamoClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.docClient = getDynamoDBClient();

    await this.initializeTables();
  }

  private async initializeTables() {
    const tables = ['Books', 'BookReservation', 'Categories'];
    for (const tableName of tables) {
      await this.createTableIfNotExists(tableName);
    }
  }

  private async createTableIfNotExists(tableName: string) {
    try {
      await this.dynamoClient.send(
        new DescribeTableCommand({ TableName: tableName })
      );
      this.logger.log(`Table ${tableName} already exists`);
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        await this.createTable(tableName);
      } else {
        throw error;
      }
    }
  }

  private async createTable(tableName: string) {
    const params = {
      TableName: tableName,
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: ScalarAttributeType.S }
      ],
      KeySchema: [
        { AttributeName: 'id', KeyType: KeyType.HASH }
      ],
      BillingMode: BillingMode.PAY_PER_REQUEST
    };

    try {
      await this.dynamoClient.send(new CreateTableCommand(params));
      this.logger.log(`Created table ${tableName}`);
      await this.waitForTableActive(tableName);
    } catch (error) {
      this.logger.error(`Failed to create table ${tableName}:`, error);
      throw error;
    }
  }

  private async waitForTableActive(tableName: string) {
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      try {
        const { Table } = await this.dynamoClient.send(
          new DescribeTableCommand({ TableName: tableName })
        );
        
        if (Table.TableStatus === 'ACTIVE') {
          this.logger.log(`Table ${tableName} is now active`);
          return;
        }
      } catch (error) {
        this.logger.error(`Error checking table status:`, error);
      }

      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }

    throw new Error(`Table ${tableName} did not become active within the expected time`);
  }

  async put(tableName: string, item: Record<string, any>) {
    const params = {
      TableName: tableName,
      Item: {
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    try {
      await this.docClient.send(new PutCommand(params));
      return item;
    } catch (error) {
      this.logger.error(`Error inserting item into ${tableName}:`, error);
      throw new Error(`DynamoDB put operation failed: ${error.message}`);
    }
  }

  async get(tableName: string, key: Record<string, any>) {
    const params = {
      TableName: tableName,
      Key: key,
    };

    try {
      const response = await this.docClient.send(new GetCommand(params));
      return response.Item;
    } catch (error) {
      this.logger.error(`Error fetching item from ${tableName}:`, error);
      throw new Error(`DynamoDB get operation failed: ${error.message}`);
    }
  }

  async update(tableName: string, key: Record<string, any>, updates: Record<string, any>) {
    const { id, createdAt, updatedAt, ...updateFields } = updates;
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.keys(updateFields).forEach((field, index) => {
      updateExpressions.push(`#field${index} = :value${index}`);
      expressionAttributeNames[`#field${index}`] = field;
      expressionAttributeValues[`:value${index}`] = updateFields[field];
    });

    // Add updatedAt
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const params = {
      TableName: tableName,
      Key: key,
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: ReturnValue.ALL_NEW,
    };

    try {
      const response = await this.docClient.send(new UpdateCommand(params));
      return response.Attributes;
    } catch (error) {
      this.logger.error(`Error updating item in ${tableName}:`, error);
      throw new Error(`DynamoDB update operation failed: ${error.message}`);
    }
  }

  async delete(tableName: string, key: Record<string, any>) {
    const params = {
      TableName: tableName,
      Key: key,
    };

    try {
      await this.docClient.send(new DeleteCommand(params));
    } catch (error) {
      this.logger.error(`Error deleting item from ${tableName}:`, error);
      throw new Error(`DynamoDB delete operation failed: ${error.message}`);
    }
  }

  async scan(tableName: string) {
    const params = {
      TableName: tableName,
    };

    try {
      const response = await this.docClient.send(new ScanCommand(params));
      return response.Items || [];
    } catch (error) {
      this.logger.error(`Error scanning table ${tableName}:`, error);
      throw new Error(`DynamoDB scan operation failed: ${error.message}`);
    }
  }

  // Optional: Method to seed initial data if needed
  async seedInitialData() {
    try {
      // Example: Add a sample book
      const sampleBook = {
        id: 'sample-book-1',
        title: 'Sample Book',
        author: 'Sample Author',
        available: true,
        status: 'AVAILABLE',
      };

      await this.put('Books', sampleBook);
      this.logger.log('Added sample book to the database');

      // Example: Add a sample category
      const sampleCategory = {
        id: 'sample-category-1',
        name: 'Sample Category',
        description: 'A sample category description',
      };

      await this.put('Categories', sampleCategory);
      this.logger.log('Added sample category to the database');

    } catch (error) {
      this.logger.error('Failed to seed initial data:', error);
    }
  }
}
