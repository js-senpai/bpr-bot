import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../../contexts/telegram.context';
import { TelegramActionsEnums } from '../../../../../enums/telegram-actions.enums';

export const ChooseFullNameAction = async ({
  ctx,
  lang = 'ua',
  i18n,
  fullNames = [],
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
  fullNames: string[];
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.ACCEPT_FULL_NAME', {
      lang,
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
          ...fullNames.map((name, index) => {
            return [
              {
                text: name,
                callback_data: JSON.stringify({
                  type: TelegramActionsEnums.CHOOSE_FULL_NAME,
                  value: index,
                }),
              },
            ];
          }),
        ],
      },
    },
  );
};
