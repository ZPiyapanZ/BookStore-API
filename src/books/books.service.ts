import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { Book } from './book.model';
import { Cache } from 'cache-manager';
import * as _ from 'lodash';
@Injectable()
export class BooksService {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getBooks(): Promise<Book> {
    console.log(await this.cacheManager.store.keys());

    const found: Book = await this.cacheManager.get('sortedBooks');
    if (!found) {
      const books = await this.setBooks();
      return books;
    }
    return found;
  }

  async setBooks(): Promise<Book> {
    const promises = [];
    const now = new Date();
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    //Expires at the end of every day
    const expire = (endOfDay - now.getTime()) / 1000;

    const getRecommendedBooks = firstValueFrom(
      this.httpService
        .get(
          `https://scb-test-book-publisher.herokuapp.com/books/recommendation`,
        )
        .pipe(
          map((response) => response.data),
          map((books: Book[]) => books.map((book: Book) => book.id)),
        ),
    ).catch((e) => {
      throw new HttpException(e.response.data, e.response.status);
    });
    const getBooks = firstValueFrom(
      this.httpService
        .get(`https://scb-test-book-publisher.herokuapp.com/books`)
        .pipe(map((response) => response.data)),
    ).catch((e) => {
      throw new HttpException(e.response.data, e.response.status);
    });
    const recommendedBooksId = await getRecommendedBooks.then((bookId) => {
      return bookId;
    });

    const books = await getBooks.then((books) => {
      return books;
    });
    await books.map((book) => {
      if (recommendedBooksId.includes(book.id)) {
        book.is_recommended = true;
      } else {
        book.is_recommended = false;
      }
      promises.push(this.cacheManager.set(`${book.id}`, book, { ttl: expire }));
      return book;
    });
    const sortedBooks = _.orderBy(
      books,
      ['is_recommended', 'book_name'],
      ['desc', 'asc'],
    );
    promises.push(
      this.cacheManager.set('sortedBooks', sortedBooks, { ttl: expire }),
    );
    await Promise.all(promises);
    return sortedBooks;
  }
}
