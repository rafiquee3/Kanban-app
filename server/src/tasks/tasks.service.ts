import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

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

  async findAll(userId: string, filterDto: GetTasksFilterDto) {
    const { status, priority } = filterDto;

    return this.prisma.task.findMany({
      where: {
        userId,
        status,
        priority,
      },
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
