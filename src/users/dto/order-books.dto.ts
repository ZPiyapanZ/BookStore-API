import { IsNotEmpty } from 'class-validator';
export class OrderBooksDto {
  @IsNotEmpty()
  orders: number[];
}
