import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt to avoid real hashing in unit tests
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const user = { id: 'uuid', email: 'test@test.com', password: 'hashedPassword' };
      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('fake_token');

      const result = await service.login('test@test.com', 'password123');

      expect(result).toEqual({ access_token: 'fake_token' });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login('wrong@test.com', 'pass'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const user = { email: 'test@test.com', password: 'hashedPassword' };
      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login('test@test.com', 'wrongpass'))
        .rejects.toThrow(new UnauthorizedException('Invalid credentials'));
    });
  });

  describe('register', () => {
    it('should create a new user and return a success message', async () => {
      const newUser = { id: 'new-id', email: 'new@test.com' };
      mockUsersService.create.mockResolvedValue(newUser);

      const result = await service.register('new@test.com', 'pass123', 'newuser');

      expect(result).toEqual({
        message: 'User created successfully',
        userId: 'new-id',
      });
      expect(mockUsersService.create).toHaveBeenCalledWith('new@test.com', 'pass123', 'newuser');
    });

    it('should throw Error if password is too short (example validation)', async () => {
      await expect(service.register('test@test.com', '123'))
        .rejects.toThrow('Password too short');
    });
  });
});
