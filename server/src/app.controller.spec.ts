import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('profile', () => {
    it('should return user data from token', () => {
      const mockReq = { user: { userId: '123', email: 'test@test.com' } };
      expect(appController.getProfile(mockReq)).toEqual(mockReq.user);
    });
  });
});
