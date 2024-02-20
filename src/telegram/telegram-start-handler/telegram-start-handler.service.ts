import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../common/contexts/telegram.context';
import { GetPhoneAction } from '../../common/components/telegram/actions/user/registration/get-phone.action';
import { GetFullNameAction } from '../../common/components/telegram/actions/user/registration/get-fullname.action';
import { WelcomeAction } from '../../common/components/telegram/actions/start/welcome.action';
import { ChooseYearAction } from '../../common/components/telegram/actions/user/registration/choose-year.action';

@Injectable()
export class TelegramStartHandlerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async start(ctx: TelegramContext) {
    const {
      session,
      update: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        message: {
          from: { id, is_bot = false },
        },
      },
      startPayload,
    } = ctx;
    if (is_bot) {
      throw new Error('You are the bot! 🤖');
    }
    if (session?.searching) {
      return;
    }
    const getUser = await this.prismaService.user.findUnique({
      where: {
        telegramId: id,
      },
      select: {
        id: true,
        isAdmin: true,
      },
    });
    session.searching = false;
    if (!session?.steps) {
      session.steps = {
        passedPhoneRegistration: false,
        passedFullNameRegistration: false,
        passedYearRegistration: false,
        enableFullNameWrite: false,
        enableYearWrite: false,
      };
    }
    if (!session.userInfo) {
      session.userInfo = {
        invitatorId: '',
        choosenYear: 0,
        phoneNumber: '',
        choosenFullName: '',
      };
    }
    if (startPayload) {
      const checkInvitation = await this.prismaService.user.findUnique({
        where: {
          telegramId: startPayload,
        },
        select: {
          id: true,
        },
      });
      if (checkInvitation) {
        session.userInfo.invitatorId = checkInvitation.id;
      }
    }
    if (!getUser) {
      if (!session.steps.passedPhoneRegistration) {
        return await GetPhoneAction({
          ctx,
          i18n: this.i18n,
        });
      }
      if (!session.steps.passedYearRegistration) {
        await ChooseYearAction({
          ctx,
          i18n: this.i18n,
        });
        session.steps.enableYearWrite = true;
        return;
      }
      if (!session.steps.passedFullNameRegistration) {
        await GetFullNameAction({
          ctx,
          i18n: this.i18n,
        });
        session.steps.enableFullNameWrite = true;
        return;
      }
    } else {
      return await WelcomeAction({
        isAdmin: getUser.isAdmin,
        i18n: this.i18n,
        ctx,
        fullName: session.userInfo.choosenFullName,
      });
    }
  }
}
