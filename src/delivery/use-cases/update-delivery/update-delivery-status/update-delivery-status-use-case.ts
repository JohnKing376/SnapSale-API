import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryService } from 'src/delivery/providers/delivery.service';
import { UpdateDeliveryStatusCommand } from './update-delivery-status.command';

@Injectable()
export class UpdateDeliveryStatusUseCase {
  constructor(private readonly deliveryService: DeliveryService) {}

  async execute(
    deliveryIdentifier: string,
    status: UpdateDeliveryStatusCommand,
  ) {
    const delivery = await this.deliveryService.getDeliveryRecord({
      identifier: deliveryIdentifier,
      identifierType: 'identifier',
    });

    if (!delivery) {
      throw new NotFoundException('delivery not found');
    }

    return await this.deliveryService.updateDelivery(
      {
        identifier: deliveryIdentifier,
        identifierType: 'identifier',
      },
      {
        ...status,
      },
    );
  }
}
