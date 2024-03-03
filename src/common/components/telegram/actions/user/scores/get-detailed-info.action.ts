import { TelegramContext } from '../../../../../contexts/telegram.context';

export const GetDetailedInfoAction = async ({
  ctx,
  chatId,
  messageId,
  text,
}: {
  ctx: TelegramContext;
  chatId: string;
  messageId: string;
  text: string;
}): Promise<void> => {
  await ctx.editMessageText(text, {
    parse_mode: 'HTML',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    chat_id: chatId,
    message_id: messageId,
  });
};
