import { Module } from '@nestjs/common';
import { OrderService } from './providers/order.service';
import { OrderItemService } from './providers/order-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderItem from './entities/order-item.entity';
import Order from './entities/order.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { OrderController } from './controllers/order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    UsersModule,
    ProductsModule,
  ],
  providers: [OrderService, OrderItemService],
  exports: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
