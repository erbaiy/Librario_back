import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Category } from './entities/category.entity';
import { DynamoDBService } from 'src/dynamodb/dynamodb.service';

@Injectable()
export class CategoryService {
  private readonly tableName = 'Categories';

  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async create(data: Partial<Category>): Promise<Category> {
    const category: Category = {
      

      id: uuidv4(),
      name: data.name,
      description: data.description,

    };

    try {
      await this.dynamoDBService.put(this.tableName, category);
      return category;
    } catch (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      const result = await this.dynamoDBService.scan(this.tableName);
      return result as Category[];
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Category> {
    try {
      const result = await this.dynamoDBService.get(this.tableName, { id });
      if (!result) {
        throw new Error(`Category with ID ${id} not found`);
      }
      return result as Category;
    } catch (error) {
      throw new Error(`Failed to fetch category: ${error.message}`);
    }
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    try {
      const updatedCategory = await this.dynamoDBService.update(
        this.tableName,
        { id },
        data
      );
      return updatedCategory as Category;
    } catch (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.dynamoDBService.delete(this.tableName, { id });
    } catch (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }
}
