import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ICreateToken } from '../interfaces/otp-token-interface';
import OtpToken from '../entities/otp-token.entity';
import { IVerifyToken } from '../interfaces/verify-token.interface';
import { EmailVerifyTokenProvider } from './email-verify-token.provider';
import { CreateTokenProvider } from './create-token.provider';
import { GetUserData } from '../../auth/interfaces/get-user-data.inteface';
import { UpdateTokenOptions } from '../types/update-token-type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OtpTokenService {
  private readonly logger = new Logger('OtpTokenService');
  constructor(
    /**
     * Import Create Token Provider
     */
    private readonly createTokenProvider: CreateTokenProvider,
    /**
     * Import Verify Token Provider
     */
    private readonly verifyTokenProvider: EmailVerifyTokenProvider,
    /**
     * Import Otp Token Repository
     */
    @InjectRepository(OtpToken)
    private readonly otpTokenRepository: Repository<OtpToken>,
  ) {}

  /**
   * @public
   * @description Method to create OtpToken
   * @param createTokenOptions
   * @memberOf OtpTokenService
   */
  public async createToken(
    createTokenOptions: ICreateToken,
  ): Promise<OtpToken> {
    return await this.createTokenProvider.createToken(createTokenOptions);
  }

  /**
   * @public
   * @description Method to find token by its identifier
   * @param identifier
   * @memberOf OtpTokenService
   */
  public async findTokenByIdentifier(
    identifier: string,
  ): Promise<OtpToken | null> {
    return await this.otpTokenRepository.findOneBy({ identifier });
  }

  /**
   * @public
   * @description Method to find token by its primary key
   * @param id
   * @memberOf OtpTokenService
   */
  public async findTokenById(id: number): Promise<OtpToken | null> {
    return await this.otpTokenRepository.findOneBy({ id });
  }

  /**
   * @public
   * @description Method to find a token by its user id
   * @param userId
   * @memberOf OtpTokenService
   */
  public async findTokenByUserId(userId: number): Promise<OtpToken | null> {
    return await this.otpTokenRepository.findOneBy({ userId });
  }

  /**
   * @public
   * @description Method to update token
   * @param id
   * @param updateTokenOptions
   * @memberOf OtpTokenService
   */
  public async updateToken(id: number, updateTokenOptions: UpdateTokenOptions) {
    const token = await this.findTokenById(id);

    if (!token) {
      throw new NotFoundException('token not found');
    }
    try {
      return await this.otpTokenRepository.update(token.id, {
        updatedAt: new Date(),
        ...updateTokenOptions,
      });
    } catch (error) {
      this.logger.error(
        `[UPDATE-TOKEN-ERROR]: ${JSON.stringify(error, null, 2)}`,
      );
      throw new InternalServerErrorException(
        'Something went wrong while trying to update the token',
      );
    }
  }

  public async deleteToken(userId: number) {
    //TODO: Fix?
    const token = await this.findTokenByUserId(userId);

    if (!token) {
      throw new NotFoundException('user not found');
    }

    await this.otpTokenRepository.delete({ userId });
  }

  /**
   * @public
   * @description Method to validate an otpToken
   * @param options
   * @returns Promise<boolean>
   * @memberOf OtpTokenService
   */
  public async isTokenValid(options: {
    otpToken: OtpToken;
    token: number;
  }): Promise<boolean> {
    const { otpToken, token } = options;

    const otp = await this.findTokenById(otpToken.id);

    if (!otp) {
      throw new NotFoundException('token not found');
    }

    if (otp.expiresAt < new Date()) {
      await this.otpTokenRepository.delete({ id: otp.id });
      throw new BadRequestException('Token is expired, Request a new one');
    }

    return otp.token === token;
  }

  /**
   * @public
   * @description Method to verify OtpToken
   * @param user
   * @param verifyTokenOptions
   * @returns boolean
   * @memberOf OtpTokenService
   */
  //TODO
  public async verifyEmailToken(
    user: GetUserData,
    verifyTokenOptions: IVerifyToken,
  ): Promise<boolean> {
    return await this.verifyTokenProvider.verifyEmailToken(
      user,
      verifyTokenOptions,
    );
  }
}
