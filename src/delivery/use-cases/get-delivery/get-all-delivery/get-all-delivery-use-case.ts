import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../../../users/providers/users.service';
import { DeliveryService } from '../../../providers/delivery.service';
import { PaginateQuery } from 'src/common/pagination/interfaces/paginate-query.interface';

@Injectable()
export class GetAllDeliveryUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly deliveryService: DeliveryService,
  ) {}

  async execute(userIdentifier: string, paginateQueryOptions: PaginateQuery) {
    const user = await this.usersService.findUserByIdentifier(userIdentifier);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const delivery = await this.deliveryService.listAllDeliveries(
      {
        userId: [user.id],
      },
      paginateQueryOptions,
    );

    if (!delivery || delivery.data.length === 0) {
      throw new NotFoundException('No deliveries found for this user');
    }

    return delivery;
  }
}
