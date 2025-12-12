import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { REQ_USER } from 'types/req-user.type';

@Injectable()
export class WorkspaceAuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() satisfies Request;
    const user = request.user as REQ_USER;
    if (!user || !user.sub) {
      return false;
    }

    const workspaceId =
      (request.params.workspaceId as string) || (request.params.id as string);
    if (!workspaceId) {
      throw new BadRequestException(
        'Workspace ID not found in request parameters',
      );
    }
    const member = await this.prismaService.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.sub,
          workspaceId: workspaceId,
        },
      },
    });
    if (!member) {
      throw new ForbiddenException('You are not a member of this workspace.');
    }
    request.member = member;
    return true;
  }
}
