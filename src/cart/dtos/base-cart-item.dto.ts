import { IsInt, IsNotEmpty } from 'class-validator';

export default class BaseCartItemDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  cartId: number;
}
