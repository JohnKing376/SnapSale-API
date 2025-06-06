import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserProvider } from './providers/create-user.provider';
import User from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { OtpTokenModule } from '../otp-token/otp-token.module';
import { BullModule } from '@nestjs/bullmq';
import { MAIL, PAYMENT_PROVIDER } from './constants/user-job.constants';
import { MailJobProcessor } from './jobs/mail-job.processor';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { PaystackModule } from '../infrastructure/payment/providers/paystack/paystack.module';
import { PaymentProviderJobProcessor } from './jobs/payment-provider-job.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => OtpTokenModule),
    BullModule.registerQueue({
      name: MAIL,
    }),
    BullModule.registerQueue({
      name: PAYMENT_PROVIDER,
    }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    PaystackModule,
  ],
  providers: [
    UsersService,
    CreateUserProvider,
    MailJobProcessor,
    PaymentProviderJobProcessor,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
