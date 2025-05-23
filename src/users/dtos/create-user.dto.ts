import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoleType } from '../../auth/enums/role-type.enums';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(40)
  lastName: string;

  @IsMobilePhone('en-NG', { strictMode: true })
  @IsNotEmpty()
  @MinLength(14)
  mobileNumber: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      'must have least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number,  can also contain special characters',
  })
  password: string;

  @IsEnum(RoleType)
  @IsNotEmpty()
  role: RoleType;

  @IsString()
  @IsOptional()
  profileImg?: string;

  @IsString()
  @IsOptional()
  googleId?: string;
}
