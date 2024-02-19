import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../../contexts/telegram.context';
import { AVAILABLE_YEARS } from '../../../../../constants/common.constants';
export const ChooseYearAction = async ({
  ctx,
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.CHOOSE_YEAR', {
      lang,
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          AVAILABLE_YEARS.map((item) => ({
            text: `${item}`,
          })),
        ],
      },
    },
  );
};
