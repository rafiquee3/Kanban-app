import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';

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
    const { status, priority, search } = filterDto;

    return this.prisma.task.findMany({
      where: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
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

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      throw new ForbiddenException('Task not found or permission denied');
    }

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async updateStatus(id: string, status: TaskStatus, userId: string) {
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

  async getStats() {
    const [statusStats, priorityStats] = await Promise.all([
      this.prisma.task.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prisma.task.groupBy({
        by: ['priority'],
        _count: { id: true },
      }),
    ]);

    return {
      byStatus: statusStats.reduce(
        (acc, c) => ({ ...acc, [c.status]: c._count.id }),
        {},
      ),
      byPriority: priorityStats.map((p) => ({
        name: p.priority,
        value: p._count.id,
      })),
    };
  }
}
