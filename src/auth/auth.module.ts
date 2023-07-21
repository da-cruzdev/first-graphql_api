import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    JwtService,
    UserService,
    PrismaService,
    AccessTokenStrategy,
  ],
})
export class AuthModule {}
