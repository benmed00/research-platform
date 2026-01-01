# Plan d'Implémentation - Plateforme de Recherche Environnementale

## 📋 Vue d'Ensemble

Ce document détaille le plan d'implémentation pour compléter toutes les fonctionnalités manquantes de la plateforme, organisées par priorité et dépendances.

**Estimation totale** : ~40-50 heures de développement

---

## 🎯 Phase 1 : Fondations & API Routes Critiques (Priorité Haute)

**Durée estimée** : 12-15 heures  
**Objectif** : Compléter les API routes manquantes pour permettre le CRUD complet sur toutes les entités

### 1.1 API Routes pour Entités Individuelles

#### `/api/employees/[id]/route.ts` (2-3h)
- [ ] **GET** : Récupérer un employé avec toutes ses relations (user, salaries, leaves, evaluations)
- [ ] **PUT** : Mettre à jour un employé (validation avec `employeeSchema`)
- [ ] **DELETE** : Supprimer un employé (soft delete ou hard delete selon règles métier)
- [ ] Gestion des erreurs (404 si non trouvé)
- [ ] Audit log pour toutes les actions

**Dépendances** : `employeeSchema` existe déjà dans `validations.ts`

#### `/api/missions/[id]/route.ts` (2-3h)
- [ ] **GET** : Récupérer une mission avec équipe, équipements, rapports
- [ ] **PUT** : Mettre à jour une mission (validation avec `missionSchema`)
- [ ] **DELETE** : Supprimer une mission (vérifier les dépendances)
- [ ] Gestion des relations (MissionTeam, MissionEquipment)
- [ ] Audit log

**Dépendances** : `missionSchema` existe déjà

#### `/api/equipment/[id]/route.ts` (2h)
- [ ] **GET** : Récupérer un équipement avec historique de maintenance
- [ ] **PUT** : Mettre à jour un équipement (validation avec `equipmentSchema`)
- [ ] **DELETE** : Supprimer un équipement (vérifier les affectations aux missions)
- [ ] Audit log

**Dépendances** : `equipmentSchema` existe déjà

#### `/api/species/[id]/route.ts` (2-3h)
- [ ] **GET** : Récupérer une espèce avec observations, localisations, photos, références
- [ ] **PUT** : Mettre à jour une espèce (validation avec `speciesSchema`)
- [ ] **DELETE** : Supprimer une espèce (soft delete recommandé pour données scientifiques)
- [ ] Gestion des relations (SpeciesObservation, SpeciesLocation, etc.)
- [ ] Audit log

**Dépendances** : `speciesSchema` existe déjà

### 1.2 API Routes Documents (Compléter)

#### `/api/documents/route.ts` - Compléter (1-2h)
- [x] **POST** : Déjà implémenté ✅
- [x] **GET** : Déjà implémenté ✅
- [ ] **PUT** : Mettre à jour un document (métadonnées uniquement, pas le fichier)
- [ ] **DELETE** : Supprimer un document (supprimer le fichier physique aussi)
- [ ] Validation avec Zod schema (à créer : `documentSchema`)

#### `/api/documents/[id]/route.ts` (1-2h)
- [ ] **GET** : Récupérer un document avec auteur et mission
- [ ] **PUT** : Mettre à jour les métadonnées d'un document
- [ ] **DELETE** : Supprimer un document et son fichier
- [ ] Gestion des permissions (auteur ou admin uniquement)

### 1.3 API Routes Publications

#### `/api/publications/route.ts` (2-3h)
- [ ] **POST** : Créer une publication
- [ ] **GET** : Lister les publications avec filtres (année, statut, type)
- [ ] Validation avec Zod schema (à créer : `publicationSchema`)
- [ ] Gestion des chapitres (PublicationChapter)

#### `/api/publications/[id]/route.ts` (1-2h)
- [ ] **GET** : Récupérer une publication avec chapitres
- [ ] **PUT** : Mettre à jour une publication
- [ ] **DELETE** : Supprimer une publication
- [ ] Gestion des chapitres (CRUD)

**Dépendances** : Créer `publicationSchema` dans `validations.ts`

---

