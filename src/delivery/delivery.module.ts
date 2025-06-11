import { Module } from '@nestjs/common';
import { DeliveryService } from './providers/delivery.service';
import { DeliveryController } from './controllers/delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './entities/delivery.entity';
import { UsersModule } from '../users/users.module';
import { OrderModule } from '../order/order.module';
import { CreateDeliverUseCase } from './use-cases/create-delivery/create-delivery-use-case';
import UpdateDeliveryUseCase from './use-cases/update-delivery/update-delivery-use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery]), UsersModule, OrderModule],
  providers: [DeliveryService, CreateDeliverUseCase, UpdateDeliveryUseCase],
  controllers: [DeliveryController],
})
export class DeliveryModule {}
