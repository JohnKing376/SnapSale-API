/**
 * Experimenting with formatted responses
 */
//
// import { Expose, Type } from 'class-transformer';
//
// export class ProductDto {
//   @Expose() name: string;
//   @Expose() description: string;
//   @Expose() price: number;
//   @Expose() condition: string;
//   @Expose() region: string;
//   @Expose() productImages: string[];
// }
//
// export class CartItemDto {
//   @Expose()
//   quantity: number;
//
//   @Expose()
//   price: number;
//
//   @Expose()
//   @Type(() => ProductDto)
//   product: {
//     name: string;
//     description: string;
//     price: number;
//     condition: string;
//     region: string;
//     productImages: string[];
//   };
// }
//
// export class CartResponseDto {
//   @Expose()
//   identifier: string;
//
//   // @Expose()
//   // totalPrice: number;
//
//   @Expose()
//   @Type(() => CartItemDto)
//   items: CartItemDto[];
//
//   @Expose()
//   createdAt: Date | null;
//
//   @Expose()
//   updatedAt: Date | null;
// }
