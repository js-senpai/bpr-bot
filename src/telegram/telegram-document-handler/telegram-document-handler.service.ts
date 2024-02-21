import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { TelegramUploadTableActionService } from '../telegram-upload-table-action/telegram-upload-table-action.service';
import { ITelegramBodyWithMessage } from '../../common/interfaces/telegram.interface';

@Injectable()
export class TelegramDocumentHandlerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly telegramUploadTableAction: TelegramUploadTableActionService,
  ) {}

  async actionHandler({ ctx, message }: ITelegramBodyWithMessage) {
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
    const checkAdmin = await this.prismaService.user.findFirst({
      where: {
        isAdmin: true,
        // @is-ignore
        telegramId: id,
      },
      select: {
        id: true,
      },
    });
    if (checkAdmin) {
      if (session.enableTableUploading) {
        return await this.telegramUploadTableAction.upload(ctx);
      }
    }
  }
}
