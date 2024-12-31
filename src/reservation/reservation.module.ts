import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { BooksModule } from 'src/books/books.module';
import { DynamoDBModule } from 'src/dynamodb/dynamodb.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    
    BooksModule,
    DynamoDBModule, 
    AuthModule
    
  ],
  controllers: [ReservationController,],
  providers: [ReservationService,],
})
export class ReservationModule {}
