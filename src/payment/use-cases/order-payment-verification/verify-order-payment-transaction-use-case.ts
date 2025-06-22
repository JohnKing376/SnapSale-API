import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../../../users/providers/users.service';
import { PaymentService } from '../../services/payment.service';
import { OrderService } from '../../../order/providers/order.service';

@Injectable()
export default class VerifyOrderPaymentTransactionUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly paymentService: PaymentService,
    private readonly ordersService: OrderService,
  ) {}

  async execute(
    userIdentifier: string,

    reference: string,
  ) {
    const user = await this.usersService.findUserByIdentifier(userIdentifier);

    if (!user) {
      throw new NotFoundException('user not found or unauthorized');
    }

    const verifyResponse =
      await this.paymentService.verifyTransaction(reference);

    if (!verifyResponse) {
      throw new BadRequestException('failed to verify transaction');
    }

    if (verifyResponse.transactionStatus === 'pending') {
      throw new BadRequestException('incomplete transaction');
    }

    if (verifyResponse.transactionStatus === 'failed') {
      throw new BadRequestException('transaction failed');
    }

    return verifyResponse.transactionInformation;
  }
}
