FROM oven/bun:1-slim AS builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY prisma ./prisma
COPY prisma.config.ts ./

# Set dummy DATABASE_URL for Prisma client generation at build time
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN bun run prisma:generate

COPY src ./src
COPY tsconfig.json ./

FROM oven/bun:1-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# New Relic APM agent settings (license key & app name are injected at
# runtime via env vars / env_file — never baked into the image)
ENV NEW_RELIC_APP_NAME="atelier-hub-backend"
ENV NEW_RELIC_NO_CONFIG_FILE=false
ENV NEW_RELIC_LOG=stdout

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Bring in only the generated Prisma client — not the whole builder node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY newrelic.cjs ./

# Use non-root bun user for security best practice
USER bun

# Expose backend port
EXPOSE 5000

# Start server using Bun
CMD ["bun", "run", "start"]