## 🎨 Phase 2 : Pages de Détail et Édition (Priorité Haute)

**Durée estimée** : 10-12 heures  
**Objectif** : Créer toutes les pages de visualisation et édition manquantes

### 2.1 Pages de Détail (View)

#### `/dashboard/employees/[id]/page.tsx` (1h)
- [ ] Afficher les informations complètes de l'employé
- [ ] Historique des salaires
- [ ] Historique des congés
- [ ] Évaluations
- [ ] Contrats
- [ ] Bouton "Modifier" vers la page d'édition

**Dépendances** : API `/api/employees/[id]` GET

#### `/dashboard/missions/[id]/page.tsx` (1h)
- [x] Existe déjà, vérifier si complet
- [ ] Afficher équipe assignée
- [ ] Afficher équipements assignés
- [ ] Afficher rapports de mission
- [ ] Carte avec localisation GPS

**Dépendances** : API `/api/missions/[id]` GET

#### `/dashboard/equipment/[id]/page.tsx` (1h)
- [x] Existe déjà, vérifier si complet
- [ ] Historique de maintenance
- [ ] Missions où l'équipement a été utilisé
- [ ] Statut actuel

**Dépendances** : API `/api/equipment/[id]` GET

#### `/dashboard/species/[id]/page.tsx` (1-2h)
- [x] Existe déjà, vérifier si complet
- [ ] Observations détaillées
- [ ] Localisations sur carte
- [ ] Photos
- [ ] Références scientifiques

**Dépendances** : API `/api/species/[id]` GET

#### `/dashboard/documents/[id]/page.tsx` (1h)
- [x] Existe déjà, vérifier si complet
- [ ] Afficher métadonnées
- [ ] Lien de téléchargement
- [ ] Versioning si applicable
- [ ] Bouton "Modifier"

**Dépendances** : API `/api/documents/[id]` GET

#### `/dashboard/publications/[id]/page.tsx` (1h)
- [x] Existe déjà, vérifier si complet
- [ ] Afficher chapitres
- [ ] Statut de publication
- [ ] Bouton "Modifier"

**Dépendances** : API `/api/publications/[id]` GET

### 2.2 Pages d'Édition

#### `/dashboard/employees/[id]/edit/page.tsx` (1-2h)
- [x] Existe déjà, vérifier si complet
- [ ] Formulaire pré-rempli avec données existantes
- [ ] Validation avec react-hook-form + Zod
- [ ] Soumission vers API PUT
- [ ] Gestion des erreurs

**Dépendances** : API `/api/employees/[id]` GET et PUT

#### `/dashboard/missions/[id]/edit/page.tsx` (1-2h)
- [x] Existe déjà, vérifier si complet
- [ ] Formulaire complet avec équipe et équipements
- [ ] Validation
- [ ] Soumission

**Dépendances** : API `/api/missions/[id]` GET et PUT

#### `/dashboard/equipment/[id]/edit/page.tsx` (1h)
- [x] Existe déjà, vérifier si complet
- [ ] Formulaire pré-rempli
- [ ] Validation
- [ ] Soumission

**Dépendances** : API `/api/equipment/[id]` GET et PUT

#### `/dashboard/species/[id]/edit/page.tsx` (1-2h)
- [x] Existe déjà, vérifier si complet
- [ ] Formulaire complet
- [ ] Gestion des observations, localisations, photos
- [ ] Validation
- [ ] Soumission

**Dépendances** : API `/api/species/[id]` GET et PUT

#### `/dashboard/documents/[id]/edit/page.tsx` (1h) - **NOUVEAU**
- [ ] Créer la page d'édition
- [ ] Formulaire pour métadonnées uniquement (pas de changement de fichier)
- [ ] Validation
- [ ] Soumission

**Dépendances** : API `/api/documents/[id]` GET et PUT

#### `/dashboard/publications/[id]/edit/page.tsx` (1-2h) - **NOUVEAU**
- [ ] Créer la page d'édition
- [ ] Formulaire complet avec gestion des chapitres
- [ ] Validation
- [ ] Soumission

**Dépendances** : API `/api/publications/[id]` GET et PUT

---

