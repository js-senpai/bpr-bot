import { Test, TestingModule } from '@nestjs/testing';
import { TelegramUploadTableActionService } from './telegram-upload-table-action.service';

describe('TelegramUploadTableActionService', () => {
  let service: TelegramUploadTableActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramUploadTableActionService],
    }).compile();

    service = module.get<TelegramUploadTableActionService>(TelegramUploadTableActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
