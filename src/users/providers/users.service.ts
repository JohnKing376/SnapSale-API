import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserProvider } from './create-user.provider';
import { CreateUserOptions } from '../interfaces/create-user.interface';
import User from '../entities/user.entity';
import { UpdateUserOptions } from '../types/update-user.types';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');
  constructor(
    /**
     * Import User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    /**
     * Import CreateUserProvider
     */
    private readonly createUserProvider: CreateUserProvider,
  ) {}

  /**
   * @public
   * @description Method to create user
   * @param createUserOptions
   * @memberOf UsersService
   */
  public async createUser(createUserOptions: CreateUserOptions): Promise<{
    newUser: User;
    tokens: { accessTokens: string; refreshTokens: string };
  }> {
    return await this.createUserProvider.createUser(createUserOptions);
  }

  /**
   * @public
   * @description Method to find one user by email
   * @param email
   * @memberOf UsersService
   */
  public async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({
      email,
    });
  }

  /**
   * @public
   * @description Method to find one user by their primary key
   * @param id
   * @memberOf UsersService
   */
  public async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({
      id,
    });
  }

  /**
   * @public
   * @description Method to find one user by their identifier
   * @param identifier
   * @memberOf UsersService
   */
  public async findUserByIdentifier(identifier: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ identifier });
  }

  /**
   * @public
   * @description Method to update a user
   * @param identifier
   * @param updateUserOptions
   * @memberOf UsersService
   */
  public async updateUser(
    identifier: string,
    updateUserOptions: UpdateUserOptions,
  ) {
    const user = await this.findUserByIdentifier(identifier);

    if (!user) {
      throw new NotFoundException('user not found');
    }
    try {
      const updatedUser = this.userRepository.merge(user, {
        updatedAt: new Date(),
        ...updateUserOptions,
      });

      await this.userRepository.save(updatedUser);
      return await this.findOneById(updatedUser.id);
    } catch (error) {
      this.logger.error(
        `[UPDATE-USER-SERVICE]: ${JSON.stringify(error, null, 2)}`,
      );
      throw new InternalServerErrorException(
        'Something went wrong while trying to update the user',
      );
    }
  }
}
