import { Module } from '@nestjs/common';
import { TelegramStatisticActionService } from './telegram-statistic-action.service';
import { PrismaService } from '../../common/services/prisma.service';

@Module({
  providers: [PrismaService, TelegramStatisticActionService],
})
export class TelegramStatisticActionModule {}
