# Plateforme de Recherche Environnementale et Biodiversité

Plateforme web centrale (ERP + plateforme scientifique) pour un centre de recherche environnemental et biodiversité basé au nord du Maroc.

## 🚀 Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Prisma** - ORM pour la base de données
- **PostgreSQL + PostGIS** - Base de données relationnelle et géospatiale
- **NextAuth.js** - Authentification et gestion des sessions
- **Tailwind CSS** - Styling
- **Leaflet** - Cartographie interactive

## 📦 Installation

```bash
npm install
```

## 🗄️ Configuration Base de Données

1. Créer un fichier `.env` à la racine du projet avec les variables suivantes :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/research_platform?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

   Pour générer un secret aléatoire :

   ```bash
   openssl rand -base64 32
   ```

1. Générer le client Prisma :

```bash
npm run db:generate
```

1. Appliquer les migrations :

```bash
npm run db:push
```

## 🏃 Développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📋 Modules

- ✅ Gestion des utilisateurs & sessions
- ✅ Gestion RH
- ✅ Comptabilité & Finances
- ✅ Gestion Matériel & Logistique
- ✅ Missions & Campagnes Terrain
- ✅ Base de données scientifique - Espèces
- ✅ Données environnementales
- ✅ SIG & Cartographie
- ✅ Gestion documentaire
- ✅ Édition & Publication
- ✅ Tableaux de bord personnalisés

## 📖 Documentation

- [Guide de Démarrage Rapide](./docs/QUICKSTART.md) - Installation et configuration
- [Architecture](./docs/ARCHITECTURE.md) - Vue d'ensemble technique
- [Git Workflow Guide](./docs/GIT_WORKFLOW.md) - Guide complet du workflow Git/GitHub
- [Git Setup Guide](./docs/README_GIT_SETUP.md) - Guide de configuration Git rapide
- [Contributing Guide](./docs/CONTRIBUTING.md) - Guide de contribution au projet
- [Documentation Standards](./docs/DOCUMENTATION_STANDARDS.md) - Standards et règles de documentation

## 🔄 Git & GitHub Workflow

Ce projet utilise un workflow Git complet avec :

- **Métadonnées de fichiers** : Tous les fichiers TypeScript incluent des en-têtes avec auteur, dates, nombre de mises à jour, etc.
- **Commits cohérents** : Scripts pour créer des commits logiques et groupés
- **Branches structurées** : Convention de nommage pour les branches
- **Pull Requests** : Templates et processus standardisés
- **Git Hooks** : Mise à jour automatique des en-têtes avant commit

### Commandes rapides

```bash
# Ajouter/mettre à jour les en-têtes de fichiers
npm run headers:update

# Créer une nouvelle branche
npm run git:branch feature/ma-fonctionnalite

# Créer des commits cohérents
npm run git:commit-grouped

# Pousser la branche
npm run git:push

# Vérifier la configuration Git
npm run git:verify
```

Voir [README_GIT_SETUP.md](./docs/README_GIT_SETUP.md) pour plus de détails.

## 🔐 Connexion par défaut

Après l'installation et le seed :

- **Email** : `admin@research-platform.ma`
- **Mot de passe** : `admin123`

⚠️ Changez le mot de passe après la première connexion !

## 🎯 Fonctionnalités Principales

### Gestion des Utilisateurs

- 15 rôles prédéfinis (Directeur Scientifique, Botaniste, etc.)
- Permissions granulaires par module
- Journal des connexions
- Sessions sécurisées

### Ressources Humaines

- Fiches employés complètes
- Gestion des contrats et salaires
- Primes (terrain, mer, risques)
- Congés et planning
- Évaluations

### Comptabilité & Finances

- Budgets annuels avec allocations
- Suivi des subventions
- Dépenses par projet
- Factures et paiements
- Rapports financiers

### Matériel & Logistique

- Inventaire complet (Véhicules, Bateau, Équipements scientifiques, etc.)
- Suivi de maintenance
- Affectation par mission
- Durée de vie et renouvellement

### Missions & Campagnes

- Création et gestion de missions
- Affectation d'équipes
- Gestion du matériel
- Rapports post-mission
- Géolocalisation GPS

### Base de Données Scientifique

- Catalogue des espèces (Flore/Faune terrestre/marine)
- Statuts UICN
- Observations et localisations
- Photos et références scientifiques

### Données Environnementales

- Qualité de l'eau (Mer, Source, Barrage)
- Qualité de l'air
- Données climatiques
- Géologie & sols
- Données de capteurs

### SIG & Cartographie

- Cartes interactives (Leaflet)
- Couches multiples (Habitats, Espèces, Stations, etc.)
- Import/Export GeoJSON
- Visualisation spatio-temporelle

### Gestion Documentaire

- Rapports scientifiques et administratifs
- Données brutes
- Publications
- Versioning
- Droits d'accès

### Édition & Publication

- Livre annuel
- Génération de graphiques
- Exports PDF/Web
- Archivage

## 🛠️ Technologies Utilisées

- **Frontend** : Next.js 14, React, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes, Prisma ORM
- **Base de données** : PostgreSQL + PostGIS
- **Authentification** : NextAuth.js
- **Cartographie** : Leaflet, React Leaflet
- **Graphiques** : Recharts
- **Formulaires** : React Hook Form

## 📝 Licence

Ce projet est privé et destiné à un usage interne.
