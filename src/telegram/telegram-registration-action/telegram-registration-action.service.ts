import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

import { TelegramContext } from '../../common/contexts/telegram.context';
import { I18nService } from 'nestjs-i18n';
import { ITelegramBodyWithMessage } from '../../common/interfaces/telegram.interface';
import { validateNameSurname } from '../../common/utils/common.utils';
import { ErrorFullNameAction } from '../../common/components/telegram/actions/errors/error-full-name.action';
import { ChooseYearAction } from '../../common/components/telegram/actions/user/registration/choose-year.action';
import { PuppeteerService } from '../../common/services/puppeteer.service';
import { SearchingAction } from '../../common/components/telegram/actions/common/searching.action';
import { ConfigService } from '@nestjs/config';
import { NotFoundUserAction } from '../../common/components/telegram/actions/errors/not-found-user.action';
import { ChooseFullNameAction } from '../../common/components/telegram/actions/user/registration/choose-full-name.action';
import { AVAILABLE_YEARS } from '../../common/constants/common.constants';
import { ErrorYearAction } from '../../common/components/telegram/actions/errors/error-year.action';
import { GetFullNameAction } from '../../common/components/telegram/actions/user/registration/get-fullname.action';
import { NotFoundResultsAction } from '../../common/components/telegram/actions/errors/not-found-results.action';
import { GetScoreResultAction } from '../../common/components/telegram/actions/user/scores/get-score-result.action';
import { ShareBotAction } from '../../common/components/telegram/actions/user/common/share-bot.action';

@Injectable()
export class TelegramRegistrationActionService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
    private readonly puppeteerService: PuppeteerService,
  ) {}

  async setContact(ctx: TelegramContext) {
    // Get user info
    const {
      session,
      update: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        message: {
          contact: { phone_number },
        },
      },
    } = ctx;
    session.userInfo.phoneNumber = phone_number;
    session.steps.passedPhoneRegistration = true;
    session.steps.enableYearWrite = true;
    return await ChooseYearAction({
      ctx,
      i18n: this.i18n,
    });
  }

  async setYear({ message, ctx }: ITelegramBodyWithMessage) {
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
    session.steps.enableYearWrite = false;
    if (!AVAILABLE_YEARS.includes(+message)) {
      await ErrorYearAction({
        ctx,
        i18n: this.i18n,
      });
      session.steps.enableYearWrite = true;
      return;
    }
    session.steps.passedYearRegistration = true;
    session.userInfo.selectedYear = +message;
    await GetFullNameAction({
      ctx,
      i18n: this.i18n,
    });
    session.steps.enableFullNameWrite = true;
    return;
  }

  async setFullName({ message, ctx }: ITelegramBodyWithMessage) {
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
    if (!validateNameSurname(message)) {
      await ErrorFullNameAction({
        ctx,
        i18n: this.i18n,
      });
      session.steps.enableFullNameWrite = true;
      return;
    }
    session.searching = true;
    session.steps.enableFullNameWrite = false;
    await SearchingAction({
      ctx,
      i18n: this.i18n,
    });
    let getFullNames = [];
    const [lastName, firstName] = message.split(' ');
    if (+session?.userInfo?.selectedYear === 2024) {
      getFullNames =
        await this.prismaService.statistic_twenty_thousand_and_twenty_four.findMany(
          {
            where: {
              OR: [
                {
                  fullName: {
                    startsWith: message.toLowerCase(),
                  },
                },
                {
                  fullName: {
                    startsWith: `${lastName} ${firstName[0]}.`.toLowerCase(),
                  },
                },
              ],
            },
            distinct: ['fullName'],
            select: {
              scores: true,
              fullName: true,
            },
          },
        );
    } else if (+session?.userInfo?.selectedYear === 2023) {
      getFullNames =
        await this.prismaService.statistic_twenty_thousand_and_twenty_three.findMany(
          {
            where: {
              OR: [
                {
                  fullName: {
                    startsWith: message.toLowerCase(),
                  },
                },
                {
                  fullName: {
                    startsWith: `${lastName} ${firstName[0]}.`.toLowerCase(),
                  },
                },
              ],
            },
            distinct: ['fullName'],
            select: {
              scores: true,
              fullName: true,
            },
          },
        );
    } else if (+session?.userInfo?.selectedYear === 2022) {
      getFullNames =
        await this.prismaService.statistic_twenty_thousand_and_twenty_two.findMany(
          {
            where: {
              OR: [
                {
                  fullName: {
                    startsWith: message.toLowerCase(),
                  },
                },
                {
                  fullName: {
                    startsWith: `${lastName} ${firstName[0]}.`.toLowerCase(),
                  },
                },
              ],
            },
            distinct: ['fullName'],
            select: {
              scores: true,
              fullName: true,
            },
          },
        );
    }
    // await SearchingFinishedAction({
    //   ctx,
    //   i18n: this.i18n,
    // });
    session.searching = false;
    if (!getFullNames.length) {
      return await NotFoundUserAction({
        ctx,
        i18n: this.i18n,
      });
    }
    session.availableNames = getFullNames;
    return await ChooseFullNameAction({
      ctx,
      i18n: this.i18n,
      fullNames: getFullNames.map(({ fullName }) =>
        fullName.replaceAll(/(^|\s)\S/g, (char) => char.toUpperCase()),
      ),
    });
  }

  async acceptFullName({
    ctx,
    nameIndex,
  }: {
    ctx: TelegramContext;
    nameIndex: string;
  }) {
    const {
      session,
      update: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        callback_query: {
          from: { id },
        },
      },
    } = ctx;
    const getUser = await this.prismaService.user.findFirst({
      where: {
        telegramId: id,
        isAdmin: false,
      },
      select: {
        id: true,
      },
    });
    if (!getUser) {
      const newUser = await this.prismaService.user.create({
        data: {
          telegramId: id,
          phone: session.userInfo.phoneNumber,
        },
      });
      if (session.userInfo.invitatorId) {
        const getInvitator = await this.prismaService.user.findUnique({
          where: {
            telegramId: id,
          },
          select: {
            id: true,
          },
        });
        if (getInvitator) {
          session.userInfo.invitatorId = '';
          await this.prismaService.invitations.create({
            data: {
              invitatorId: getInvitator.id,
              userId: newUser.id,
            },
          });
        }
      }
    }

    if (!session?.availableNames[nameIndex]) {
      return await NotFoundResultsAction({
        ctx,
        i18n: this.i18n,
      });
    }
    const getScores = session.availableNames[nameIndex];
    session.userInfo.selectedFullName = getScores.fullName;
    return await GetScoreResultAction({
      ctx,
      i18n: this.i18n,
      scores: getScores.scores,
    });
  }

  async shareBot(ctx: TelegramContext) {
    const {
      update: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        message: {
          from: { id },
        },
      },
    } = ctx;
    const getUser = await this.prismaService.user.findFirst({
      where: {
        telegramId: id,
        isAdmin: false,
      },
      select: {
        id: true,
      },
    });
    if (getUser) {
      return await ShareBotAction({
        ctx,
        i18n: this.i18n,
        botName: this.configService.get('TELEGRAM_BOT_NAME'),
        telegramId: id,
      });
    }
  }
}
