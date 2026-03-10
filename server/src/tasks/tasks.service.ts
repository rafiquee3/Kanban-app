import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    try {
      const { title, description, status, priority } = createTaskDto;
      return await this.prisma.task.create({
        data: {
          title,
          description,
          status: status || 'TODO',
          priority: priority || 'MEDIUM',
          userId,
        },
      });
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async findAll(filterDto: GetTasksFilterDto) {
    const { status, priority } = filterDto; // Używamy tylko tego, co masz w DTO

    return this.prisma.task.findMany({
      where: {
        // If status is in the URL (?status=DONE), Prisma will include it
        ...(status && { status }),
        // If priority is in the URL (?priority=HIGH), Prisma will include it
        ...(priority && { priority }),
      },
      include: {
        user: {
          select: {
            email: true,
            username: true,
          },
        },
      },
    });
  }

  async update(id: string, updateTaskDto: any, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      throw new ForbiddenException('Task not found or permission denied');
    }

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async updateStatus(id: string, status: any, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      throw new ForbiddenException('Task not found or permission denied');
    }

    return this.prisma.task.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string, userId: string) {
    const result = await this.prisma.task.deleteMany({
      where: {
        id,
        userId,
      },
    });

    if (result.count === 0) {
      throw new ForbiddenException(
        'You do not have permission to delete this task, or the task does not exist.',
      );
    }

    return result;
  }
}
