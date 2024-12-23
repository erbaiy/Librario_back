


import { Injectable, NotFoundException } from '@nestjs/common';
import { BookService } from 'src/books/books.service';
import { DynamoDBService } from 'src/dynamodb/dynamodb.service';

@Injectable()
export class ReservationService {
  constructor(
    private readonly dynamoDBService: DynamoDBService,
    private readonly bookService: BookService,
  ) {}



  async borrow(id: string) {
    const book = await this.bookService.getBook(id);
    if (!book.available) {
      throw new NotFoundException('Book is not available');
    }

    const reservation = {
      id: id,
      bookId: id,
      userId: '67602df30aa68e9570241294',
    };
   const result = await this.dynamoDBService.put('BookReservation', reservation);
   if(result){
    book.available = false;
    await this.bookService.updateBook(id, book);
   }


    return reservation;


}
async return(id: string) {

    const reservation = await this.dynamoDBService.get('BookReservation', { id });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
      await this.bookService.updateBook(reservation.bookId, { available: true });
  
    await this.dynamoDBService.delete('BookReservation', { id });
  
    return {
      message: 'Reservation successfully returned',
      reservation,
    };
  }
  
}