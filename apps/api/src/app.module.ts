import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from '@luxly/storage';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UploadModule, PrismaModule, StorageModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
