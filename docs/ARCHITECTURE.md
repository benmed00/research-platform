# Architecture de la Plateforme de Recherche

## 🏗️ Vue d'ensemble

Cette plateforme est construite avec une architecture moderne, modulaire et évolutive pour servir de système central pour un centre de recherche environnemental et biodiversité.

## 📦 Stack Technologique

### Frontend
- **Next.js 14** avec App Router - Framework React moderne
- **TypeScript** - Typage statique pour la sécurité du code
- **Tailwind CSS** - Framework CSS utilitaire
- **Lucide React** - Icônes modernes
- **React Hook Form** - Gestion des formulaires
- **Recharts** - Graphiques et visualisations

### Backend
- **Next.js API Routes** - API REST intégrée
- **Prisma ORM** - Gestion de la base de données
- **NextAuth.js** - Authentification et sessions
- **bcryptjs** - Hashage des mots de passe

### Base de Données
- **PostgreSQL** - Base de données relationnelle
- **PostGIS** (à configurer) - Extension géospatiale pour les données SIG

### Cartographie
- **Leaflet** - Bibliothèque de cartographie interactive
- **React Leaflet** - Composants React pour Leaflet

## 📁 Structure du Projet

```
research-platform/
├── prisma/
│   ├── schema.prisma          # Schéma de base de données
│   └── seed.ts                # Données initiales
├── src/
│   ├── app/
│   │   ├── api/               # Routes API
│   │   ├── auth/              # Pages d'authentification
│   │   ├── dashboard/         # Pages du tableau de bord
│   │   └── layout.tsx         # Layout principal
│   ├── components/
│   │   ├── layout/            # Composants de layout
│   │   └── ui/                # Composants UI réutilisables
│   ├── lib/
│   │   ├── auth.ts            # Configuration NextAuth
│   │   ├── prisma.ts          # Client Prisma
│   │   └── utils.ts           # Utilitaires
│   └── types/                 # Types TypeScript
└── public/                    # Fichiers statiques
```

## 🔐 Système d'Authentification

- Authentification par email/mot de passe
- Sessions JWT sécurisées
- Journal des connexions
- Gestion des rôles et permissions granulaires

## 👥 Rôles Utilisateurs

15 rôles prédéfinis :
- Directeur Scientifique
- Directeur Administratif & Financier
- Botaniste
- Zoologiste Terrestre
- Biologiste Marin
- Hydrobiologiste
- Géologue
- Climatologue
- Data Scientist / SIG
- Ingénieur Plateformes
- Technicien Laboratoire
- Technicien Terrain
- Marin / Pilote Bateau
- Logisticien
- Communication / Édition

## 📊 Modules Fonctionnels

### 1. Gestion des Utilisateurs
- CRUD utilisateurs
- Gestion des rôles
- Permissions par module
- Journal des connexions

### 2. Ressources Humaines
- Fiches employés
- Contrats
- Salaires et primes
- Congés
- Évaluations

### 3. Comptabilité & Finances
- Budgets annuels
- Subventions
- Dépenses
- Factures
- Paiements

### 4. Matériel & Logistique
- Inventaire équipements
- Catégories (Véhicules, Bateau, Scientifique, etc.)
- Maintenance
- Affectation missions

### 5. Missions & Campagnes
- Création missions
- Gestion équipes
- Affectation matériel
- Rapports post-mission
- Géolocalisation GPS

### 6. Base de Données Scientifique
- Catalogue espèces (Flore/Faune)
- Statuts UICN
- Observations
- Localisations géographiques
- Photos et références

### 7. Données Environnementales
- Qualité de l'eau (Mer, Source, Barrage)
- Qualité de l'air
- Données climatiques
- Géologie & sols
- Données capteurs

### 8. SIG & Cartographie
- Cartes interactives
- Couches multiples
- Import/Export GeoJSON
- Visualisation spatio-temporelle

### 9. Gestion Documentaire
- Rapports scientifiques
- Rapports administratifs
- Données brutes
- Publications
- Versioning

### 10. Édition & Publication
- Livre annuel
- Génération graphiques
- Exports PDF/Web
- Archivage

## 🗄️ Modèle de Données

Le schéma Prisma définit plus de 30 modèles couvrant tous les aspects de la plateforme :
- Utilisateurs et sessions
- Employés et RH
- Finances
- Équipements
- Missions
- Espèces
- Données environnementales
- Documents
- Publications
- Audit logs

## 🔒 Sécurité

- Hashage des mots de passe (bcrypt)
- Sessions sécurisées (JWT)
- Journal d'audit des actions
- Permissions granulaires
- Validation des données (Zod)

## 🚀 Déploiement

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- PostGIS (pour les fonctionnalités SIG)

### Installation

```bash
npm install
# Créer le fichier .env avec DATABASE_URL et NEXTAUTH_SECRET
npm run db:push
npm run db:seed
npm run dev
```

## 📈 Évolutivité

La plateforme est conçue pour :
- Gérer des milliers d'enregistrements
- S'adapter à de nouveaux modules
- Intégrer des APIs externes
- S'étendre à d'autres régions
- Ajouter des fonctionnalités de science citoyenne

## 🔄 Prochaines Étapes

1. Configuration PostGIS pour les données géospatiales
2. Implémentation complète de Leaflet pour la cartographie
3. Système de permissions avancé par module
4. Tableaux de bord personnalisés par rôle
5. Export PDF/Excel des rapports
6. Upload et gestion de fichiers
7. Notifications en temps réel
8. API publique pour l'interopérabilité

