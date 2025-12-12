import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@luxly/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    const connectionString = `${configService.getOrThrow<string>('DATABASE_URL')}`;
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }
}
