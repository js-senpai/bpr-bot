import { Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { Logger, UseInterceptors } from '@nestjs/common';
import { ResponseTimeInterceptor } from '../common/interceptors/response-time.interceptor';
import { TelegramContext } from '../common/contexts/telegram.context';
import { TelegramStartHandlerService } from './telegram-start-handler/telegram-start-handler.service';
import { TelegramInlineHandlerService } from './telegram-inline-handler/telegram-inline-handler.service';
import { TelegramKeyboardsHandlerService } from './telegram-keyboards-handler/telegram-keyboards-handler.service';
import { TelegramRegistrationActionService } from './telegram-registration-action/telegram-registration-action.service';
import { TelegramDocumentHandlerService } from './telegram-document-handler/telegram-document-handler.service';
import { ErrorUnknownAction } from '../common/components/telegram/actions/errors/error-unknown.action';
import { I18nService } from 'nestjs-i18n';

@Update()
@UseInterceptors(ResponseTimeInterceptor)
// @UseFilters(TelegrafExceptionFilter)
export class TelegramUpdate {
  constructor(
    private readonly telegramStartHandlerService: TelegramStartHandlerService,
    private readonly telegramInlineHandlerService: TelegramInlineHandlerService,
    private readonly telegramKeyboardHandlerService: TelegramKeyboardsHandlerService,
    private readonly telegramRegistrationActionService: TelegramRegistrationActionService,
    private readonly telegramDocumentHandlerService: TelegramDocumentHandlerService,
    private readonly logger: Logger,
    private readonly i18n: I18nService,
  ) {}

  // Start
  @Start()
  async start(@Ctx() ctx: TelegramContext) {
    try {
      // Get data
      await this.telegramStartHandlerService.start(ctx);
    } catch (e) {
      ctx.session.searching = false;
      ctx.session.enableTableUploading = false;
      ctx.session.enableWritingMail = false;
      ctx.session.enableMailing = false;
      ErrorUnknownAction({
        ctx,
        i18n: this.i18n,
      });
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
      ctx.session.searching = false;
      ctx.session.enableTableUploading = false;
      ctx.session.enableWritingMail = false;
      ctx.session.enableMailing = false;
      ErrorUnknownAction({
        ctx,
        i18n: this.i18n,
      });
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
      ctx.session.searching = false;
      ctx.session.enableTableUploading = false;
      ctx.session.enableWritingMail = false;
      ctx.session.enableMailing = false;
      ErrorUnknownAction({
        ctx,
        i18n: this.i18n,
      });
      this.logger.error('Error in contactQuery', e.stack, TelegramUpdate.name);
      throw e;
    }
  }

  @On('document')
  async onDocument(
    @Message('text') message: string,
    @Ctx() ctx: TelegramContext,
  ): Promise<void> {
    try {
      await this.telegramDocumentHandlerService.actionHandler({ ctx, message });
    } catch (e) {
      ctx.session.searching = false;
      ctx.session.enableTableUploading = false;
      ctx.session.enableWritingMail = false;
      ctx.session.enableMailing = false;
      ErrorUnknownAction({
        ctx,
        i18n: this.i18n,
      });
      this.logger.error(
        'Error in onMessage method',
        JSON.stringify(e?.response?.data || e.stack),
        TelegramUpdate.name,
      );
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
      ctx.session.searching = false;
      ctx.session.enableTableUploading = false;
      ctx.session.enableWritingMail = false;
      ctx.session.enableMailing = false;
      ErrorUnknownAction({
        ctx,
        i18n: this.i18n,
      });
      this.logger.error(
        'Error in onMessage method',
        JSON.stringify(e?.response?.data || e.stack),
        TelegramUpdate.name,
      );
      throw e;
    }
  }
}
