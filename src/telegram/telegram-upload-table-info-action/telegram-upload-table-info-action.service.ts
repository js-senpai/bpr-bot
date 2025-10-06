import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { TelegramFileService } from '../../common/services/telegram-file.service';
import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../common/contexts/telegram.context';
import { ErrorCsvUploadAction } from '../../common/components/telegram/actions/errors/error-csv-upload.action';
import { ErrorFileSizeAction } from '../../common/components/telegram/actions/errors/error-file-size.action';
import { UploadingAction } from '../../common/components/telegram/actions/common/uploading.action';
import * as csv from 'csvtojson';
import { SelectYearTableInfoAction } from '../../common/components/telegram/actions/admin/table-info/select-year-table-info.action';
import { EnableUploadingTableInfoAction } from '../../common/components/telegram/actions/admin/table-info/enable-uploading-table-info.action';
import { UploadedAction } from '../../common/components/telegram/actions/common/uploading-finished.action';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
@Injectable()
export class TelegramUploadTableInfoActionService {
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
    return await SelectYearTableInfoAction({
      ctx,
      i18n: this.i18n,
    });
  }

  async chooseYear({
    ctx,
    year = 2025,
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
    await EnableUploadingTableInfoAction({
      ctx,
      i18n: this.i18n,
      chatId: chat.id,
      messageId: message_id,
    });
    session.enableTableInfoUploading = true;
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
      session.enableTableInfoUploading = false;
      return await ErrorCsvUploadAction({
        ctx,
        i18n: this.i18n,
      });
    }
    if (file_size > 20 * 1024 * 1024) {
      session.enableTableInfoUploading = false;
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
    const getJson: { [key: string]: string }[] = await csv().fromStream(file);
    for (const item of getJson) {
      const getValues = Object.values(item);
      if (ctx.session.selectedTableYear === 2025) {
        if (+getValues[1] && +getValues[2]) {
          await this.prismaService.statistic_info_twenty_thousand_and_twenty_five.upsert(
            {
              where: {
                event_number: +getValues[1],
              },
              update: {
                provider_number: +getValues[2],
                formType: getValues[5],
                status: getValues[6],
                type: getValues[4],
                scores: getValues[7],
                theme: getValues[3],
                dateStart: dayjs(getValues[8], 'DD.MM.YYYY').toDate(),
                dateEnd: dayjs(getValues[9], 'DD.MM.YYYY').toDate(),
                profession: getValues[10],
                provisorProfession: getValues[11],
                juniorProfession: getValues[12],
                seniorProfession: getValues[13],
                location: getValues[15],
                regLink: getValues[16],
                providerLink: getValues[17],
                providerMaintainer: getValues[18],
                providerMaintainerPhone: getValues[19],
              },
              create: {
                provider_number: +getValues[2],
                event_number: +getValues[1],
                formType: getValues[5],
                status: getValues[6],
                type: getValues[4],
                scores: getValues[7],
                theme: getValues[3],
                dateStart: dayjs(getValues[8], 'DD.MM.YYYY').toDate(),
                dateEnd: dayjs(getValues[9], 'DD.MM.YYYY').toDate(),
                profession: getValues[10],
                provisorProfession: getValues[11],
                juniorProfession: getValues[12],
                seniorProfession: getValues[13],
                location: getValues[15],
                regLink: getValues[16],
                providerLink: getValues[17],
                providerMaintainer: getValues[18],
                providerMaintainerPhone: getValues[19],
              },
            },
          );
        }
      } else if (ctx.session.selectedTableYear === 2024) {
        if (+getValues[1] && +getValues[2]) {
          await this.prismaService.statistic_info_twenty_thousand_and_twenty_four.upsert(
            {
              where: {
                event_number: +getValues[1],
              },
              update: {
                provider_number: +getValues[2],
                formType: getValues[5],
                status: getValues[6],
                type: getValues[4],
                scores: getValues[7],
                theme: getValues[3],
                dateStart: dayjs(getValues[8], 'DD.MM.YYYY').toDate(),
                dateEnd: dayjs(getValues[9], 'DD.MM.YYYY').toDate(),
                profession: getValues[10],
                provisorProfession: getValues[11],
                juniorProfession: getValues[12],
                seniorProfession: getValues[13],
                location: getValues[15],
                regLink: getValues[16],
                providerLink: getValues[17],
                providerMaintainer: getValues[18],
                providerMaintainerPhone: getValues[19],
              },
              create: {
                provider_number: +getValues[2],
                event_number: +getValues[1],
                formType: getValues[5],
                status: getValues[6],
                type: getValues[4],
                scores: getValues[7],
                theme: getValues[3],
                dateStart: dayjs(getValues[8], 'DD.MM.YYYY').toDate(),
                dateEnd: dayjs(getValues[9], 'DD.MM.YYYY').toDate(),
                profession: getValues[10],
                provisorProfession: getValues[11],
                juniorProfession: getValues[12],
                seniorProfession: getValues[13],
                location: getValues[15],
                regLink: getValues[16],
                providerLink: getValues[17],
                providerMaintainer: getValues[18],
                providerMaintainerPhone: getValues[19],
              },
            },
          );
        }
      } else if (ctx.session.selectedTableYear === 2023) {
        if (+getValues[2] && +getValues[0]) {
          await this.prismaService.statistic_info_twenty_thousand_and_twenty_three.upsert(
            {
              where: {
                event_number: +getValues[2],
              },
              update: {
                provider_number: +getValues[0],
                formType: getValues[3],
                status: getValues[4],
                type: getValues[5],
                scores: getValues[6],
                theme: getValues[7],
                dateStart: dayjs(getValues[8], 'DD.MM.YYYY').toDate(),
                dateEnd: dayjs(getValues[9], 'DD.MM.YYYY').toDate(),
                profession: getValues[10],
                provisorProfession: getValues[11],
                juniorProfession: getValues[12],
                regLink: getValues[13],
                providerMaintainer: getValues[14],
                providerMaintainerPhone: getValues[15],
                location: getValues[16],
                providerLink: getValues[17],
              },
              create: {
                provider_number: +getValues[0],
                event_number: +getValues[2],
                formType: getValues[3],
                status: getValues[4],
                type: getValues[5],
                scores: getValues[6],
                theme: getValues[7],
                dateStart: dayjs(getValues[8], 'DD.MM.YYYY').toDate(),
                dateEnd: dayjs(getValues[9], 'DD.MM.YYYY').toDate(),
                profession: getValues[10],
                provisorProfession: getValues[11],
                juniorProfession: getValues[12],
                regLink: getValues[13],
                providerMaintainer: getValues[14],
                providerMaintainerPhone: getValues[15],
                location: getValues[16],
                providerLink: getValues[17],
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
    session.enableTableInfoUploading = false;
    session.searching = false;
    return;
  }
}
