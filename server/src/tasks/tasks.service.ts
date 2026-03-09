import { ForbiddenException, Injectable } from '@nestjs/common';
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

  async updateStatus(id: string, status: any) {
    return this.prisma.task.updateMany({
      where: { id },
      data: { status },
    });
  }


  async remove(id: string, userId: string) {
    const result = await this.prisma.task.deleteMany({
      where: { 
        id, userId 
      },
    });

    if (result.count === 0) {
      throw new ForbiddenException("You do not have permission to delete this task, or the task does not exist.");
    }

    return result;
}
}
