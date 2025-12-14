# Stage 1: Base (Install dependencies)
FROM node:18-alpine AS base

# Install libc6-compat (diperlukan untuk process manager tertentu di alpine)
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Stage 2: Deps (Install node_modules)
FROM base AS deps
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# Stage 3: Builder (Build Next.js)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Disable telemetry agar build lebih cepat
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 4: Runner (Production Image)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Buat user non-root (SECURITY!)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy hasil build standalone
COPY --from=builder /app/public ./public
# Set permission folder .next ke user nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy output standalone (folder .next/standalone otomatis digenerate nextjs)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Menyalin folder prisma (schema) ke final image agar bisa dimigrasi
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Gunakan user biasa
USER nextjs

# Expose port (Internal container)
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
# Jalankan server
CMD ["node", "server.js"]