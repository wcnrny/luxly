import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, WorkspaceRole } from '@luxly/prisma';
import { PutObjectCommand, S3_CLIENT_TOKEN, S3Client } from '@luxly/storage';
import { randomUUID } from 'crypto';
import { Queue } from 'bullmq';
import { JobName, ProcessFilePayload, QUEUE_NAME } from '@luxly/types';
import { InjectQueue } from '@nestjs/bullmq';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

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
  async create(userId: string, dto: CreateWorkspaceDto) {
    return await this.prismaService.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: dto.name,
          description: dto.description,
          iconUrl: dto.iconURL,
        },
      });
      await tx.workspaceMember.create({
        data: { workspaceId: workspace.id, userId, role: WorkspaceRole.OWNER },
      });
      return { workspaceId: workspace.id };
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
        members: {
          include: {
            user: {
              select: {
                avatarUrl: true,
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!workspace) throw new NotFoundException();
    const member = workspace.members.find((m) => m.userId === userId);
    if (!member) throw new ForbiddenException();

    return {
      ...workspace,
      currentUserRole: member.role,
    };
  }

  async findMembers(id: string, userId: string) {
    const members = await this.prismaService.workspaceMember.findMany({
      where: {
        workspaceId: id,
      },
      include: {
        user: true,
      },
    });

    if (!members) throw new NotFoundException();
    const member = members.find((m) => m.userId === userId);
    if (!member) throw new ForbiddenException();

    return {
      members,
      currentUserRole: member.role,
    };
  }

  async updateMember(
    id: string,
    userId: string,
    updateUserId: string,
    role: WorkspaceRole,
  ) {
    const requester = await this.prismaService.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: id,
        },
      },
    });

    if (!requester || !['ADMIN', 'OWNER'].includes(requester.role)) {
      throw new ForbiddenException(
        'You do not have permission to update members.',
      );
    }

    // 2. Hedef kullanıcıyı güncelle (Try-Catch ile sarıyoruz)
    try {
      await this.prismaService.workspaceMember.update({
        where: {
          id: updateUserId,
          workspaceId: id,
        },
        data: {
          role,
        },
      });
    } catch (error) {
      // P2025: Record to update not found.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          'The member you are trying to update does not exist in this workspace.',
        );
      }
      // Beklenmedik başka bir hata varsa fırlat
      throw error;
    }
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
    return { fileKey };
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

  async addPeople(workspaceId: string, email: string) {
    return await this.prismaService.workspace.update({
      where: { id: workspaceId },
      data: {
        members: {
          create: {
            user: {
              connect: {
                email,
              },
            },
          },
        },
      },
    });
  }

  async uploadIcon(contentType: string) {
    const fileKey = `icons/${randomUUID()}-${Date.now()}`;

    const command = new PutObjectCommand({
      Bucket: 'luxly-bucket',
      Key: fileKey,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60,
    });

    return {
      fileKey: fileKey,
      uploadUrl: signedUrl,
    };
  }

  async getDocuments(workspaceId: string) {
    const documents = await this.prismaService.document.findMany({
      where: {
        workspaceId,
      },
    });
    return { documents };
  }

  async getDocument(documentId: string) {
    const document = await this.prismaService.document.findUnique({
      where: {
        id: documentId,
      },
    });
    return { document };
  }
}
