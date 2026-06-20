# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install ALL dependencies (including devDependencies for the build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy full source and build
COPY . .
RUN npm run build

# ─── Stage 2: Production runtime ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Only production deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built frontend + bundled server from builder
COPY --from=builder /app/dist ./dist

# Copy the CMS JSON data file (read/written at runtime by the server)
COPY --from=builder /app/src/data ./src/data

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
