import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateProduct } from '../interfaces/create-product.interface';
import { GetUserData } from '../../auth/interfaces/get-user-data.inteface';
import { CreateProductProvider } from './create-product.provider';
import { UpdateProducts } from '../types/update-products.types';
import { UpdateProductProvider } from './update-product.provider';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { Pagination } from '../../common/pagination/interfaces/pagination.interface';
import { PaginateQuery } from '../interfaces/paginate-query.interface';
import { UsersService } from '../../users/providers/users.service';

@Injectable()
export class ProductsService {
  constructor(
    /**
     * Inject Product Repository
     */
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    /**
     * Import Create Product Provider
     */
    private readonly createProductProvider: CreateProductProvider,
    /**
     * Import Update Product Provider
     */
    private readonly updateProductProvider: UpdateProductProvider,
    /**
     * Import Pagination Provider
     */
    private readonly paginationProvider: PaginationProvider,
    /**
     * Import User Service
     */
    private readonly usersService: UsersService,
  ) {}

  /**
   * @public
   * @description Method to create a new product
   * @author John O.King
   * @param user
   * @param createProductOptions
   * @returns Promise<Product|>
   * @memberOf ProductsService
   */
  public async createProduct(
    user: GetUserData,
    createProductOptions: ICreateProduct,
  ): Promise<Product> {
    return await this.createProductProvider.createProduct(
      user,
      createProductOptions,
    );
  }

  /**
   * @public
   * @description Method to find one product by its identifier
   * @author John O.King
   * @param identifier
   * @returns Promise<Product | null>
   * @memberOf ProductsService
   */
  public async findProductByIdentifier(identifier: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({
      identifier,
    });

    if (!product) {
      throw new NotFoundException('product with this identifier not found');
    }

    return product;
  }

  /**
   * @public
   * @description Method to find one product by its primary key
   * @author John O.King
   * @param id
   * @returns Promise<Product | null>
   * @memberOf ProductsService
   */
  public async findProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({
      id,
    });
    if (!product) {
      throw new NotFoundException('product with this id not found');
    }

    return product;
  }
  /**
   * @public
   * @description Method to update a product by its identifier
   * @author John O.King
   * @param updateProductOptions
   * @param identifier
   * @returns Promise<Product| null>
   * @memberOf ProductsService
   */
  public async updateProduct(
    updateProductOptions: UpdateProducts,
    identifier: string,
  ): Promise<Product | null> {
    return await this.updateProductProvider.updateProduct(
      identifier,
      updateProductOptions,
    );
  }

  /**
   * @public
   * @description Method to delete a product by its identifier
   * @author John O.King
   * @param identifier
   * @returns Promise<string>
   * @memberOf ProductsService
   */

  //TODO: Test
  public async deleteProduct(identifier: string): Promise<string> {
    await this.findProductByIdentifier(identifier);

    await this.productRepository.delete({ identifier });

    return `Product with identifier ${identifier} was deleted successfully.`;
  }

  /**
   * @description Method to get all products by its primary key
   * @author John O.King
   * @param paginateQueryOptions
   * @param user
   * @returns Promise<Pagination<Product>>
   */
  public async listProducts(
    paginateQueryOptions: PaginateQuery,
    user: GetUserData,
  ): Promise<Pagination<Product>> {
    const auth_user = await this.usersService.findUserByIdentifier(user.sub);

    return await this.paginationProvider.paginateQuery(
      {
        page: paginateQueryOptions.page,
        limit: paginateQueryOptions.limit,
      },
      this.productRepository,
      { merchantId: auth_user.id },
      {
        merchant: true,
      },
    );
  }
}
