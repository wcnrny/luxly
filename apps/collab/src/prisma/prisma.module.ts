import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [PrismaService, ConfigService],
  imports: [ConfigModule],
})
export class PrismaModule {}
