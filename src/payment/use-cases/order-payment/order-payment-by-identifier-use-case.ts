import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../../../users/providers/users.service';
import { OrderService } from '../../../order/providers/order.service';
import { PaymentService } from '../../services/payment.service';
import { Statuses } from '../../../order/enums/statuses.enum';

@Injectable()
export default class OrderPaymentByIdentifierUseCase {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly usersService: UsersService,
    private readonly orderService: OrderService,
  ) {}

  async execute(userIdentifier: string, orderIdentifier: string) {
    const user = await this.usersService.findUserByIdentifier(userIdentifier);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const order = await this.orderService.getOrderByIdentifier(orderIdentifier);

    if (!order) {
      throw new NotFoundException('order not found');
    }

    if (order.status === Statuses.PAID) {
      throw new BadRequestException(
        'you have already paid for this order. hold on while payment is being updated',
      );
    }

    if (!order.items || order.items.length === 0) {
      throw new NotFoundException(
        'order is empty, add an item to proceed to payment',
      );
    }

    const transactionResponse = await this.paymentService.initializePayment({
      amount: order.total,
      email: user.email,
    });

    if (transactionResponse === null) {
      throw new BadRequestException('failed to initialize transaction');
    }

    await this.orderService.updateOrderStatus(orderIdentifier, Statuses.PAID);

    return transactionResponse.transactionInformation;
  }
}
