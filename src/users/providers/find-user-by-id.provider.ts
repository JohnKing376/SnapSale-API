import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../entities/user.entity';

@Injectable()
export class FindUserByIdProvider {
  private readonly logger = new Logger('FindUserByIdProvider');

  constructor(
    /**
     * Import User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findOneById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException('user not found');
      }

      return user;
    } catch (error) {
      this.logger.error(`[FIND-USER-BY-ID-ERROR]: ${error}`);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
