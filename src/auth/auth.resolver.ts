import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { SignupInput } from './dto/signup.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { SignResponse } from './dto/sign-response';
import { SigninInput } from './dto/signin.input';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignResponse)
  Signup(@Args('signupInput') signupInput: SignupInput) {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => SignResponse)
  Signin(@Args('signinInput') signinInput: SigninInput) {
    return this.authService.signin(signinInput);
  }
}
