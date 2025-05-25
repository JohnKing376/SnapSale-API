import { IsInt, IsNotEmpty } from 'class-validator';

import { PickType } from '@nestjs/mapped-types';
import BaseCartItemDto from './base-cart-item.dto';

export default class AddCartItemDto extends PickType(BaseCartItemDto, [
  'productId',
] as const) {
  @IsInt()
  @IsNotEmpty()
  quantity: number = 1;
}
