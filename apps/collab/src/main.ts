import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Random port value because we will listen Hocuspocus server at port 8081
  await app.listen(3333);
}
void bootstrap();
