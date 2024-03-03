import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../../contexts/telegram.context';
import { GetTotalUsersKeyboardButton } from '../../../buttons/keyboard-buttons/admin/statistic/get-total-users.keyboard-button';
import { CancelKeyboardButton } from '../../../buttons/keyboard-buttons/admin/common/cancel.keyboard-button';

export const EnableMailingAction = async ({
  ctx,
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.WRITE_MAIL_MESSAGE', {
      lang,
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [
            ...(await GetTotalUsersKeyboardButton({
              i18n,
              lang,
            })),
            ...(await CancelKeyboardButton({
              lang,
              i18n,
            })),
          ],
        ],
      },
    },
  );
};
