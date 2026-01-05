# Notes sur Session et Notifications

## 📋 Session - Pourquoi c'est vide ?

**C'est normal !** Le modèle `Session` dans Prisma existe mais reste vide car :

1. **NextAuth utilise la stratégie JWT** (définie dans `src/lib/auth.ts` ligne 85)
2. Avec JWT, les sessions sont stockées dans des **cookies signés**, pas en base de données
3. Le modèle `Session` est présent pour compatibilité, mais n'est utilisé que si vous passez à la stratégie `database`

### Pour utiliser Session en base de données :

Si vous souhaitez utiliser le modèle `Session` en base, vous devez :

1. Installer `@next-auth/prisma-adapter` :
   ```bash
   npm install @next-auth/prisma-adapter
   ```

2. Modifier `src/lib/auth.ts` :
   ```typescript
   import { PrismaAdapter } from "@next-auth/prisma-adapter";
   import { prisma } from "@/lib/prisma";
   
   export const authOptions: NextAuthOptions = {
     adapter: PrismaAdapter(prisma),
     // ... reste de la config
     session: {
       strategy: "database", // Au lieu de "jwt"
     },
   };
   ```

**Note** : La stratégie JWT est généralement préférée car elle est plus performante et ne nécessite pas de requêtes DB à chaque requête.

## 🔔 Notifications - Maintenant avec données !

✅ **135 notifications créées** lors du seed (3 par utilisateur)

### Vérifier les notifications :

1. **Via l'interface** : Allez sur `/dashboard/notifications`
2. **Via Prisma Studio** : `npm run db:studio` → Table `Notification`
3. **Via l'API** : `GET /api/notifications`

### Créer des notifications de test :

1. **Via le bouton** : Page `/dashboard/notifications` → "Créer des notifications de test"
2. **Via l'API** : `POST /api/notifications/test`
3. **Automatiquement** : Lors de la création de missions, espèces, etc.

### Notifications automatiques :

Les notifications sont créées automatiquement lors de :
- ✅ Création d'une nouvelle mission → Notifie les admins
- ✅ Mission terminée → Notifie le créateur et l'équipe
- ✅ Nouvelle espèce ajoutée → Notifie les scientifiques

## 📊 Résumé

- **Session** : Vide = Normal (JWT strategy)
- **Notifications** : 135 créées = ✅ Fonctionnel

