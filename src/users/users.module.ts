import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserProvider } from './providers/create-user.provider';
import User from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { OtpTokenModule } from '../otp-token/otp-token.module';
import { BullModule } from '@nestjs/bullmq';
import { MAIL } from './constants/user-mail-job.constants';
import { MailJobProcessor } from './jobs/mail-job.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => OtpTokenModule),
    BullModule.registerQueue({
      name: MAIL,
    }),
  ],
  providers: [UsersService, CreateUserProvider, MailJobProcessor],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
