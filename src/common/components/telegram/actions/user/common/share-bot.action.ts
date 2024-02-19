import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../../contexts/telegram.context';
import { ShareInlineButton } from '../../../buttons/inline-buttons/user/common/share.inline-button';

export const ShareBotAction = async ({
  ctx,
  lang = 'ua',
  i18n,
  botName,
  telegramId,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
  botName: string;
  telegramId: number;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.SHARE_BOT', {
      lang,
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
          await ShareInlineButton({
            i18n,
            botName,
            telegramId,
          }),
        ],
      },
    },
  );
};
