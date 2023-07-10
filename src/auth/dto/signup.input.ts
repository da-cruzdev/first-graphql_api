import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SignupInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}
