import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ICreateToken } from '../interfaces/otp-token-interface';
import OtpToken from '../entities/otp-token.entity';
import { IVerifyToken } from '../interfaces/verify-token.interface';
import { VerifyTokenProvider } from './verify-token.provider';
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
    private readonly verifyTokenProvider: VerifyTokenProvider,
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
   * @description Method to verify OtpToken
   * @param user
   * @param verifyTokenOptions
   * @returns boolean
   * @memberOf OtpTokenService
   */
  public async verifyToken(
    user: GetUserData,
    verifyTokenOptions: IVerifyToken,
  ): Promise<boolean> {
    return await this.verifyTokenProvider.verifyToken(user, verifyTokenOptions);
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
}
