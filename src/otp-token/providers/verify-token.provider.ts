import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OtpToken from '../entities/otp-token.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/providers/users.service';
import { IVerifyToken } from '../interfaces/verify-token.interface';

@Injectable()
export class VerifyTokenProvider {
  constructor(
    /**
     * Import Otp Token Repository
     */
    @InjectRepository(OtpToken)
    private readonly otpTokenRepository: Repository<OtpToken>,
    /**
     * Import User User
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public async verifyToken(verifyTokenOptions: IVerifyToken): Promise<boolean> {
    const { email, token } = verifyTokenOptions;

    const user = await this.usersService.findOneByEmail(email);

    const otpToken = await this.otpTokenRepository.findOne({
      where: { id: user.id },
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
      await this.otpTokenRepository.update(otpToken.id, { isUsed: true });
    }

    return isValid;
  }
}
