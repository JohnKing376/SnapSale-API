import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from '../../decorators/get-user.decorator';
import { GetUserData } from '../../interfaces/get-user-data.inteface';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { PasswordService } from '../providers/password.service';
import { ResponseMeta } from '../../../common/decorators/response-meta.decorator';
import { SystemMessages } from '../../../common/messages/system.messages';

@Controller('password-management')
export class PasswordController {
  constructor(
    /**
     * Import Password Service
     */
    private readonly passwordService: PasswordService,
  ) {}

  @ResponseMeta({
    message: SystemMessages.SUCCESS.PASSWORD_CHANGE_SUCCESSFUL,
    statusCode: HttpStatus.OK,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('change-password')
  public async changePassword(
    @GetUser() authUser: GetUserData,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.passwordService.changePassword(
      authUser.sub,
      changePasswordDto,
    );
  }
}
