import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from '../providers/products.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { GetUserData } from '../../auth/interfaces/get-user-data.inteface';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { PaginationQueryDto } from '../../common/pagination/dtos/pagination-query.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthType } from '../../auth/enums/auth-type.enums';
import { ResponseMeta } from '../../common/decorators/response-meta.decorator';
import { SystemMessages } from '../../common/messages/system.messages';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(
    /**
     * Import Product Service
     */
    private readonly productsService: ProductsService,
  ) {}

  @ResponseMeta({
    message: SystemMessages.SUCCESS.PRODUCT_CREATED,
    statusCode: HttpStatus.CREATED,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async createProducts(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: GetUserData,
  ) {
    return await this.productsService.createProduct(user, createProductDto);
  }

  @ResponseMeta({
    message: SystemMessages.SUCCESS.FETCHED_PRODUCT,
    statusCode: HttpStatus.OK,
  })
  @Get('one-product/:identifier')
  public async getProduct(@Param() identifier: string) {
    return await this.productsService.findProductByIdentifier(identifier);
  }

  @ResponseMeta({
    message: SystemMessages.SUCCESS.FETCHED_PRODUCTS,
    statusCode: HttpStatus.OK,
  })
  @Auth(AuthType.BEARER)
  @Get('list-products')
  public async listProducts(
    @Query() productQuery: PaginationQueryDto,
    @GetUser() user: GetUserData,
  ) {
    return await this.productsService.listProducts(productQuery, user);
  }

  @ResponseMeta({
    message: SystemMessages.SUCCESS.PRODUCT_UPDATED,
    statusCode: HttpStatus.OK,
  })
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

  @ResponseMeta({
    message: SystemMessages.SUCCESS.PRODUCT_DELETED,
    statusCode: HttpStatus.OK,
  })
  @Delete('delete/:identifier')
  public async deleteProducts(@Param('identifier') identifier: string) {
    return this.productsService.deleteProduct(identifier);
  }
}
