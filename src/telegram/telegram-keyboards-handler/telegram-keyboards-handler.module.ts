import { Module } from '@nestjs/common';
import { TelegramKeyboardsHandlerService } from './telegram-keyboards-handler.service';
import { PrismaService } from '../../common/services/prisma.service';
import { TelegramRegistrationActionService } from '../telegram-registration-action/telegram-registration-action.service';
import { TelegramStatisticActionService } from '../telegram-statistic-action/telegram-statistic-action.service';
import { TelegramMailingActionService } from '../telegram-mailing-action/telegram-mailing-action.service';

@Module({
  providers: [
    PrismaService,
    TelegramStatisticActionService,
    TelegramRegistrationActionService,
    TelegramKeyboardsHandlerService,
    TelegramMailingActionService,
  ],
})
export class TelegramKeyboardsHandlerModule {}
