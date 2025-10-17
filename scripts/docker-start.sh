#!/bin/sh
# Script de démarrage Docker avec migrations automatiques
# Garantit que les tables existent avant de démarrer l'application

set -e  # Arrêter en cas d'erreur

echo "🔄 Exécution des migrations de base de données..."

# Exécuter les migrations Drizzle
# db:push synchronise le schéma sans créer de fichiers de migration
npm run db:push

echo "✅ Migrations terminées avec succès"
echo "🚀 Démarrage du serveur Nuxt..."

# Démarrer le serveur
exec node .output/server/index.mjs
