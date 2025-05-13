import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HashingProvider } from '../../providers/hashing.provider';
import { UsersService } from '../../../users/providers/users.service';
import { IChangePassword } from '../interfaces/change-password.interface';

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
}
