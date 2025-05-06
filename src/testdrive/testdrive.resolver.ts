import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TestdriveService } from './testdrive.service';
import { Testdrive } from '../graphql/types/testdrive.type';
import { CreateTestdriveInput } from './graphql/create-testdrive.input';
import { UpdateTestdriveInput } from './graphql/update-testdrive.input';

@Resolver(() => Testdrive)
export class TestdriveResolver {
  constructor(private readonly testdriveService: TestdriveService) {}

  @Query(() => [Testdrive])
  async testdrives(): Promise<Testdrive[]> {
    return this.testdriveService.findAll();
  }

  @Query(() => Testdrive, { nullable: true })
  async testdrive(@Args('id', { type: () => ID }) id: string): Promise<Testdrive | null> {
    return this.testdriveService.findOne(parseInt(id, 10));
  }

  @Mutation(() => Testdrive)
  async createTestdrive(@Args('input') input: CreateTestdriveInput): Promise<Testdrive> {
    return this.testdriveService.create(input);
  }

  @Mutation(() => Testdrive)
  async updateTestdrive(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateTestdriveInput,
  ): Promise<Testdrive> {
    return this.testdriveService.update(parseInt(id, 10), input);
  }

  @Mutation(() => Testdrive)
  async deleteTestdrive(@Args('id', { type: () => ID }) id: string): Promise<Testdrive> {
    return this.testdriveService.remove(parseInt(id, 10));
  }
} 