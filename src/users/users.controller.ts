import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './users.entity';
import { UsersService } from './users.service';
import { OrderBooksDto } from './dto/order-books.dto';
import {
  ApiOkResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @HttpCode(200)
  createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.usersService.createUser(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get()
  getUserData(@GetUser() user: Users) {
    const { id, username, ...userData } = user;
    return userData;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Delete()
  deleteUser(@GetUser() user: Users) {
    return this.usersService.deleteUser(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post('/orders')
  @HttpCode(200)
  orderBooks(
    @Body() orderBooksDto: OrderBooksDto,
    @GetUser() user: Users,
  ): Promise<{ price: number }> {
    return this.usersService.orderBooks(orderBooksDto, user);
  }
}
