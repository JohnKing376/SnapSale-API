import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductsService } from '../providers/products.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { GetUserData } from '../../auth/interfaces/get-user-data.inteface';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    /**
     * Import Product Service
     */
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  public async createProducts(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: GetUserData,
  ) {
    return await this.productsService.createProduct(user, createProductDto);
  }

  @Patch('update/:identifier')
  public async updateProducts(
    @Body() updateProductDto: UpdateProductDto,
    @Param('identifier') identifier: string,
  ) {
    console.log(typeof identifier);
    return await this.productsService.updateProduct(
      updateProductDto,
      identifier,
    );
  }

  @Delete('delete/:identifier')
  public async deleteProducts(@Param('identifier') identifier: string) {
    return this.productsService.deleteProduct(identifier);
  }
}
