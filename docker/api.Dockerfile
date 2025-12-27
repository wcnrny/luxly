FROM oven/bun:alpine AS base

WORKDIR /app

COPY package.json bun.lock ./

COPY packages/prisma/package.json ./packages/prisma/
COPY packages/storage/package.json ./packages/storage/
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/


COPY apps/api/package.json ./apps/api/

RUN bun install --ignore-scripts

COPY . .

WORKDIR /app/packages/prisma
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" bunx prisma generate

WORKDIR /app/apps/api
RUN bun run build 

EXPOSE 3000

CMD ["bun", "run", "start:prod"]