import { IsInt, IsNotEmpty } from 'class-validator';

export default class VerifyTokenDto {
  @IsNotEmpty()
  @IsInt()
  token: number;
}
