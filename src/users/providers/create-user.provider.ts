import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserOptions } from '../interfaces/create-user.interface';
import { HashingProvider } from '../../auth/providers/hashing.provider';
import { OtpTokenService } from '../../otp-token/providers/otp-token.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  MAIL,
  SEND_EMAIL_VERIFICATION_OTP_JOB,
  WELCOME_MAIL_JOB,
} from '../constants/user-mail-job.constants';
import { OtpTokenType } from '../../otp-token/enums/otp-token-type.enums';
import { IMailOptions } from '../interfaces/email-queue.job.interface';
import {
  SIGN_UP_SUCCESSFUL_PROCEED_TO_ACTIVATE_EMAIL,
  SIGN_UP_SUCCESSFUL_WELCOME_EMAIL,
} from '../../common/messages/system.messages';

@Injectable()
export class CreateUserProvider {
  private readonly logger = new Logger('CreateUserProvider');
  constructor(
    /**
     * Inject User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    /**
     * Import Hashing Provider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * Inject Job Queue
     */
    @InjectQueue(MAIL)
    private readonly emailQueue: Queue,

    /**
     * Import OtpTokenService
     */
    private readonly otpTokenService: OtpTokenService,
  ) {}

  public async createUser(createUserOptions: CreateUserOptions): Promise<User> {
    const user = await this.userRepository.findOneBy({
      email: createUserOptions.email,
    });

    if (user) {
      throw new BadRequestException('Bad Request', {
        description: 'user already exists',
      });
    }

    const hashPassword = await this.hashingProvider.hashPassword(
      createUserOptions.password,
    );

    try {
      const createUser = this.userRepository.create({
        ...createUserOptions,
        password: hashPassword,
        createdAt: new Date(Date.now()).toISOString(),
      });

      const newUser = await this.userRepository.save(createUser);

      const otpToken = await this.otpTokenService.createToken({
        purpose: OtpTokenType.EMAIL_VERIFICATION,
        userId: newUser.id,
      });

      await this.emailQueue.add(WELCOME_MAIL_JOB, {
        userId: newUser.id,
        subject: SIGN_UP_SUCCESSFUL_WELCOME_EMAIL,
      } satisfies IMailOptions);

      await this.emailQueue.add(SEND_EMAIL_VERIFICATION_OTP_JOB, {
        userId: newUser.id,
        subject: SIGN_UP_SUCCESSFUL_PROCEED_TO_ACTIVATE_EMAIL,
        token: otpToken.token,
      } satisfies IMailOptions);

      return newUser;
    } catch (CreateUserProviderError) {
      this.logger.error(
        `[CREATE-USER-PROVIDER-ERROR]: ----->
         ${JSON.stringify(CreateUserProviderError, null, 5)}`,
      );
      throw new InternalServerErrorException(
        'Something went wrong while trying to create the user. Please try again later',
      );
    }
  }
}
