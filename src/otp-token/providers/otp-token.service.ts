import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IOtpToken } from '../interfaces/otp-token-interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OtpToken from '../entities/otp-token.entity';
import { IVerifyToken } from '../interfaces/verify-token.interface';
import { UsersService } from '../../users/providers/users.service';
import { UpdateToken } from '../types/update-token-type';
import { VerifyTokenProvider } from './verify-token.provider';
import appConfig from '../../config/app.config';
import { ConfigType } from '@nestjs/config';
import AppConfig from '../../config/app.config';

//TODO: Add Providers to this Service
@Injectable()
export class OtpTokenService {
  constructor(
    /**
     * Import Otp Token Repository
     */
    @InjectRepository(OtpToken)
    private readonly otpTokenRepository: Repository<OtpToken>,
    /**
     * Import Verify Token Provider
     */
    private readonly verifyTokenProvider: VerifyTokenProvider,
    /**
     * Inject App Config
     */
    @Inject(appConfig.KEY)
    private readonly appConfig: ConfigType<typeof AppConfig>,
  ) {}

  public async createToken(
    createOtpTokenOptions: IOtpToken,
  ): Promise<OtpToken> {
    const newToken = this.otpTokenRepository.create({
      ...createOtpTokenOptions,
      token: this.generateToken(6),
      purpose: createOtpTokenOptions.purpose,
      expiresAt: this.appConfig.otp_token_ttl,
    });

    await this.otpTokenRepository.save(newToken);
    return newToken;
  }

  //TODO: Refine Generate Token
  public generateToken(length: number): number {
    let i: number;
    const numbers: Array<number> = [];

    /**
     * To Prevent the Leading number from being zero
     */
    numbers.push(Math.floor(Math.random() * 9) + 1);

    for (i = 1; i < length; i++) {
      const randomNumbers = Math.floor(Math.random() * 10);
      numbers.push(randomNumbers);
    }

    return Number(numbers.join(''));
  }

  /**
   * @description Method to verify OtpToken
   * @param verifyTokenOptions
   * @returns boolean
   */
  public async verifyToken(verifyTokenOptions: IVerifyToken): Promise<boolean> {
    return await this.verifyTokenProvider.verifyToken(verifyTokenOptions);
  }
}
