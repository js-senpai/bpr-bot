import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { I18nService } from 'nestjs-i18n';
import { ITelegramBodyWithMessage } from '../../common/interfaces/telegram.interface';
import { SuccessfullyMailingAction } from '../../common/components/telegram/actions/admin/mailing/successfully-mailing.action';
import { delay } from '../../common/utils/common.utils';

@Injectable()
export class TelegramMailingActionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async sendMessages({ message, ctx }: ITelegramBodyWithMessage) {
    const {
      session,
      update: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        message: {
          from: { id },
        },
      },
    } = ctx;
    const getAdmin = await this.prismaService.user.findUnique({
      where: {
        telegramId: id,
        isAdmin: true,
      },
    });
    if (!getAdmin) {
      return;
    }
    const getUsers = await this.prismaService.user.findMany({
      where: {
        isAdmin: false,
      },
      select: {
        telegramId: true,
      },
    });
    session.enableWritingMail = false;
    for (const { telegramId } of getUsers) {
      await delay(1000);
      await ctx.sendMessage(message, {
        parse_mode: 'HTML',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        chat_id: telegramId,
      });
    }
    return await SuccessfullyMailingAction({
      ctx,
      i18n: this.i18n,
    });
  }
}
