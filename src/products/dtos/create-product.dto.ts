import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ProductCondition } from '../enums/product-condition.enum';
import { ProductCategory } from '../enums/category.enum';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsArray()
  productImage?: string[];

  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;

  @IsNotEmpty()
  @IsArray()
  @IsEnum(ProductCategory, { each: true })
  category: ProductCategory[];

  @IsNotEmpty()
  @IsEnum(ProductCondition)
  condition: ProductCondition;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  region: string;
}
