import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../entities/user.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { CreateUserOptions } from '../interfaces/create-user.interface';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Inject User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    try {
      const newUser = this.userRepository.create({
        ...createUserOptions,
        createdAt: DateTime.now(),
      });

      await this.userRepository.save(newUser);

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
