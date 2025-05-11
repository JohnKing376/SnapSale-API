import { Processor, WorkerHost } from '@nestjs/bullmq';
import {
  MAIL,
  SEND_EMAIL_VERIFICATION_OTP_JOB,
  WELCOME_MAIL_JOB,
} from '../constants/user-mail-job.constants';
import { Job } from 'bullmq';
import { UsersService } from '../providers/users.service';
import { Logger, NotFoundException } from '@nestjs/common';
import { MailService } from '../../mail/providers/mail.service';
import { IMailOptions } from '../interfaces/email-queue.job.interface';
import { IEmailOptions } from '../../mail/interfaces/send-email.interface';
import { EmailType } from '../../mail/enums/mail-type.enums';

@Processor(MAIL)
export class MailJobProcessor extends WorkerHost {
  private readonly logger = new Logger('MailJobProcessor');
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {
    super();
  }
  async process(job: Job) {
    switch (job.name) {
      case WELCOME_MAIL_JOB: {
        const data = job.data as IMailOptions;
        const user = await this.usersService.findOneById(data.userId);

        if (!user) {
          throw new NotFoundException('user not found');
        }
        console.log(`Job ${job.id} is progressing: `, job.progress);

        this.logger.log(
          `[WELCOME-MAIL-JOB]: SENDING WELCOME_MAIL TO ${user.id}`,
        );

        await this.mailService.sendMail({
          receiversName: user.firstName,
          emailTemplate: EmailType.WELCOME_EMAIL_TEMPLATE,
          receiversEmail: user.email,
          emailSubject: data.subject,
          fullName: user.fullName,
        } satisfies IEmailOptions);

        this.logger.log(`[${job.name}job] completed successfully`);

        break;
      }

      case SEND_EMAIL_VERIFICATION_OTP_JOB: {
        {
          const data = job.data as IMailOptions;
          const user = await this.usersService.findOneById(data.userId);

          if (!user) {
            throw new NotFoundException('user not found');
          }

          this.logger.log(
            `[SEND_EMAIL_VERIFICATION_OTP_JOB]: SENDING EMAIL_VERIFICATION_OTP_MAIL TO ${user.id}`,
          );

          await this.mailService.sendMail({
            receiversName: user.firstName,
            emailTemplate: EmailType.EMAIL_TOKEN_VERIFICATION_TEMPLATE,
            receiversEmail: user.email,
            emailSubject: data.subject,
            fullName: user.fullName,
            token: data.token,
          } satisfies IEmailOptions);
        }
        break;
      }

      default: {
        throw new NotFoundException(`${job.name} processor is not found`);
      }
    }
  }
}
