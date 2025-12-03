/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

import argon from 'argon2';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppConfigService } from 'src/common/app-config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
  ) {}
  async validateLogin(dto: LoginDto) {
    const user = await this.prismaService.users.findFirst({
      where: {
        email: dto.email,
      },
      include: {
        accounts: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const credentials = user.accounts.find((acc) => acc.provider === 'local');
    if (!credentials || !credentials.password) {
      throw new NotFoundException('Kullanıcı bulunamadı!');
    }
    const pepper = this.configService.getOrThrow<string>('API_SECRET_PEPPER');
    const isValid = await argon.verify(
      credentials.password,
      dto.password + pepper,
    );
    if (isValid) {
      const { accessToken, refreshToken } = await this.generateTokens(
        user.id,
        user.email,
        user.role,
      );
      const refreshTokenHash = await argon.hash(refreshToken);
      await this.prismaService.users.update({
        where: { username: user.username },
        data: { currentRefreshToken: refreshTokenHash },
      });
      const { accounts, ...filteredUser } = user;
      return {
        accessToken,
        refreshToken,
        user: filteredUser,
      };
    } else {
      console.log('şifre yanlış girildi veya kullanıcı bulunamadı');
      throw new UnauthorizedException('Kullanıcı şifresi yanlış!');
    }
  }

  async refreshTokens(userId: string, incomingRefreshToken: string) {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    });

    if (!user || !user.currentRefreshToken) {
      throw new ForbiddenException('Erişim Reddedildi (User yok veya RT yok)');
    }
    const refreshTokenMatches = await argon.verify(
      user.currentRefreshToken,
      incomingRefreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException(
        'Erişim Reddedildi (Geçersiz Refresh Token)',
      );
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    const { accessToken, refreshToken } = tokens;
    return { accessToken, refreshToken, user };
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await argon.hash(refreshToken);
    await this.prismaService.users.update({
      where: { id: userId },
      data: { currentRefreshToken: hash },
    });
  }

  async generateTokens(userId: string, email: string, role: string) {
    const payload = {
      sub: userId,
      email,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async createMockUser() {
    const pepper = this.configService.getOrThrow<string>('API_SECRET_PEPPER');

    const hashedPassword = await argon.hash('123' + pepper);

    const seedUser = await this.prismaService.users.upsert({
      where: { email: 'wcnrny@proton.me' },
      update: {},
      create: {
        email: 'wcnrny@proton.me',
        username: 'wcnrny',
        firstName: 'Furkan',
        lastName: 'Erkara',
        role: 'ADMIN',
        bio: 'deneme',
        emailVerified: new Date(),
        accounts: {
          create: {
            provider: 'local',
            type: 'credentials',
            providerAccountId: 'wcnrny@proton.me',
            password: hashedPassword,
          },
        },
      },
    });

    console.log(`[+] Kullanıcı hazır: ${seedUser.id}`);
    return true;
  }
}
