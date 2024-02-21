import { TelegramContext } from '../../../../contexts/telegram.context';
import { I18nService } from 'nestjs-i18n';

export const ErrorCsvUploadAction = async ({
  ctx,
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.ERROR_CSV_UPLOAD', {
      lang,
    }),
    {
      parse_mode: 'HTML',
    },
  );
};
