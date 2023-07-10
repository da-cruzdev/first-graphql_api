import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAllUsers();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('email') email: string) {
    return this.userService.findOneUser(email);
  }

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') id: number,
    updateUserInput: UpdateUserInput,
  ) {
    return this.userService.updateUser(id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.removeUser(id);
  }
}
