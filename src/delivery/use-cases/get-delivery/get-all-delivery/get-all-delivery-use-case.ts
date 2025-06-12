import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../../../users/providers/users.service';
import { DeliveryService } from '../../../providers/delivery.service';

// @Injectable()
// export class GetAllDeliveryUseCase {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly deliveryService: DeliveryService,
//   ) {}
//
//   async execute(userIdentifier: string) {
//     const user = await this.usersService.findUserByIdentifier(userIdentifier);
//
//     if (!user) {
//       throw new NotFoundException('user not found');
//     }
//
//     return await this.deliveryService.getDeliveryRecord({});
//   }
// }
