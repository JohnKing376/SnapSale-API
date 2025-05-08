import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  NODE_ENV: process.env.NODE_ENV || 'production',
  //TODO: Might remove haha
  otp_token_ttl: new Date(
    Date.now() + Number(process.env.OTP_TOKEN_TTL) * 60 * 1000,
  ),
}));
