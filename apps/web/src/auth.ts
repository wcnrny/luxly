import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { UserRole } from "@luxly/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    modelName: "Users",
    fields: {
      image: "avatarUrl",
      emailVerified: "emailVerified",
    },
    additionalFields: {
      username: { type: "string", required: true, input: true },
      role: { type: "string", required: false, defaultValue: UserRole.USER },
    },
  },
  session: {
    modelName: "Session",
  },
  account: {
    modelName: "Account",
  },
  verification: {
    modelName: "Verification",
  },
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.AUTH_SECRET,
  advanced: {
    cookiePrefix: "better-auth",
    defaultCookieAttributes: {
      domain: ".luxly.local",
      secure: true,
      sameSite: "lax",
      httpOnly: true,
      path: "/",
    },
  },
  trustedOrigins: [
    "https://luxly.local",
    "https://app.luxly.local",
    "https://api.luxly.local",
  ],
});
