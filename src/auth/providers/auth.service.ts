import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { SignInUser } from '../interfaces/sign-in-user.interface';
import { SignInProvider } from './sign-in.provider';

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
  ) {}

  public async signIn(signInUser: SignInUser) {
    return await this.signInProvider.signIn(signInUser);
  }
}
