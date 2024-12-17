import { Controller, Post, Body, Get, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { BookService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BooksExceptionFilter } from '../common/filters/books-exception.filter';

@Controller('books')
@UseFilters(BooksExceptionFilter)
export class BooksController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.bookService.createBook(createBookDto);
  }

  @Get()
  async findAll() {
    return await this.bookService.findAll();
  }
}
