import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindUserByIdentifierProvider {
  private readonly logger = new Logger('FindUserByIdentifierProvider');

  constructor(
    /**
     * Import User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findOneByIdentifier(identifier: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ identifier });

      if (!user) {
        throw new NotFoundException('user not found');
      }

      return user;
    } catch (error) {
      this.logger.error(`[FIND-USER-BY-IDENTIFIER-ERROR]: ${error}`);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
