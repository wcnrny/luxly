/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh_token as string;
        },
      ]),
      secretOrKey: process.env.API_REFRESH_SECRET_JWT || 'idk',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    // Token içindeki veriyi (decoded) ve ham token'ı döndürüyoruz
    const refreshToken = req.cookies.refresh_token;
    return { ...payload, refreshToken };
  }
}
