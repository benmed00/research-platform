# Guide de Test - Export de Données

## 🧪 Tests des Fonctionnalités d'Export

Ce document décrit les tests à effectuer pour vérifier que les exports GeoJSON et CSV fonctionnent correctement.

## ✅ Checklist de Tests

### 1. Export GeoJSON

#### Test 1.1 : Export de toutes les données (sans filtres)
- [ ] Ouvrir la page `/dashboard/maps`
- [ ] S'assurer que toutes les couches sont activées
- [ ] Cliquer sur "Exporter GeoJSON"
- [ ] Vérifier que le fichier se télécharge : `carte-rif-YYYY-MM-DD.geojson`
- [ ] Ouvrir le fichier dans un éditeur de texte
- [ ] Vérifier que le format JSON est valide
- [ ] Vérifier la structure :
  ```json
  {
    "type": "FeatureCollection",
    "features": [...],
    "metadata": {...}
  }
  ```

#### Test 1.2 : Vérifier les propriétés des Features
- [ ] Ouvrir le fichier GeoJSON
- [ ] Vérifier que chaque feature a :
  - `type: "Feature"`
  - `geometry.type: "Point"`
  - `geometry.coordinates: [longitude, latitude]`
  - `properties` avec les bonnes informations
- [ ] Vérifier que les coordonnées sont dans l'ordre [lon, lat] (pas [lat, lon])

#### Test 1.3 : Vérifier les types de données
- [ ] Vérifier que les missions ont `properties.type: "mission"`
- [ ] Vérifier que les espèces ont `properties.type: "species"`
- [ ] Vérifier que la qualité d'eau a `properties.type: "water_quality"`
- [ ] Vérifier que les stations météo ont `properties.type: "climate_station"`

