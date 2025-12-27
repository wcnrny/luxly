import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { db } from './lib/prisma';
import { UserRole } from '@luxly/prisma';

const apiAuth = betterAuth({
  database: prismaAdapter(db, { provider: 'postgresql' }),
  secret: process.env.AUTH_SECRET,
  trustedOrigins: ['http://localhost:3000', 'http://localhost:3001'],
  user: {
    modelName: 'Users',
    fields: {
      image: 'avatarUrl',
      emailVerified: 'emailVerified',
    },
    additionalFields: {
      username: { type: 'string', required: true, input: true },
      role: { type: 'string', required: false, defaultValue: UserRole.USER },
    },
  },
  session: {
    modelName: 'Session',
  },
  account: {
    modelName: 'Account',
  },
  verification: {
    modelName: 'Verification',
  },
  emailAndPassword: {
    enabled: true,
  },
});

export async function getUserFromRequest(headers: Headers) {
  const session = await apiAuth.api.getSession({
    headers,
  });
  return session;
}
