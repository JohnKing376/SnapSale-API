import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { SignInUser } from '../interfaces/sign-in-user.interface';
import { HashingProvider } from './hashing.provider';
import { GenerateTokenProvider } from './generate-token.provider';

@Injectable()
export class SignInProvider {
  private readonly logger = new Logger('SignInProvider');
  constructor(
    /**
     * Inject User Service
     */
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    /**
     * Import Hashing Provider
     */
    private readonly hashingProvider: HashingProvider,
    /**
     * Import Generate Token Provider
     */
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  public async signIn(signInUser: SignInUser) {
    const { email, password } = signInUser;

    const user = await this.userService.findOneByEmail(email);

    const passwordMatch = await this.hashingProvider.comparePassword(
      password,
      user.password,
    );

    if (!passwordMatch) {
      this.logger.log('[INVALID-CREDENTIALS]');
      throw new BadRequestException('Invalid Credentials');
    }

    const tokens = await this.generateTokenProvider.generateTokens(user);

    this.logger.log('[AUTHENTICATION SUCCESSFUL]');

    return { user, tokens };
  }
}
