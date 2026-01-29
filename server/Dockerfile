FROM node:24.12.0-alpine3.23 AS node

# Build
FROM node AS build
WORKDIR /app

COPY . .
RUN npm ci -w server --include-workspace-root

ARG REVISION
RUN npm run build -w server

# Runtime
FROM node AS runner
WORKDIR /app

COPY --from=build /app/server /app/package-lock.json /app/
RUN npm ci --omit=dev

ENV HOSTNAME="0.0.0.0"
CMD ["node", "./build/index.mjs"]
