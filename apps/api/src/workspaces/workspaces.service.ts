import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkspaceRole } from '@luxly/prisma';
import { PutObjectCommand, S3_CLIENT_TOKEN, S3Client } from '@luxly/storage';
import { randomUUID } from 'crypto';
import { Queue } from 'bullmq';
import { JobName, ProcessFilePayload, QUEUE_NAME } from '@luxly/types';
import { InjectQueue } from '@nestjs/bullmq';

function isMulterFile(file: unknown): file is Express.Multer.File {
  return !!file && typeof file === 'object' && 'originalname' in file;
}

@Injectable()
export class WorkspacesService {
  private readonly logger = new Logger(WorkspacesService.name);
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(S3_CLIENT_TOKEN) private readonly s3Client: S3Client,
    @InjectQueue(QUEUE_NAME) private readonly queueService: Queue,
  ) {}
  async create(userId: string, name: string) {
    return await this.prismaService.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({ data: { name } });
      await tx.workspaceMember.create({
        data: { workspaceId: workspace.id, userId, role: WorkspaceRole.OWNER },
      });
    });
  }

  async findAllMyWorkspaces(userId: string) {
    return await this.prismaService.workspace.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        _count: {
          select: { members: true, documents: true },
        },
      },
    });
  }

  async findOne(workspaceId: string) {
    return await this.prismaService.workspace.findFirstOrThrow({
      where: { id: workspaceId },
      select: {
        _count: {
          select: { members: true, documents: true },
        },
      },
    });
  }

  async uploadFile(
    workspaceId: string,
    file: Express.Multer.File,
    userId: string,
  ) {
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
        ContentEncoding: 'utf-16',
      }),
    );
    const output_prisma = await this.prismaService.document.create({
      data: {
        title: file.originalname,
        s3key: fileKey,
        mimeType: file.mimetype,
        size: file.size,
        user: { connect: { id: userId } },
        workspace: { connect: { id: workspaceId } },
      },
    });
    const output_job = await this.addQueue(
      output_prisma.id,
      fileKey,
      file.mimetype,
      userId,
    );
    this.logger.log({
      id: output_prisma.id,
      jobId: output_job.id,
      s3Id: output_minio.$metadata.cfId,
    });
  }
  async addQueue(
    docId: string,
    fileKey: string,
    mimeType: string,
    userId: string,
  ) {
    const job = await this.queueService.add(
      JobName.PROCESS_FILE,
      { documentId: docId, fileKey, mimeType, userId } as ProcessFilePayload,
      { attempts: 3, backoff: 5000, priority: 1, removeOnComplete: true },
    );
    return job;
  }
}
