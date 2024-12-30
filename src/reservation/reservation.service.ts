// reservation.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BookService } from 'src/books/books.service';
import { Book } from 'src/books/books.types';
import { DynamoDBService } from 'src/dynamodb/dynamodb.service';

@Injectable()
export class ReservationService {
  private readonly BOOKS_TABLE = 'Books';
  private readonly RESERVATIONS_TABLE = 'BookReservation';

  constructor(
    private readonly dynamoDBService: DynamoDBService,
    private readonly bookService: BookService,
  ) {}

  async borrowBook(bookId: string, cognitoUserId: string): Promise<Book> {
    try {
      // Check if book exists
      const book = await this.bookService.getBook(bookId); // Changed from findOne to getBook
      if (!book) {
        throw new NotFoundException(`Book with ID ${bookId} not found`);
      }
      
      // Check if book is available
      if (!book.available) {
        throw new BadRequestException('Book is not available for borrowing');
      }

      // Create reservation
      const reservation = {
        id: bookId,
        bookId: bookId,
        userId: cognitoUserId,
        borrowedAt: new Date().toISOString()
      };

      // Save reservation
      await this.dynamoDBService.put(this.RESERVATIONS_TABLE, reservation);

      // Update book availability
      await this.bookService.updateBook(bookId, { available: false });
      
      return book;

      // Update book status
      const updatedBook = await this.dynamoDBService.update(
        this.BOOKS_TABLE,
        { id: bookId },
        {
          available: false,
          borrowerId: cognitoUserId,
          borrowedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'BORROWED'
        }
      );

      if (!updatedBook) {
        // Rollback reservation if book update fails
        await this.dynamoDBService.delete(this.RESERVATIONS_TABLE, { id: bookId });
        throw new InternalServerErrorException('Failed to update book status');
      }

      return updatedBook as Book;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to borrow book: ${error.message}`,
        { cause: error }
      );
    }
  }

  async return(bookId: string): Promise<any> {
    try {
      // Check if reservation exists
      const reservation = await this.dynamoDBService.get(this.RESERVATIONS_TABLE, { id: bookId });
      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      // Update book status
      const updatedBook = await this.dynamoDBService.update(
        this.BOOKS_TABLE,
        { id: bookId },
        {
          available: true,
          borrowerId: null,
          borrowedAt: null,
          updatedAt: new Date().toISOString(),
          status: 'AVAILABLE'
        }
      );

      if (!updatedBook) {
        throw new InternalServerErrorException('Failed to update book status');
      }

      // Delete reservation
      await this.dynamoDBService.delete(this.RESERVATIONS_TABLE, { id: bookId });

      return {
        message: 'Book successfully returned',
        book: updatedBook
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to return book: ${error.message}`,
        { cause: error }
      );
    }
  }
}
