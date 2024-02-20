import { Scenes } from 'telegraf';
import { SceneSession, SceneSessionData } from 'telegraf/typings/scenes';
import { Context } from 'telegraf/typings/context';
import { Update } from 'telegraf/typings/core/types/typegram';
export interface TelegramContext extends Scenes.SceneContext, Context {
  session: SceneSession<SceneSessionData> & {
    searching: boolean;
    availableNames?: { name: string; scores: string }[];
    enableMailing?: boolean;
    steps: {
      passedPhoneRegistration: boolean;
      passedYearRegistration: boolean;
      passedFullNameRegistration: boolean;
      enableFullNameWrite: boolean;
      enableYearWrite: boolean;
    };
    userInfo: {
      phoneNumber: string;
      choosenFullName: string;
      invitatorId?: string;
      choosenYear: number;
    };
  };
  update: Update;
  startPayload?: any;
}
