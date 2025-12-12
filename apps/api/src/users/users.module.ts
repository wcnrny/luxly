import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersController } from './users.controller';
import { AppConfigService } from 'src/common/app-config.service';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, PrismaService, AppConfigService],
  controllers: [UsersController],
})
export class UsersModule {}
