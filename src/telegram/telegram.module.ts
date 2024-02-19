import { Logger, Module } from '@nestjs/common';
import { TelegramUpdate } from './telegram.update';
import { PrismaService } from '../common/services/prisma.service';
import { TelegramStartHandlerService } from './telegram-start-handler/telegram-start-handler.service';
import { TelegramInlineHandlerService } from './telegram-inline-handler/telegram-inline-handler.service';
import { TelegramKeyboardsHandlerService } from './telegram-keyboards-handler/telegram-keyboards-handler.service';
import { TelegramRegistrationActionService } from './telegram-registration-action/telegram-registration-action.service';
import { PuppeteerService } from '../common/services/puppeteer.service';
import { TelegramStatisticActionService } from './telegram-statistic-action/telegram-statistic-action.service';
import { TelegramMailingActionService } from './telegram-mailing-action/telegram-mailing-action.service';

@Module({
  providers: [
    Logger,
    PrismaService,
    PuppeteerService,
    TelegramRegistrationActionService,
    TelegramStartHandlerService,
    TelegramInlineHandlerService,
    TelegramKeyboardsHandlerService,
    TelegramStatisticActionService,
    TelegramMailingActionService,
    TelegramUpdate,
  ],
})
export class TelegramModule {}
