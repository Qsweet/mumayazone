FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace config and lockfile
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy package.json files for workspaces
COPY packages/shared-types/package.json ./packages/shared-types/
COPY mqudah-professional-website/package.json ./mqudah-professional-website/

# Install dependencies (frozen-lockfile is default for ci/install)
RUN pnpm install --no-frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/mqudah-professional-website/node_modules ./mqudah-professional-website/node_modules

# Copy full source code
COPY . .

# Build shared types first (if needed, though workspace install might handle symlinks, explicit build ensures dist exists)
WORKDIR /app/packages/shared-types
RUN pnpm build

# Build frontend
WORKDIR /app/mqudah-professional-website
# Pass environment variables typically needed at build time if any (SKIP_ENV_VALIDATION=1 is common for T3/Next)
ENV NEXT_TELEMETRY_DISABLED 1
ENV SKIP_ENV_VALIDATION 1
ENV DATABASE_URL "postgresql://postgres:password@localhost:5432/mqudah"
RUN pnpm build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install pnpm for runtime scripts (migrations)
RUN npm install -g pnpm

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/mqudah-professional-website/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# We need to copy distinct layers because standalone output traces dependencies
COPY --from=builder --chown=nextjs:nodejs /app/mqudah-professional-website/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/mqudah-professional-website/.next/static ./mqudah-professional-website/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# It's located deep in .next/standalone/mqudah-professional-website/server.js usually, 
# or if we copied correctly, we run it from app root.
# The standalone output preserves directory structure relative to monorepo root often.
# Let's assume standard behavior:
CMD ["node", "mqudah-professional-website/server.js"]
