import { TelegramContext } from '../contexts/telegram.context';

export interface ITelegramBodyWithMessage {
  ctx: TelegramContext;
  message: string;
}
