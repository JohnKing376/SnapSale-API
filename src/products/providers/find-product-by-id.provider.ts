import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindProductByIdProvider {
  private readonly logger = new Logger('FindProductByIdProvider');

  constructor(
    /**
     * Import Product Repository
     */
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async findOneByIdentifier(identifier: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOneBy({
        identifier,
      });

      if (!product) {
        throw new NotFoundException('product with this id not found');
      }

      return product;
    } catch (error) {
      this.logger.error(`[FIND-PRODUCT-BY-ID-ERROR]: ${error}`);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
