import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/configs/winston.config';
import { PrismaService } from './common/services/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as process from 'process';
async function bootstrap() {
  console.log(process.env.DATABASE_URL);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useLogger(WinstonModule.createLogger(winstonConfig));
  // Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(4000);
}
bootstrap();
