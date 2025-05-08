import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindUserByEmailProvider {
  constructor(
    /**
     * Inject User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //TODO: Maybe this is not needed.

  /**
   * @description Method to get a user by email
   * @author John O.King
   * @param email
   * @return Promise<User | null>
   * @memberOf FindUserByEmailProvider
   */
  public async findUserByEmail(email: string): Promise<User> {
    let user: User | null = null;

    try {
      user = await this.userRepository.findOneBy({
        email,
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user',
      });
    }

    if (!user) {
      throw new NotFoundException('Invalid Credentials');
    }

    return user;
  }
}
