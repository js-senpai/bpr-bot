import { Test, TestingModule } from '@nestjs/testing';
import { TelegramMailingActionService } from './telegram-mailing-action.service';

describe('TelegramMailingActionService', () => {
  let service: TelegramMailingActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramMailingActionService],
    }).compile();

    service = module.get<TelegramMailingActionService>(TelegramMailingActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
