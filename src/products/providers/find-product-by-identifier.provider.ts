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
export class FindProductByIdentifierProvider {
  private readonly logger = new Logger('FindProductByIdentifierProvider');

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
        throw new NotFoundException('product with this identifier not found');
      }

      return product;
    } catch (error) {
      this.logger.error(`[FIND-PRODUCT-BY-IDENTIFIER-ERROR]: ${error}`);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
