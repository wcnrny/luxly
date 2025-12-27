import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  PayloadTooLargeException,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { WorkspacesService } from './workspaces.service';

import { AuthGuard } from 'src/common/guards/auth.guard';
import { WorkspaceAuthGuard } from 'src/common/guards/workspace-auth.guard';

import { CreateWorkspaceDto } from './dto/create-workspace.dto';

import { type Request } from 'express';
import { AddMemberDto } from './dto/invite-dto';
import { WorkspaceRole } from '@luxly/prisma';

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

@UseGuards(AuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  async handleCreate(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @Req() req: Request,
  ) {
    const userId = req.user!.id;
    return await this.workspacesService.create(userId, createWorkspaceDto);
  }

  @Get('upload/icon')
  async handleUploadIcon(@Query('contentType') contentType: string) {
    return await this.workspacesService.uploadIcon(contentType);
  }
  @Get()
  @UseGuards(AuthGuard)
  async getWorkspace(@Req() req: Request) {
    const user = req.user!;
    return await this.workspacesService.findAllMyWorkspaces(user.id);
  }

  @Get(':id')
  @UseGuards(WorkspaceAuthGuard)
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user!.id;
    return await this.workspacesService.findOne(id, userId);
  }

  @Get(':id/members')
  @UseGuards(WorkspaceAuthGuard)
  async findMembers(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user!.id;
    return await this.workspacesService.findMembers(id, userId);
  }
  @Patch(':id/members/:userId')
  @UseGuards(WorkspaceAuthGuard)
  async updateMember(
    @Param('id') id: string,
    @Req() req: Request,
    @Param('userId') updateUserId: string,
    @Body() body: { role: WorkspaceRole },
  ) {
    const userId = req.user!.id;
    return await this.workspacesService.updateMember(
      id,
      userId,
      updateUserId,
      body.role,
    );
  }

  @UseGuards(WorkspaceAuthGuard)
  @Post('add/:id')
  async addPeople(@Body() dto: AddMemberDto) {
    return await this.workspacesService.addPeople(dto.workspaceId, dto.email);
  }

  @UseGuards(WorkspaceAuthGuard)
  @Patch(':id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(@Param('id') id: string, @Body() updateDto: any) {
    // return this.workspacesService.update(id, updateDto);
  }

  @UseGuards(WorkspaceAuthGuard)
  @Get(':id/documents')
  async handleGetDocuments(@Param('id') workspaceId: string) {
    return await this.workspacesService.getDocuments(workspaceId);
  }

  @UseGuards(WorkspaceAuthGuard)
  @Get(':id/documents/:docId')
  async handleGetDocument(@Param('docId') documentId: string) {
    return await this.workspacesService.getDocument(documentId);
  }

  @UseGuards(WorkspaceAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: MAX_SIZE,
      },
      fileFilter: (req, file, cb) => {
        if (!['application/pdf', 'video/mp4'].includes(file.mimetype)) {
          return cb(
            new Error('Only .pdf and .mp4 file formats are allowed.'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @Post(':id/documents/upload')
  async uploadFile(
    @Param('id') workspaceId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (file.size > MAX_SIZE) {
      throw new PayloadTooLargeException('File size is bigger than 50 MB.');
    }
    if (!req.user) {
      throw new UnauthorizedException('User not found.');
    }
    await this.workspacesService.uploadFile(workspaceId, file, req.user.id);
  }
}
