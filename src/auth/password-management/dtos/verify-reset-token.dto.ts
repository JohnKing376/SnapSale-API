import { IsEmail, IsInt, IsNotEmpty } from 'class-validator';

export class VerifyResetTokenDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsInt()
  @IsNotEmpty()
  token: number;
}
