import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OtpTokenService } from '../providers/otp-token.service';
import VerifyTokenDto from '../dtos/verify-token.dto';
import { ResponseMeta } from '../../common/decorators/response-meta.decorator';
import { SystemMessages } from '../../common/messages/system.messages';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { GetUserData } from '../../auth/interfaces/get-user-data.inteface';

@Controller('otp-token')
export class OtpTokenController {
  constructor(
    /**
     * Import Otp-Token Service
     */
    private readonly otpTokenService: OtpTokenService,
  ) {}

  @ResponseMeta({
    message: SystemMessages.SUCCESS.OTP_VERIFIED,
    statusCode: HttpStatus.OK,
  })
  @Post('verify-token')
  @HttpCode(HttpStatus.OK)
  public async verifyToken(
    @GetUser() user: GetUserData,
    @Body() verifyTokenDto: VerifyTokenDto,
  ) {
    console.log(verifyTokenDto);
    return await this.otpTokenService.verifyToken(user, verifyTokenDto);
  }
}
