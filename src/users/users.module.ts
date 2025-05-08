import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserProvider } from './providers/create-user.provider';
import User from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { FindUserByEmailProvider } from './providers/find-user-by-email.provider';
import { OtpTokenModule } from '../otp-token/otp-token.module';
import { FindUserByIdentifierProvider } from './providers/find-user-by-identifier.provider';
import { FindUserByIdProvider } from './providers/find-user-by-id.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => OtpTokenModule),
  ],
  providers: [
    UsersService,
    CreateUserProvider,
    FindUserByEmailProvider,
    FindUserByIdentifierProvider,
    FindUserByIdProvider,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
