import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  SUPERADMIN = 'superAdmin',
  USER = 'user',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});
