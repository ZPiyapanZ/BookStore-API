import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Orders } from './orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
  ) {}
  async createOrder(createOrderDto: CreateOrderDto[]) {
    const orders = this.ordersRepository.create(createOrderDto);
    await this.ordersRepository.save(orders);
    return orders;
  }
}
