import { IsNotEmpty } from 'class-validator';
import { Users } from 'src/users/users.entity';
export class CreateOrderDto {
  @IsNotEmpty()
  bookId: number;
  @IsNotEmpty()
  book_name: string;
  @IsNotEmpty()
  author_name: string;
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  is_recommended: boolean;
  @IsNotEmpty()
  user: Users;
}
