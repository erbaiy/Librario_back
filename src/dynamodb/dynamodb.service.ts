import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { getDynamoDBClient } from '../config/dynamodb.config';

@Injectable()
export class DynamoDBService implements OnModuleInit {
  private docClient: DynamoDBDocumentClient;
  private readonly logger = new Logger(DynamoDBService.name);

  onModuleInit() {
    this.docClient = getDynamoDBClient();

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

  async update(
    tableName: string,
    key: Record<string, any>,
    updates: Record<string, any>
  ) {
    const { id, createdAt, ...updateFields } = updates;
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};
  
    Object.keys(updateFields).forEach((field, index) => {
      updateExpressions.push(`#field${index} = :value${index}`);
      expressionAttributeNames[`#field${index}`] = field;
      expressionAttributeValues[`:value${index}`] = updateFields[field];
    });
  
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();
  
    const params = {
      TableName: tableName,
      Key: key,
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW' as const, // Explicitly use a valid ReturnValue
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
}
