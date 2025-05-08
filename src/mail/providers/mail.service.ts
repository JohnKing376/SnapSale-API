import { MailerService } from '@nestjs-modules/mailer';
import {
  Inject,
  Injectable,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import AppConfig from '../../config/app.config';
import appConfig from '../../config/app.config';
import { IEmailOptions } from '../interfaces/send-email.interface';

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
    @Inject(appConfig.KEY)
    private readonly appConfig: ConfigType<typeof AppConfig>,
  ) {}

  private logger = new Logger('MailService');

  public async sendMail(emailOptions: IEmailOptions): Promise<void> {
    try {
      /**
       * Destructure the email Options
       */
      const {
        sendersEmail = this.appConfig.business_mail,
        sendersName = this.appConfig.business_name,
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
      this.logger.log('MAIL SENT');
    } catch (sendMailError) {
      this.logger.error('MAIL FAILED');
      throw new RequestTimeoutException('Mail could not be sent', {
        description: JSON.stringify(
          `MailService.sendMailError: ${sendMailError}`,
          null,
          2,
        ),
      });
    }
  }
}
