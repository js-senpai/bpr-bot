import { Test, TestingModule } from '@nestjs/testing';
import { TelegramStatisticActionService } from './telegram-statistic-action.service';

describe('TelegramStatisticActionService', () => {
  let service: TelegramStatisticActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramStatisticActionService],
    }).compile();

    service = module.get<TelegramStatisticActionService>(TelegramStatisticActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
