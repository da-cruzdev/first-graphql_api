import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SignupInput } from './dto/signup.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
// import { Prisma } from '@prisma/client';
import { SigninInput } from './dto/signin.input';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(signupInput: SignupInput) {
    // const hashedassword = await argon.hash(signupInput.password);
    const user = await this.userService.createUser(signupInput);

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );

    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async signin(signinInput: SigninInput) {
    const user = await this.userService.findOneUser(signinInput.email);

    const password = await argon.verify(user.password, signinInput.password);

    if (!password) {
      throw new BadRequestException('Votre mot de passe est incorrect');
    }

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );

    await this.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user };
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshToken: { not: null },
      },
      data: { refreshToken: null },
    });

    return { loggedOut: true };
  }

  async getNewTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ForbiddenException(`Accès interdit`);
    }

    const tokenMatch = await argon.verify(user.refreshToken, rt);

    if (!tokenMatch) {
      throw new ForbiddenException(`Accès interdit`);
    }

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async createTokens(userId: number, email: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: '10s',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      {
        expiresIn: '1d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      },
    );

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }
}
