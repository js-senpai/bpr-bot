import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { TelegramUploadTableActionService } from '../telegram-upload-table-action/telegram-upload-table-action.service';
import { ITelegramBodyWithMessage } from '../../common/interfaces/telegram.interface';
import { TelegramUploadTableInfoActionService } from '../telegram-upload-table-info-action/telegram-upload-table-info-action.service';

@Injectable()
export class TelegramDocumentHandlerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly telegramUploadTableAction: TelegramUploadTableActionService,
    private readonly telegramUploadTableInfoAction: TelegramUploadTableInfoActionService,
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
      if (session.enableTableInfoUploading) {
        return await this.telegramUploadTableInfoAction.upload(ctx);
      }
    }
  }
}
