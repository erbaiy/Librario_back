import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BookService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './books.types';


@Controller('books') // Base route: /books
export class BooksController {
  constructor(private readonly bookService: BookService) {}

  // Create a new book
  @Post()
  async createBook(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  // Get a book by ID
  @Get(':id')
  async getBook(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.bookService.getBook(id);
  }

  // Get all books
  @Get()
  async findAll() {
    return this.bookService.findAll();
  }

  // Update a book by ID
  @Put(':id')
  async updateBook(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updates: UpdateBookDto,
  ) {
    return this.bookService.updateBook(id, updates);
  }

  // Delete a book by ID
  @Delete(':id')
  async deleteBook(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.bookService.deleteBook(id);
  }

  
}
