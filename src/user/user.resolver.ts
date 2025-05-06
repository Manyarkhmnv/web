import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '../graphql/types/user.type';
import { CreateUserInput } from './graphql/create-user.input';
import { UpdateUserInput } from './graphql/update-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id', { type: () => ID }) id: string): Promise<User | null> {
    return this.userService.findOne(parseInt(id, 10));
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.userService.create(input);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update(parseInt(id, 10), input);
  }

  @Mutation(() => User)
  async deleteUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.userService.remove(parseInt(id, 10));
  }
} 