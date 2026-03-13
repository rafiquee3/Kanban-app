import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { TaskStatus, Priority } from '@prisma/client';

describe('TasksService', () => {
  let service: TasksService;

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Permission Validation', () => {
    const taskId = 'task-uuid';
    const ownerId = 'user-owner';
    const hackerId = 'user-hacker';

    describe('update', () => {
      it('should throw ForbiddenException if user is not the owner', async () => {
        // Mock finding the task, which belongs to ownerId
        mockPrismaService.task.findUnique.mockResolvedValue({
          id: taskId,
          userId: ownerId,
        });

        await expect(service.update(taskId, { title: 'New Title' }, hackerId))
          .rejects.toThrow(new ForbiddenException('Task not found or permission denied'));
      });

      it('should allow update if user is the owner', async () => {
        mockPrismaService.task.findUnique.mockResolvedValue({
          id: taskId,
          userId: ownerId,
        });
        mockPrismaService.task.update.mockResolvedValue({ id: taskId, title: 'Updated' });

        const result = await service.update(taskId, { title: 'Updated' }, ownerId);
        expect(result.title).toBe('Updated');
        expect(mockPrismaService.task.update).toHaveBeenCalled();
      });
    });

    describe('remove', () => {
      it('should throw ForbiddenException if no records were deleted (wrong owner or missing ID)', async () => {
        // deleteMany returns { count: 0 } if nothing matched the where clause (id + userId)
        mockPrismaService.task.deleteMany.mockResolvedValue({ count: 0 });

        await expect(service.remove(taskId, hackerId))
          .rejects.toThrow(ForbiddenException);
      });

      it('should successfully remove if task exists and owner matches', async () => {
        mockPrismaService.task.deleteMany.mockResolvedValue({ count: 1 });

        const result = await service.remove(taskId, ownerId);
        expect(result.count).toBe(1);
      });
    });
  });

  describe('Filtering and Transformation', () => {
    describe('findAll', () => {
      it('should build correct where object with filters', async () => {
        const filter = {
          status: TaskStatus.IN_PROGRESS,
          priority: Priority.HIGH,
          search: 'test',
        };

        await service.findAll(filter);

        expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
          where: {
            status: TaskStatus.IN_PROGRESS,
            priority: Priority.HIGH,
            OR: [
              { title: { contains: 'test', mode: 'insensitive' } },
              { description: { contains: 'test', mode: 'insensitive' } },
            ],
          },
          include: expect.any(Object),
        });
      });
    });

    describe('getStats', () => {
      it('should map raw groupBy data to frontend format', async () => {
        // Mocking the Promise.all return values
        mockPrismaService.task.groupBy
          .mockResolvedValueOnce([
            { status: 'TODO', _count: { id: 5 } },
            { status: 'DONE', _count: { id: 2 } },
          ])
          .mockResolvedValueOnce([
            { priority: 'HIGH', _count: { id: 3 } },
            { priority: 'LOW', _count: { id: 4 } },
          ]);

        const stats = await service.getStats();

        expect(stats).toEqual({
          byStatus: {
            TODO: 5,
            DONE: 2,
          },
          byPriority: [
            { name: 'HIGH', value: 3 },
            { name: 'LOW', value: 4 },
          ],
        });
      });
    });
  });
});
