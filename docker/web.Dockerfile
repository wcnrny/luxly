FROM oven/bun:alpine AS base

WORKDIR /app

COPY package.json bun.lock ./

COPY packages/storage/package.json ./packages/storage/
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/
COPY packages/prisma/package.json ./packages/prisma/

COPY apps/web/package.json ./apps/web/

RUN bun install --ignore-scripts

COPY . .

WORKDIR /app/apps/web

ARG NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} bun run build 

EXPOSE 3000

CMD ["bun", "run", "start"]