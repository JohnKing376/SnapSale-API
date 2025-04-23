import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database/database.config';
import appConfig from './config/app.config';
import environmentValidator from './config/validator/environment.validator';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { AuthTypeGuard } from './auth/guards/authentication/auth-type.guard';
import { ProductsModule } from './products/products.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PaginationModule } from './common/pagination/pagination/pagination.module';
import { Pagination } from './common/pagination/pagination';
import { PaginationModule } from './common/pagination/pagination.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: !ENV ? `.env` : `.env.${ENV}`,
      validationSchema: environmentValidator,
    }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        database: configService.get('database.name'),
        port: configService.get('database.port'),
        host: configService.get('database.host'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        synchronize: configService.get('database.synchronize'),
        entities: [
          'dist/**/*.entity{.ts,.js}',
          'dist/**/entities/**/*.entity{.ts,.js}',
        ],
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    PaginationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthTypeGuard,
    },
    AuthenticationGuard,
    Pagination,
  ],
})
export class AppModule {}
