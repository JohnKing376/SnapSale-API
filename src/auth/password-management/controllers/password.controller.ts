import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from '../../decorators/get-user.decorator';
import { GetUserData } from '../../interfaces/get-user-data.inteface';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { PasswordService } from '../providers/password.service';
import { ResponseMeta } from '../../../common/decorators/response-meta.decorator';
import { SystemMessages } from '../../../common/helpers/messages/system.messages';
import { GenerateResetTokenDto } from '../dtos/generate-reset-token.dto';
import { AuthType } from '../../enums/auth-type.enums';
import { Auth } from '../../decorators/auth.decorator';
import { VerifyResetTokenDto } from '../dtos/verify-reset-token.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

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

  @Auth(AuthType.NONE)
  @ResponseMeta({
    message: SystemMessages.SUCCESS.PASSWORD_RESET_EMAIL_SENT,
    statusCode: HttpStatus.OK,
  })
  @Post('send-password-reset-token')
  public async sendResetToken(
    @Body() generateResetTokenDto: GenerateResetTokenDto,
  ) {
    return await this.passwordService.sendResetCode(generateResetTokenDto);
  }

  @Auth(AuthType.NONE)
  @ResponseMeta({
    message: SystemMessages.SUCCESS.OTP_VERIFIED,
    statusCode: HttpStatus.OK,
  })
  @Post('verify-reset-token')
  public async verifyToken(@Body() verifyTokenDto: VerifyResetTokenDto) {
    return await this.passwordService.verifyResetToken(verifyTokenDto);
  }

  @Patch('reset-password')
  @ResponseMeta({
    message: SystemMessages.SUCCESS.PASSWORD_RESET_SUCCESSFUL,
    statusCode: HttpStatus.OK,
  })
  public async resetPassword(
    @GetUser() activeUser: GetUserData,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.passwordService.resetPassword(
      activeUser,
      resetPasswordDto,
    );
  }
}
