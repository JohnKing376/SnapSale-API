import { Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import OrderPaymentByIdentifierUseCase from '../use-cases/order-payment/order-payment-by-identifier-use-case';
import VerifyOrderPaymentTransactionUseCase from '../use-cases/order-payment-verification/verify-order-payment-transaction-use-case';
import { ResponseMeta } from '../../common/decorators/response-meta.decorator';
import { OPERATION_SUCCESSFUL } from '../../common/utils/helpers/messages/custom.messages';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { GetUserData } from '../../common/interfaces/get-user-data.inteface';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly orderPaymentByIdentifierUseCase: OrderPaymentByIdentifierUseCase,
    private readonly verifyOrderPaymentTransactionUseCase: VerifyOrderPaymentTransactionUseCase,
  ) {}

  @ResponseMeta({
    statusCode: HttpStatus.OK,
    message: OPERATION_SUCCESSFUL('Payment Transaction Initiation'),
  })
  @Post('order/:orderIdentifier')
  async orderPayment(
    @GetUser() activeUser: GetUserData,
    @Param('orderIdentifier') identifier: string,
  ) {
    console.log(identifier);
    return await this.orderPaymentByIdentifierUseCase.execute(
      activeUser.sub,
      identifier,
    );
  }

  @ResponseMeta({
    statusCode: HttpStatus.OK,
    message: OPERATION_SUCCESSFUL('Verify Transaction'),
  })
  @Get('order/verify-transaction/:reference')
  async verifyOrderPayment(
    @GetUser() activeUser: GetUserData,
    @Param('reference') reference: string,
  ) {
    return await this.verifyOrderPaymentTransactionUseCase.execute(
      activeUser.sub,
      reference,
    );
  }
}
