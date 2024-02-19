import { Module } from '@nestjs/common';
import { PrismaService } from './common/services/prisma.service';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { telegramConfig } from './common/configs/telegram.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { join } from 'path';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    // Config module
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: telegramConfig,
    }),
    // i18n
    I18nModule.forRoot({
      fallbackLanguage: 'ua',
      fallbacks: {
        ua: 'ua',
      },
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    TelegramModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
