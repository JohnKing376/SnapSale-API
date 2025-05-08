import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { UpdateProducts } from '../types/update-products.types';

@Injectable()
export class UpdateProductProvider {
  private readonly logger = new Logger('UpdateProductProvider');
  constructor(
    /**
     * Import Product Repository
     */
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async updateProduct(
    identifier: string,
    updateProductOptions: UpdateProducts,
  ): Promise<Product | null> {
    const product = await this.productRepository.findOneBy({ identifier });

    if (!product) throw new NotFoundException('product not found');

    try {
      await this.productRepository.update(
        { identifier },
        { ...updateProductOptions },
      );

      return this.productRepository.findOne({
        where: { identifier: product.identifier },
      });
    } catch (UpdateProductProviderError) {
      this.logger.error(
        `[UPDATE-PRODUCT-PROVIDER-ERROR]: ${JSON.stringify(UpdateProductProviderError, null, 2)}]`,
      );
      throw new InternalServerErrorException(
        'Something went wrong while updating the product. Try again later',
      );
    }
  }
}
