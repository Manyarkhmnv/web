import { Module } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductController } from "./product.controller";
import { ProductApiController } from "./product.api.controller";
import { ProductResolver } from './product.resolver';
import { CacheModule } from '@nestjs/cache-manager';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5000,
      max: 100,
    }),
    StorageModule,
  ],
  controllers: [ProductController, ProductApiController],
  providers: [ProductService, PrismaService, ProductResolver],
})
export class ProductModule {}
