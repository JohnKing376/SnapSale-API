import { Module } from '@nestjs/common';
import { DeliveryService } from './providers/delivery.service';
import { DeliveryController } from './controllers/delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './entities/delivery.entity';
import { UsersModule } from '../users/users.module';
import { OrderModule } from '../order/order.module';
import { CreateDeliveryUseCase } from './use-cases/create-delivery/create-delivery-use-case';
import { UpdateDeliveryUseCase } from './use-cases/update-delivery/update-delivery-use-case';
import { GetDeliveryByIdentifierUseCase } from './use-cases/get-delivery/get-delivery-by-identifier/get-delivery-by-identifier-use-case';
import { GetDeliveryByOrderIdentifierUseCase } from './use-cases/get-delivery/get-delivery-by-order-id/get-delivery-by-order-identifier-use-case.service';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery]), UsersModule, OrderModule],
  providers: [
    DeliveryService,
    CreateDeliveryUseCase,
    UpdateDeliveryUseCase,
    GetDeliveryByIdentifierUseCase,
    GetDeliveryByOrderIdentifierUseCase,
  ],
  controllers: [DeliveryController],
})
export class DeliveryModule {}
