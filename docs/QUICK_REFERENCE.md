# Guide de Référence Rapide - Plan d'Implémentation

## 🚀 Démarrage Rapide

### Ordre d'Implémentation Recommandé

1. **API Routes Individuelles** (8 routes)
   - `/api/employees/[id]` → `/api/missions/[id]` → `/api/equipment/[id]` → `/api/species/[id]`
   - `/api/documents` (compléter) → `/api/documents/[id]` → `/api/publications` → `/api/publications/[id]`

2. **Pages de Détail** (6 pages)
   - Vérifier toutes les pages `[id]/page.tsx` existantes
   - S'assurer qu'elles utilisent les nouvelles API routes

3. **Pages d'Édition** (6 pages)
   - Vérifier toutes les pages `[id]/edit/page.tsx` existantes
   - Créer `/dashboard/documents/[id]/edit/page.tsx`
   - Créer `/dashboard/publications/[id]/edit/page.tsx`

4. **Fonctionnalités Avancées**
   - Export PDF/Excel
   - Leaflet avec données réelles
   - Recherche avancée
   - Graphiques Recharts

## 📋 Template API Route [id]

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { entitySchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const entity = await prisma.entity.findUnique({
      where: { id: params.id },
      include: {
        // Relations nécessaires
      },
    });

    if (!entity) {
      return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    }

    return NextResponse.json(entity);
  } catch (error) {
    console.error("Error fetching entity:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const validatedData = entitySchema.parse(data);

    const entity = await prisma.entity.update({
      where: { id: params.id },
      data: {
        // Mapper validatedData
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "Entity",
        entityId: entity.id,
        changes: JSON.stringify(validatedData),
      },
    });

    return NextResponse.json(entity);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating entity:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await prisma.entity.delete({
      where: { id: params.id },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entity: "Entity",
        entityId: params.id,
        changes: JSON.stringify({ deleted: true }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting entity:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
```

## 📝 Schémas de Validation à Ajouter

Dans `/src/lib/validations.ts` :

```typescript
export const documentSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  type: z.enum([
    "RAPPORT_SCIENTIFIQUE",
    "RAPPORT_ADMINISTRATIF",
    "DONNEE_BRUTE",
    "PUBLICATION",
    "AUTRE",
  ]),
  description: z.string().optional(),
  missionId: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export const publicationSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  type: z.enum(["LIVRE_ANNUEL", "ARTICLE", "RAPPORT", "AUTRE"]),
  year: z.string().refine(
    (val) => {
      const year = parseInt(val);
      return !isNaN(year) && year >= 2020 && year <= 2100;
    },
    { message: "L'année doit être entre 2020 et 2100" }
  ),
  status: z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED"]).default("DRAFT"),
  description: z.string().optional(),
});
```

## 🎯 Checklist par Tâche

### Pour chaque API Route [id] :
- [ ] GET avec toutes les relations nécessaires
- [ ] PUT avec validation Zod
- [ ] DELETE avec vérification des dépendances
- [ ] Gestion des erreurs (404, 401, 500)
- [ ] Audit log pour toutes les actions
- [ ] Test manuel avec Postman/Thunder Client

### Pour chaque Page de Détail :
- [ ] Récupération des données via API
- [ ] Affichage de toutes les informations
- [ ] Affichage des relations
- [ ] Bouton "Modifier" vers page d'édition
- [ ] Gestion des états de chargement
- [ ] Gestion des erreurs

### Pour chaque Page d'Édition :
- [ ] Formulaire pré-rempli avec données existantes
- [ ] Validation avec react-hook-form + Zod
- [ ] Soumission vers API PUT
- [ ] Redirection après succès
- [ ] Gestion des erreurs
- [ ] Messages de confirmation

## 🔍 Vérification des Pages Existantes

Pages à vérifier et compléter :

### Pages de Détail
- [x] `/dashboard/equipment/[id]/page.tsx` - Existe
- [x] `/dashboard/missions/[id]/page.tsx` - Existe
- [x] `/dashboard/species/[id]/page.tsx` - Existe
- [x] `/dashboard/rh/employees/[id]/page.tsx` - Existe
- [x] `/dashboard/documents/[id]/page.tsx` - Existe
- [x] `/dashboard/publications/[id]/page.tsx` - Existe

### Pages d'Édition
- [x] `/dashboard/equipment/[id]/edit/page.tsx` - Existe
- [x] `/dashboard/missions/[id]/edit/page.tsx` - Existe
- [x] `/dashboard/species/[id]/edit/page.tsx` - Existe
- [x] `/dashboard/rh/employees/[id]/edit/page.tsx` - Existe
- [ ] `/dashboard/documents/[id]/edit/page.tsx` - **À CRÉER**
- [ ] `/dashboard/publications/[id]/edit/page.tsx` - **À CRÉER**

## 📊 Modèles Prisma à Consulter

Pour comprendre les relations :

- `Employee` → `User`, `Salary`, `Leave`, `Evaluation`
- `Mission` → `MissionTeam`, `MissionEquipment`, `MissionReport`, `Document`
- `Equipment` → `MaintenanceRecord`, `MissionEquipment`
- `Species` → `SpeciesObservation`, `SpeciesLocation`, `SpeciesPhoto`, `SpeciesReference`
- `Document` → `User` (author), `Mission`
- `Publication` → `PublicationChapter`, `User` (author)

## 🛠️ Commandes Utiles

```bash
# Générer le client Prisma après modifications
npm run db:generate

# Appliquer les migrations
npm run db:push

# Lancer le serveur de développement
npm run dev

# Linter
npm run lint

# Ouvrir Prisma Studio (pour voir les données)
npm run db:studio
```

## 📚 Ressources

- **Documentation complète** : `IMPLEMENTATION_PLAN.md`
- **Architecture** : `ARCHITECTURE.md`
- **État actuel** : `IMPLEMENTATION_STATUS.md`
- **Fonctionnalités** : `FEATURES.md`

## ⚡ Points d'Attention

1. **Authentification** : Toutes les API routes doivent vérifier la session
2. **Validation** : Toujours utiliser Zod pour valider les données
3. **Audit Log** : Créer un log pour chaque action (CREATE, UPDATE, DELETE)
4. **Gestion d'erreurs** : Toujours gérer les cas d'erreur (404, 401, 500)
5. **Relations** : Inclure les relations nécessaires dans les requêtes Prisma
6. **Permissions** : Vérifier les permissions selon le rôle utilisateur (futur)

## 🎨 Patterns à Suivre

### Pattern API Route
1. Vérifier session
2. Valider les données (si POST/PUT)
3. Exécuter l'opération Prisma
4. Créer audit log
5. Retourner la réponse

### Pattern Page de Détail
1. Récupérer l'ID depuis les params
2. Fetch des données depuis l'API
3. Afficher avec gestion des états (loading, error, success)
4. Bouton vers page d'édition

### Pattern Page d'Édition
1. Récupérer l'ID depuis les params
2. Fetch des données existantes
3. Formulaire pré-rempli avec react-hook-form
4. Validation avec Zod
5. Soumission vers API PUT
6. Redirection après succès

---

**Dernière mise à jour** : Voir `IMPLEMENTATION_PLAN.md` pour les détails complets

