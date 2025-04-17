import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../providers/auth.service';
import { SignInUserDto } from '../dtos/sign-in-user.dto';
import { RefreshTokenDto } from '../dtos/refresh-token-dto';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enums';

@Controller('auth')
export class AuthController {
  constructor(
    /**
     * Inject Auth Service
     */
    private readonly authService: AuthService,
  ) {}

  @Auth(AuthType.NONE)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  public async signIn(@Body() signInUserDto: SignInUserDto) {
    return await this.authService.signIn(signInUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
