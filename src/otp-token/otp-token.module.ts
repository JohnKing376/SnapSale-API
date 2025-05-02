import { Module } from '@nestjs/common';
import { OtpTokenService } from './providers/otp-token.service';

@Module({
  providers: [OtpTokenService]
})
export class OtpTokenModule {}
