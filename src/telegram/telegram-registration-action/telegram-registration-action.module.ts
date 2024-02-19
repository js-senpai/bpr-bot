import { Module } from '@nestjs/common';
import { TelegramRegistrationActionService } from './telegram-registration-action.service';
import { PrismaService } from '../../common/services/prisma.service';
import { PuppeteerService } from '../../common/services/puppeteer.service';

@Module({
  providers: [
    PrismaService,
    PuppeteerService,
    TelegramRegistrationActionService,
  ],
})
export class TelegramRegistrationActionModule {}
