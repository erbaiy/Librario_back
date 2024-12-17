// src/books/books.service.ts
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DynamoDBService } from 'src/dynamodb/dynamodb.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  private readonly tableName = 'Books';
  
  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    try {
      // Additional validation if needed
      if (!createBookDto.title || !createBookDto.author) {
        throw new BadRequestException('Title and author are required');
      }

      const data: Book = {
        id: uuidv4(),
        title: createBookDto.title,
        author: createBookDto.author,
        category: createBookDto.category,
        available: createBookDto.available,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.dynamoDBService.put(this.tableName, data);
      return data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create book: ${error.message}`
      );
    }
  }

  async findAll(): Promise<Book[]> {
    try {
      const books = await this.dynamoDBService.scan(this.tableName);
      return books as Book[];
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch books: ${error.message}`
      );
    }
  }
}
