FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace config and lockfile (from root context)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy package.json files for workspaces
COPY packages/shared-types/package.json ./packages/shared-types/
COPY server-nest/package.json ./server-nest/

# Install dependencies (frozen-lockfile is default for ci/install)
RUN pnpm install --no-frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/server-nest/node_modules ./server-nest/node_modules

# Copy full source code
COPY . .

# Build shared types
WORKDIR /app/packages/shared-types
RUN pnpm build

# Generate Prisma Client (if schema exists in standard location)
# Check if prisma folder exists in server-nest, usually it does.
WORKDIR /app/server-nest
RUN npx prisma generate

# Build backend
RUN pnpm build

# Production image
# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN apk add --no-cache openssl libc6-compat

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy root node_modules (with pnpm virtual store)
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

# Copy workspace artifacts to their original location to preserve symlinks
COPY --from=builder --chown=nestjs:nodejs /app/server-nest/dist ./server-nest/dist
COPY --from=builder --chown=nestjs:nodejs /app/server-nest/node_modules ./server-nest/node_modules
COPY --from=builder --chown=nestjs:nodejs /app/server-nest/package.json ./server-nest/package.json
COPY --from=builder --chown=nestjs:nodejs /app/server-nest/prisma ./server-nest/prisma

# Set working directory to workspace
WORKDIR /app/server-nest

USER nestjs

EXPOSE 3001

CMD ["node", "dist/src/main"]
