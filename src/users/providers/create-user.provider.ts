import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { DateTime } from 'luxon';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Inject User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });

      if (user) {
        throw new BadRequestException('Bad Request', {
          description: 'user already exists',
        });
      }

      const newUser = this.userRepository.create({
        ...createUserDto,
        createdAt: DateTime.now(),
      });

      await this.userRepository.save(newUser);

      return newUser;
    } catch (CreateUserProviderError) {
      console.log(CreateUserProviderError);
      throw new InternalServerErrorException('Internal Server Error', {
        cause: CreateUserProviderError,
        description: JSON.stringify(
          `createUserProviderError ---> ${CreateUserProviderError}`,
          null,
          2,
        ),
      });
    }
  }
}
