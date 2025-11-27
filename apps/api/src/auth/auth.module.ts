import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AuthService, PrismaService, JwtService],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      global: true,
      secret:
        process.env.API_SECRET_JWT ||
        'burayi_unutmusun_git_env_e_jwt_secret_ekle',
      signOptions: { expiresIn: '60s' },
    }),
    PrismaModule,
  ],
})
export class AuthModule {}
