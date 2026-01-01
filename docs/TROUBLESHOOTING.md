# Guide de Dépannage

## ❌ Erreur : "The table does not exist in the current database"

### Symptôme
```
Invalid `prisma.user.findMany()` invocation:
The table `(not available)` does not exist in the current database.
```

### Causes possibles
1. Les tables n'ont pas été créées dans PostgreSQL
2. Le Prisma Client est désynchronisé
3. Le fichier query_engine est verrouillé par un processus

### Solution

#### Étape 1 : Arrêter le serveur Next.js
Si `npm run dev` est en cours d'exécution, arrêtez-le (Ctrl+C dans le terminal).

#### Étape 2 : Vérifier que la base de données est accessible
Assurez-vous que PostgreSQL est démarré et que la base de données `research_platform` existe.

#### Étape 3 : Créer/synchroniser les tables
```bash
npm run db:push
```

#### Étape 4 : Régénérer le Prisma Client
```bash
npm run db:generate
```

**Note** : Si vous obtenez une erreur EPERM (file locked), fermez tous les processus qui pourraient utiliser le fichier :
- Serveur Next.js (`npm run dev`)
- Prisma Studio (`npm run db:studio`)
- Autres terminaux

#### Étape 5 : Vérifier que les tables existent
```bash
npm run db:studio
```

Dans Prisma Studio, vous devriez voir toutes les tables listées.

#### Étape 6 : Si nécessaire, réinitialiser complètement
```bash
npm run db:reset
```

Cela va :
- Supprimer toutes les données
- Réappliquer toutes les migrations
- Exécuter le seed automatiquement

#### Étape 7 : Redémarrer le serveur
```bash
npm run dev
```

## ❌ Erreur EPERM lors de `prisma generate`

### Symptôme
```
EPERM: operation not permitted, rename 'query_engine-windows.dll.node.tmp...'
```

### Solution Rapide (Windows PowerShell)

Utilisez le script automatique :

```powershell
.\scripts\fix-prisma-client.ps1
```

Ce script va :
1. Détecter et arrêter automatiquement les processus Node.js
2. Supprimer le dossier `.prisma` verrouillé
3. Régénérer le Prisma Client

### Solution Manuelle

1. **Arrêter tous les processus Node.js** :
   - Fermez le serveur Next.js (Ctrl+C dans le terminal)
   - Fermez Prisma Studio
   - Vérifiez dans le gestionnaire de tâches Windows qu'aucun processus `node.exe` n'utilise le fichier

2. **Forcer la régénération** :
   ```powershell
   # Supprimer le dossier .prisma
   Remove-Item -Recurse -Force node_modules\.prisma
   # Puis régénérer
   npm run db:generate
   ```

3. **Alternative avec Git Bash/WSL** :
   ```bash
   # Supprimer le dossier .prisma
   rm -rf node_modules/.prisma
   # Puis régénérer
   npm run db:generate
   ```

## ❌ Les données ne s'affichent pas après le seed

### Vérifications
1. Le seed s'est-il terminé sans erreur ?
   ```bash
   npm run db:seed
   ```

2. Vérifier dans Prisma Studio :
   ```bash
   npm run db:studio
   ```

3. Vérifier directement dans PostgreSQL :
   ```sql
   SELECT COUNT(*) FROM "User";
   SELECT COUNT(*) FROM "Mission";
   ```

## ❌ Erreur de connexion à la base de données

### Vérifier `.env`
Assurez-vous que le fichier `.env` contient :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/research_platform?schema=public"
```

### Tester la connexion
```bash
# Avec psql
psql -U postgres -d research_platform -c "SELECT 1;"

# Ou vérifier que PostgreSQL tourne
# Windows Services : chercher "postgresql"
```

## ❌ Le serveur Next.js ne démarre pas

### Nettoyer le cache
```bash
# Supprimer le cache Next.js
rm -rf .next

# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install
```

## ✅ Vérification rapide

Pour vérifier que tout fonctionne :

```bash
# 1. Vérifier que PostgreSQL tourne
# (Windows Services)

# 2. Générer le client
npm run db:generate

# 3. Synchroniser les tables
npm run db:push

# 4. Vérifier avec Prisma Studio
npm run db:studio
# Devrait afficher toutes les tables

# 5. Lancer le serveur
npm run dev
```

## 🔧 Commandes de récupération complète

Si rien ne fonctionne, réinitialiser complètement :

```bash
# 1. Arrêter tous les processus Node.js

# 2. Nettoyer
rm -rf .next
rm -rf node_modules/.prisma

# 3. Réinstaller
npm install

# 4. Régénérer le client
npm run db:generate

# 5. Créer/synchroniser les tables
npm run db:push

# 6. Vérifier
npm run db:studio

# 7. Seed
npm run db:seed

# 8. Démarrer
npm run dev
```

---

**Si le problème persiste**, vérifiez :
- Que PostgreSQL est bien démarré
- Que la base de données `research_platform` existe
- Que les identifiants dans `.env` sont corrects
- Que le port PostgreSQL (5432) n'est pas utilisé par autre chose

