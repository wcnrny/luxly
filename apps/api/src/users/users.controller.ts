import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { type Request } from 'express';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id/profile')
  @UseGuards(AuthGuard)
  async handleProfile(@Req() req: Request, @Param('id') userId: string) {
    return await this.usersService.getUserProfile(userId);
  }

  @Get('me/avatar-url')
  @UseGuards(AuthGuard)
  async getAvatarUploadUrl(
    @Req() req: Request,
    @Query('contentType') contentType: string,
  ) {
    const userId = req.user!.id;
    return await this.usersService.uploadAvatar(contentType, userId);
  }

  @Patch('me/avatar')
  @UseGuards(AuthGuard)
  async updateAvatar(@Req() req: Request, @Body() body: { avatarUrl: string }) {
    const userId = req.user!.id;
    return await this.usersService.updateAvatar(userId, body.avatarUrl);
  }

  @Get('check')
  async checkAvailability(
    @Query('email') email?: string,
    @Query('username') username?: string,
  ) {
    return await this.usersService.checkAvailability(email, username);
  }
}
