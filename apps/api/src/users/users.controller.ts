import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { REQ_USER } from 'types/req-user.type';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id/profile')
  @UseGuards(AuthGuard)
  async handleProfile(@Req() req: Request, @Param('id') userId: string) {
    const reqUser = req.user as REQ_USER;
    return await this.usersService.getUserProfile(reqUser, userId);
  }
}
