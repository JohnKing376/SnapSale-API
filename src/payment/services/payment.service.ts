import { Injectable } from '@nestjs/common';
import { PaystackService } from '../../infrastructure/payment/providers/paystack/paystack.service';
import InitializePaymentOptions from '../interfaces/initialize-payment-options.interface';

@Injectable()
export class PaymentService {
  constructor(private readonly paystackService: PaystackService) {}

  /**
   * @description Method used to initialize a payment through paystack's provider
   * @param initializePaymentOptions
   */
  public async initializePayment(
    initializePaymentOptions: InitializePaymentOptions,
  ) {
    const { email, amount, reference, callback_url } = initializePaymentOptions;

    return await this.paystackService.initializeTransaction({
      email,
      amount,
      reference,
      callback_url,
    });
  }

  /**
   * @description Method used to verify a customer's payment
   * @param reference
   */
  public async verifyTransaction(reference: string) {
    return await this.paystackService.verifyTransaction({ reference });
  }
}
