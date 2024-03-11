import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../../contexts/telegram.context';
import { GetTotalUsersKeyboardButton } from '../../../buttons/keyboard-buttons/admin/statistic/get-total-users.keyboard-button';
import { SendMailsKeyboardButton } from '../../../buttons/keyboard-buttons/admin/mailing/send-mails.keyboard-button';
import { UploadTableInfoKeyboardButton } from '../../../buttons/keyboard-buttons/admin/table-info/upload-table-info.keyboard-action';
import { UploadTableKeyboardButton } from '../../../buttons/keyboard-buttons/admin/table/upload-table.keyboard-button';

export const SuccessfullyMailingAction = async ({
  ctx,
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.SENT_MAIL_SUCCESSFULLY', {
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
