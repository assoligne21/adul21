# Dockerfile pour déploiement Nuxt 4 sur Coolify

# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --omit=dev

# Copier le code source
COPY . .

# Build l'application
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner

WORKDIR /app

# Copier les fichiers nécessaires depuis le build
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package*.json /app/

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["node", ".output/server/index.mjs"]
