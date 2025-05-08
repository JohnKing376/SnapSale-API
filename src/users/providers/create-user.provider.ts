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
import { MailService } from '../../mail/providers/mail.service';
import { OtpTokenService } from '../../otp-token/providers/otp-token.service';

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

    private readonly mailService: MailService,

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
      const newUser = this.userRepository.create({
        ...createUserOptions,
        password: hashPassword,
        createdAt: new Date(Date.now()).toISOString(),
      });

      /*******************************/
      /*For Testing Purposes*/
      //
      // await this.otpTokenService.createToken({
      //   purpose: OtpTokenType.EMAIL_VERIFICATION,
      //   userId: newUser.id,
      // });
      /*******************************/

      /*******************************/
      // /*For Testing Purposes*/
      // await this.mailService.sendMail({
      //   receiversName: newUser.fullName,
      //   emailTemplate: EmailType.WELCOME_EMAIL,
      //   receiversEmail: newUser.email,
      //   emailSubject: 'WELCOME_EMAIL',
      // });
      /*******************************/

      return await this.userRepository.save(newUser);
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
