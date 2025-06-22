import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { PaystackModule } from '../infrastructure/payment/providers/paystack/paystack.module';
import { UsersModule } from '../users/users.module';
import { OrderModule } from '../order/order.module';
import OrderPaymentByIdentifierUseCase from './use-cases/order-payment/order-payment-by-identifier-use-case';
import VerifyOrderPaymentTransactionUseCase from './use-cases/order-payment-verification/verify-order-payment-transaction-use-case';

@Module({
  imports: [PaystackModule, UsersModule, OrderModule],
  providers: [
    PaymentService,
    OrderPaymentByIdentifierUseCase,
    VerifyOrderPaymentTransactionUseCase,
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
