import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../../contexts/telegram.context';
import { AnotherRequestKeyboardButton } from '../../../buttons/keyboard-buttons/user/registration/another-request.keyboard-button';
import { ShareBotKeyboardButton } from '../../../buttons/keyboard-buttons/user/common/share-bot.keyboard-button';
import { DetailedInlineButton } from '../../../buttons/inline-buttons/user/table/detailed.inline-button';
import { MenuAction } from '../../common/menu.action';

export const GetScoreResultAction = async ({
  ctx,
  lang = 'ua',
  i18n,
  scores,
  year = 2024,
  nameIndex,
  isAdmin = false,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
  scores: string;
  year: number;
  nameIndex: string;
  isAdmin: boolean;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.TOTAL_SCORES', {
      lang,
      args: {
        scores,
        year,
      },
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          await DetailedInlineButton({
            lang,
            i18n,
            nameIndex,
          }),
        ],
      },
    },
  );
  await MenuAction({
    ctx,
    i18n,
    lang,
    isAdmin,
  });
};
