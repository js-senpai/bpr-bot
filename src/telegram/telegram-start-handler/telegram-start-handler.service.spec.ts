import { Test, TestingModule } from '@nestjs/testing';
import { TelegramStartHandlerService } from './telegram-start-handler.service';

describe('TelegramStartHandlerService', () => {
  let service: TelegramStartHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramStartHandlerService],
    }).compile();

    service = module.get<TelegramStartHandlerService>(TelegramStartHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
