import { TelegramContext } from '../../../../contexts/telegram.context';
import { I18nService } from 'nestjs-i18n';
import { TryAgainFullNameKeyboardButton } from '../../buttons/keyboard-buttons/user/registration/try-again-full-name.keyboard-button';

export const NotFoundResultsAction = async ({
  ctx,
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.NOT_FOUND_RESULTS', {
      lang,
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          await TryAgainFullNameKeyboardButton({
            i18n,
          }),
        ],
      },
    },
  );
};
