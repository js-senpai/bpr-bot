import { TelegramContext } from '../../../../../contexts/telegram.context';
import { I18nService } from 'nestjs-i18n';

export const GetFullNameAction = async ({
  ctx,
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.WRITE_FULL_NAME', {
      lang,
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        remove_keyboard: true,
      },
    },
  );
};
