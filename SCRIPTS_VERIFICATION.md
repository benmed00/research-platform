# Vérification des Scripts package.json

## ✅ Scripts Vérifiés et Fonctionnels

### Scripts de Développement
- ✅ **`npm run dev`** - Lance le serveur de développement Next.js
  - Commande: `next dev`
  - Port par défaut: 3000
  - Hot reload activé

- ✅ **`npm run build`** - Compile l'application pour la production
  - Commande: `next build`
  - Génère les fichiers optimisés dans `.next/`

- ✅ **`npm run start`** - Lance l'application en mode production
  - Commande: `next start`
  - Nécessite un build préalable (`npm run build`)

- ✅ **`npm run lint`** - Vérifie le code avec ESLint
  - Commande: `next lint`
  - Utilise la configuration Next.js

### Scripts Base de Données

- ✅ **`npm run db:generate`** - Génère le client Prisma
  - Commande: `prisma generate`
  - Crée les types TypeScript à partir du schema
  - **Important**: À exécuter après chaque modification du schema

- ✅ **`npm run db:push`** - Synchronise le schema avec la base de données
  - Commande: `prisma db push`
  - Crée/modifie les tables sans migrations
  - **Usage**: Développement rapide

- ✅ **`npm run db:migrate`** - Crée et applique une migration
  - Commande: `prisma migrate dev`
  - Crée un fichier de migration
  - **Usage**: Production et versioning des changements DB

- ✅ **`npm run db:studio`** - Ouvre Prisma Studio (interface graphique)
  - Commande: `prisma studio`
  - Interface web pour visualiser/modifier les données
  - Port par défaut: 5555

- ✅ **`npm run db:seed`** - Remplit la base avec des données initiales
  - Commande: `ts-node --project tsconfig.seed.json prisma/seed.ts`
  - Crée l'utilisateur admin et le budget initial
  - **Usage**: Après `db:push` ou `db:migrate`

- ✅ **`npm run db:reset`** - Réinitialise la base de données
  - Commande: `prisma migrate reset`
  - Supprime toutes les données et réapplique les migrations
  - **Attention**: Destructif !

### Scripts Automatiques

- ✅ **`postinstall`** - Exécuté automatiquement après `npm install`
  - Commande: `prisma generate`
  - Génère automatiquement le client Prisma

## 📋 Ordre d'Exécution Recommandé

### Première Installation
```bash
# 1. Installer les dépendances
npm install

# 2. Configurer .env avec DATABASE_URL et NEXTAUTH_SECRET

# 3. Générer le client Prisma (fait automatiquement par postinstall)
npm run db:generate

# 4. Créer les tables dans la base de données
npm run db:push

# 5. Remplir avec les données initiales
npm run db:seed

# 6. Lancer le serveur de développement
npm run dev
```

### Développement Quotidien
```bash
# Lancer le serveur
npm run dev

# Si modification du schema Prisma
npm run db:generate
npm run db:push
```

### Production
```bash
# Build de production
npm run build

# Lancer en production
npm run start
```

## 🔧 Configuration Prisma Seed

Le seed est configuré dans `package.json` sous la section `prisma`:

```json
"prisma": {
  "seed": "ts-node --project tsconfig.seed.json prisma/seed.ts"
}
```

Cela permet à Prisma d'exécuter automatiquement le seed lors de `prisma migrate reset`.

## ⚠️ Notes Importantes

1. **db:push vs db:migrate**
   - `db:push`: Pour développement rapide, pas de fichiers de migration
   - `db:migrate`: Pour production, crée des fichiers de migration versionnés

2. **db:seed**
   - Nécessite que la base de données soit créée et les tables existent
   - Peut être exécuté plusieurs fois (utilise `upsert`)

3. **postinstall**
   - S'exécute automatiquement après chaque `npm install`
   - Génère le client Prisma pour éviter les erreurs d'import

## ✅ Tous les Scripts sont Fonctionnels

Tous les scripts ont été vérifiés et sont correctement configurés pour fonctionner avec :
- Next.js 14
- Prisma 5
- TypeScript 5
- Node.js 18+

