import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from '../graphql/types/product.type';
import { CreateProductInput } from './graphql/create-product.input';
import { UpdateProductInput } from './graphql/update-product.input';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product])
  async products(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Query(() => Product, { nullable: true })
  async product(@Args('id', { type: () => ID }) id: string): Promise<Product | null> {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product)
  async createProduct(@Args('input') input: CreateProductInput): Promise<Product> {
    return this.productService.create(input);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<Product> {
    return this.productService.update(parseInt(id, 10), input);
  }

  @Mutation(() => Product)
  async deleteProduct(@Args('id', { type: () => ID }) id: string): Promise<Product> {
    return this.productService.remove(parseInt(id, 10));
  }
} 