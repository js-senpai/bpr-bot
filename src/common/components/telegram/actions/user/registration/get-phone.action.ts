import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../../contexts/telegram.context';
import { GetPhoneKeyboardButton } from '../../../buttons/keyboard-buttons/user/registration/get-phone.keyboard-button';

export const GetPhoneAction = async ({
  ctx,
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.AGREEMENT', {
      lang,
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          await GetPhoneKeyboardButton({
            i18n,
          }),
        ],
      },
    },
  );
};
