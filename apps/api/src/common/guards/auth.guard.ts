/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { getUserFromRequest } from 'src/auth-check';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const headers = fromNodeHeaders(request.headers);

    try {
      console.log(headers);
      const result = await getUserFromRequest(headers);
      if (!result) {
        throw new UnauthorizedException('UR NOT AUTHORIZED');
      }
      request.user = result.user;
      request['session'] = result.session;
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    return true;
  }
}
