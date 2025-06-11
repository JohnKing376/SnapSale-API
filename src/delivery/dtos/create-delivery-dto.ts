import { Statuses } from '../enums/statuses.enum';
import {
  IsDate,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export default class CreateDeliveryDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  @IsMobilePhone()
  phoneNumber: string;

  @IsEnum(Statuses)
  @IsOptional()
  status: Statuses;

  @IsDate()
  @IsOptional()
  deliveryDate?: Date;

  @IsOptional()
  @IsString()
  trackingIdentifier: string;
}
