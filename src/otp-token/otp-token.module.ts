import { forwardRef, Module } from '@nestjs/common';
import { OtpTokenService } from './providers/otp-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import OtpToken from './entities/otp-token.entity';
import { UsersModule } from '../users/users.module';
import { OtpTokenController } from './controllers/otp-token.controller';
import { EmailVerifyTokenProvider } from './providers/email-verify-token.provider';
import { CreateTokenProvider } from './providers/create-token.provider';
import { GenerateOtpTokenProvider } from './providers/generate-otp-token.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpToken]),
    forwardRef(() => UsersModule),
  ],
  providers: [
    OtpTokenService,
    EmailVerifyTokenProvider,
    CreateTokenProvider,
    GenerateOtpTokenProvider,
  ],
  exports: [OtpTokenService],
  controllers: [OtpTokenController],
})
export class OtpTokenModule {}
