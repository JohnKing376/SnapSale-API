import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';
import { FindUserByIdentifierProvider } from './find-user-by-identifier.provider';
import { FindUserByIdProvider } from './find-user-by-id.provider';
import { CreateUserOptions } from '../interfaces/create-user.interface';
import User from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    /**
     * Import CreateUserProvider
     */
    private readonly createUserProvider: CreateUserProvider,
    /**
     * Import FindUserByEmailProvider
     */
    private readonly findUserByEmailProvider: FindUserByEmailProvider,
    /**
     * Import Find User By Identifier Provider
     */
    private readonly findUserByIdentifierProvider: FindUserByIdentifierProvider,
    /**
     * Import Find User By Id Provider
     */
    private readonly findUserByIdProvider: FindUserByIdProvider,
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
  public async findOneByEmail(email: string): Promise<User> {
    return await this.findUserByEmailProvider.findUserByEmail(email);
  }

  /**
   * @public
   * @description Method to find one user by their primary key
   * @param id
   * @memberOf UsersService
   */
  public async findOneById(id: number): Promise<User> {
    return await this.findUserByIdProvider.findOneById(id);
  }

  /**
   * @public
   * @description Method to find one user by their identifier
   * @param identifier
   * @memberOf UsersService
   */
  public async findUserByIdentifier(identifier: string): Promise<User> {
    return await this.findUserByIdentifierProvider.findOneByIdentifier(
      identifier,
    );
  }
}
