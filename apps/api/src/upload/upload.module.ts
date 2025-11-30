import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { AppConfigService } from 'src/common/app-config.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  providers: [UploadService, PrismaService, AppConfigService, JwtService],
  controllers: [UploadController],
  imports: [
    JwtModule,
    PrismaModule,
    BullModule.registerQueue({ name: 'processing-queue' }),
  ],
})
export class UploadModule {}
