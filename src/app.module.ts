import { DynamoDBModule } from './dynamodb/dynamodb.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';
import { CategoryController } from './category/category.controller';
import { BooksModule } from './books/books.module';
import { DynamoDBService } from './dynamodb/dynamodb.service';
import { ReservationModule } from './reservation/reservation.module';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './config/config.module';
import { APP_FILTER } from '@nestjs/core';
import { BooksExceptionFilter } from './common/filters/books-exception.filter';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DynamoDBModule,
    CategoryModule,
    BooksModule,
    ReservationModule,
    AuthModule,
    ConfigurationModule,
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [AppController, CategoryController],
  providers: [
    AppService, 
    CategoryService,
    JwtStrategy,
    {
      provide: APP_FILTER,
      useClass: BooksExceptionFilter,
    }
  ]
})
export class AppModule {}
