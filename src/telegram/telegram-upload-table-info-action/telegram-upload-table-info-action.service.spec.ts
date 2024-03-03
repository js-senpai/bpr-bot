import { Test, TestingModule } from '@nestjs/testing';
import { TelegramUploadTableInfoActionService } from './telegram-upload-table-info-action.service';

describe('TelegramUploadTableInfoActionService', () => {
  let service: TelegramUploadTableInfoActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramUploadTableInfoActionService],
    }).compile();

    service = module.get<TelegramUploadTableInfoActionService>(TelegramUploadTableInfoActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
