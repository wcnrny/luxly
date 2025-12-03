import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfigSchema } from '@luxly/config';
import { z } from 'zod';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from '@luxly/storage';
import { WorkerService } from './worker.service';
import { ProcessorFactory } from './core/factories/processor.factory';
import { PdfProcessor } from './processors/pdf/pdf.processor';
import { MediaProcessor } from './processors/media/media.processor';
import { DocxProcessor } from './processors/document/docx.processor';
import { PrismaService } from './prisma/prisma.service';
import { QUEUE_NAME } from '@luxly/types';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const parsed = appConfigSchema.safeParse(config);
        if (!parsed.success) {
          console.error(
            'Geçersiz environment değişkenleri:',
            z.treeifyError(parsed.error),
          );
          throw new Error('Config validasyonu başarısız.');
        }
        return parsed.data;
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          connection: {
            host: configService.getOrThrow<string>('VALKEY_HOST'),
            port: configService.getOrThrow<number>('VALKEY_PORT'),
          },
        };
      },
    }),
    PrismaModule,
    StorageModule,
    BullModule.registerQueue({ name: QUEUE_NAME }),
  ],
  controllers: [],
  providers: [
    WorkerService,
    ProcessorFactory,
    PdfProcessor,
    MediaProcessor,
    DocxProcessor,
    PrismaService,
  ],
})
export class AppModule {}
