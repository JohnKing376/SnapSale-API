import { Processor, WorkerHost } from '@nestjs/bullmq';
import { UsersService } from '../providers/users.service';
import { PaystackService } from '../../infrastructure/payment-providers/paystack/paystack.service';
import { Job } from 'bullmq';
import {
  CREATE_PAYSTACK_CUSTOMER,
  PAYMENT_PROVIDER,
} from '../constants/user-job.constants';
import { JobQueue } from '../../infrastructure/queue/interfaces/job.queue.interface';
import { Logger, NotFoundException } from '@nestjs/common';

@Processor(PAYMENT_PROVIDER)
export class PaymentProviderJobProcessor extends WorkerHost {
  private readonly logger = new Logger('PaymentProviderJobProcessor');
  constructor(
    private readonly usersService: UsersService,
    private readonly paymentProvider: PaystackService,
  ) {
    super();
  }
  async process(job: Job) {
    switch (job.name) {
      case CREATE_PAYSTACK_CUSTOMER:
        {
          const data = job.data as JobQueue;

          const user = await this.usersService.findOneById(data.userId);

          if (!user) {
            throw new NotFoundException('user not found');
          }

          //TODO: Do not create a user when the email is unverified

          this.logger.log('Payment Provider: Customer Creation Started');

          const pCustomer = await this.paymentProvider.createCustomer({
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
          });

          if (pCustomer) {
            await this.usersService.updateUser(user.identifier, {
              customerCode: pCustomer.customerInformation.customerCode,
            });
          }

          this.logger.log('Payment Provider: Customer Created Successfully');
        }

        break;

      default: {
        throw new NotFoundException(`${job.name} processor is not found`);
      }
    }
  }
}