## 📤 Phase 3 : Fonctionnalités Avancées (Priorité Moyenne)

**Durée estimée** : 12-15 heures

### 3.1 Export PDF/Excel (3-4h)

#### Export Excel
- [ ] Créer `/api/export/excel/route.ts`
- [ ] Exporter listes (employés, missions, espèces, etc.)
- [ ] Utiliser la bibliothèque `xlsx` (déjà installée)
- [ ] Boutons d'export sur les pages de liste
- [ ] Options de filtres pour l'export

#### Export PDF
- [ ] Créer `/api/export/pdf/route.ts`
- [ ] Utiliser `jspdf` (déjà installée)
- [ ] Générer rapports formatés
- [ ] Export de documents individuels
- [ ] Export de rapports de mission

**Dépendances** : Bibliothèques déjà installées (`xlsx`, `jspdf`)

### 3.2 Intégration Leaflet Complète (3-4h)

#### `/dashboard/maps/page.tsx` - Améliorer
- [ ] Charger les données réelles depuis la base
- [ ] Afficher les espèces sur la carte (SpeciesLocation)
- [ ] Afficher les missions (Mission avec GPS)
- [ ] Afficher les stations environnementales
- [ ] Couches interactives (toggle on/off)
- [ ] Popups avec informations détaillées
- [ ] Légende
- [ ] Export GeoJSON

**Dépendances** : 
- API routes pour récupérer données géospatiales
- Composant `LeafletMap` existe déjà

### 3.3 Recherche Avancée et Filtres (3-4h)

#### Composant de Recherche Avancée
- [ ] Améliorer `/components/search/advanced-search.tsx`
- [ ] Filtres multiples par entité
- [ ] Filtres par date (range)
- [ ] Filtres par statut/type
- [ ] Recherche full-text
- [ ] Sauvegarde des filtres (localStorage)
- [ ] URL params pour partage de recherches

#### Intégration dans les pages
- [ ] Ajouter recherche avancée sur toutes les pages de liste
- [ ] Filtres en temps réel
- [ ] Tri multi-colonnes
- [ ] Pagination améliorée

**Dépendances** : 
- Composant `advanced-search.tsx` existe déjà
- Composant `filter-bar.tsx` existe déjà

### 3.4 Graphiques avec Recharts (2-3h)

#### Composants de Graphiques
- [ ] Créer `/components/charts/` avec composants réutilisables
- [ ] Graphiques pour finances (dépenses, budgets)
- [ ] Graphiques pour données environnementales (tendances)
- [ ] Graphiques pour missions (statistiques)
- [ ] Graphiques pour espèces (distribution)
- [ ] Intégrer dans les dashboards

**Dépendances** : 
- Bibliothèque `recharts` déjà installée
- Composant `finance-charts.tsx` existe déjà

---

## ✨ Phase 4 : Améliorations UX (Priorité Basse)

**Durée estimée** : 6-8 heures

### 4.1 Tableaux de Bord Personnalisés par Rôle (2-3h)

#### Dashboard Personnalisé
- [ ] Créer composant `/components/dashboard/role-dashboard.tsx`
- [ ] Logique de personnalisation par rôle
- [ ] Widgets configurables
- [ ] Statistiques pertinentes par rôle
- [ ] Actions rapides par rôle

**Dépendances** : Système de rôles existe déjà

### 4.2 Calendrier pour Missions et Congés (2-3h)

#### Composant Calendrier
- [ ] Installer bibliothèque calendrier (react-big-calendar ou fullcalendar)
- [ ] Créer `/components/calendar/calendar-view.tsx`
- [ ] Afficher missions sur calendrier
- [ ] Afficher congés sur calendrier
- [ ] Vue mensuelle, hebdomadaire, quotidienne
- [ ] Création rapide depuis le calendrier

**Dépendances** : API routes pour missions et congés

### 4.3 Mode Sombre (1-2h)

#### Thème Sombre
- [ ] Configurer Tailwind pour mode sombre
- [ ] Créer toggle dans le header
- [ ] Sauvegarder préférence (localStorage)
- [ ] Appliquer classes dark: sur tous les composants
- [ ] Tester tous les écrans

