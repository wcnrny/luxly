/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

import argon from 'argon2';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppConfigService } from 'src/common/app-config.service';
import { RegisterDto } from './dto/register.dto';
import { v4 as uuidv4 } from 'uuid';

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
      throw new UnauthorizedException(
        'You have entered wrong email or password.',
      );
    }
  }

  async registerUser(dto: RegisterDto) {
    const pepper = this.configService.getOrThrow<string>('API_SECRET_PEPPER');
    const hashedPassword = await argon.hash(dto.password + pepper);

    const existingUser = await this.prismaService.users.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });

    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ConflictException('Email is already in use');
      }
      if (existingUser.username === dto.username) {
        throw new ConflictException('Username is already taken');
      }
    }
    try {
      const newUser = await this.prismaService.users.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          username: dto.username,
          email: dto.email,
          accounts: {
            create: [
              {
                provider: 'local',
                password: hashedPassword,
                type: 'credentials',
                providerAccountId: dto.email,
              },
            ],
          },
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          // Şifreyi asla geri döndürme!
        },
      });

      return newUser;
    } catch (error) {
      // Prisma'nın Unique Constraint Hatası (Code: P2002)
      if ((error.code as string) === 'P2002') {
        const target = error.meta?.target as string;
        throw new ConflictException(`${target} is already taken`);
      }
      // Beklenmeyen başka bir hata
      throw new InternalServerErrorException(
        'Something went wrong during registration',
      );
    }
  }

  async refreshTokens(userId: string, incomingRefreshToken: string) {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    });

    if (!user || !user.currentRefreshToken) {
      throw new ForbiddenException('No user or refresh token.');
    }
    const refreshTokenMatches = await argon.verify(
      user.currentRefreshToken,
      incomingRefreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Non-valid refresh token.');
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
        expiresIn: '1d',
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
