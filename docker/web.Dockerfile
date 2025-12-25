# syntax=docker/dockerfile:1

# ============================================================================
# Dependencies & Build Stage
# ============================================================================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Install dependencies and build
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Clean and install production dependencies only
RUN rm -rf node_modules && \
    bun install --frozen-lockfile --production && \
    wget -qO- https://gobinaries.com/tj/node-prune | sh && \
    node-prune && \
    rm /usr/local/bin/node-prune

# ============================================================================
# Production Stage
# ============================================================================
FROM oven/bun:1-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy everything from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/app/lib/logger.ts ./app/lib/logger.ts
COPY --from=builder /app/package.json ./package.json

# Security: Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S remix -u 1001 && \
    chown -R remix:nodejs /app

USER remix

EXPOSE 3000

CMD ["bun", "run", "start"]
