import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../../../users/providers/users.service';
import { OrderService } from '../../../order/providers/order.service';
import { DeliveryService } from '../../providers/delivery.service';
import { Delivery } from '../../entities/delivery.entity';
import { CreateDeliveryCommand } from './create-delivery.command';

@Injectable()
export class CreateDeliveryUseCase {
  constructor(
    private readonly userService: UsersService,
    private readonly orderService: OrderService,
    private readonly deliveryService: DeliveryService,
  ) {}

  // Experimenting with use-cases

  public async execute(
    userIdentifier: string,
    command: CreateDeliveryCommand,
  ): Promise<Delivery> {
    const user = await this.userService.findUserByIdentifier(userIdentifier);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const order = await this.orderService.listPendingOrder(userIdentifier);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const existingDelivery = await this.deliveryService.getDeliveryRecord({
      identifierType: 'orderId',
      identifier: order.id,
    });

    if (existingDelivery) {
      throw new ConflictException('A delivery already exists for this order');
    }

    return this.deliveryService.createDelivery({
      ...command,
      userId: user.id,
      orderId: order.id,
    });
  }
}
