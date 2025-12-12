import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { REQ_USER } from 'types/req-user.type';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async getUserProfile(user: REQ_USER, userId: string) {
    const profile = await this.prismaService.users.findFirstOrThrow({
      where: { id: userId },
      select: {
        avatarUrl: true,
        bio: true,
        firstName: true,
        lastName: true,
        role: true,
        username: true,
      },
    });
    return profile;
  }
}
