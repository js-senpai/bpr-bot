import * as LocalSession from 'telegraf-session-local';
export const telegramSessionMiddleware = new LocalSession({
  database: 'telegram-session.storage.json',
  storage: LocalSession.storageFileAsync,
}).middleware();
