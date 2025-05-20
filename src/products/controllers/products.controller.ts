import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
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
import { ResponseMeta } from '../../common/decorators/response-meta.decorator';
import { SystemMessages } from '../../common/helpers/messages/system.messages';
import { Role } from '../../auth/decorators/role.decorator';
import { RoleType } from '../../auth/enums/role-type.enums';

@Role(RoleType.MERCHANT, RoleType.ADMIN)
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
  @Get('product/:identifier')
  public async getProduct(@Param() identifier: string) {
    const product =
      await this.productsService.findProductByIdentifier(identifier);

    if (!product) {
      throw new NotFoundException('product not found');
    }

    return product;
  }

  @ResponseMeta({
    message: SystemMessages.SUCCESS.FETCHED_PRODUCTS,
    statusCode: HttpStatus.OK,
  })
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
  @Patch('update-product/:identifier')
  public async updateProducts(
    @Body() updateProductDto: UpdateProductDto,
    @Param('identifier') identifier: string,
  ) {
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
