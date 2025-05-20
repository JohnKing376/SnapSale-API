import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../providers/auth.service';
import { SignInUserDto } from '../dtos/sign-in-user.dto';
import { RefreshTokenDto } from '../dtos/refresh-token-dto';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enums';
import { ResponseMeta } from '../../common/decorators/response-meta.decorator';
import { SystemMessages } from '../../common/helpers/messages/system.messages';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    /**
     * Inject Auth Service
     */
    private readonly authService: AuthService,
  ) {}

  @ResponseMeta({
    message: SystemMessages.SUCCESS.LOGIN_SUCCESSFUL,
    statusCode: HttpStatus.OK,
  })
  @Auth(AuthType.NONE)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  public async signIn(@Body() signInUserDto: SignInUserDto) {
    return await this.authService.signIn(signInUserDto);
  }

  @ResponseMeta({
    message: SystemMessages.SUCCESS.TOKEN_REFRESHED,
    statusCode: HttpStatus.OK,
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
