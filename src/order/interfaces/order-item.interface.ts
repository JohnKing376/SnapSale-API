export interface AddItemToOrder {
  orderId: number;

  quantity: number;

  productId: number;
}

export interface AddMultipleItemToOrder {
  orderId: number;

  items: Array<{
    quantity: number;

    productId: number;
  }>;
}
