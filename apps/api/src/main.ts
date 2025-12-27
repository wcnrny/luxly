import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { AppConfigService } from './common/app-config.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        'https://luxly.local',
        'https://app.luxly.local',
        'http://localhost:3000',
      ],
      credentials: true,
    },
  });
  const configService = app.get(AppConfigService);

  app.use(cookieParser());
  const port = configService.getOrThrow<number>('API_PORT');
  await app.listen(port, '0.0.0.0').then(() => {
    new Logger().log(`Listening on port: ${port}`);
  });
}
void bootstrap();
