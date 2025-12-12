import { WorkspaceMember } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      member?: WorkspaceMember;
    }
  }
}
