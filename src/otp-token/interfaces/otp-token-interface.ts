import { OtpTokenType } from '../enums/otp-token-type.enums';

export interface ICreateToken {
  token?: number;
  isUsed?: boolean;
  purpose: OtpTokenType;
  userId: number;
  expiresAt?: Date;
}
