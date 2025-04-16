import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../providers/auth.service';
import { SignInUserDto } from '../dtos/sign-in-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    /**
     * Inject Auth Service
     */
    private readonly authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  public async signIn(@Body() signInUserDto: SignInUserDto) {
    return await this.authService.signIn(signInUserDto);
  }
}
