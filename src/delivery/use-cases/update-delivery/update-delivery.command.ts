import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliveryCommand } from '../create-delivery/create-delivery.command';

export class UpdateDeliveryCommand extends PartialType(CreateDeliveryCommand) {}