#### Test 1.4 : Export avec filtres appliqués
- [ ] Appliquer un filtre (ex: Type d'espèce = "Flore Terrestre")
- [ ] Cliquer sur "Exporter GeoJSON"
- [ ] Vérifier que seules les espèces filtrées sont dans l'export
- [ ] Vérifier que les autres types de données ne sont pas affectés (si leurs couches sont activées)

#### Test 1.5 : Export avec couches désactivées
- [ ] Désactiver la couche "Missions"
- [ ] Cliquer sur "Exporter GeoJSON"
- [ ] Vérifier que les missions ne sont PAS dans l'export
- [ ] Réactiver les missions et désactiver "Espèces"
- [ ] Vérifier que les espèces ne sont PAS dans l'export

#### Test 1.6 : Compatibilité SIG
- [ ] Importer le GeoJSON dans QGIS
  - Ouvrir QGIS
  - Layer > Add Layer > Add Vector Layer
  - Sélectionner le fichier GeoJSON
  - Vérifier que les points s'affichent correctement
  - Vérifier que les attributs sont accessibles
- [ ] Importer dans Google Earth
  - Ouvrir Google Earth
  - File > Import
  - Sélectionner le fichier GeoJSON
  - Vérifier que les points s'affichent
- [ ] Tester avec d'autres outils SIG si disponibles

---

### 2. Export CSV

#### Test 2.1 : Export de toutes les données
- [ ] Ouvrir la page `/dashboard/maps`
- [ ] S'assurer que toutes les couches sont activées
- [ ] Cliquer sur "Exporter CSV"
- [ ] Vérifier que le fichier se télécharge : `carte-rif-YYYY-MM-DD.csv`
- [ ] Ouvrir le fichier dans Excel ou Google Sheets
- [ ] Vérifier que les colonnes sont :
  - Type
  - ID
  - Latitude
  - Longitude
  - Location
  - Additional Info

#### Test 2.2 : Vérifier le format CSV
- [ ] Ouvrir le CSV dans un éditeur de texte
- [ ] Vérifier que les valeurs sont séparées par des virgules
- [ ] Vérifier que les valeurs contenant des virgules sont entre guillemets
- [ ] Vérifier qu'il n'y a pas de problèmes d'encodage (accents, caractères spéciaux)

#### Test 2.3 : Vérifier les types de données
- [ ] Vérifier que les missions ont `Type: "Mission"`
- [ ] Vérifier que les espèces ont `Type: "Espèce"`
- [ ] Vérifier que la qualité d'eau a `Type: "Qualité d'eau"`
- [ ] Vérifier que les stations météo ont `Type: "Station météo"`

#### Test 2.4 : Vérifier les informations additionnelles
- [ ] Pour les missions : Vérifier que "Additional Info" contient titre, statut, dates
- [ ] Pour les espèces : Vérifier que "Additional Info" contient nom scientifique, commun, type, IUCN
- [ ] Pour la qualité d'eau : Vérifier que "Additional Info" contient type, pH, température

#### Test 2.5 : Export avec filtres
- [ ] Appliquer un filtre (ex: Recherche = "Macaque")
- [ ] Cliquer sur "Exporter CSV"
- [ ] Vérifier que seules les données filtrées sont dans l'export
- [ ] Vérifier que les autres types ne sont pas affectés

#### Test 2.6 : Compatibilité Excel/Sheets
- [ ] Ouvrir le CSV dans Microsoft Excel
  - Vérifier que les colonnes sont correctement séparées
  - Vérifier qu'il n'y a pas d'erreurs d'import
  - Vérifier que les accents s'affichent correctement
- [ ] Ouvrir le CSV dans Google Sheets
  - Même vérifications
- [ ] Tester l'ouverture dans d'autres outils (LibreOffice, etc.)

---

### 3. Tests de Performance

#### Test 3.1 : Export avec beaucoup de données
- [ ] S'assurer qu'il y a beaucoup de données (253+ localisations d'espèces)
- [ ] Exporter en GeoJSON
- [ ] Vérifier que le téléchargement ne prend pas trop de temps (< 5 secondes)
- [ ] Vérifier que le navigateur ne freeze pas pendant l'export

#### Test 3.2 : Export avec peu de données
- [ ] Appliquer des filtres très restrictifs (ex: 1 seule espèce)
- [ ] Exporter en CSV
- [ ] Vérifier que l'export fonctionne même avec peu de données
- [ ] Vérifier que le fichier n'est pas vide

---

### 4. Tests de Robustesse

#### Test 4.1 : Données manquantes
- [ ] Vérifier que l'export fonctionne même si certains champs sont vides
- [ ] Vérifier que les valeurs null/undefined sont gérées correctement

#### Test 4.2 : Caractères spéciaux
- [ ] Vérifier que les noms avec accents sont correctement exportés
- [ ] Vérifier que les caractères spéciaux (apostrophes, guillemets) sont échappés dans le CSV

#### Test 4.3 : Dates
- [ ] Vérifier que les dates sont dans un format lisible
- [ ] Vérifier que les dates sont cohérentes entre GeoJSON et CSV

---

### 5. Tests d'Intégration

#### Test 5.1 : Filtres combinés
- [ ] Appliquer plusieurs filtres en même temps :
  - Type d'espèce = "Flore Terrestre"
  - Statut IUCN = "EN"
  - Recherche = "Cèdre"
- [ ] Exporter en GeoJSON
- [ ] Vérifier que seules les espèces correspondant à TOUS les critères sont exportées

#### Test 5.2 : Navigation entre exports
- [ ] Exporter en GeoJSON
- [ ] Attendre la fin du téléchargement
- [ ] Appliquer des filtres différents
- [ ] Exporter en CSV
- [ ] Vérifier que les deux exports sont différents et corrects

---

## 📋 Résultats Attendus

### GeoJSON
- ✅ Format JSON valide
- ✅ Structure FeatureCollection correcte
- ✅ Coordonnées dans l'ordre [longitude, latitude]
- ✅ Tous les types de données présents (si couches activées)
- ✅ Métadonnées incluses
- ✅ Compatible avec QGIS, Google Earth, etc.

### CSV
- ✅ Format CSV valide
- ✅ Colonnes correctes
- ✅ Séparation par virgules
- ✅ Échappement des caractères spéciaux
- ✅ Compatible Excel, Google Sheets
- ✅ Informations complètes dans "Additional Info"

---

## 🐛 Problèmes Connus & Solutions

### Problème : Export ne démarre pas
**Solution** : Vérifier la console du navigateur pour les erreurs JavaScript

### Problème : Fichier corrompu
**Solution** : Vérifier que toutes les données sont valides avant l'export

### Problème : Accents mal encodés
**Solution** : Le CSV utilise UTF-8, vérifier que votre éditeur l'ouvre avec le bon encodage

### Problème : GeoJSON ne s'ouvre pas dans QGIS
**Solution** : Vérifier que le format est correct (notamment l'ordre des coordonnées)

---

## ✅ Validation Finale

Après avoir complété tous les tests :
- [ ] Tous les tests passent
- [ ] Aucune erreur dans la console
- [ ] Les exports fonctionnent avec tous les scénarios
- [ ] La documentation est à jour

---

**Date de création** : 2026-01-XX  
**Dernière mise à jour** : 2026-01-XX  
**Statut** : ✅ Prêt pour tests

