import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { GetUserData } from '../../common/interfaces/get-user-data.inteface';
import CreateDeliveryDto from '../dtos/create-delivery-dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ResponseMeta } from '../../common/decorators/response-meta.decorator';
import {
  DELETE_RESOURCE_SUCCESSFUL,
  OPERATION_SUCCESSFUL,
  RESOURCE_FETCHED_SUCCESSFULLY,
  RESOURCE_LIST_FETCHED_SUCCESSFULLY,
  UPDATE_RESOURCE_SUCCESSFUL,
} from '../../common/utils/helpers/messages/custom.messages';
import { CreateDeliveryUseCase } from '../use-cases/create-delivery/create-delivery-use-case';
import { UpdateDeliveryUseCase } from '../use-cases/update-delivery/update-delivery-use-case';
import UpdateDeliveryDto from '../dtos/update-delivery-dto';
import { GetDeliveryByOrderIdentifierUseCase } from '../use-cases/get-delivery/get-delivery-by-order-id/get-delivery-by-order-identifier-use-case.service';
import { GetDeliveryByIdentifierUseCase } from '../use-cases/get-delivery/get-delivery-by-identifier/get-delivery-by-identifier-use-case';
import { DeleteDeliveryByIdentifierUseCase } from '../use-cases/delete-delivery/delete-delivery-by-identifier-use-case';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { GetAllDeliveryUseCase } from '../use-cases/get-delivery/get-all-delivery/get-all-delivery-use-case';
import { Role } from '../../auth/decorators/role.decorator';
import { RoleType } from '../../auth/enums/role-type.enums';
import { UpdateDeliveryStatusDto } from '../dtos/update-delivery-status.dto';
import { UpdateDeliveryStatusUseCase } from '../use-cases/update-delivery/update-delivery-status/update-delivery-status-use-case';
import { GetDeliveryByTrackingIdentifierUseCase } from '../use-cases/get-delivery/get-delivery-by-track-id/get-delivery-by-tracking-identifier-use-case';

@Controller('delivery')
export class DeliveryController {
  constructor(
    private readonly createDeliveryUseCase: CreateDeliveryUseCase,
    private readonly updateDeliveryUseCase: UpdateDeliveryUseCase,
    private readonly getDeliveryByOrderIdentifierUseCase: GetDeliveryByOrderIdentifierUseCase,
    private readonly getDeliveryByIdentifierUseCase: GetDeliveryByIdentifierUseCase,
    private readonly deleteDeliveryByIdentifierUseCase: DeleteDeliveryByIdentifierUseCase,
    private readonly getAllDeliveryUseCase: GetAllDeliveryUseCase,
    private readonly updateDeliveryStatusUseCase: UpdateDeliveryStatusUseCase,
    private readonly getDeliveryByTrackIdentifierUseCase: GetDeliveryByTrackingIdentifierUseCase,
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

  @ResponseMeta({
    message: DELETE_RESOURCE_SUCCESSFUL('Delivery Details'),
    statusCode: HttpStatus.OK,
  })
  @Delete('delete/:deliveryIdentifier')
  public async deleteDeliveryByIdentifier(
    @GetUser() activeUser: GetUserData,
    @Param('deliveryIdentifier') identifier: string,
  ) {
    return await this.deleteDeliveryByIdentifierUseCase.execute(
      activeUser.sub,
      identifier,
    );
  }

  @ResponseMeta({
    message: RESOURCE_LIST_FETCHED_SUCCESSFULLY('Deliveries'),
    statusCode: HttpStatus.OK,
  })
  @Get('list-all')
  public async listAllDeliveries(
    @GetUser() activeUser: GetUserData,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return await this.getAllDeliveryUseCase.execute(
      activeUser.sub,
      paginationQueryDto,
    );
  }

  @ResponseMeta({
    message: RESOURCE_FETCHED_SUCCESSFULLY('Delivery'),
    statusCode: HttpStatus.OK,
  })
  @Get('view/trackingIdentifier/:trackingIdentifier')
  public async getDeliveryByTrackId(
    @GetUser() activeUser: GetUserData,
    @Param('trackingIdentifier') identifier: string,
  ) {
    return await this.getDeliveryByTrackIdentifierUseCase.execute(
      activeUser.sub,
      {
        trackingId: identifier,
      },
    );
  }

  @Role(RoleType.ADMIN)
  @ResponseMeta({
    message: UPDATE_RESOURCE_SUCCESSFUL('Status'),
    statusCode: HttpStatus.OK,
  })
  @Patch('update/status/:deliveryIdentifier')
  public async updateStatus(
    @Param('deliveryIdentifier') identifier: string,
    @Body() updateDeliveryStatusDto: UpdateDeliveryStatusDto,
  ) {
    return await this.updateDeliveryStatusUseCase.execute(
      identifier,
      updateDeliveryStatusDto,
    );
  }
}
