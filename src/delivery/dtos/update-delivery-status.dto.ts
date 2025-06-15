import { Statuses } from '../enums/statuses.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export declare class UpdateDeliveryStatusDto {
  @IsNotEmpty()
  @IsEnum(Statuses)
  status: Statuses;
}
