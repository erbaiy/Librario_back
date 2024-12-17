import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { DynamoDBService } from 'src/dynamodb/dynamodb.service';

@Module({
  providers: [CategoryService, DynamoDBService],
  exports: [CategoryService],
})
export class CategoryModule {}