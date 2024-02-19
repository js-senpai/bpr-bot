import { Module } from '@nestjs/common';
import { TelegramInlineHandlerService } from './telegram-inline-handler.service';
import { PrismaService } from '../../common/services/prisma.service';
import { TelegramRegistrationActionService } from '../telegram-registration-action/telegram-registration-action.service';

@Module({
  providers: [
    PrismaService,
    TelegramRegistrationActionService,
    TelegramInlineHandlerService,
  ],
})
export class TelegramInlineHandlerModule {}
