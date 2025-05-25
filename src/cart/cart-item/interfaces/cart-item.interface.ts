export interface CartItemBase {
  cartId: number;
  productId: number;
}

export interface AddCartItem extends CartItemBase {
  quantity: number;
  price: number;
}

export interface UpdateCartItem {
  quantity: number;
}
