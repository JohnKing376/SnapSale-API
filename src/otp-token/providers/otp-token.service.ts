import { Injectable } from '@nestjs/common';
import { ICreateToken } from '../interfaces/otp-token-interface';
import OtpToken from '../entities/otp-token.entity';
import { IVerifyToken } from '../interfaces/verify-token.interface';
import { VerifyTokenProvider } from './verify-token.provider';
import { CreateTokenProvider } from './create-token.provider';
import { GetUserData } from '../../auth/interfaces/get-user-data.inteface';

@Injectable()
export class OtpTokenService {
  constructor(
    /**
     * Import Create Token Provider
     */
    private readonly createTokenProvider: CreateTokenProvider,
    /**
     * Import Verify Token Provider
     */
    private readonly verifyTokenProvider: VerifyTokenProvider,
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
  //
  // /**
  //  * @public
  //  * @description Method to verify OtpToken
  //  * @param verifyTokenOptions
  //  * @returns boolean
  //  * @memberOf OtpTokenService
  //  */
  public async verifyToken(
    user: GetUserData,
    verifyTokenOptions: IVerifyToken,
  ): Promise<boolean> {
    return await this.verifyTokenProvider.verifyToken(
      user,
      verifyTokenOptions,
    );
  }
}
