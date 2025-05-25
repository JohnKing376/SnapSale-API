import { ClassSerializerInterceptor, forwardRef, Module } from '@nestjs/common';
import { CartService } from './providers/cart.service';
import { CartItemModule } from './cart-item/cart-item.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { CartController } from './controllers/cart.controller';
import Cart from './entities/cart.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PaginationModule } from '../common/pagination/pagination.module';

@Module({
  providers: [
    CartService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  imports: [
    CartItemModule,
    TypeOrmModule.forFeature([Cart]),
    forwardRef(() => ProductsModule),
    forwardRef(() => UsersModule),
    PaginationModule,
  ],
  controllers: [CartController],
})
export class CartModule {}
