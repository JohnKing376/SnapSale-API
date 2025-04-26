import { Module } from '@nestjs/common';
import { ProductsService } from './providers/products.service';
import { ProductsController } from './controllers/products.controller';
import { CreateProductProvider } from './providers/create-product.provider';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UpdateProductProvider } from './providers/update-product.provider';
import { PaginationModule } from '../common/pagination/pagination.module';

@Module({
  providers: [ProductsService, CreateProductProvider, UpdateProductProvider],
  controllers: [ProductsController],
  imports: [TypeOrmModule.forFeature([Product]), UsersModule, PaginationModule],
})
export class ProductsModule {}
