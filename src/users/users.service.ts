import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  CACHE_MANAGER,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './users.entity';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { OrderBooksDto } from './dto/order-books.dto';
import { BooksService } from 'src/books/books.service';
import { OrdersService } from 'src/orders/orders.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private booksService: BooksService,
    private ordersService: OrdersService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { username, name, surname, password, date_of_birth } = createUserDto;
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      username,
      name,
      surname,
      password: hashedPassword,
      date_of_birth,
    });
    try {
      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteUser(user: Users): Promise<void> {
    await this.usersRepository.delete({ id: user.id });
  }
  async orderBooks(
    orderBooksDto: OrderBooksDto,
    user: Users,
  ): Promise<{ price: number }> {
    const ordersBooks = [];
    const notFoundBooks = [];
    let totalPrice = 0;
    //check cache books
    await this.booksService.getBooks();

    const { orders } = orderBooksDto;

    await orders.forEach(async (order) => {
      const found = await this.cacheManager.get(`${order}`);
      if (!found) {
        notFoundBooks.push(order);
      }
      totalPrice += found['price'];
      ordersBooks.push({
        price: found['price'],
        book_name: found['book_name'],
        author_name: found['author_name'],
        is_recommended: found['is_recommended'],
        bookId: found['id'],
        user,
      });
    });

    if (notFoundBooks.length) {
      throw new NotFoundException(`Books with ID "${notFoundBooks}" not found`);
    }
    await this.ordersService.createOrder(ordersBooks);

    return { price: totalPrice };
  }
}
