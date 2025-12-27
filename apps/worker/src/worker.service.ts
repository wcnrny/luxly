/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { QUEUE_NAME, ProcessFilePayload } from '@luxly/types';
import { Job } from 'bullmq';
import { Inject, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { GetObjectCommand, S3_CLIENT_TOKEN, S3Client } from '@luxly/storage';

// For file r/w
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { Readable } from 'stream';

import { Prisma, ProcessingStatus } from '@luxly/prisma';
import { ProcessorFactory } from './core/factories/processor.factory';

import { TiptapTransformer } from '@hocuspocus/transformer';
import * as Y from 'yjs';
import StarterKit from '@tiptap/starter-kit';

@Processor(QUEUE_NAME)
export class WorkerService extends WorkerHost {
  private readonly logger = new Logger(WorkerService.name);
  private readonly BATCH_SIZE = 50;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly processorFactory: ProcessorFactory,
    @Inject(S3_CLIENT_TOKEN) private readonly s3ClientService: S3Client,
  ) {
    super();
  }
  async process(job: Job<ProcessFilePayload, any, string>): Promise<any> {
    const { documentId, fileKey, mimeType } = job.data;
    const localPath = join(tmpdir(), fileKey);

    const fullTextParagraphs: string[] = [];
    try {
      this.logger.log(`Job started: [${job.id}]: ${mimeType}`);

      await this.updateStatus(documentId, 'PROCESSING');

      // Downloading file into /tmp
      await this.downloadFile(fileKey, localPath);

      // Getting which processor we need by filtering mime types.
      // Check the factory and the function for more details.
      const processor = this.processorFactory.getProcessor(mimeType);

      // Stream Processing Pipeline
      const chunkGenerator = processor.process(localPath);
      let batchBuffer: Prisma.DocumentChunkCreateManyInput[] = [];

      // Reading and flushing chunks
      for await (const chunk of chunkGenerator) {
        batchBuffer.push({
          documentId,
          content: chunk.content,
          pageNumber: chunk.metadata.pageNumber ?? null,
          startTime: chunk.metadata.startTime ?? null,
          endTime: chunk.metadata.endTime ?? null,
        });

        if (chunk.content) {
          fullTextParagraphs.push(chunk.content);
        }

        if (batchBuffer.length >= this.BATCH_SIZE) {
          await this.flushBatch(batchBuffer);
          batchBuffer = [];
        }
      }
      if (batchBuffer.length > 0) {
        await this.flushBatch(batchBuffer);
      }

      if (fullTextParagraphs.length > 0) {
        await this.createAndSaveDocumentState(documentId, fullTextParagraphs);
      }
      await this.updateStatus(documentId, 'COMPLETED');
      this.logger.log(`Job Completed! [${job.id}]`);
    } catch (err) {
      this.logger.error(err);
      await this.updateStatus(documentId, 'FAILED', err.message);
      throw err;
    } finally {
      await this.safeDelete(localPath);
    }

    return {};
  }

  private async createAndSaveDocumentState(
    documentId: string,
    paragraphs: string[],
  ) {
    this.logger.log(`Generating Tiptap State for document: ${documentId}`);

    const tiptapJson = {
      type: 'doc',
      content: paragraphs.map((text) => ({
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: text,
          },
        ],
      })),
    };
    const ydoc = TiptapTransformer.toYdoc(tiptapJson, 'default', [
      StarterKit as any,
    ]);

    const update = Y.encodeStateAsUpdate(ydoc);
    const buffer = Buffer.from(update);

    await this.prismaService.documentState.upsert({
      where: { documentId },
      create: {
        documentId,
        data: buffer,
      },
      update: {
        data: buffer,
      },
    });

    this.logger.log(
      `DocumentState saved successfully! Size: ${buffer.length} bytes`,
    );
  }

  private async downloadFile(key: string, outputPath: string) {
    const command = new GetObjectCommand({
      Bucket: 'luxly-bucket',
      Key: key,
    });
    const res = await this.s3ClientService.send(command);
    const stream = res.Body as Readable;
    await writeFile(outputPath, stream);
  }

  private async flushBatch(data: Prisma.DocumentChunkCreateManyInput[]) {
    if (data.length === 0) return;
    await this.prismaService.documentChunk.createMany({ data });
  }

  private async safeDelete(path: string) {
    try {
      await unlink(path);
    } catch {
      this.logger.debug('FILE_NOT_FOUND_PASS');
    }
  }

  private async updateStatus(
    id: string,
    status: ProcessingStatus,
    error?: string,
  ) {
    await this.prismaService.document.update({
      where: { id },
      data: { status, errorMessage: error || null },
    });
  }
}
