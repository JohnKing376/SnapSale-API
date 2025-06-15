import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryService } from '../../../providers/delivery.service';
import { UsersService } from '../../../../users/providers/users.service';
import { Delivery } from '../../../entities/delivery.entity';
import { GetDeliveryByTrackingIdCommand } from './get-delivery-by-tracking-id.command';

@Injectable()
export class GetDeliveryByTrackingIdentifierUseCase {
  constructor(
    private readonly deliveryService: DeliveryService,
    private readonly usersService: UsersService,
  ) {}

  async execute(
    userIdentifier: string,
    getDeliveryByTrackIdCommand: GetDeliveryByTrackingIdCommand,
  ): Promise<Delivery> {
    const { trackingId } = getDeliveryByTrackIdCommand;

    const user = await this.usersService.findUserByIdentifier(userIdentifier);

    if (!user) throw new NotFoundException('user not found');

    const delivery = await this.deliveryService.getDeliveryRecord({
      identifier: trackingId,
      identifierType: 'trackId',
    });

    if (!delivery || delivery.userId !== user.id) {
      throw new NotFoundException('delivery not found');
    }

    return delivery;
  }
}
