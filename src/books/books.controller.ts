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
  Logger,
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

  // Search books by title or author
  @Get('search')
  async searchBooks(@Query('q') q: string): Promise<Book[]> {
    Logger.log(`Search Query: ${q}`);
    return this.bookService.searchBooks(q);
  }

  // Get all books
  @Get()
  async findAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  // Get a book by ID
  @Get(':id')
  async getBook(@Param('id', new ParseUUIDPipe()) id: string): Promise<Book> {
    return this.bookService.getBook(id);
  }

  // Update a book by ID
  @Put(':id')
  async updateBook(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updates: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateBook(id, updates);
  }

  // Delete a book by ID
  @Delete(':id')
  async deleteBook(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.bookService.deleteBook(id);
  }

  // Borrow a book
  @Post(':id/borrow')
  async borrowBook(@Param('id', new ParseUUIDPipe()) id: string): Promise<Book> { 
    return this.bookService.borrowBook(id);
  }
}
