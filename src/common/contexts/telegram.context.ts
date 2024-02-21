import { Scenes } from 'telegraf';
import { SceneSession, SceneSessionData } from 'telegraf/typings/scenes';
import { Context } from 'telegraf/typings/context';
import { Update } from 'telegraf/typings/core/types/typegram';
export interface TelegramContext extends Scenes.SceneContext, Context {
  session: SceneSession<SceneSessionData> & {
    searching: boolean;
    availableNames?: { fullName: string; scores: string }[];
    enableMailing?: boolean;
    enableWritingMail?: boolean;
    enableTableUploading?: boolean;
    selectedTableYear?: number;
    steps: {
      passedPhoneRegistration: boolean;
      passedYearRegistration: boolean;
      passedFullNameRegistration: boolean;
      enableFullNameWrite: boolean;
      enableYearWrite: boolean;
    };
    userInfo: {
      phoneNumber: string;
      selectedFullName: string;
      invitatorId?: string;
      selectedYear: number;
    };
  };
  update: Update;
  startPayload?: any;
}
