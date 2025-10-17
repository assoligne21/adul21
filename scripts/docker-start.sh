#!/bin/sh
# Script de démarrage Docker
# Les migrations peuvent être exécutées manuellement si nécessaire

set -e  # Arrêter en cas d'erreur

echo "🚀 Démarrage du serveur Nuxt..."

# Démarrer le serveur directement
# Les tables devraient déjà exister depuis le premier déploiement
exec node .output/server/index.mjs
