# Multi-stage production Dockerfile for Parivahan Next 2.0
# Base stage: Node.js alpine build environment
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json ./
RUN npm ci --no-audit

# Copy source code and build config
COPY . .

# Compile TypeScript and Vite production bundle
RUN npm run build

# Production stage: Unprivileged Nginx
FROM nginxinc/nginx-unprivileged:alpine-slim

# Copy custom hardened Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose non-privileged HTTP port
EXPOSE 8080

# Healthcheck configuration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
