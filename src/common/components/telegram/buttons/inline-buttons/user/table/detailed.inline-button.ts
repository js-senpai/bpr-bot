import { I18nService } from 'nestjs-i18n';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { TelegramActionsEnums } from '../../../../../../enums/telegram-actions.enums';

export const DetailedInlineButton = async ({
  lang = 'ua',
  i18n,
  nameIndex,
}: {
  lang?: string;
  i18n: I18nService;
  nameIndex: string;
}): Promise<InlineKeyboardButton[]> => [
  {
    text: await i18n.translate('telegram.BUTTONS.INLINE_BUTTONS.DETAILED', {
      lang,
    }),
    callback_data: JSON.stringify({
      type: TelegramActionsEnums.DETAILED,
      value: nameIndex,
    }),
  },
];
