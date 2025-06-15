import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryService } from '../../providers/delivery.service';
import { UsersService } from '../../../users/providers/users.service';

@Injectable()
export class DeleteDeliveryByIdentifierUseCase {
  constructor(
    private readonly deliveryService: DeliveryService,
    private readonly usersService: UsersService,
  ) {}

  async execute(userIdentifier: string, deliveryIdentifier: string) {
    const user = await this.usersService.findUserByIdentifier(userIdentifier);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const delivery = await this.deliveryService.getDeliveryRecord({
      identifier: deliveryIdentifier,
      identifierType: 'identifier',
    });

    if (!delivery || delivery.userId !== user.id) {
      throw new NotFoundException('delivery not found');
    }

    await this.deliveryService.deleteDeliveryByIdentifier({
      identifier: deliveryIdentifier,
      identifierType: 'identifier',
    });
  }
}
