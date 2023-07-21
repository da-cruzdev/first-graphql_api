import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserInputError } from '@nestjs/apollo';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserInput: CreateUserInput) {
    try {
      const hashedassword = await argon.hash(createUserInput.password);
      const user = await this.prisma.user.create({
        data: {
          username: createUserInput.username,
          email: createUserInput.email,
          password: hashedassword,
        } as Prisma.UserCreateInput,
      });

      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`L'adresse email est déja utilisée`);
      }

      throw new InternalServerErrorException(
        "L'adresse email est déja utilisée",
      );
    }
  }

  async findAllUsers() {
    return await this.prisma.user.findMany();
  }

  async findOneUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UserInputError(
        `Cet utilisateur avec l'id ${email} n'existe pas...!!!`,
      );
    }
    return user;
  }

  async updateUser(id: number, updateUserInput: UpdateUserInput) {
    const updateUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserInput,
      },
    });

    if (!updateUser) {
      throw new UserInputError(
        `Cet utilisateur avec l'id ${id} n'existe pas...!!!`,
      );
    }
    return updateUser;
  }

  removeUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
