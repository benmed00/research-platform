# Guide de Démarrage Rapide

## 🚀 Installation et Configuration

### 1. Prérequis
- Node.js 18 ou supérieur
- PostgreSQL 14 ou supérieur
- npm ou yarn

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration de la base de données

1. Créer une base de données PostgreSQL :

```sql
CREATE DATABASE research_platform;
```

2. (Optionnel) Installer PostGIS pour les fonctionnalités géospatiales :

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

3. Créer le fichier `.env` à la racine du projet :

```bash
# Créer le fichier .env manuellement
```

4. Configurer les variables d'environnement dans `.env` :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/research_platform?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-aleatoire-ici"
```

Pour générer un secret aléatoire :

```bash
openssl rand -base64 32
```

### 4. Initialisation de la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables dans la base de données
npm run db:push

# Charger les données initiales (utilisateur admin)
npm run db:seed
```

### 5. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔐 Connexion initiale

Après le seed, vous pouvez vous connecter avec :
- **Email** : `admin@research-platform.ma`
- **Mot de passe** : `admin123`

⚠️ **Important** : Changez le mot de passe après la première connexion !

## 📋 Commandes utiles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint

# Prisma Studio (interface graphique pour la base de données)
npm run db:studio

# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# Réinitialiser la base de données (attention : supprime toutes les données)
npm run db:push -- --force-reset
```

## 🎯 Prochaines étapes

1. **Créer des utilisateurs** : `/dashboard/users/new`
2. **Configurer le budget annuel** : `/dashboard/finance/budgets/new`
3. **Ajouter des employés** : `/dashboard/rh/employees/new`
4. **Enregistrer des équipements** : `/dashboard/equipment/new`
5. **Créer une mission** : `/dashboard/missions/new`
6. **Ajouter des espèces** : `/dashboard/species/new`

## 📚 Documentation

- [Architecture](./ARCHITECTURE.md) - Vue d'ensemble de l'architecture
- [README](./README.md) - Documentation générale

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifiez que PostgreSQL est démarré
- Vérifiez les credentials dans `.env`
- Vérifiez que la base de données existe

### Erreur "Module not found"
- Supprimez `node_modules` et `package-lock.json`
- Exécutez `npm install` à nouveau

### Erreur Prisma
- Exécutez `npm run db:generate`
- Vérifiez que la base de données est accessible

## 💡 Conseils

- Utilisez Prisma Studio pour visualiser et modifier les données : `npm run db:studio`
- Les logs d'audit sont enregistrés automatiquement pour toutes les actions importantes
- Les mots de passe sont hashés avec bcrypt (10 rounds)
- Les sessions sont stockées en JWT (stateless)

