import { MailerService } from '@nestjs-modules/mailer';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { IEmailOptions } from '../interfaces/send-email.interface';
import mailConfig from '../config/mail.config';
import MailConfig from '../config/mail.config';

@Injectable()
export class MailService {
  constructor(
    /**
     * Import Mailer Service
     */
    private readonly mailerService: MailerService,
    /**
     * Inject Mail Config
     */
    @Inject(mailConfig.KEY)
    private readonly mailConfig: ConfigType<typeof MailConfig>,
  ) {}

  private logger = new Logger('MailService');

  public async sendMail(emailOptions: IEmailOptions): Promise<void> {
    try {
      /**
       * Destructure the email Options
       */
      const {
        sendersEmail = this.mailConfig.business_mail,
        sendersName = this.mailConfig.business_name,
        receiversEmail,
        emailSubject,
        emailTemplate,
        fullName,
        token,
        emailAttachments = [],
      } = emailOptions;

      await this.mailerService.sendMail({
        from: sendersEmail,
        sender: sendersName,
        to: receiversEmail,
        subject: emailSubject,
        template: emailTemplate,
        context: {
          fullName: fullName,
          token: token,
        },
        attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
      });
      this.logger.log('SUCCESSFULLY SENT MAIL');
    } catch (sendMailError) {
      this.logger.error(`FAILED TO SEND MAIL`);
      this.logger.error(`[MAIL-SERVICE-ERROR]: ${sendMailError}]`);
      throw new InternalServerErrorException(
        'Something went wrong while trying to send mail',
      );
    }
  }
}
