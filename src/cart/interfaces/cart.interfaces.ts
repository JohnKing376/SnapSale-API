export interface BaseItemCart {
  productId: number;

  quantity: number;
}

export type AddItemToCart = BaseItemCart;

export type RemoveItemFromCart = AddItemToCart;
