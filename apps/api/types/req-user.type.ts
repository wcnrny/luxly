import { UserRole } from '@luxly/prisma';

export type REQ_USER = { sub: string; email: string; role: UserRole };
