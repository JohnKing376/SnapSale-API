import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OtpToken from '../entities/otp-token.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/providers/users.service';
import { IVerifyToken } from '../interfaces/verify-token.interface';

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
     * Import User User
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public async verifyToken(verifyTokenOptions: IVerifyToken): Promise<boolean> {
    const { email, token } = verifyTokenOptions;

    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

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
      try {
        await this.otpTokenRepository.update(otpToken.id, { isUsed: true });
      } catch (error) {
        this.logger.log(
          `[VERIFY-TOKEN-PROVIDER-ERROR]: -----> ${JSON.stringify(error, null, 2)}`,
        );
        throw new InternalServerErrorException(
          'Something went wrong. Try again later',
        );
      }
    }

    return isValid;
  }
}
