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
     * Inject App Config
     */
    @Inject(mailConfig.KEY)
    private readonly config: ConfigType<typeof MailConfig>,
  ) {}

  private logger = new Logger('MailService');

  public async sendMail(emailOptions: IEmailOptions): Promise<void> {
    try {
      /**
       * Destructure the email Options
       */
      const {
        sendersEmail = this.config.business_mail,
        sendersName = this.config.business_name,
        receiversEmail,
        receiversName,
        emailSubject,
        emailTemplate,
        emailPayload = {},
        emailAttachments = [],
      } = emailOptions;
      await this.mailerService.sendMail({
        from: sendersEmail,
        sender: sendersName,
        to: receiversEmail,
        subject: emailSubject,
        template: emailTemplate,
        context: {
          fullName: receiversName,
          ...emailPayload,
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
