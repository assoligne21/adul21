# Dockerfile optimisé pour déploiement Nuxt 4 sur Coolify
# Temps de build réduit de ~6min à ~2-3min

# Stage 1: Dependencies
FROM node:22-alpine AS deps

# Installer pnpm (plus rapide que npm)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copier UNIQUEMENT les fichiers de dépendances
COPY package.json pnpm-lock.yaml* package-lock.json* ./

# Installer les dépendances avec cache mount (accélère les rebuilds)
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    else \
      npm ci; \
    fi

# Stage 2: Builder
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copier les node_modules depuis deps (cache layer)
COPY --from=deps /app/node_modules ./node_modules

# Copier le code source
COPY . .

# Variables d'environnement pour le build
ARG SITE_URL=https://adul21.fr
ENV SITE_URL=${SITE_URL}

# Build l'application (avec cache des fichiers .nuxt si disponible)
RUN npm run build

# Stage 3: Production runner
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

# Copier les fichiers nécessaires
COPY --from=builder --chown=nuxtjs:nodejs /app/.output /app/.output
COPY --from=builder --chown=nuxtjs:nodejs /app/package.json /app/
COPY --from=builder --chown=nuxtjs:nodejs /app/drizzle.config.ts /app/
COPY --from=builder --chown=nuxtjs:nodejs /app/server/database/ /app/server/database/

# Copier le script de démarrage
COPY --chown=nuxtjs:nodejs scripts/docker-start.sh /app/
RUN chmod +x /app/docker-start.sh

# Installer uniquement les dépendances nécessaires pour les migrations
# On initialise pnpm puis on installe drizzle-kit globalement et les dépendances localement
RUN pnpm init -y && \
    pnpm add -g drizzle-kit@0.31.5 && \
    pnpm add --save-prod postgres@3.4.7 pg@8.13.1 drizzle-orm@0.44.6 dotenv@17.2.3 zod@3.25.76

# Variables d'environnement
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    NODE_OPTIONS="--max-old-space-size=2048"

USER nuxtjs

EXPOSE 3000

# Health check (optionnel mais recommandé)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["/app/docker-start.sh"]
