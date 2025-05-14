import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OtpToken from '../entities/otp-token.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/providers/users.service';
import { IVerifyToken } from '../interfaces/verify-token.interface';
import { GetUserData } from '../../auth/interfaces/get-user-data.inteface';
import { OtpTokenService } from './otp-token.service';

@Injectable()
export class EmailVerifyTokenProvider {
  private readonly logger = new Logger('EmailVerifyTokenProvider');
  constructor(
    /**
     * Import Otp Token Repository
     */
    @InjectRepository(OtpToken)
    private readonly otpTokenRepository: Repository<OtpToken>,
    /**
     * Import User Service
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    /**
     * Import  Otp-Token Service
     */
    @Inject(forwardRef(() => OtpTokenService))
    private readonly otpTokenService: OtpTokenService,
  ) {}

  public async verifyEmailToken(
    activeUser: GetUserData,
    verifyTokenOptions: IVerifyToken,
  ): Promise<boolean> {
    const { token } = verifyTokenOptions;

    const user = await this.usersService.findOneByEmail(activeUser.email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const otpToken = await this.otpTokenService.findTokenByUserId(user.id);

    if (!otpToken) {
      throw new NotFoundException('token not found');
    }

    const isValid = await this.otpTokenService.isTokenValid({
      otpToken,
      token,
    });

    if (isValid) {
      await this.otpTokenService.updateToken(otpToken.id, {
        isUsed: true,
      });

      await this.usersService.updateUser(user.identifier, {
        isVerified: true,
      });
    }

    return isValid;
  }
}
