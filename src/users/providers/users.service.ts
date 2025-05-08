import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserProvider } from './create-user.provider';
import { CreateUserOptions } from '../interfaces/create-user.interface';
import User from '../entities/user.entity';

@Injectable()
export class UsersService {
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
  public async createUser(createUserOptions: CreateUserOptions): Promise<User> {
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
}
