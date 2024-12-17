import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamoDBModule } from './dynamodb/dynamodb.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';
import { CategoryController } from './category/category.controller';
import { BooksModule } from './books/books.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    DynamoDBModule,
    CategoryModule,
    BooksModule,

  ],
  controllers: [AppController,CategoryController,],
  providers: [AppService, CategoryService],
})
export class AppModule {}
