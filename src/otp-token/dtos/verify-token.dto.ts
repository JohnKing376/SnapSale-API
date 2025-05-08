import { IsEmail, IsInt, IsNotEmpty } from 'class-validator';

export default class VerifyTokenDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsInt()
  token: number;
}
