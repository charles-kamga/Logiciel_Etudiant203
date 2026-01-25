# 📅 EDT Universitaire - Projet ICT 203 (2025/2026)

**Système de Gestion d'Emploi du Temps pour l'Université de Yaoundé 1 (UY1 - ICT)**

Ce projet vise à fournir une solution complète et moderne pour la gestion des emplois du temps universitaires, permettant une planification optimale sans conflits entre salles, enseignants et classes.

---

## Fonctionnalités réalisées
- **Système d'authentification** : Accès différenciés pour Admin, Enseignants et Étudiants.
- **Portail Admin** : Dashboard complet, gestion des salles (capacité), des classes (effectifs), des enseignants et module d'arbitrage de conflits.
- **Inscription Étudiant** : Formulaire dédié pour l'enregistrement des nouveaux étudiants par filière.
- **Design Moderne** : Interface "UniPortal" responsive avec Tailwind CSS v4 et Lucide Icons.
- **Architecture Pro** : Backend Node.js/Express, Base de données SQLite portable avec Prisma ORM.

## 🛠️ Installation et Configuration

### Pré-requis
- Node.js (v18+)
- npm
- Backend : Créer les routes API pour envoyer les données de la base.
- Frontend : Créer un service de connexion (Axios).

### 1. Configuration du Backend
```bash
cd backend
npm install
# Synchroniser la base de données SQLite
npx prisma db push
```

### Configuration du Frontend
```bash
cd ../frontend
npm install
```
### Installation à la racine (pour le lancement simultané)
```bash
cd ..
npm install
```
### Lancement du projet
Pour lancer le serveur backend et l'interface frontend en même temps :
```bash
npm run dev
```
- Ou lancer les executable 
##### [ LINUX ]
```
chmod +x lancer.sh
./lancer.sh
```
##### [ WINDOWS ]
```
lancer.bat
```

## 🚀 État actuel du projet (Phase 1 : Design & Architecture)

Jusqu'à présent, nous avons réalisé les fondations solides du logiciel :

### 🔹 Architecture & Backend
- **Structure Monorepo** : Séparation claire entre `/frontend` et `/backend`.
- **Base de Données** : Implémentation de **SQLite** via **Prisma ORM** pour une portabilité totale (Zéro installation requise pour le testeur).
- **Modèle de Données** : Schéma complet incluant Salles (capacités), Enseignants, Classes (effectifs), UE et sessions.

### 🔹 Frontend (Interface Utilisateur)
- **Design Système** : Style "UniPortal" moderne utilisant **React** et **Tailwind CSS v4**.
- **Branding** : Intégration de l'identité visuelle **UY1 - ICT**.
- **Pages Développées** :
  - `Home` : Landing page professionnelle avec accès rapide par profil.
  - `Login` : Portail de sélection des rôles.
  - `RegisterStudent` : Formulaire d'inscription pour les étudiants avec gestion des matricules.
  - `AdminLogin` : Accès sécurisé pour l'administration (admin/admin).
  - `Console Admin` : Dashboard complet avec Sidebar, statistiques et suivi de progression des plannings.
  - `Gestion des Salles` : CRUD complet pour gérer les espaces et leurs capacités.
  - `Modules Admin` : Interfaces pour la gestion des enseignants, des classes, des vœux et module d'arbitrage.

### 🔹 Portabilité & Exécution
- **Scripts de lancement** : Création de `start.sh` et `start.bat` pour un démarrage rapide sur Windows et Linux.
- **Automatisation** : Configuration de `concurrently` pour lancer le client et le serveur en une seule commande.

---

- Le logiciel s'ouvrira automatiquement dans votre navigateur par défaut.
#### 🔑 Identifiants de test (Admin)
- Utilisateur : admin
- Mot de passe : admin
#### 📁 Structure du projet
- frontend/ : Application React (Vite + Tailwind CSS v4)
- backend/ : API REST (Node.js + Express + Prisma)
- backend/prisma/dev.db : Base de données SQLite portable

## 🛠️ Installation & Lancement

1. **Cloner le projet**
   ```bash
   git clone https://github.com/Tchinda-BL4Z3/Logiciel_Etudiants_203.git
   cd Logiciel_Etudiants_203
   ```
### Étape 2 : Créer un fichier `.gitignore` (INDISPENSABLE)
- Pour éviter d'envoyer des fichiers inutiles ou trop lourds sur GitHub, crée un fichier `.gitignore` à la **racine** :
```text
node_modules/
frontend/node_modules/
backend/node_modules/
.env
dist/
.DS_Store
