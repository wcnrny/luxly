// packages/db/src/index.ts

import { PrismaClient } from "@luxly/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
export default db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export * from "@luxly/prisma";
