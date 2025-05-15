import { Processor, WorkerHost } from '@nestjs/bullmq';
import { UsersService } from '../../../users/providers/users.service';
import { MailService } from '../../../mail/providers/mail.service';
import { Job } from 'bullmq';
import { IMailOptions } from '../../../users/interfaces/email-queue.job.interface';
import { Logger, NotFoundException } from '@nestjs/common';
import { IEmailOptions } from '../../../mail/interfaces/send-email.interface';
import { EmailType } from '../../../mail/enums/mail-type.enums';
import { PASSWORD_RESET_MAIL } from '../constants/password-management-constants';

@Processor(PASSWORD_RESET_MAIL)
export class PasswordResetMailProcessor extends WorkerHost {
  private readonly logger = new Logger();
  constructor(
    private usersService: UsersService,
    private mailService: MailService,
  ) {
    super();
  }
  async process(job: Job) {
    const data = job.data as IMailOptions;

    const user = await this.usersService.findOneById(data.userId);

    if (!user) throw new NotFoundException('user not found');

    this.logger.log(
      `[PASSWORD-RESET-MAIL]: SENDING PASSWORD RESET MAIL TO ${user.id}`,
    );

    await this.mailService.sendMail({
      receiversName: user.firstName,
      receiversEmail: user.email,
      emailSubject: data.subject,
      emailTemplate: EmailType.PASSWORD_RESET_TEMPLATE,
      fullName: user.fullName,
      token: data.token,
    } satisfies IEmailOptions);

    this.logger.log(
      `[PASSWORD-RESET-MAIL]: SUCCESSFULLY SENT PASSWORD RESET MAIL`,
    );
  }
}
