import { Test, TestingModule } from '@nestjs/testing';
import { TelegramInlineHandlerService } from './telegram-inline-handler.service';

describe('TelegramInlineHandlerService', () => {
  let service: TelegramInlineHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramInlineHandlerService],
    }).compile();

    service = module.get<TelegramInlineHandlerService>(TelegramInlineHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
