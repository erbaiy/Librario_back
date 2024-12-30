import { 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException, 
  BadRequestException, 
  Logger
} from '@nestjs/common';
import { DynamoDBService } from '../dynamodb/dynamodb.service';
import { CreateBookDto } from './dto/create-book.dto';
import { randomUUID } from 'crypto';
import { Book } from './books.types';

@Injectable()
export class BookService {
  private readonly tableName = 'Books';
  private readonly categoryTableName = 'Categories';

  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async createBook(bookData: CreateBookDto): Promise<Book> {
    try {
      // Validate category exists
      const categoryExists = await this.validateCategory(bookData.category);
      if (!categoryExists) {
        throw new BadRequestException('Invalid category specified');
      }

      const newBook: Book = {
        id: randomUUID(),
        ...bookData,
        available: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.dynamoDBService.put(this.tableName, newBook);
      return newBook;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create book: ${error.message}`,
        { cause: error }
      );
    }
  }

  async getBook(id: string): Promise<Book> {
    try {
      if (!id) {
        throw new BadRequestException('Book ID is required');
      }

      const book = await this.dynamoDBService.get(this.tableName, { id });
      if (!book) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      return book as Book;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to get book: ${error.message}`,
        { cause: error }
      );
    }
  }

  async findAll(): Promise<Book[]> {
    try {

      console.log('Table name:', this.tableName)
      const books = await this.dynamoDBService.scan(this.tableName);
      return books as Book[];
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get books: ${error.message}`,
        { cause: error }
      );
    }
  }

  async updateBook(id: string, updates: Partial<CreateBookDto>): Promise<Book> {
    try {
      // Check if book exists
     
     const isExist= await this.getBook(id);
      if (!isExist) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      // If category is being updated, validate it exists
      if (updates.category) {
        const categoryExists = await this.validateCategory(updates.category);
        if (!categoryExists) {
          throw new BadRequestException('Invalid category specified');
        }
      }

      const updatedBook = await this.dynamoDBService.update(
        this.tableName,
        { id },
        {
          ...updates,
          updatedAt: new Date().toISOString()
        }
      );

      return updatedBook as Book;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update book: ${error.message}`,
        { cause: error }
      );
    }
  }

  async deleteBook(id: string): Promise<void> {
    try {
      if (!id) {
        throw new BadRequestException('Book ID is required');
      }

      // Check if book exists before deletion
      await this.getBook(id);

      await this.dynamoDBService.delete(this.tableName, { id });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to delete book: ${error.message}`,
        { cause: error }
      );
    }
  }

  private async validateCategory(categoryId: string): Promise<boolean> {
    try {
      const category = await this.dynamoDBService.get(
        this.categoryTableName, 
        { id: categoryId }
      );
      return !!category;
    } catch (error) {
      console.error('Error validating category:', error);
      return false;
    }
  }

  async searchBooks(query: string): Promise<Book[]> {
    try {
      const books = await this.dynamoDBService.scan(this.tableName);
      Logger.log('Books fetched:', books);
      const filteredBooks = books.filter(book => {
        return book?.title?.toLowerCase().includes(query.toLowerCase()) || 
               book?.author?.toLowerCase().includes(query.toLowerCase());
      }) as Book[];
      Logger.log('Filtered books:', filteredBooks);
      return filteredBooks;
    } catch (error) {
      Logger.error(`Failed to search books: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to search books: ${error.message}`,
        { cause: error },
      );
    }
  }
  

  // borrow a book 



}