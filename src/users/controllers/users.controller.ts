import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersService } from '../providers/users.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthType } from '../../auth/enums/auth-type.enums';
import { Response } from 'express';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    /**
     * Inject User Service
     */

    private readonly userService: UsersService,
  ) {}
  @Auth(AuthType.NONE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.createUser(createUserDto);

    res.status(HttpStatus.CREATED).send({
      status_code: HttpStatus.CREATED,
      status: 'CREATED',
      message: 'User created successfully',
      user: {
        identifier: user.identifier,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        profileImg: user.profileImg,
        meta: {
          fullName: user.fullName,
          createdAt: user.createdAt,
        },
      },
    });
  }
}