**Dépendances** : Tailwind CSS supporte déjà le mode sombre

### 4.4 Design Responsive Amélioré (1h)

#### Responsive Design
- [ ] Tester toutes les pages sur mobile
- [ ] Améliorer sidebar (menu hamburger sur mobile)
- [ ] Améliorer tableaux (scroll horizontal ou cards)
- [ ] Améliorer formulaires (colonnes sur mobile)
- [ ] Tester sur différentes tailles d'écran

---

## 📝 Schémas de Validation à Créer

### Dans `/src/lib/validations.ts`

```typescript
// Schéma pour documents
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

// Schéma pour publications
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

---

## 🔄 Ordre d'Implémentation Recommandé

### Semaine 1 : API Routes (Phase 1.1 et 1.2)
1. `/api/employees/[id]` - GET, PUT, DELETE
2. `/api/missions/[id]` - GET, PUT, DELETE
3. `/api/equipment/[id]` - GET, PUT, DELETE
4. `/api/species/[id]` - GET, PUT, DELETE
5. `/api/documents` - PUT, DELETE
6. `/api/documents/[id]` - GET, PUT, DELETE
7. `/api/publications` - POST, GET
8. `/api/publications/[id]` - GET, PUT, DELETE

### Semaine 2 : Pages de Détail et Édition (Phase 2)
1. Vérifier et compléter les pages de détail existantes
2. Créer/compléter les pages d'édition
3. Tester le flux complet CRUD

### Semaine 3 : Fonctionnalités Avancées (Phase 3)
1. Export PDF/Excel
2. Intégration Leaflet
3. Recherche avancée
4. Graphiques Recharts

### Semaine 4 : Améliorations UX (Phase 4)
1. Dashboards personnalisés
2. Calendrier
3. Mode sombre
4. Responsive design

---

## 🧪 Tests à Prévoir

### Tests Manuels
- [ ] Tester chaque API route (GET, POST, PUT, DELETE)
- [ ] Tester chaque page de détail
- [ ] Tester chaque page d'édition
- [ ] Tester les exports
- [ ] Tester la recherche avancée
- [ ] Tester sur différents rôles utilisateurs

### Tests Automatisés (Futur)
- [ ] Tests unitaires pour les API routes
- [ ] Tests d'intégration
- [ ] Tests E2E avec Playwright/Cypress

---

## 📦 Dépendances à Installer (si nécessaire)

```bash
# Pour le calendrier
npm install react-big-calendar @types/react-big-calendar

# Pour les exports (déjà installés)
# xlsx, jspdf
```

---

## ✅ Checklist de Validation

Avant de considérer une tâche comme terminée :

- [ ] Code implémenté
- [ ] Validation avec Zod (si applicable)
- [ ] Gestion des erreurs
- [ ] Audit log créé
- [ ] Tests manuels effectués
- [ ] Pas d'erreurs de lint
- [ ] Documentation mise à jour (si nécessaire)

---

## 📊 Métriques de Progrès

- **Phase 1** : 0/8 API routes complétées
- **Phase 2** : 0/12 pages complétées
- **Phase 3** : 0/4 fonctionnalités complétées
- **Phase 4** : 0/4 améliorations complétées

**Progression globale** : 0/28 tâches (0%)

---

## 🎯 Objectifs par Sprint

### Sprint 1 (Semaine 1)
- ✅ Compléter toutes les API routes manquantes
- ✅ Créer les schémas de validation manquants

### Sprint 2 (Semaine 2)
- ✅ Compléter toutes les pages de détail
- ✅ Compléter toutes les pages d'édition

### Sprint 3 (Semaine 3)
- ✅ Implémenter exports PDF/Excel
- ✅ Compléter intégration Leaflet
- ✅ Implémenter recherche avancée
- ✅ Ajouter graphiques Recharts

### Sprint 4 (Semaine 4)
- ✅ Dashboards personnalisés
- ✅ Calendrier
- ✅ Mode sombre
- ✅ Responsive design

---

**Dernière mise à jour** : [Date]
**Responsable** : [Nom]
**Statut** : 📋 Planifié

