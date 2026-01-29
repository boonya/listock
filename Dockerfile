FROM node:24.12.0-alpine3.23 AS base

## Preparation stage
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json client/package.json server/package.json ./
RUN npm ci

# Build time stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ARG REVISION

# NODE_ENV=development
# API_URL=http://localhost:31235

# HOSTNAME: z.string().default('localhost'),
# PORT: z.coerce.number().min(1024).max(65_535).default(31_235),
# SUPABASE_URL: z.url(),
# SUPABASE_ANON_KEY: z.string().nonempty(),

RUN npm run build

# Run time stage
FROM base AS runner
WORKDIR /app

COPY --from=builder --chown=app:nodejs /app/server/build /app/server
COPY --from=builder --chown=app:nodejs /app/client/build /app/client

USER app

# "/app/client" should be exposed as a directory with static files
ENV HOSTNAME="0.0.0.0"
CMD ["node", "/app/server/index.js"]
