import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import User from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserProvider } from './create-user.provider';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FindUserByEmailProvider } from './find-user-by-email.provider';

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
    /**
     * Import FindUserByEmailProvider
     */
    private readonly findUserByEmailProvider: FindUserByEmailProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.createUserProvider.createUser(createUserDto);
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    return await this.findUserByEmailProvider.findUserByEmail(email);
  }

  public async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
