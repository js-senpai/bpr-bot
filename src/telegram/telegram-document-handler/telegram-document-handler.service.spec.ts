import { Test, TestingModule } from '@nestjs/testing';
import { TelegramDocumentHandlerService } from './telegram-document-handler.service';

describe('TelegramDocumentHandlerService', () => {
  let service: TelegramDocumentHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramDocumentHandlerService],
    }).compile();

    service = module.get<TelegramDocumentHandlerService>(TelegramDocumentHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
