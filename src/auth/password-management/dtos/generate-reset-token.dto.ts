import { IsEmail, IsNotEmpty } from 'class-validator';

export class GenerateResetTokenDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
