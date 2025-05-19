import { ProductCondition } from '../enums/product-condition.enum';

export interface ICreateProduct {
  name: string;
  description: string;
  price: number;
  quantity: number;
  productImage?: string[];
  isAvailable: boolean;
  categoryId: number;
  condition: ProductCondition;
  region: string;
}
