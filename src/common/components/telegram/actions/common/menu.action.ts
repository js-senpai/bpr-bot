import { TelegramContext } from '../../../../contexts/telegram.context';
import { I18nService } from 'nestjs-i18n';
import { AnotherRequestKeyboardButton } from '../../buttons/keyboard-buttons/user/registration/another-request.keyboard-button';
import { SendMailsKeyboardButton } from '../../buttons/keyboard-buttons/admin/mailing/send-mails.keyboard-button';
import { GetTotalUsersKeyboardButton } from '../../buttons/keyboard-buttons/admin/statistic/get-total-users.keyboard-button';
import { ShareBotKeyboardButton } from '../../buttons/keyboard-buttons/user/common/share-bot.keyboard-button';
import { CancelKeyboardButton } from '../../buttons/keyboard-buttons/admin/common/cancel.keyboard-button';
import { UploadTableKeyboardButton } from '../../buttons/keyboard-buttons/admin/table/upload-table.keyboard-button';
import { UploadTableInfoKeyboardButton } from '../../buttons/keyboard-buttons/admin/table-info/upload-table-info.keyboard-action';

export const MenuAction = async ({
  ctx,
  lang = 'ua',
  i18n,
  isAdmin = false,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
  isAdmin: boolean;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.MENU', {
      lang,
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        resize_keyboard: true,
        keyboard: !isAdmin
          ? [
              await AnotherRequestKeyboardButton({
                i18n,
                lang,
              }),
              await ShareBotKeyboardButton({
                i18n,
                lang,
              }),
            ]
          : [
              [
                ...(await GetTotalUsersKeyboardButton({
                  i18n,
                  lang,
                })),
                ...(await UploadTableInfoKeyboardButton({
                  i18n,
                  lang,
                })),
              ],
              [
                ...(await UploadTableKeyboardButton({
                  i18n,
                  lang,
                })),
                ...(await SendMailsKeyboardButton({
                  lang,
                  i18n,
                })),
              ],
            ],
      },
    },
  );
};
