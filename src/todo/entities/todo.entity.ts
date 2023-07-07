import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Todo {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;
}
