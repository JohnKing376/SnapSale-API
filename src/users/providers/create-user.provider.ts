import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserOptions } from '../interfaces/create-user.interface';
import { HashingProvider } from '../../auth/providers/hashing.provider';
import { MailService } from '../../mail/providers/mail.service';
import { EmailType } from '../../mail/enums/mail-type.enums';
import { OtpTokenService } from '../../otp-token/providers/otp-token.service';
import { OtpTokenType } from '../../otp-token/enums/otp-token-type.enums';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Inject User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    /**
     * Import Hashing Provider
     */
    // @Inject(forwardRef(() => HashingProvider))
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
        createdAt: new Date(),
      });

      await this.userRepository.save(newUser);

      /*******************************/
      /*For Testing Purposes*/

      await this.otpTokenService.createToken({
        purpose: OtpTokenType.EMAIL_VERIFICATION,
        userId: newUser.id,
      });
      /*******************************/

      /*******************************/
      /*For Testing Purposes*/
      await this.mailService.sendMail({
        receiversName: newUser.fullName,
        emailTemplate: EmailType.WELCOME_EMAIL,
        receiversEmail: newUser.email,
        emailSubject: 'WELCOME_EMAIL',
      });
      /*******************************/

      return newUser;
    } catch (CreateUserProviderError) {
      console.log(CreateUserProviderError);
      throw new InternalServerErrorException('Internal Server Error', {
        description: JSON.stringify(
          `CreateUserProviderError.${CreateUserProviderError}`,
          null,
          2,
        ),
      });
    }
  }
}
