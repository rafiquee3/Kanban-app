import { Test, TestingModule } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load .env.test from the server directory
const envPath = join(__dirname, '../../.env.test');
dotenv.config({ path: envPath });

import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus, Priority } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

describe('TasksService Integration', () => {
  let service: TasksService;
  let prisma: PrismaService;
  let testUser: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, PrismaService],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clean up database before tests
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword,
      },
    });
  });

  afterAll(async () => {
    // Clean up after all tests
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a task in the database', async () => {
    const createTaskDto = {
      title: 'Test Integration Task',
      description: 'This is a test task for integration',
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
    };

    const task = await service.create(createTaskDto, testUser.id);

    expect(task).toBeDefined();
    expect(task.id).toBeDefined();
    expect(task.title).toBe(createTaskDto.title);
    expect(task.userId).toBe(testUser.id);

    // Verify it exists in the database
    const dbTask = await prisma.task.findUnique({
      where: { id: task.id },
    });
    expect(dbTask).toBeDefined();
    expect(dbTask?.title).toBe(createTaskDto.title);
  });

  it('should find all tasks for the user', async () => {
    // Arrange: Create a specific task for this test
    const taskTitle = 'Find All Integration Test';
    await prisma.task.create({
      data: {
        title: taskTitle,
        userId: testUser.id,
      },
    });

    // Act
    const tasks = await service.findAll({});

    // Assert
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks.some(t => t.title === taskTitle)).toBe(true);
  });

  it('should find tasks with filters', async () => {
    // Create another task with different status
    await prisma.task.create({
      data: {
        title: 'Another Task',
        status: TaskStatus.DONE,
        userId: testUser.id,
      },
    });

    const todoTasks = await service.findAll({ status: TaskStatus.TODO });
    const doneTasks = await service.findAll({ status: TaskStatus.DONE });

    expect(todoTasks.every(t => t.status === TaskStatus.TODO)).toBe(true);
    expect(doneTasks.every(t => t.status === TaskStatus.DONE)).toBe(true);
    expect(doneTasks.some(t => t.title === 'Another Task')).toBe(true);
  });

  it('should update task status', async () => {
    // First create a task to update
    const task = await prisma.task.create({
      data: {
        title: 'Task to update',
        status: TaskStatus.TODO,
        userId: testUser.id,
      },
    });

    const updatedTask = await service.updateStatus(task.id, TaskStatus.IN_PROGRESS, testUser.id);
    expect(updatedTask.status).toBe(TaskStatus.IN_PROGRESS);

    // Verify in DB
    const dbTask = await prisma.task.findUnique({ where: { id: task.id } });
    expect(dbTask?.status).toBe(TaskStatus.IN_PROGRESS);
  });

  it('should remove a task', async () => {
    const task = await prisma.task.create({
      data: {
        title: 'Task to delete',
        userId: testUser.id,
      },
    });

    await service.remove(task.id, testUser.id);

    const dbTask = await prisma.task.findUnique({ where: { id: task.id } });
    expect(dbTask).toBeNull();
  });
});
