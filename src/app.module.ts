import { CacheModule, Module, CacheInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/users.entity';
import { PassportModule } from '@nestjs/passport';
import { BooksModule } from './books/books.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { OrdersModule } from './orders/orders.module';
import { Orders } from './orders/orders.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './app.sqlite',
      entities: [Users, Orders],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    PassportModule,
    BooksModule,
    CacheModule.register({ isGlobal: true }),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
  ],
})
export class AppModule {}
