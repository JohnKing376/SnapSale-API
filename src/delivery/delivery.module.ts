import { Module } from '@nestjs/common';
import { DeliveryService } from './providers/delivery.service';
import { DeliveryController } from './controllers/delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './entities/delivery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery])],
  providers: [DeliveryService],
  controllers: [DeliveryController],
})
export class DeliveryModule {}
