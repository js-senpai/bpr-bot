import { Module } from '@nestjs/common';
import { TelegramMailingActionService } from './telegram-mailing-action.service';
import { PrismaService } from '../../common/services/prisma.service';

@Module({
  providers: [PrismaService, TelegramMailingActionService],
})
export class TelegramMailingActionModule {}
