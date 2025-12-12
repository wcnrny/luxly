import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CollabService } from './collab.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [],
  providers: [CollabService, PrismaService],
})
export class AppModule {}
