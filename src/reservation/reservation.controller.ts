// reservation.controller.ts
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Request, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { AuthGuard } from '@nestjs/passport';
import { Book } from 'src/books/books.types';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}


  // @Get('/borrowed')
  // getBorrowedBooks() {
  //   return this.reservationService.getBorrowedBooks();
  // }

  // @UseGuards(AuthGuard('jwt'))
  @Post('/borrow')
async borrowBook(
  @Body('bookId', new ParseUUIDPipe()) bookId: string,
  @Body('userId', new ParseUUIDPipe()) userId: string,
): Promise<Book> {
  return this.reservationService.borrowBook(bookId, userId);
}
  
  @Post(':id/return')
  return(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.reservationService.return(id);
  }
}
