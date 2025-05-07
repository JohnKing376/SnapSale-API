import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import User from '../../users/entities/user.entity';
import { ConfigType } from '@nestjs/config';
import AppConfig from '../../config/app.config';
import appConfig from '../../config/app.config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,

    @Inject(appConfig.KEY)
    private readonly appConfig: ConfigType<typeof AppConfig>,
  ) {}

  public async sendWelcomeEmail(user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      from: this.appConfig.business_mail,
      subject: 'WELCOME EMAIL',
      template: './welcome',
      context: {
        name: user.fullName,
        email: user.email,
      },
    });
  }
}
