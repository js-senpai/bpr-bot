import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../../contexts/telegram.context';
import { AnotherRequestKeyboardButton } from '../../../buttons/keyboard-buttons/user/registration/another-request.keyboard-button';
import { ShareBotKeyboardButton } from '../../../buttons/keyboard-buttons/user/common/share-bot.keyboard-button';

export const GetScoreResultAction = async ({
  ctx,
  lang = 'ua',
  i18n,
  scores,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
  scores: string;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.TOTAL_SCORES', {
      lang,
      args: {
        scores,
      },
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          await AnotherRequestKeyboardButton({
            i18n,
          }),
          await ShareBotKeyboardButton({
            i18n,
          }),
        ],
      },
    },
  );
};
