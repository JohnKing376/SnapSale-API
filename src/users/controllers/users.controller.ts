import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersService } from '../providers/users.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthType } from '../../auth/enums/auth-type.enums';

@Controller('users')
export class UsersController {
  constructor(
    /**
     * Inject User Service
     */

    private readonly userService: UsersService,
  ) {}
  @Auth(AuthType.NONE)
  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }
}
