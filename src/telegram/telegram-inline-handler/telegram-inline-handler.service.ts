import { Injectable } from '@nestjs/common';
import { TelegramRegistrationActionService } from '../telegram-registration-action/telegram-registration-action.service';
import { TelegramContext } from '../../common/contexts/telegram.context';
import { TelegramActionsEnums } from '../../common/enums/telegram-actions.enums';

@Injectable()
export class TelegramInlineHandlerService {
  constructor(
    private readonly telegramRegistrationAction: TelegramRegistrationActionService,
  ) {}

  async actionHandler(ctx: TelegramContext): Promise<void> {
    const {
      update: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        callback_query: { data },
      },
    } = ctx;
    const { type = 'notSet', value } = JSON.parse(data);
    if (type === TelegramActionsEnums.CHOOSE_FULL_NAME) {
      return await this.telegramRegistrationAction.acceptFullName({
        ctx,
        fieldName: value,
      });
    }
  }
}
