import { Test, TestingModule } from '@nestjs/testing';
import { TelegramKeyboardsHandlerService } from './telegram-keyboards-handler.service';

describe('TelegramKeyboardsHandlerService', () => {
  let service: TelegramKeyboardsHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramKeyboardsHandlerService],
    }).compile();

    service = module.get<TelegramKeyboardsHandlerService>(TelegramKeyboardsHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
