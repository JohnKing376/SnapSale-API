import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OtpToken from '../entities/otp-token.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/providers/users.service';
import { IVerifyToken } from '../interfaces/verify-token.interface';
import { GetUserData } from '../../auth/interfaces/get-user-data.inteface';
import { OtpTokenService } from './otp-token.service';

@Injectable()
export class VerifyTokenProvider {
  private readonly logger = new Logger('VerifyTokenProvider');
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

  public async verifyToken(
    activeUser: GetUserData,
    verifyTokenOptions: IVerifyToken,
  ): Promise<boolean> {
    const { token } = verifyTokenOptions;

    const user = await this.usersService.findOneByEmail(activeUser.email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const otpToken = await this.otpTokenRepository.findOne({
      where: { userId: user.id },
    });

    if (!otpToken) {
      throw new NotFoundException('Token associated with this user not found');
    }

    if (otpToken.expiresAt < new Date()) {
      await this.otpTokenRepository.delete({ id: otpToken.id });
      throw new BadRequestException('Token is expired');
    }

    const isValid = otpToken.token === token;

    if (isValid) {
      await this.usersService.updateUser(user.identifier, {
        isVerified: true,
      });
      await this.otpTokenService.updateToken(otpToken.id, {
        isUsed: true,
      });
    }

    return isValid;
  }
}
