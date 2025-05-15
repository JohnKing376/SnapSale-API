import { forwardRef, Module } from '@nestjs/common';
import { PasswordService } from './providers/password.service';
import { PasswordController } from './controllers/password.controller';
import { AuthModule } from '../auth.module';
import { UsersModule } from '../../users/users.module';
import { BcryptProvider } from '../providers/bcrypt.provider';
import { HashingProvider } from '../providers/hashing.provider';
import { BullModule } from '@nestjs/bullmq';
import { PASSWORD_RESET_MAIL } from './constants/password-management-constants';
import { PasswordResetMailProcessor } from './jobs/password-reset-mail.processor';
import { OtpTokenModule } from '../../otp-token/otp-token.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    OtpTokenModule,
    BullModule.registerQueue({
      name: PASSWORD_RESET_MAIL,
    }),
  ],
  providers: [
    PasswordService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    PasswordResetMailProcessor,
  ],
  controllers: [PasswordController],
})
export class PasswordModule {}
