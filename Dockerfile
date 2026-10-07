FROM node:22-slim AS base
COPY --from=oven/bun:1.3.8 /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app

# Stage 1: Build the application
FROM base AS builder

COPY package.json bun.lock ./

RUN bun install

COPY . .

RUN bun run build

# Stage 2: Start the application production
FROM base AS production

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json /app/next.config.ts /app/.env /app/bun.lock /app/tsconfig.json ./

RUN bun install --production
RUN bun add -D typescript

EXPOSE 3000
CMD ["bun", "run", "start"]
