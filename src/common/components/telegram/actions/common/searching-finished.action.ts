import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../contexts/telegram.context';

export const SearchingFinishedAction = async ({
  ctx,
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.SEARCHING_FINISHED', {
      lang,
    }),
    {
      parse_mode: 'HTML',
    },
  );
};
