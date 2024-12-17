import { Module } from '@nestjs/common';
import { BookService } from './books.service';
import { BooksController } from './books.controller';
import { DynamoDBService } from 'src/dynamodb/dynamodb.service';  // Correct import

@Module({
  controllers: [BooksController],  // Only controllers should be here
  providers: [BookService, DynamoDBService],  // Add DynamoDBService to providers
  exports: [BookService],  // Export BookService if needed in other modules
})
export class BooksModule {}
