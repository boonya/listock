FROM node:24.12.0-alpine3.23 AS node

# Build
FROM node AS build
WORKDIR /app

COPY . .
RUN npm ci -w client --include-workspace-root

ARG REVISION
RUN npm run build -w client

# Runtime
FROM nginx:stable-alpine-slim AS runner

COPY --from=build /app/client/build /www/
RUN rm -rf /etc/nginx/conf.d/*
COPY client/nginx.conf /etc/nginx/conf.d/virtualhost.conf

SHELL ["/bin/sh", "-c"]
# if [ -z "$API_URL" ]; then exit 1
CMD sed -i "s|%API_URL%|${API_URL}|g" /www/index.html && \
  nginx -g "daemon off;"
