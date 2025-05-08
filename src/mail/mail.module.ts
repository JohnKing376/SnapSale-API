import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { MailService } from './providers/mail.service';
import MailConfig from './config/mail.config';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(MailConfig),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('mailConfig.mail_host'),
          port: config.get<number>('mailConfig.mail_port'),
          auth: {
            user: config.get<string>('mailConfig.mail_user'),
            pass: config.get<string>('mailConfig.mail_password'),
          },
        },
        defaults: {
          from: config.get<string>('mailConfig.business_mail'),
        },
        template: {
          dir: join(__dirname + '/templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
