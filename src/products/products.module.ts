import { Module } from '@nestjs/common';
import { ProductsService } from './providers/products.service';
import { ProductsController } from './controllers/products.controller';
import { CreateProductProvider } from './providers/create-product.provider';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UpdateProductProvider } from './providers/update-product.provider';
import { PaginationModule } from '../common/pagination/pagination.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleTypeGuard } from '../auth/guards/authentication/role-type.guard';
import { FindProductByIdentifierProvider } from './providers/find-product-by-identifier.provider';
import { FindProductByIdProvider } from './providers/find-product-by-id.provider';

@Module({
  providers: [
    ProductsService,
    CreateProductProvider,
    UpdateProductProvider,
    {
      provide: APP_GUARD,
      useClass: RoleTypeGuard,
    },
    FindProductByIdentifierProvider,
    FindProductByIdProvider,
  ],
  controllers: [ProductsController],
  imports: [TypeOrmModule.forFeature([Product]), UsersModule, PaginationModule],
})
export class ProductsModule {}
