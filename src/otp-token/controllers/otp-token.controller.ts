import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OtpTokenService } from '../providers/otp-token.service';
import VerifyTokenDto from '../dtos/verify-token.dto';
import { ResponseMeta } from '../../common/decorators/response-meta.decorator';
import { SystemMessages } from '../../common/messages/system.messages';

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
  @Post()
  @HttpCode(HttpStatus.OK)
  public async verifyToken(verifyTokenDto: VerifyTokenDto) {
    return await this.otpTokenService.verifyToken(verifyTokenDto);
  }
}
