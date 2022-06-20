import { Controller, Get } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.model';
@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  getBooks(): Promise<Book> {
    return this.booksService.getBooks();
  }
}
