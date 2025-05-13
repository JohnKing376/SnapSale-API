import { forwardRef, Module } from '@nestjs/common';
import { PasswordService } from './providers/password.service';
import { PasswordController } from './controllers/password.controller';
import { AuthModule } from '../auth.module';
import { UsersModule } from '../../users/users.module';
import { BcryptProvider } from '../providers/bcrypt.provider';
import { HashingProvider } from '../providers/hashing.provider';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => UsersModule)],
  providers: [
    PasswordService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
  controllers: [PasswordController],
})
export class PasswordModule {}
