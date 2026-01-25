#!/bin/bash

echo "--- INSTALLATION AUTOMATIQUE (LINUX) ---"

# 1. Installation à la racine
echo "Étape 1: Installation des outils racine..."
npm install

# 2. Installation Backend
echo "Étape 2: Installation du Backend..."
cd backend
npm install
# Génération du client Prisma (très important pour SQLite)
npx prisma generate
# Synchronisation de la base de données
npx prisma db push

# 3. Installation Frontend
echo "Étape 3: Installation du Frontend..."
cd ../frontend
npm install

echo "--- INSTALLATION TERMINÉE ---"
echo "Pour lancer le projet, tape : ./start.sh"
