import { I18nService } from 'nestjs-i18n';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

export const ShareInlineButton = async ({
  lang = 'ua',
  i18n,
  botName,
  telegramId,
}: {
  lang?: string;
  i18n: I18nService;
  botName: string;
  telegramId: number;
}): Promise<InlineKeyboardButton[]> => [
  {
    text: await i18n.translate('telegram.BUTTONS.INLINE_BUTTONS.SHARE', {
      lang,
    }),
    switch_inline_query: await i18n.translate('telegram.SHARE_BOT_TEXT', {
      lang,
      args: {
        botName,
        telegramId,
      },
    }),
  },
];
