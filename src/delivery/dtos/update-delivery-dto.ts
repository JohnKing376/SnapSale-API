import { PartialType } from '@nestjs/mapped-types';
import CreateDeliveryDto from './create-delivery-dto';

export default class UpdateDeliveryDto extends PartialType(CreateDeliveryDto) {}
