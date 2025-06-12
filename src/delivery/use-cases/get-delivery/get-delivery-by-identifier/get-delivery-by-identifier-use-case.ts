import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryService } from '../../../providers/delivery.service';
import { UsersService } from '../../../../users/providers/users.service';

@Injectable()
export class GetDeliveryByIdentifierUseCase {
  constructor(
    private readonly deliveryService: DeliveryService,
    private readonly usersService: UsersService,
  ) {}

  async execute(authUserIdentifier: string, identifier: string) {
    const user =
      await this.usersService.findUserByIdentifier(authUserIdentifier);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const delivery = await this.deliveryService.getDeliveryRecord({
      identifier: identifier,
      identifierType: 'identifier',
    });

    if (!delivery || delivery.userId !== user.id) {
      throw new NotFoundException('delivery not found');
    }

    return delivery;
  }
}
