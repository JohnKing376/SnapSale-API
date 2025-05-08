import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  NODE_ENV: process.env.NODE_ENV || 'production',
  mail_host: process.env.MAIL_HOST,
  mail_port: Number(process.env.MAIL_PORT),
  mail_user: process.env.MAIL_USERNAME,
  mail_password: process.env.MAIL_PASSWORD,
  business_mail: process.env.BUSINESS_MAIL,
  business_name: process.env.BUSINESS_NAME,
}));
