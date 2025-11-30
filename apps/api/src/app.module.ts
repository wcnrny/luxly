import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bullmq';

import { StorageModule } from '@luxly/storage';
import { appConfigSchema } from '@luxly/config';

import { z } from 'zod';
import { AppConfigService } from './common/app-config.service';

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
    UploadModule,
    PrismaModule,
    StorageModule,
    AuthModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('VALKEY_HOST'),
          port: configService.get<number>('VALKEY_PORT'),
        },
      }),
    }),
  ],
  controllers: [],
  providers: [AppConfigService, ConfigService],
  exports: [AppConfigService],
})
export class AppModule {}
