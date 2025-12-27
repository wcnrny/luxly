/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  Session,
  type Users as PrismaUsers,
  WorkspaceMember,
} from '@luxly/prisma';
declare global {
  namespace Express {
    interface User extends PrismaUsers {}
    interface Request {
      user?: PrismaUser;
      member?: WorkspaceMember;
      session?: Session;
    }
  }
}
