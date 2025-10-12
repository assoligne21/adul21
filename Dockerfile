# Dockerfile pour déploiement Nuxt 4 sur Coolify

# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer TOUTES les dépendances (y compris devDependencies pour le build)
RUN npm ci

# Copier le code source
COPY . .

# Variables d'environnement nécessaires pour le build
# Les vraies valeurs seront injectées par Coolify
ARG SITE_URL=https://adul21.fr

ENV SITE_URL=${SITE_URL}

# Build l'application
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner

WORKDIR /app

# Copier les fichiers nécessaires depuis le build
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package*.json /app/

# Installer TOUTES les dépendances (y compris dev) car @nuxt/ui-pro
# a besoin de tailwindcss à runtime et le bundling ne fonctionne pas correctement
RUN npm ci

# Créer un symlink pour que Nuxt trouve les modules au bon endroit
RUN mkdir -p /app/.output/server && \
    ln -s /app/node_modules /app/.output/server/node_modules

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["node", ".output/server/index.mjs"]
