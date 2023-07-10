import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { SignupInput } from './dto/signup.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { SignResponse } from './dto/sign-response';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignResponse)
  Signup(@Args('signupInput') signupInput: SignupInput) {
    return this.authService.signup(signupInput);
  }

  @Query(() => [Auth], { name: 'auth' })
  findAll() {
    return this.authService.findAll();
  }

  @Query(() => Auth, { name: 'auth' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.authService.findOne(id);
  }

  @Mutation(() => Auth)
  updateAuth(
    @Args('updateAuthInput') id: number,
    updateAuthInput: UpdateAuthInput,
  ) {
    return this.authService.update(id, updateAuthInput);
  }

  @Mutation(() => Auth)
  removeAuth(@Args('id', { type: () => Int }) id: number) {
    return this.authService.remove(id);
  }
}
