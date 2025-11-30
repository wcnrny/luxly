import { PutObjectCommand, S3_CLIENT_TOKEN, S3Client } from '@luxly/storage';
import { InjectQueue } from '@nestjs/bullmq';
import {
  Injectable,
  BadRequestException,
  Inject,
  Logger,
} from '@nestjs/common';
import { Queue } from 'bullmq';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';

import { QUEUE_NAME } from '@luxly/types';

function isMulterFile(file: unknown): file is Express.Multer.File {
  return !!file && typeof file === 'object' && 'originalname' in file;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(S3_CLIENT_TOKEN) private readonly s3Client: S3Client,
    @InjectQueue('processing-queue') private readonly queueService: Queue,
  ) {}

  async uploadFile(file: Express.Multer.File, userId: string) {
    if (!isMulterFile(file)) {
      throw new BadRequestException('Invalid file upload payload');
    }
    const fileKey = `${randomUUID()}-${file.originalname}`;

    const output_minio = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'luxly-bucket',
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    const output_prisma = await this.prismaService.document.create({
      data: {
        title: file.originalname,
        s3key: fileKey,
        mimeType: file.mimetype,
        size: file.size,
        user: { connect: { id: userId } },
      },
    });
    const output_job = await this.addQueue(
      output_prisma.id,
      fileKey,
      file.mimetype,
    );
    this.logger.log({
      id: output_prisma.id,
      jobId: output_job.id,
      s3Id: output_minio.$metadata.cfId,
    });
  }

  async addQueue(docId: string, fileKey: string, mimeType: string) {
    const job = await this.queueService.add(
      QUEUE_NAME,
      { docId, fileKey, mimeType },
      { attempts: 3, backoff: 5000, priority: 1, removeOnComplete: true },
    );
    return job;
  }
}
