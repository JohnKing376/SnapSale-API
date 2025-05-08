import { forwardRef, Module } from '@nestjs/common';
import { OtpTokenService } from './providers/otp-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import OtpToken from './entities/otp-token.entity';
import { UsersModule } from '../users/users.module';
import { OtpTokenController } from './controllers/otp-token.controller';
import { VerifyTokenProvider } from './providers/verify-token.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpToken]),
    forwardRef(() => UsersModule),
  ],
  providers: [OtpTokenService, VerifyTokenProvider],
  exports: [OtpTokenService],
  controllers: [OtpTokenController],
})
export class OtpTokenModule {}
