import { Module } from '@nestjs/common';
import { TelegramStartHandlerService } from './telegram-start-handler.service';
import { PrismaService } from '../../common/services/prisma.service';

@Module({
  providers: [PrismaService, TelegramStartHandlerService],
})
export class TelegramStartHandlerModule {}
