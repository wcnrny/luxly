import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [UploadService, PrismaService],
  controllers: [UploadController],
  imports: [PrismaModule],
})
export class UploadModule {}
