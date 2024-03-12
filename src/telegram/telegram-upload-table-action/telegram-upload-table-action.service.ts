import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { TelegramFileService } from '../../common/services/telegram-file.service';
import { TelegramContext } from '../../common/contexts/telegram.context';
import { ErrorCsvUploadAction } from '../../common/components/telegram/actions/errors/error-csv-upload.action';
import { I18nService } from 'nestjs-i18n';
import * as csv from 'csvtojson';
import { EnableUploadingTableAction } from '../../common/components/telegram/actions/admin/table/enable-uploading-table.action';
import { SelectYearTableAction } from '../../common/components/telegram/actions/admin/table/select-year-table.action';
import { UploadingAction } from '../../common/components/telegram/actions/common/uploading.action';
import { UploadedAction } from '../../common/components/telegram/actions/common/uploading-finished.action';
import { ErrorFileSizeAction } from '../../common/components/telegram/actions/errors/error-file-size.action';
@Injectable()
export class TelegramUploadTableActionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly telegramFileService: TelegramFileService,
    private readonly i18n: I18nService,
  ) {}

  async enableUploadingTable(ctx) {
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
    return await SelectYearTableAction({
      ctx,
      i18n: this.i18n,
    });
  }

  async chooseYear({
    ctx,
    year = 2024,
  }: {
    ctx: TelegramContext;
    year: number;
  }) {
    const {
      session,
      update: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        callback_query: {
          from: { id },
          message: { message_id, chat },
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
    session.selectedTableYear = year;
    await EnableUploadingTableAction({
      ctx,
      i18n: this.i18n,
      chatId: chat.id,
      messageId: message_id,
    });
    session.enableTableUploading = true;
    return;
  }

  async upload(ctx: TelegramContext) {
    const {
      session,
      update: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        message: {
          from: { id },
          document: { mime_type, file_id, file_size },
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
    if (mime_type !== 'text/csv') {
      session.enableTableUploading = false;
      return await ErrorCsvUploadAction({
        ctx,
        i18n: this.i18n,
      });
    }
    if (file_size > 20 * 1024 * 1024) {
      session.enableTableUploading = false;
      return await ErrorFileSizeAction({
        ctx,
        i18n: this.i18n,
      });
    }
    session.searching = true;
    await UploadingAction({
      ctx,
      i18n: this.i18n,
    });
    const { file } = await this.telegramFileService.get({
      mimeType: mime_type,
      fileId: file_id,
      ctx,
    });
    const getJson = await csv().fromStream(file);
    for (const item of getJson) {
      const getValues = Object.values(item);
      if (ctx.session.selectedTableYear === 2024) {
        if (getValues[2] && +getValues[0] && +getValues[1] && getValues[3]) {
          await this.prismaService.statistic_twenty_thousand_and_twenty_four.upsert(
            {
              where: {
                cert_number: getValues[2] as string,
              },
              update: {
                scores: +getValues[4] || 0,
              },
              create: {
                provider_number: +getValues[0],
                event_number: +getValues[1],
                cert_number: getValues[2] as string,
                scores: +getValues[4] || 0,
                fullName: (getValues[3] as string).trim().toLowerCase(),
              },
            },
          );
        }
      } else if (ctx.session.selectedTableYear === 2023) {
        if (getValues[4] && +getValues[0] && +getValues[1] && getValues[5]) {
          await this.prismaService.statistic_twenty_thousand_and_twenty_three.upsert(
            {
              where: {
                cert_number: getValues[4] as string,
              },
              update: {
                scores: +getValues[6] || 0,
              },
              create: {
                provider_number: +getValues[0],
                event_number: +getValues[1],
                cert_number: getValues[4] as string,
                scores: +getValues[6] || 0,
                fullName: (getValues[5] as string).trim().toLowerCase(),
              },
            },
          );
        }
      } else if (ctx.session.selectedTableYear === 2022) {
        if (getValues[4] && +getValues[0] && +getValues[1] && getValues[5]) {
          await this.prismaService.statistic_twenty_thousand_and_twenty_two.upsert(
            {
              where: {
                cert_number: getValues[4] as string,
              },
              update: {
                scores: +getValues[6] || 0,
              },
              create: {
                provider_number: +getValues[0],
                event_number: +getValues[1],
                cert_number: getValues[4] as string,
                scores: +getValues[6] || 0,
                fullName: (getValues[5] as string).trim().toLowerCase(),
              },
            },
          );
        }
      }
    }
    await UploadedAction({
      ctx,
      i18n: this.i18n,
    });
    session.enableTableUploading = false;
    session.searching = false;
    return;
  }
}
