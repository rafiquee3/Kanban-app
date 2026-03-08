import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId, // Key: we link the task to the logged-in user
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: any, userId: string) {
    return this.prisma.task.updateMany({
      where: { id, userId }, // We ensure that the user edits THEIR OWN task
      data: { status },
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.task.deleteMany({
      where: { id, userId },
    });
  }
}