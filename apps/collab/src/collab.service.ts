/* eslint-disable @typescript-eslint/require-await */
import { Database } from '@hocuspocus/extension-database';
import { Server } from '@hocuspocus/server';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class CollabService implements OnModuleInit, OnModuleDestroy {
  private server: Server;
  private readonly logger = new Logger(CollabService.name);
  constructor(private readonly prismaService: PrismaService) {}

  onModuleInit() {
    this.server = new Server({
      port: 8081,
      name: 'luxly-collab',
      extensions: [
        new Database({
          fetch: async ({ documentName }) => {
            this.logger.debug(`${documentName} is loading.`);
            const state = await this.prismaService.documentState.findUnique({
              where: { documentId: documentName },
            });
            if (state) {
              return state.data;
            }
            return null;
          },
          store: async ({ documentName, state }) => {
            this.logger.debug(`${documentName} is being saved.`);
            const stateBuffer = Buffer.from(state);
            await this.prismaService.documentState.upsert({
              where: { documentId: documentName },
              create: {
                documentId: documentName,
                data: stateBuffer,
              },
              update: {
                data: stateBuffer,
              },
            });
          },
        }),
      ],
      onConnect: async (data) => {
        this.logger.log(`This user is connected to: ${data.documentName}`);
      },
    });
    void this.server.listen().then(() => {
      this.logger.log('Hocuspocus Collab Server is ready at 8081 port!');
    });
  }
  async onModuleDestroy() {
    await this.server.destroy();
  }
}
