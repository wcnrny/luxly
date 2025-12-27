import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bullmq';

import { StorageModule } from '@luxly/storage';
import { appConfigSchema } from '@luxly/config';

import { z } from 'zod';
import { AppConfigService } from './common/app-config.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { WorkspacesModule } from './workspaces/workspaces.module';

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
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      // TODO: Implement Redis/Valkey store here.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useFactory: (configService: ConfigService) => ({
        isGlobal: true,
        ttl: 5 * 60 * 1000,
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host:
            configService.get<string>('NODE_ENV') === 'production'
              ? configService.get<string>('INTERNAL_VALKEY_HOST')
              : configService.get<string>('VALKEY_HOST'),
          port: configService.get<number>('VALKEY_PORT'),
        },
      }),
    }),
    JwtModule.register({ global: true }),
    PrismaModule,
    StorageModule,
    AuthModule,
    UsersModule,
    WorkspacesModule,
  ],
  controllers: [],
  providers: [AppConfigService, ConfigService],
  exports: [AppConfigService],
})
export class AppModule {}
