import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../../contexts/telegram.context';

export const GetTotalUsersAction = async ({
  ctx,
  lang = 'ua',
  i18n,
  total = 0,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
  total: number;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.TOTAL_USERS', {
      lang,
      args: {
        total,
      },
    }),
    {
      parse_mode: 'HTML',
    },
  );
};
