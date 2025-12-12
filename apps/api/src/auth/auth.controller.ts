/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { type Request, type Response } from 'express';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';

import { AuthGuard } from '../common/guards/auth.guard';
import { UserRole } from '@luxly/prisma';
import { AppConfigService } from 'src/common/app-config.service';

const EXPIRES_IN = 60 * 60 * 24; // 1 Day

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: AppConfigService,
  ) {}

  @Post('login')
  async handleLogin(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.validateLogin(dto);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const { currentRefreshToken, ...resUser } = user;

    return {
      ...resUser,
      accessToken,
      expiresIn: EXPIRES_IN * 1000, // in ms
    };
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
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const { currentRefreshToken, ...resUser } = user;

    return { ...resUser, accessToken };
  }

  @UseGuards(AuthGuard)
  @Get('ping')
  handlePing(@Req() req: Request) {
    const reqUser = req.user as { sub: string; email: string; role: UserRole };
    if (!reqUser) throw new UnauthorizedException('NO_USER');
    return {
      message: 'Pong!',
      user: reqUser,
    };
  }
}
