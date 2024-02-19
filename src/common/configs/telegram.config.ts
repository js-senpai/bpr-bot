import { ConfigService } from '@nestjs/config';
import { TelegrafModuleOptions } from 'nestjs-telegraf';
import { telegramSessionMiddleware } from '../middlewares/telegram-session.middleware';

export const telegramConfig = async (
  configService: ConfigService,
): Promise<TelegrafModuleOptions> => ({
  token: configService.get('TELEGRAM_BOT_TOKEN'),
  middlewares: [telegramSessionMiddleware],
});
