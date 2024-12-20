import { Module } from '@nestjs/common';
import { BookService } from './books.service';
import { BooksController } from './books.controller';
import { DynamoDBModule } from '../dynamodb/dynamodb.module';
import { CategoryExistsRule } from '../dynamodb/category-exists.rule';

@Module({
  imports: [DynamoDBModule], // Import DynamoDBModule
  controllers: [BooksController],
  providers: [BookService, CategoryExistsRule], // Provide only necessary providers
  exports: [BookService],
})
export class BooksModule {}
