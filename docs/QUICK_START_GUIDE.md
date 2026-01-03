# Guide de Démarrage Rapide - Fonctionnalités Carte

## 🚀 Démarrage Rapide

Ce guide vous permet de tester rapidement toutes les nouvelles fonctionnalités de la carte.

## 📍 Accès à la Carte

1. Connectez-vous à la plateforme
2. Naviguez vers **Dashboard > SIG & Cartographie**
3. Ou directement : `http://localhost:3000/dashboard/maps`

## 🎯 Fonctionnalités à Tester

### 1. Clustering des Marqueurs

**Test** :
- Observez que les marqueurs se regroupent automatiquement en clusters
- Zoomez pour voir les clusters se séparer
- Les clusters affichent le nombre d'éléments (couleurs : bleu=missions, vert=espèces, rouge=stations)

**Résultat attendu** :
- Carte plus lisible avec 253+ localisations
- Clusters intelligents selon le niveau de zoom

---

### 2. Filtres

**Test** :
- Ouvrez le panneau de filtres à gauche
- Testez chaque type de filtre :
  - **Recherche** : Tapez "Macaque" ou "Cèdre"
  - **Type d'espèce** : Cochez "Flore Terrestre"
  - **Statut IUCN** : Cochez "EN" (En danger)
  - **Statut mission** : Cochez "En cours"
  - **Type d'eau** : Cochez "Mer"

**Résultat attendu** :
- Les compteurs se mettent à jour en temps réel
- La carte affiche uniquement les données filtrées
- Plusieurs filtres peuvent être combinés

---

### 3. Couches (Layers)

**Test** :
- Cliquez sur les boutons de couches pour activer/désactiver :
  - Missions
  - Espèces
  - Points d'eau
  - Stations météo

**Résultat attendu** :
- Les couches se montrent/cachent instantanément
- Les compteurs affichent le nombre d'éléments par couche

---

### 4. Export de Données

#### Export GeoJSON

**Test** :
1. Appliquez des filtres si vous voulez (optionnel)
2. Cliquez sur "Exporter GeoJSON"
3. Vérifiez que le fichier se télécharge : `carte-rif-YYYY-MM-DD.geojson`
4. Ouvrez le fichier dans QGIS ou Google Earth

**Résultat attendu** :
- Fichier téléchargé avec succès
- Notification de succès affichée
- Fichier valide au format GeoJSON

#### Export CSV

**Test** :
1. Cliquez sur "Exporter CSV"
2. Vérifiez que le fichier se télécharge : `carte-rif-YYYY-MM-DD.csv`
3. Ouvrez le fichier dans Excel ou Google Sheets

**Résultat attendu** :
- Fichier téléchargé avec succès
- Notification de succès affichée
- Fichier CSV valide avec colonnes correctes

---

### 5. Graphiques

**Test** :
- Descendez sur la page pour voir les graphiques
- Observez les 4 graphiques :
  1. Distribution des espèces par type (Pie Chart)
  2. Distribution par statut IUCN (Bar Chart)
  3. Évolution des observations (Line Chart)
  4. Missions par statut (Pie Chart)

**Résultat attendu** :
- Graphiques affichés correctement
- Données cohérentes avec les filtres
- Tooltips interactifs au survol

---

### 6. Notifications

**Test** :
- Exportez des données → Notification de succès verte
- S'il y a une erreur → Notification d'erreur rouge
- Au chargement → Notification d'information bleue

**Résultat attendu** :
- Notifications s'affichent en haut à droite
- Auto-dismiss après quelques secondes
- Bouton X pour fermer manuellement

---

## 🎨 Interface

### Layout
- **Gauche** : Panneau avec couches et filtres
- **Droite** : Carte interactive (3/4 de l'écran)
- **Bas** : Graphiques et statistiques

### Interactions
- **Zoom** : Molette de souris ou boutons +/-
- **Pan** : Cliquer-glisser
- **Popup** : Cliquer sur un marqueur/cluster
- **Filtres** : Changement immédiat sur la carte

---

## 📊 Données Affichées

### Missions (120)
- Titre, localisation, dates, statut
- Couleur : Bleu

### Espèces (253 localisations)
- Nom scientifique, commun, type, statut IUCN
- Photos dans les popups
- Couleur : Vert

### Points d'eau (300)
- Type (Mer, Source, Barrage)
- Paramètres (pH, température, salinité)
- Couleur : Cercles bleus

### Stations météo
- Localisation
- Couleur : Rouge

---

## ⚡ Performance

### Temps de Chargement
- **Avant** : 5-10 secondes
- **Après** : 1-2 secondes

### Requêtes API
- **Avant** : 51+ requêtes
- **Après** : 4 requêtes

### Cache
- Données mises en cache 5 minutes
- Rechargement instantané sur revisite

---

## 🐛 Résolution de Problèmes

### La carte ne charge pas
1. Vérifiez la console du navigateur (F12)
2. Vérifiez que l'API fonctionne
3. Vérifiez la connexion à la base de données

### Les filtres ne fonctionnent pas
1. Vérifiez que les données sont chargées
2. Vérifiez la console pour erreurs JavaScript
3. Rechargez la page

### L'export ne fonctionne pas
1. Vérifiez les notifications (erreur affichée)
2. Vérifiez la console pour détails
3. Vérifiez que les données filtrées ne sont pas vides

### Les graphiques ne s'affichent pas
1. Attendez quelques secondes (lazy loading)
2. Vérifiez que les données sont chargées
3. Vérifiez la console pour erreurs

---

## ✅ Checklist de Test Rapide

- [ ] La carte se charge (1-2 secondes)
- [ ] Les clusters s'affichent correctement
- [ ] Les filtres fonctionnent
- [ ] La recherche textuelle fonctionne
- [ ] L'export GeoJSON fonctionne
- [ ] L'export CSV fonctionne
- [ ] Les graphiques s'affichent
- [ ] Les notifications apparaissent
- [ ] Le mode sombre fonctionne
- [ ] Responsive sur mobile

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- `docs/ALL_PHASES_COMPLETE.md` - Vue d'ensemble complète
- `docs/API_OPTIMIZATION.md` - Détails techniques
- `docs/TESTING_EXPORTS.md` - Tests détaillés
- `docs/PHASE3_NOTIFICATIONS.md` - Système de notifications

---

**Bonne exploration ! 🚀**

