import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/configs/winston.config';
import { PrismaService } from './common/services/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new I18nValidationPipe());

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );
  app.useLogger(WinstonModule.createLogger(winstonConfig));
  // Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(4000);
}
bootstrap();
