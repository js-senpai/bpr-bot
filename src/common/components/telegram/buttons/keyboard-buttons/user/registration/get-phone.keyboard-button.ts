import { I18nService } from 'nestjs-i18n';
import { KeyboardButton } from 'telegraf/typings/core/types/typegram';

export const GetPhoneKeyboardButton = async ({
  lang = 'ua',
  i18n,
}: {
  lang?: string;
  i18n: I18nService;
}): Promise<KeyboardButton[]> => [
  {
    text: await i18n.translate(
      'telegram.BUTTONS.KEYBOARD_BUTTONS.SHARE_PHONE',
      {
        lang,
      },
    ),
    request_contact: true,
  },
];
