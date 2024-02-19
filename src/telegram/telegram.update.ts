import { Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { Logger, UseFilters, UseInterceptors } from '@nestjs/common';
import { ResponseTimeInterceptor } from '../common/interceptors/response-time.interceptor';
import { TelegrafExceptionFilter } from '../common/filters/telegraf-exception.filter';
import { TelegramContext } from '../common/contexts/telegram.context';
import { TelegramStartHandlerService } from './telegram-start-handler/telegram-start-handler.service';
import { TelegramInlineHandlerService } from './telegram-inline-handler/telegram-inline-handler.service';
import { TelegramKeyboardsHandlerService } from './telegram-keyboards-handler/telegram-keyboards-handler.service';
import { TelegramRegistrationActionService } from './telegram-registration-action/telegram-registration-action.service';

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(TelegrafExceptionFilter)
export class TelegramUpdate {
  constructor(
    private readonly telegramStartHandlerService: TelegramStartHandlerService,
    private readonly telegramInlineHandlerService: TelegramInlineHandlerService,
    private readonly telegramKeyboardHandlerService: TelegramKeyboardsHandlerService,
    private readonly telegramRegistrationActionService: TelegramRegistrationActionService,
    private readonly logger: Logger,
  ) {}

  // Start
  @Start()
  async start(@Ctx() ctx: TelegramContext) {
    try {
      // Get data
      await this.telegramStartHandlerService.start(ctx);
    } catch (e) {
      this.logger.error(
        'Error in start method',
        JSON.stringify(e?.response?.data || e.stack),
        TelegramUpdate.name,
      );
      throw e;
    }
  }

  @On('callback_query')
  async callbackQuery(@Ctx() ctx: TelegramContext) {
    try {
      await this.telegramInlineHandlerService.actionHandler(ctx);
    } catch (e) {
      this.logger.error(
        'Error in callbackQuery',
        JSON.stringify(e?.response?.data || e.stack),
        TelegramUpdate.name,
      );
      throw e;
    }
  }

  @On('contact')
  async contactQuery(@Ctx() ctx: TelegramContext) {
    try {
      await this.telegramRegistrationActionService.setContact(ctx);
    } catch (e) {
      this.logger.error('Error in contactQuery', e.stack, TelegramUpdate.name);
      throw e;
    }
  }

  @On('text')
  async onMessage(
    @Message('text') message: string,
    @Ctx() ctx: TelegramContext,
  ): Promise<void> {
    try {
      await this.telegramKeyboardHandlerService.actionHandler({
        message,
        ctx,
      });
    } catch (e) {
      this.logger.error(
        'Error in onMessage method',
        JSON.stringify(e?.response?.data || e.stack),
        TelegramUpdate.name,
      );
      throw e;
    }
  }
}
