import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { GetUserData } from '../../auth/interfaces/get-user-data.inteface';
import AddCartItemDto from '../dtos/add-cart-item.dto';
import { CartService } from '../providers/cart.service';
import { ResponseMeta } from '../../common/decorators/response-meta.decorator';
import {
  ADD_RESOURCE_SUCCESSFUL,
  DELETE_RESOURCE_SUCCESSFUL,
  RESOURCE_LIST_FETCHED_SUCCESSFULLY,
} from '../../common/helpers/messages/custom.messages';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { PaginationQueryDto } from '../../common/pagination/dtos/pagination-query.dto';
import DeleteCartItemDto from '../dtos/delete-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ResponseMeta({
    message: ADD_RESOURCE_SUCCESSFUL('Cart Item'),
    statusCode: HttpStatus.CREATED,
  })
  @Post('add-item')
  public async addItemToCart(
    @GetUser() activeUser: GetUserData,
    @Body() addCartItemDto: AddCartItemDto,
  ) {
    return await this.cartService.addItemToCart(activeUser, addCartItemDto);
  }

  @ResponseMeta({
    message: DELETE_RESOURCE_SUCCESSFUL('Cart Item'),
    statusCode: HttpStatus.OK,
  })
  @Delete('remove-item')
  public async removeOneItem(
    @GetUser() activeUser: GetUserData,
    @Body() deleteCartItemDto: DeleteCartItemDto,
  ) {
    return await this.cartService.removeOneCartItem(
      activeUser,
      deleteCartItemDto,
    );
  }

  @ResponseMeta({
    message: DELETE_RESOURCE_SUCCESSFUL('Cart Items'),
    statusCode: HttpStatus.OK,
  })
  @Delete('remove-all-items')
  public async removeAllItems(@GetUser() activeUser: GetUserData) {
    return this.cartService.deleteItemsFromCart(activeUser);
  }

  @ResponseMeta({
    message: RESOURCE_LIST_FETCHED_SUCCESSFULLY('Cart Items'),
    statusCode: HttpStatus.OK,
  })
  @Get('get-items')
  public async getCart(
    @GetUser() activeUser: GetUserData,
    @Query() productQuery: PaginationQueryDto,
  ) {
    return await this.cartService.listCartItems(activeUser, productQuery);

    //TODO: experimenting with formatted responses

    //return plainToInstance(CartResponseDto, cart, {
    //excludeExtraneousValues: true,
    //});
  }
}
