import { Controller, Delete, Param, Post } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ValidateDynamoDBKeyPipe } from '../common/validate-object-id.pipe';


@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService,

  ) {}

 
  @Post(':id/borrow')
  borrow(@Param('id', ValidateDynamoDBKeyPipe) id: string) {
    return this.reservationService.borrow(id);
  }

  @Post(':id/return')
  return(@Param('id', ValidateDynamoDBKeyPipe) id: string) {
    
    return this.reservationService.return(id);
  }

  // @Delete(':id')
  // remove(@Param('id', ValidateDynamoDBKeyPipe) id: string) {
  //   return this.ReservationService.remove(id);
  // }
}
