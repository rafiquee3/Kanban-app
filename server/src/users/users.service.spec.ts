import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Mock bcryptjs
jest.mock('bcryptjs');

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if email is already in use', async () => {
      const email = 'existing@example.com';
      // Mock findUnique (called via findByEmail) to return an existing user
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email });

      await expect(service.create(email, 'password123')).rejects.toThrow(
        new ConflictException('Email already in use'),
      );

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should successfully create a new user if email is unique', async () => {
      const email = 'new@example.com';
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue({
        id: '2',
        email,
        createdAt: new Date(),
      });

      const result = await service.create(email, 'password123', 'newuser');

      expect(result).toBeDefined();
      expect(result.email).toBe(email);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });
  });
});
