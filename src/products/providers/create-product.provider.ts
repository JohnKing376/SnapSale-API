import {
  Injectable,
  InternalServerErrorException,
  Logger,
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
  private readonly logger = new Logger('CreateProductProvider');
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
    const merchantId = await this.usersService.findUserByIdentifier(user.sub);

    if (!merchantId) {
      throw new NotFoundException('user not found');
    }

    try {
      const newProduct = this.productRepository.create({
        merchantId: merchantId.id,
        createdAt: new Date(),
        ...createProductOptions,
      });

      return await this.productRepository.save(newProduct);
    } catch (CreateProductProviderError) {
      this.logger.log(
        `[CREATE-PRODUCT-PROVIDER-ERROR]: ${JSON.stringify(CreateProductProviderError, null, 2)}`,
      );
      throw new InternalServerErrorException(
        'Something went wrong while trying to create the product. Please try again later',
      );
    }
  }
}
