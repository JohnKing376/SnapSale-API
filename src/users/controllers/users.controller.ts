import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersService } from '../providers/users.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthType } from '../../auth/enums/auth-type.enums';
import { ResponseMeta } from '../../common/decorators/response-meta.decorator';
import { SystemMessages } from '../../common/messages/system.messages';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { GetUserData } from '../../auth/interfaces/get-user-data.inteface';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    /**
     * Inject User Service
     */

    private readonly userService: UsersService,
  ) {}

  @ResponseMeta({
    message: SystemMessages.SUCCESS.USER_CREATED,
    statusCode: HttpStatus.CREATED,
  })
  @Auth(AuthType.NONE)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @ResponseMeta({
    message: SystemMessages.SUCCESS.USER_UPDATED,
    statusCode: HttpStatus.OK,
  })
  @Post('update-user')
  public async updateUser(
    @GetUser() authUser: GetUserData,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(authUser.sub, updateUserDto);
  }
}
