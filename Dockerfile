# =======================================================
# ⚜️ ID10T MAISON DE LUXE — ENTERPRISE DOCKERFILE
# Multi-Stage Production Build
# =======================================================

# Stage 1: Build Frontend TypeScript Bundle
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production API & Static Server Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm ci --only=production

# Copy backend source & docs
COPY server ./server
COPY scripts ./scripts

# Copy compiled frontend assets from builder
COPY --from=frontend-builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "server/index.js"]
