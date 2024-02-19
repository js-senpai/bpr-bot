import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { TelegramContext } from '../../common/contexts/telegram.context';
import { GetTotalUsersAction } from '../../common/components/telegram/actions/admin/statstic/get-total-users.action';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class TelegramStatisticActionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async getTotalUsers(ctx: TelegramContext) {
    const {
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
    const getTotalUsers = await this.prismaService.user.count();
    return await GetTotalUsersAction({
      ctx,
      i18n: this.i18n,
      total: getTotalUsers,
    });
  }
}
