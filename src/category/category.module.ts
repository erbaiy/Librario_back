import { Module } from '@nestjs/common';
import { DynamoDBModule } from '../dynamodb/dynamodb.module';
import { CategoryExistsRule } from '../dynamodb/category-exists.rule';
import { CategoryService } from './category.service';

@Module({
  imports: [DynamoDBModule], // Import DynamoDBModule to use DynamoDBService
  providers: [CategoryService, CategoryExistsRule], // Register CategoryExistsRule
  exports: [CategoryService, CategoryExistsRule],   // Export for use in other modules
})
export class CategoryModule {}
