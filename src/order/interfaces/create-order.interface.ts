export interface CreateOrder {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}
