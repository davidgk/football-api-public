import { AppController } from '@app/app.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '@app/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return proper message', () => {
      expect(appController.getHello()).toBe(
        'Hi there , thanks for starting Football-api, created by David G. Kotlirevsky',
      );
    });
  });
});
