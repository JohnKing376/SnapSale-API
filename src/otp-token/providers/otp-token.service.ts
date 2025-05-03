import {
  BadRequestException,
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
     * Import User User
     */
    private readonly usersService: UsersService,
  ) {}

  public async createToken(createOtpTokenOptions: IOtpToken) {
    const expiryDate = new Date(Date.now() + 5 * 60 * 1000); // TODO: Add an Abstraction Layer to this field

    const newToken = this.otpTokenRepository.create({
      ...createOtpTokenOptions,
      expiresAt: expiryDate,
    });

    await this.otpTokenRepository.save(newToken);
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
    const { email, token } = verifyTokenOptions;

    const user = await this.usersService.findOneByEmail(email);

    const otpToken = await this.otpTokenRepository.findOne({
      where: {
        id: user.id,
      },
    });

    if (!otpToken) {
      throw new NotFoundException('Not Found', {
        description: 'token associated with this user not found',
      });
    }

    if (otpToken.expiresAt < new Date()) {
      await this.otpTokenRepository.delete({
        id: otpToken.id,
      });
      throw new BadRequestException('Bad Request', {
        description: 'Token is expired',
      });
    }

    if (otpToken.token === token) {
      await this.updateToken(otpToken.id, {
        isRevoked: true,
      });
    }

    return otpToken.token === token;
  }

  /**
   * @description Method to update token
   * @param key
   * @param updateTokenOptions
   */
  public async updateToken(key: number, updateTokenOptions: UpdateToken) {
    const token = await this.otpTokenRepository.findOne({
      where: {
        id: key,
      },
    });

    if (!token) {
      throw new NotFoundException('Not Found', {
        description: 'token associated with this user not found',
      });
    }

    await this.otpTokenRepository.update(
      {
        id: key,
      },
      updateTokenOptions,
    );

    return this.otpTokenRepository.findOne({
      where: { id: token.id },
    });
  }
}
