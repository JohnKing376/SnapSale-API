import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../../users/providers/users.service';
import { OrderService } from '../../../order/providers/order.service';
import { DeliveryService } from '../../providers/delivery.service';
import { UpdateDeliveryCommand } from './update-delivery.command';

@Injectable()
export default class UpdateDeliveryUseCase {
  constructor(
    private readonly userService: UsersService,
    private readonly orderService: OrderService,
    private readonly deliveryService: DeliveryService,
  ) {}

  async execute(userIdentifier: string, command: UpdateDeliveryCommand) {
    const user = await this.userService.findUserByIdentifier(userIdentifier);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const order = await this.orderService.listPendingOrder(userIdentifier);

    if (!order) {
      throw new NotFoundException('order not found');
    }

    return await this.deliveryService.updateDelivery(
      {
        identifier: userIdentifier,
        identifierType: 'identifier',
      },
      {
        ...command,
        userId: user.id,
        orderId: order.id,
      },
    );
  }
}
