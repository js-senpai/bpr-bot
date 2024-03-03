import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../../contexts/telegram.context';
import { AVAILABLE_YEARS } from '../../../../../constants/common.constants';
import { TelegramActionsEnums } from '../../../../../enums/telegram-actions.enums';

export const SelectYearTableInfoAction = async ({
  ctx,
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.CHOOSE_TABLE_YEAR', {
      lang,
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          AVAILABLE_YEARS.map((item) => ({
            text: `${item}`,
            callback_data: JSON.stringify({
              type: TelegramActionsEnums.CHOOSE_TABLE_INFO_YEAR,
              value: item,
            }),
          })),
        ],
      },
    },
  );
};
