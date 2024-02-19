import { TelegramContext } from '../contexts/telegram.context';

export interface ITelegramKeyboardBody {
  ctx: TelegramContext;
  message: string;
}
