import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { type Request, type Response } from 'express';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';

import { AuthGuard } from './guards/auth.guard';
import { UserRole } from '@luxly/prisma';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async handleLogin(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(dto);
    const { accessToken, refreshToken, user } =
      await this.authService.validateLogin(dto);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { user, accessToken };
  }

  @UseGuards(AuthGuard)
  @Post('refresh')
  async handleRefreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.refreshTokens(
        (req.user! as { sub: string; email: string; role: UserRole }).sub,
        req.cookies.refresh_token as string,
      );
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { user, accessToken };
  }

  @Post('create-user')
  async createUser() {
    return await this.authService.createMockUser();
  }
}
