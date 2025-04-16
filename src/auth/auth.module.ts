import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { GenerateTokenProvider } from './providers/generate-token.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [AuthService, HashingProvider],
  providers: [
    AuthService,
    SignInProvider,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    GenerateTokenProvider,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
