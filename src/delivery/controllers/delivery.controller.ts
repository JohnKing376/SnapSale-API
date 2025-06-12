import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { GetUserData } from '../../common/interfaces/get-user-data.inteface';
import CreateDeliveryDto from '../dtos/create-delivery-dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ResponseMeta } from '../../common/decorators/response-meta.decorator';
import {
  OPERATION_SUCCESSFUL,
  RESOURCE_FETCHED_SUCCESSFULLY,
} from '../../common/utils/helpers/messages/custom.messages';
import { CreateDeliveryUseCase } from '../use-cases/create-delivery/create-delivery-use-case';
import { UpdateDeliveryUseCase } from '../use-cases/update-delivery/update-delivery-use-case';
import UpdateDeliveryDto from '../dtos/update-delivery-dto';
import { GetDeliveryByOrderIdentifierUseCase } from '../use-cases/get-delivery/get-delivery-by-order-id/get-delivery-by-order-identifier-use-case.service';
import { GetDeliveryByIdentifierUseCase } from '../use-cases/get-delivery/get-delivery-by-identifier/get-delivery-by-identifier-use-case';

@Controller('delivery')
export class DeliveryController {
  constructor(
    private readonly createDeliveryUseCase: CreateDeliveryUseCase,
    private readonly updateDeliveryUseCase: UpdateDeliveryUseCase,
    private readonly getDeliveryByOrderIdentifierUseCase: GetDeliveryByOrderIdentifierUseCase,
    private readonly getDeliveryByIdentifierUseCase: GetDeliveryByIdentifierUseCase,
  ) {}

  @ResponseMeta({
    message: OPERATION_SUCCESSFUL('Delivery Creation'),
    statusCode: HttpStatus.OK,
  })
  @Post('create')
  public async createDelivery(
    @GetUser() activeUser: GetUserData,
    @Body() createDeliveryDto: CreateDeliveryDto,
  ) {
    return await this.createDeliveryUseCase.execute(
      activeUser.sub,
      createDeliveryDto,
    );
  }

  @ResponseMeta({
    message: OPERATION_SUCCESSFUL('Delivery Update'),
    statusCode: HttpStatus.CREATED,
  })
  @Patch('update')
  public async updateDelivery(
    @GetUser() activeUser: GetUserData,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
  ) {
    return await this.updateDeliveryUseCase.execute(
      activeUser.sub,
      updateDeliveryDto,
    );
  }

  @ResponseMeta({
    message: RESOURCE_FETCHED_SUCCESSFULLY('Delivery Details'),
    statusCode: HttpStatus.OK,
  })
  @Get('view/orderIdentifier/:orderIdentifier')
  public async getDeliveryByOrderId(
    @GetUser() activeUser: GetUserData,
    @Param('orderIdentifier') identifier: string,
  ) {
    return await this.getDeliveryByOrderIdentifierUseCase.execute(
      activeUser.sub,
      identifier,
    );
  }

  @ResponseMeta({
    message: RESOURCE_FETCHED_SUCCESSFULLY('Delivery Details'),
    statusCode: HttpStatus.OK,
  })
  @Get('view/deliveryIdentifier/:deliveryIdentifier')
  public async getDeliveryByIdentifier(
    @GetUser() activeUser: GetUserData,
    @Param('deliveryIdentifier') identifier: string,
  ) {
    return await this.getDeliveryByIdentifierUseCase.execute(
      activeUser.sub,
      identifier,
    );
  }
}
