import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import User from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserProvider } from './create-user.provider';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    /**
     * Inject User Repository
     */
    @InjectRepository(User)
    private userRepository: Repository<User>,
    /**
     * Import CreateUserProvider
     */

    private readonly createUserProvider: CreateUserProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUser(createUserDto);
  }
}
