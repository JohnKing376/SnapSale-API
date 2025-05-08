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

  /**
   * @public
   * @description Method to sign in a user
   * @param signInUser
   * @memberOf AuthService
   */
  public async signIn(signInUser: SignInUser) {
    return await this.signInProvider.signIn(signInUser);
  }

  /**
   * @public
   * @description Method to generate a user's refresh token
   * @param refreshToken
   * @memberOf AuthService
   */
  public async refreshToken(refreshToken: RefreshToken) {
    return await this.refreshTokenProvider.generateRefreshToken(refreshToken);
  }
}
