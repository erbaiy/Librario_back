import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { BooksModule } from 'src/books/books.module';
import { DynamoDBModule } from 'src/dynamodb/dynamodb.module';

@Module({
  imports: [
    
    BooksModule,
    DynamoDBModule, 
    
  ],
  controllers: [ReservationController,],
  providers: [ReservationService,],
})
export class ReservationModule {}
