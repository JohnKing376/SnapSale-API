import { Body, Controller, HttpStatus, Patch, Post } from '@nestjs/common';

import { GetUserData } from '../../common/interfaces/get-user-data.inteface';

import CreateDeliveryDto from '../dtos/create-delivery-dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ResponseMeta } from '../../common/decorators/response-meta.decorator';
import { OPERATION_SUCCESSFUL } from '../../common/utils/helpers/messages/custom.messages';
import { CreateDeliverUseCase } from '../use-cases/create-delivery/create-delivery-use-case';
import UpdateDeliveryUseCase from '../use-cases/update-delivery/update-delivery-use-case';
import UpdateDeliveryDto from '../dtos/update-delivery-dto';

@Controller('delivery')
export class DeliveryController {
  constructor(
    private readonly createDeliveryUseCase: CreateDeliverUseCase,
    private readonly updateDeliveryUseCase: UpdateDeliveryUseCase,
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
}
