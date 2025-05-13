import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      'must have least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number,  can also contain special characters',
  })
  newPassword: string;
}
