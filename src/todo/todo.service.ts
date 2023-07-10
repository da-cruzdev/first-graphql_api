import { Injectable } from '@nestjs/common';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

import { Todo } from './entities/todo.entity';
import { UserInputError } from '@nestjs/apollo';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTodoInput: CreateTodoInput): Promise<Todo> {
    return await this.prisma.todo.create({
      data: createTodoInput,
    });
  }

  async findAll(): Promise<Todo[]> {
    return await this.prisma.todo.findMany();
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({
      where: { id: id } as Prisma.TodoWhereUniqueInput,
    });

    if (!todo) {
      throw new UserInputError(`Le todo avec l'id ${id} n'existe pas`);
    }

    return todo;
  }

  async update(id: number, updateTodoInput: UpdateTodoInput): Promise<Todo> {
    const updateTodo = await this.prisma.todo.update({
      where: { id: id } as Prisma.TodoWhereUniqueInput,
      data: updateTodoInput,
    });
    if (!updateTodo) {
      throw new UserInputError(`Le todo avec l'id ${id} n'existe pas`);
    }
    return updateTodo;
  }

  async remove(id: Number) {
    return await this.prisma.todo.delete({
      where: { id: id } as Prisma.TodoWhereUniqueInput,
    });
  }
}
