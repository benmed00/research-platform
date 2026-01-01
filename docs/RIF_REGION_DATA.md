# Données Géographiques - Région du Rif

## Vue d'ensemble

Toutes les données géographiques ont été concentrées sur la **région du Rif**, chaîne montagneuse du nord du Maroc, s'étendant de Chefchaouen à Al Hoceima.

## Coordonnées géographiques

### Centre de la carte
- **Chefchaouen** : 35.1714°N, -5.2694°W
- **Zoom initial** : 9

### Limites du Rif
- **Latitude** : 34.2°N à 35.6°N
- **Longitude** : -6.0°W à -3.5°W

## Lieux spécifiques du Rif

### Villes principales
- Chefchaouen (564m d'altitude)
- Tétouan (80m)
- Al Hoceima (37m)
- Taza (510m)
- Taounate (565m)
- Ketama (1320m)
- Ouezzane (302m)

### Montagnes et sommets
- Jbel Tidirhine (2456m)
- Jbel Bou Naceur (3340m)
- Jbel Talassemtane (2105m)
- Jbel Lakraa (2159m)
- Jbel Kelti (1925m)

### Réserves et forêts
- Parc National de Talassemtane
- Forêt de Chefchaouen
- Cèdre de Chefchaouen
- Forêt de Ketama
- Réserve de Bouhachem

### Zones côtières
- Plage d'Al Hoceima
- Calas de Cala Iris
- Plage de Tétouan
- Côte Méditerranéenne du Rif

### Cours d'eau
- Oued Laou
- Oued Moulouya
- Oued Martil
- Oued Rhis

## Données générées

### Missions (120 missions)
- Toutes situées dans le Rif
- Lieux réalistes avec coordonnées précises
- Descriptions mentionnant le Rif

### Espèces (150 espèces)

#### Flore du Rif (exemples)
- **Abies pinsapo** - Sapin du Maroc (VU)
- **Quercus canariensis** - Chêne zéen (LC)
- **Cedrus atlantica** - Cèdre de l'Atlas (EN)
- **Juniperus thurifera** - Genévrier thurifère (LC)
- **Thymus broussonetii** - Thym du Rif (LC)

#### Faune terrestre du Rif (exemples)
- **Macaca sylvanus** - Macaque de Barbarie (EN)
- **Gazella cuvieri** - Gazelle de Cuvier (EN)
- **Ammotragus lervia** - Mouflon à manchettes (VU)
- **Canis lupus** - Loup gris d'Afrique (EN)
- **Genetta genetta** - Genette commune (LC)

#### Faune marine (côte méditerranéenne)
- **Caretta caretta** - Tortue caouanne (VU)
- **Chelonia mydas** - Tortue verte (EN)
- **Delphinus delphis** - Dauphin commun (LC)
- **Sparus aurata** - Dorade royale (LC)

#### Espèces d'eau douce
- **Salmo trutta** - Truite fario (LC)
- **Luciobarbus maghrebensis** - Barbeau du Maghreb (LC)
- **Anguilla anguilla** - Anguille européenne (CR)

### Stations météorologiques (7 stations)
1. Station Chefchaouen
2. Station Tétouan
3. Station Al Hoceima
4. Station Taza
5. Station Ketama
6. Station Jbel Tidirhine
7. Station Parc Talassemtane

### Qualité de l'eau (300 enregistrements)
- Points d'eau côtiers (Mer Méditerranée)
- Sources et oueds
- Qualité adaptée au contexte montagnard du Rif

### Qualité de l'air (400 enregistrements)
- Air pur caractéristique des zones montagneuses
- Stations dans toutes les villes principales du Rif

### Données de capteurs (200 enregistrements)
- Capteurs distribués dans le Rif
- Données environnementales réalistes

## Popups enrichies sur la carte

### Missions
- Titre et description
- Lieu précis dans le Rif
- Dates (début/fin)
- Statut avec badge coloré
- Objectifs de la mission

### Espèces
- Nom scientifique et nom commun
- Type (badge visuel : 🌿 Flore, 🦌 Faune, 🐠 Marine, 🐟 Eau douce)
- Statut IUCN
- Habitat spécifique au Rif
- Lieu d'observation
- Notes d'observation
- **Photos** (si disponibles)

### Points d'eau
- Type (🌊 Mer, 💧 Source, 🏔️ Barrage)
- Paramètres (pH, température, salinité)
- Date de mesure

## Améliorations techniques

### Fonction `getRandomRifLocation()`
- Sélectionne un lieu du Rif
- Ajoute une variation aléatoire de 100-500m pour créer des clusters réalistes
- Garantit que toutes les coordonnées sont dans le Rif

### Photos d'espèces
- URLs via Unsplash avec mots-clés basés sur les noms d'espèces
- Captions mentionnant "Rif, Maroc"
- Fallback automatique si l'image ne charge pas

## Prochaines étapes

Pour appliquer ces changements :

```bash
# Réinitialiser la base de données
npm run db:reset

# Ou manuellement
npm run db:push
npm run db:seed
```

## Notes importantes

- Toutes les coordonnées sont validées pour être dans le Rif
- Les espèces sont spécifiques à la région méditerranéenne/montagneuse du Rif
- Les habitats mentionnent explicitement le Rif
- Les descriptions sont réalistes et cohérentes

