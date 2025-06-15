import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderService } from '../../../../order/providers/order.service';
import { DeliveryService } from '../../../providers/delivery.service';
import { UsersService } from '../../../../users/providers/users.service';

@Injectable()
export class GetDeliveryByOrderIdentifierUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly deliveryService: DeliveryService,
    private readonly usersService: UsersService,
  ) {}

  async execute(userIdentifier: string, orderIdentifier: string) {
    const user = await this.usersService.findUserByIdentifier(userIdentifier);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const order = await this.orderService.getOrderByIdentifier(orderIdentifier);

    if (!order || order.userId !== user.id) {
      throw new NotFoundException('order not found');
    }

    return await this.deliveryService.getDeliveryRecord({
      identifier: order.id,
      identifierType: 'orderId',
    });
  }
}
