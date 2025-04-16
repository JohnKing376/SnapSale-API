import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { SignInUser } from '../interfaces/sign-in-user.interface';
import { SignInProvider } from './sign-in.provider';
import RefreshToken from '../interfaces/refresh-token.interface';
import { RefreshTokenProvider } from './refresh-token.provider';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject User Service
     */
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    /**
     * Import Sign In Provider
     */
    private readonly signInProvider: SignInProvider,
    /**
     * Import Refresh Token Provider
     */
    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}

  public async signIn(signInUser: SignInUser) {
    return await this.signInProvider.signIn(signInUser);
  }

  public async refreshToken(refreshToken: RefreshToken) {
    return await this.refreshTokenProvider.generateRefreshToken(refreshToken);
  }
}
