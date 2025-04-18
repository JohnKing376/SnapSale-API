import { ProductCategory } from '../enums/category.enum';
import { ProductCondition } from '../enums/product-condition.enum';

export interface ICreateProduct {
  name: string;
  description: string;
  price: number;
  quantity: number;
  productImage?: string[];
  isAvailable: boolean;
  category: ProductCategory[];
  condition: ProductCondition;
  region: string;
}
