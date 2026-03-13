import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
    getStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('userId passing', () => {
    const mockUser = { userId: 'user-123' };
    const mockRequest = { user: mockUser };

    it('should pass userId to tasksService.create', async () => {
      const dto = { title: 'Test Task' } as any;
      await controller.create(dto, mockRequest);
      expect(mockTasksService.create).toHaveBeenCalledWith(dto, mockUser.userId);
    });

    it('should pass userId to tasksService.update', async () => {
      const dto = { title: 'Updated' } as any;
      const taskId = 'task-uuid';
      await controller.update(taskId, dto, mockRequest);
      expect(mockTasksService.update).toHaveBeenCalledWith(taskId, dto, mockUser.userId);
    });

    it('should pass userId to tasksService.updateStatus', async () => {
      const dto = { status: 'DONE' } as any;
      const taskId = 'task-uuid';
      await controller.updateStatus(taskId, dto, mockRequest);
      expect(mockTasksService.updateStatus).toHaveBeenCalledWith(taskId, dto.status, mockUser.userId);
    });

    it('should pass userId to tasksService.remove', async () => {
      const taskId = 'task-uuid';
      await controller.remove(taskId, mockRequest);
      expect(mockTasksService.remove).toHaveBeenCalledWith(taskId, mockUser.userId);
    });
  });
});
