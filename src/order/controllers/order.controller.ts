import { Controller, Get, HttpStatus } from '@nestjs/common';
import { OrderService } from '../providers/order.service';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { GetUserData } from '../../auth/interfaces/get-user-data.inteface';
import { ResponseMeta } from '../../common/decorators/response-meta.decorator';
import {
  RESOURCE_FETCHED_SUCCESSFULLY,
  RESOURCE_LIST_FETCHED_SUCCESSFULLY,
} from '../../common/helpers/messages/custom.messages';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ResponseMeta({
    message: RESOURCE_LIST_FETCHED_SUCCESSFULLY('Orders'),
    statusCode: HttpStatus.OK,
  })
  @Get('list-orders')
  public async listAll(@GetUser() activeUser: GetUserData) {
    return await this.orderService.listOrders(activeUser);
  }

  @ResponseMeta({
    message: RESOURCE_FETCHED_SUCCESSFULLY('Pending Order'),
  })
  @Get('list-pending-order')
  public async listPendingOrder(@GetUser() activeUser: GetUserData) {
    return await this.orderService.listPendingOrder(activeUser);
  }
}
