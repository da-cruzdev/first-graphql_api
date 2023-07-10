import { SignupInput } from './signup.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAuthInput extends PartialType(SignupInput) {}
