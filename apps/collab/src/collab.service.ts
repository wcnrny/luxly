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
      address: '0.0.0.0',
      extensions: [
        new Database({
          fetch: async ({ documentName }) => {
            this.logger.debug(`Fetching document: ${documentName}`);
            try {
              const state = await this.prismaService.documentState.findUnique({
                where: { documentId: documentName },
              });

              if (state) {
                this.logger.debug(
                  `Document found, loading ${state.data.length} bytes.`,
                );
                return state.data;
              }

              this.logger.debug(`Document not found, creating empty.`);
              return null;
            } catch (error) {
              this.logger.error(
                `Error fetching document ${documentName}:`,
                error,
              );
              throw error;
            }
          },
          store: async ({ documentName, state }) => {
            this.logger.debug(
              `Storing document: ${documentName} (${state.length} bytes)`,
            );
            try {
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
            } catch (error) {
              this.logger.error(
                `Error storing document ${documentName}:`,
                error,
              );
            }
          },
        }),
      ],
      onConnect: async (data) => {
        this.logger.log(`This user is connected to: ${data.documentName}`);
      },
      onDisconnect: async (data) => {
        this.logger.log(`Client disconnected from: ${data.documentName}`);
      },
      onLoadDocument: async (data) => {
        const getContext = await this.prismaService.documentState.findUnique({
          where: { documentId: data.documentName },
          select: {
            data: true,
            updatedAt: true,
          },
        });
        if (!getContext || !getContext.data) return null;
        return getContext.data;
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
