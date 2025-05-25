import { forwardRef, Module } from '@nestjs/common';
import { CartItemService } from './providers/cart-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import CartItem from './entities/cart-item.entity';
import { ProductsModule } from '../../products/products.module';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem]),
    forwardRef(() => ProductsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
