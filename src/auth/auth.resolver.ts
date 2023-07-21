import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { SignupInput } from './dto/signup.input';
import { SignResponse } from './dto/sign-response';
import { SigninInput } from './dto/signin.input';
import { LogoutResponse } from './dto/logout-response';
import { ParseIntPipe } from '@nestjs/common';
import { Public } from './decorators/public.decorato';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => SignResponse)
  Signup(@Args('signupInput') signupInput: SignupInput) {
    return this.authService.signup(signupInput);
  }

  @Public()
  @Mutation(() => SignResponse)
  Signin(@Args('signinInput') signinInput: SigninInput) {
    return this.authService.signin(signinInput);
  }
  @Mutation(() => LogoutResponse)
  Logout(@Args('id', ParseIntPipe) id: number) {
    return this.authService.logout(id);
  }

  @Public()
  @Query(() => String)
  hello() {
    return `Hello Guys`;
  }
}
