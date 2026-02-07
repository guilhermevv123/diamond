# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy output from builder
COPY --from=builder /app/.output ./.output

# Expose port
EXPOSE 3000

# Set environment variables defaults
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Start command
CMD ["sh", "-c", "echo '--- DOCKER STARTUP ENV CHECK ---'; printenv | grep SUPABASE || echo 'SUPABASE VARS NOT FOUND'; node .output/server/index.mjs"]
