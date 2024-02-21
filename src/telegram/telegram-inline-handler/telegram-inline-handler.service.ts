import { Injectable } from '@nestjs/common';
import { TelegramRegistrationActionService } from '../telegram-registration-action/telegram-registration-action.service';
import { TelegramContext } from '../../common/contexts/telegram.context';
import { TelegramActionsEnums } from '../../common/enums/telegram-actions.enums';
import { TelegramUploadTableActionService } from '../telegram-upload-table-action/telegram-upload-table-action.service';

@Injectable()
export class TelegramInlineHandlerService {
  constructor(
    private readonly telegramRegistrationAction: TelegramRegistrationActionService,
    private readonly telegramUploadTableAction: TelegramUploadTableActionService,
  ) {}

  async actionHandler(ctx: TelegramContext): Promise<void> {
    const {
      session,
      update: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        callback_query: { data },
      },
    } = ctx;
    if (session?.searching) {
      return;
    }
    const { type = 'notSet', value } = JSON.parse(data);
    if (type === TelegramActionsEnums.CHOOSE_FULL_NAME) {
      return await this.telegramRegistrationAction.acceptFullName({
        ctx,
        nameIndex: value,
      });
    }
    if (type === TelegramActionsEnums.CHOOSE_TABLE_YEAR) {
      return await this.telegramUploadTableAction.chooseYear({
        ctx,
        year: +value,
      });
    }
  }
}
