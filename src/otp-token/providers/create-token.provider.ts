import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import OtpToken from '../entities/otp-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GenerateOtpTokenProvider } from './generate-otp-token.provider';
import AppConfig from '../../config/app.config';
import appConfig from '../../config/app.config';
import { ConfigType } from '@nestjs/config';
import { ICreateToken } from '../interfaces/otp-token-interface';

@Injectable()
export class CreateTokenProvider {
  constructor(
    /**
     * Import Otp Token Repository
     */
    @InjectRepository(OtpToken)
    private readonly otpTokenRepository: Repository<OtpToken>,
    /**
     * Import Generate Token Provider
     */
    private readonly generateTokenProvider: GenerateOtpTokenProvider,
    /**
     * Inject App Config
     */
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof AppConfig>,
  ) {}
  private readonly logger = new Logger('CreateTokenProvider');

  public async createToken(
    createOtpTokenOptions: ICreateToken,
  ): Promise<OtpToken> {
    try {
      const newToken = this.otpTokenRepository.create({
        ...createOtpTokenOptions,
        token: this.generateTokenProvider.generateToken(6),
        purpose: createOtpTokenOptions.purpose,
        expiresAt: this.config.otp_token_ttl,
      });

      await this.otpTokenRepository.save(newToken);

      return newToken;
    } catch (error) {
      this.logger.error(
        `[CREATE-TOKEN-PROVIDER]: ${JSON.stringify(error, null, 2)} `,
      );
      throw new InternalServerErrorException(
        'Something went wrong while creating the token',
      );
    }
  }
}
