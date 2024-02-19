import { Test, TestingModule } from '@nestjs/testing';
import { TelegramRegistrationActionService } from './telegram-registration-action.service';

describe('TelegramRegistrationActionService', () => {
  let service: TelegramRegistrationActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramRegistrationActionService],
    }).compile();

    service = module.get<TelegramRegistrationActionService>(TelegramRegistrationActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
