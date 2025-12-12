import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppConfigService } from 'src/common/app-config.service';
import { WorkspaceAuthGuard } from 'src/common/guards/workspace-auth.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAME } from '@luxly/types';

@Module({
  imports: [PrismaModule, BullModule.registerQueue({ name: QUEUE_NAME })],
  controllers: [WorkspacesController],
  providers: [
    WorkspacesService,
    PrismaService,
    AppConfigService,
    WorkspaceAuthGuard,
    AuthGuard,
  ],
})
export class WorkspacesModule {}
