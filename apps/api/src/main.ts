import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { AppConfigService } from './common/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: true, credentials: true },
  });
  const configService = app.get(AppConfigService);

  app.use(cookieParser());
  const port = configService.getOrThrow<number>('API_PORT');
  await app.listen(port);
}
void bootstrap();
