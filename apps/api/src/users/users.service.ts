import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_CLIENT_TOKEN } from '@luxly/storage';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(S3_CLIENT_TOKEN) private readonly s3Client: S3Client,
  ) {}
  async getUserProfile(userId: string) {
    const profile = await this.prismaService.users.findFirstOrThrow({
      where: { id: userId },
      select: {
        avatarUrl: true,
        bio: true,
        name: true,
        role: true,
        username: true,
      },
    });
    return profile;
  }

  async checkAvailability(email?: string, username?: string) {
    const result = {
      emailAvailable: true,
      usernameAvailable: true,
    };

    if (email) {
      const count = await this.prismaService.users.count({
        where: { email },
      });
      if (count > 0) result.emailAvailable = false;
    }

    if (username) {
      const count = await this.prismaService.users.count({
        where: { username },
      });
      if (count > 0) result.usernameAvailable = false;
    }

    return result;
  }

  async uploadAvatar(contentType: string, userId: string) {
    const fileKey = `avatars/${userId}-${Date.now()}`;

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

  async updateAvatar(userId: string, avatarUrl: string) {
    return await this.prismaService.users.update({
      where: { id: userId },
      data: { avatarUrl },
      select: { id: true, avatarUrl: true, name: true },
    });
  }
}
