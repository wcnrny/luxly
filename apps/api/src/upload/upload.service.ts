import { PutObjectCommand, S3_CLIENT_TOKEN, S3Client } from '@luxly/storage';
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';

function isMulterFile(file: unknown): file is Express.Multer.File {
  return !!file && typeof file === 'object' && 'originalname' in file;
}

@Injectable()
export class UploadService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(S3_CLIENT_TOKEN) private readonly s3Client: S3Client,
    // QueueService
  ) {}

  async uploadFile(file: Express.Multer.File, userId: string) {
    if (!isMulterFile(file)) {
      throw new BadRequestException('Invalid file upload payload');
    }
    const fileKey = `${randomUUID()}-${file.originalname}`;

    const output = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'luxly-bucket',
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    console.log(output);
    console.info(`S3 bucket'a atıldı. id: ${fileKey}`);
  }
}
