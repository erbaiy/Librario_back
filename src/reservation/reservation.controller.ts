// reservation.controller.ts
import { Controller, Param, ParseUUIDPipe, Post, Request, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { AuthGuard } from '@nestjs/passport';
import { Book } from 'src/books/books.types';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/borrow')
  async borrowBook(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req
  ): Promise<Book> {
    console.log('User:', req.user); // Add this to debug

    const cognitoUserId = req.user.sub;
    return this.reservationService.borrowBook(id, cognitoUserId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/return')
  return(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.reservationService.return(id);
  }
}
