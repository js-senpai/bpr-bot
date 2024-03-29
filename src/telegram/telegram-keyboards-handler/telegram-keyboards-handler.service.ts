import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { TelegramRegistrationActionService } from '../telegram-registration-action/telegram-registration-action.service';
import { ITelegramBodyWithMessage } from '../../common/interfaces/telegram.interface';
import { ChooseYearAction } from '../../common/components/telegram/actions/user/registration/choose-year.action';
import { PrismaService } from '../../common/services/prisma.service';
import { TelegramStatisticActionService } from '../telegram-statistic-action/telegram-statistic-action.service';
import { TelegramMailingActionService } from '../telegram-mailing-action/telegram-mailing-action.service';
import { EnableMailingAction } from '../../common/components/telegram/actions/admin/mailing/enable-mailing.action';
import { TelegramUploadTableActionService } from '../telegram-upload-table-action/telegram-upload-table-action.service';
import { MenuAction } from '../../common/components/telegram/actions/common/menu.action';
import { TelegramUploadTableInfoActionService } from '../telegram-upload-table-info-action/telegram-upload-table-info-action.service';

@Injectable()
export class TelegramKeyboardsHandlerService {
  constructor(
    private readonly i18n: I18nService,
    private readonly telegramRegistrationAction: TelegramRegistrationActionService,
    private readonly prismaService: PrismaService,
    private readonly telegramStatisticAction: TelegramStatisticActionService,
    private readonly telegramMailingAction: TelegramMailingActionService,
    private readonly telegramUploadTableAction: TelegramUploadTableActionService,
    private readonly telegramUploadTableInfoAction: TelegramUploadTableInfoActionService,
  ) {}

  async actionHandler({ message, ctx }: ITelegramBodyWithMessage) {
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
    if (session?.searching) {
      return;
    }
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
    const getAllButtonsKeys = await this.i18n.translate(
      'telegram.BUTTONS.KEYBOARD_BUTTONS',
    );
    // Get key
    let getKey = 'not_set';
    for (const [key, value] of Object.entries(getAllButtonsKeys)) {
      if (value === message) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getKey = key;
      }
    }
    if (!checkAdmin) {
      if (session?.steps?.enableYearWrite) {
        return await this.telegramRegistrationAction.setYear({
          message,
          ctx,
        });
      }
      if (session?.steps?.enableFullNameWrite) {
        return await this.telegramRegistrationAction.setFullName({
          message,
          ctx,
        });
      }
    } else {
      if (getKey === 'CANCEL') {
        session.enableMailing = false;
        session.enableWritingMail = false;
        session.enableTableUploading = false;
        session.enableTableInfoUploading = false;
        return await MenuAction({
          ctx,
          i18n: this.i18n,
          isAdmin: !!checkAdmin,
        });
      }
      if (session?.enableWritingMail) {
        return await this.telegramMailingAction.sendMessages({
          message,
          ctx,
        });
      }
    }

    if (!checkAdmin) {
      if (getKey === 'TRY_AGAIN') {
        session.steps.passedYearRegistration = false;
        await ChooseYearAction({
          ctx,
          i18n: this.i18n,
        });
        session.steps.enableYearWrite = true;
        return;
      }
      if (getKey === 'ANOTHER_REQUEST') {
        session.steps.passedYearRegistration = false;
        session.steps.passedFullNameRegistration = false;
        await ChooseYearAction({
          ctx,
          i18n: this.i18n,
        });
        session.steps.enableYearWrite = true;
      }
      if (getKey === 'SHARE') {
        return await this.telegramRegistrationAction.shareBot(ctx);
      }
    } else {
      if (getKey === 'TOTAL_USERS') {
        return await this.telegramStatisticAction.getTotalUsers(ctx);
      }
      if (getKey === 'MAILING') {
        await EnableMailingAction({
          ctx,
          i18n: this.i18n,
        });
        session.enableMailing = true;
        session.enableWritingMail = true;
        return;
      }
      if (getKey === 'UPLOAD_TABLE') {
        return await this.telegramUploadTableAction.enableUploadingTable(ctx);
      }
      if (getKey === 'UPLOAD_INFO_TABLE') {
        return await this.telegramUploadTableInfoAction.enableUploadingTable(
          ctx,
        );
      }
    }
  }
}
