import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { ICreateProduct } from '../interfaces/create-product.interface';
import { UsersService } from '../../users/providers/users.service';
import { GetUserData } from '../../auth/interfaces/get-user-data.inteface';

@Injectable()
export class CreateProductProvider {
  constructor(
    /**
     * Import Product Repository
     */
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    /**
     * Import User Service
     */
    private readonly usersService: UsersService,
  ) {}

  public async createProduct(
    user: GetUserData,
    createProductOptions: ICreateProduct,
  ): Promise<Product> {
    const merchantId = await this.usersService.findOneByIdentifier(user.sub);

    if (!merchantId) {
      throw new NotFoundException('user not found');
    }

    try {
      const newProduct = this.productRepository.create({
        ...createProductOptions,
        merchant: merchantId,
      });

      await this.productRepository.save(newProduct);

      return newProduct;
    } catch (CreateProductProviderError) {
      throw new InternalServerErrorException('Internal Server Error', {
        description: JSON.stringify(
          `CreateProductProviderError.${CreateProductProviderError}`,
          null,
          2,
        ),
        cause: CreateProductProviderError,
      });
    }
  }
}
