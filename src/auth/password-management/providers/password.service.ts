import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HashingProvider } from '../../providers/hashing.provider';
import { UsersService } from '../../../users/providers/users.service';
import { IChangePassword } from '../interfaces/change-password.interface';
import { IResetTokenOptions } from '../interfaces/generate-reset-token.interface';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { IMailOptions } from '../../../users/interfaces/email-queue.job.interface';
import { OtpTokenService } from '../../../otp-token/providers/otp-token.service';
import { OtpTokenType } from '../../../otp-token/enums/otp-token-type.enums';
import {
  SEND_RESET_TOKEN_EMAIL,
  SystemMessages,
} from '../../../common/messages/system.messages';
import { PASSWORD_RESET_MAIL } from '../constants/password-management-constants';
import { IVerifyResetToken } from '../interfaces/verify-reset-token.interface';
import { GenerateTokenProvider } from '../../providers/generate-token.provider';
import { IResetPassword } from '../interfaces/reset-password.interface';
import { GetUserData } from '../../interfaces/get-user-data.inteface';

@Injectable()
export class PasswordService {
  constructor(
    /**
     * Import Hashing Provider
     */
    private readonly hashingProvider: HashingProvider,
    /**
     * Import Users Service
     */
    private readonly usersService: UsersService,

    /**
     * Inject Job Queue
     */
    @InjectQueue(PASSWORD_RESET_MAIL)
    private readonly emailQueue: Queue,
    /**
     * Import Otp Token Service
     */
    private readonly otpTokenService: OtpTokenService,
    /**
     * Import Generate Token Provider
     */
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  public async changePassword(
    identifier: string,
    changePasswordOptions: IChangePassword,
  ) {
    const user = await this.usersService.findUserByIdentifier(identifier);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const { oldPassword, newPassword } = changePasswordOptions;

    const isPasswordTrue = await this.hashingProvider.comparePassword(
      oldPassword,
      user.password,
    );

    if (!isPasswordTrue) {
      throw new BadRequestException('Invalid Credentials');
    }

    const hashedPassword = await this.hashingProvider.hashPassword(newPassword);

    return await this.usersService.updateUser(user.identifier, {
      password: hashedPassword,
    });
  }

  public async sendResetCode(resetTokenOptions: IResetTokenOptions) {
    const { email } = resetTokenOptions;

    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const existingToken = await this.otpTokenService.findTokenByUserId(user.id);

    if (existingToken) {
      await this.otpTokenService.deleteToken(user.id);
    }

    const otpToken = await this.otpTokenService.createToken({
      userId: user.id,
      purpose: OtpTokenType.PASSWORD_RESET_TOKEN,
    });

    await this.emailQueue.add(PASSWORD_RESET_MAIL, {
      userId: user.id,
      token: otpToken.token,
      subject: SEND_RESET_TOKEN_EMAIL,
    } satisfies IMailOptions);

    return {
      email: user.email, //TODO
    };
  }

  public async verifyResetToken(verifyResetTokenOptions: IVerifyResetToken) {
    const { email, token } = verifyResetTokenOptions;

    const user = await this.usersService.findOneByEmail(email);

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

    if (!isValid) {
      throw new HttpException(
        {
          message: SystemMessages.ERROR.INVALID_TOKEN,
          statusCode: HttpStatus.BAD_REQUEST,
          tokenValid: isValid,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokens = await this.generateTokenProvider.generateTokens(user);

    return {
      tokenValid: isValid,
      tokens,
    };
  }

  public async resetPassword(
    authUser: GetUserData,
    passwordResetOptions: IResetPassword,
  ) {
    const user = await this.usersService.findOneByEmail(authUser.email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const { password } = passwordResetOptions;

    const hashedPassword = await this.hashingProvider.hashPassword(password);

    await this.usersService.updateUser(user.identifier, {
      password: hashedPassword,
    });

    return {};
  }
}
