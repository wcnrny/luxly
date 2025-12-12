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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { WorkspacesService } from './workspaces.service';

import { AuthGuard } from 'src/common/guards/auth.guard';
import { WorkspaceAuthGuard } from 'src/common/guards/workspace-auth.guard';

import { CreateWorkspaceDto } from './dto/create-workspace.dto';

import { type REQ_USER } from 'types/req-user.type';
import { type Request } from 'express';

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

@UseGuards(AuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @Req() req: Request,
  ) {
    const user = req.user as REQ_USER;
    return await this.workspacesService.create(
      user.sub,
      createWorkspaceDto.name,
    );
  }

  @Get()
  async getWorkspace(@Req() req: Request) {
    const user = req.user as REQ_USER;
    return await this.workspacesService.findAllMyWorkspaces(user.sub);
  }

  @UseGuards(WorkspaceAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.workspacesService.findOne(id);
  }

  @UseGuards(WorkspaceAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.workspacesService.update(id, updateDto);
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
      throw new UnauthorizedException('Kullanıcı bulunamadı.');
    }
    await this.workspacesService.uploadFile(
      workspaceId,
      file,
      (req.user as REQ_USER).sub,
    );
  }
}
