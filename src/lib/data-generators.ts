/**
 * @file data-generators.ts
 * @description src/lib/data-generators.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 1853
 * @size 56.86 KB
 */
import {
  UserRole,
  ContractType,
  MissionStatus,
  SpeciesType,
  IUCNStatus,
  EquipmentCategory,
  EquipmentStatus,
} from "./data-models";

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate a random number within a range
 */
export function randomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random float within a range
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Pick a random element from an array
 */
export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Pick multiple random elements from an array
 */
export function randomChoices<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Pick a random element from an array (overload for compatibility)
 */
export function randomChoiceOverload<T>(array: T[], count?: number): T | T[] {
  if (count !== undefined) {
    return randomChoices(array, count);
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a random date within a range
 */
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to a date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Normal distribution (approximate using Box-Muller transform)
 */
export function normalDistribution(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}

/**
 * Weighted random choice
 */
export function weightedChoice<T>(
  items: readonly T[] | T[],
  weights: number[]
): T {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  return items[items.length - 1];
}

/**
 * Generate realistic timestamps with patterns
 * - More activity on weekdays
 * - Peak hours during 9-17
 * - Some weekend activity
 */
export function realisticTimestamp(startDate: Date, endDate: Date): Date {
  const date = randomDate(startDate, endDate);
  const dayOfWeek = date.getDay();
  
  // Weight weekdays higher (Monday=1 to Friday=5)
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  if (isWeekend && Math.random() > 0.3) {
    // 30% chance of weekend activity, otherwise regenerate
    return realisticTimestamp(startDate, endDate);
  }
  
  // Peak hours: 9 AM to 5 PM
  const hour = weightedChoice([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], [1, 3, 4, 5, 5, 5, 5, 5, 4, 3, 1]);
  const minute = randomRange(0, 59);
  const second = randomRange(0, 59);
  
  date.setHours(hour, minute, second, 0);
  return date;
}

// ============================================
// REALISTIC DATA GENERATORS
// ============================================

/**
 * RIF MOUNTAINS REGION - Specific locations with precise coordinates
 * All data generation is focused on this region in Northern Morocco
 */
export interface RifLocation {
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number; // meters
  type: "city" | "mountain" | "forest" | "coast" | "river" | "reserve";
}

export const RIF_LOCATIONS: RifLocation[] = [
  // Major cities and towns
  { name: "Chefchaouen", latitude: 35.1714, longitude: -5.2694, elevation: 564, type: "city" },
  { name: "Tétouan", latitude: 35.5764, longitude: -5.3714, elevation: 80, type: "city" },
  { name: "Al Hoceima", latitude: 35.2494, longitude: -3.9373, elevation: 37, type: "city" },
  { name: "Taza", latitude: 34.2144, longitude: -4.0089, elevation: 510, type: "city" },
  { name: "Taounate", latitude: 34.5364, longitude: -4.6397, elevation: 565, type: "city" },
  { name: "Ketama", latitude: 34.8847, longitude: -4.5872, elevation: 1320, type: "city" },
  { name: "Ouezzane", latitude: 34.8069, longitude: -5.5858, elevation: 302, type: "city" },
  { name: "Fès", latitude: 34.0331, longitude: -4.9997, elevation: 410, type: "city" },
  
  // Mountains and peaks
  { name: "Jbel Tidirhine", latitude: 35.1358, longitude: -4.6231, elevation: 2456, type: "mountain" },
  { name: "Jbel Bou Naceur", latitude: 34.8806, longitude: -4.4233, elevation: 3340, type: "mountain" },
  { name: "Jbel Talassemtane", latitude: 35.0292, longitude: -5.0267, elevation: 2105, type: "mountain" },
  { name: "Jbel Lakraa", latitude: 35.2158, longitude: -4.7989, elevation: 2159, type: "mountain" },
  { name: "Jbel Kelti", latitude: 35.0944, longitude: -4.7014, elevation: 1925, type: "mountain" },
  
  // Forests and natural reserves
  { name: "Parc National de Talassemtane", latitude: 35.0300, longitude: -5.0167, elevation: 1800, type: "reserve" },
  { name: "Forêt de Chefchaouen", latitude: 35.1800, longitude: -5.2500, elevation: 800, type: "forest" },
  { name: "Cèdre de Chefchaouen", latitude: 35.1917, longitude: -5.2750, elevation: 1200, type: "forest" },
  { name: "Forêt de Ketama", latitude: 34.9000, longitude: -4.5833, elevation: 1400, type: "forest" },
  { name: "Réserve de Bouhachem", latitude: 35.0639, longitude: -5.3333, elevation: 1100, type: "reserve" },
  
  // Coastal areas
  { name: "Plage d'Al Hoceima", latitude: 35.2472, longitude: -3.9367, elevation: 0, type: "coast" },
  { name: "Calas de Cala Iris", latitude: 35.2731, longitude: -3.9828, elevation: 0, type: "coast" },
  { name: "Plage de Tétouan", latitude: 35.6000, longitude: -5.3333, elevation: 0, type: "coast" },
  { name: "Côte Méditerranéenne - RIF", latitude: 35.2500, longitude: -3.9500, elevation: 0, type: "coast" },
  
  // Rivers and water bodies
  { name: "Oued Laou", latitude: 35.4458, longitude: -5.2231, elevation: 0, type: "river" },
  { name: "Oued Moulouya", latitude: 35.1167, longitude: -2.3400, elevation: 0, type: "river" },
  { name: "Oued Martil", latitude: 35.6167, longitude: -5.3167, elevation: 0, type: "river" },
  { name: "Oued Rhis", latitude: 35.1667, longitude: -5.2833, elevation: 400, type: "river" },
  
  // Rural areas and valleys
  { name: "Vallée de Oued Laou", latitude: 35.2667, longitude: -5.1667, elevation: 300, type: "river" },
  { name: "Vallée de Chefchaouen", latitude: 35.1500, longitude: -5.2333, elevation: 600, type: "river" },
  { name: "Zone rurale - Talassemtane", latitude: 35.0000, longitude: -5.0333, elevation: 1400, type: "reserve" },
];

/**
 * Get a random location from RIF_LOCATIONS with slight random variation in coordinates
 * to create realistic clustering around known locations
 */
export function getRandomRifLocation(): { name: string; latitude: number; longitude: number } {
  const location = randomChoice(RIF_LOCATIONS);
  
  // Add small random variation (100-500m) to create realistic clustering
  const latVariation = randomFloat(-0.004, 0.004); // ~500m max
  const lonVariation = randomFloat(-0.004, 0.004);
  
  return {
    name: location.name,
    latitude: location.latitude + latVariation,
    longitude: location.longitude + lonVariation,
  };
}

/**
 * Get locations only (for backward compatibility)
 */
export const MOROCCAN_LOCATIONS = RIF_LOCATIONS.map(loc => loc.name);

/**
 * Generate realistic user data
 */
export function generateUsers(count: number, startDate: Date): Array<{
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}> {
  const firstNames = [
    "Ahmed", "Fatima", "Mohamed", "Aicha", "Hassan", "Khadija",
    "Omar", "Zineb", "Youssef", "Leila", "Karim", "Nadia",
    "Mehdi", "Sanae", "Amine", "Hanane", "Rachid", "Samira",
    "Said", "Siham", "Bilal", "Meriem", "Khalid", "Salma",
  ];
  
  const lastNames = [
    "Alaoui", "Bennani", "Cherkaoui", "El Fassi", "Idrissi",
    "Lamrani", "Makki", "Naciri", "Ouazzani", "Rahmani",
    "Saadi", "Tazi", "Zahir", "Amrani", "Bouzidi",
  ];
  
  // Role distribution (weighted)
  const roles: UserRole[] = [
    "DIRECTEUR_SCIENTIFIQUE", "DIRECTEUR_ADMINISTRATIF_FINANCIER",
    "BOTANISTE", "ZOOLOGISTE_TERRESTRE", "BIOLOGISTE_MARIN",
    "DATA_SCIENTIST_SIG", "TECHNICIEN_TERRAIN", "TECHNICIEN_LABORATOIRE",
    "GEOLOGUE", "CLIMATOLOGUE", "LOGISTICIEN",
  ];
  
  const roleWeights = [
    1, 1, // Directors (fewer)
    3, 3, 3, // Scientists (more common)
    2, 4, 2, // Technical roles
    2, 2, 2, // Specialists
  ];
  
  const users = [];
  const usedEmails = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    const firstName = randomChoice(firstNames);
    const lastName = randomChoice(lastNames);
    const role = weightedChoice(roles, roleWeights);
    
    // Generate unique email
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@research-platform.ma`;
    let counter = 1;
    while (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${counter}@research-platform.ma`;
      counter++;
    }
    usedEmails.add(email);
    
    // 85% active users
    const isActive = Math.random() > 0.15;
    
    // Staggered creation dates
    const createdAt = randomDate(startDate, new Date());
    
    users.push({
      email,
      firstName,
      lastName,
      role,
      isActive,
      createdAt,
    });
  }
  
  return users;
}

/**
 * Generate realistic species data specific to RIF MOUNTAINS region
 */
export function generateSpecies(count: number): Array<{
  scientificName: string;
  commonName: string;
  type: SpeciesType;
  iucnStatus: IUCNStatus;
  habitat: string;
  description: string;
}> {
  // RIF-SPECIFIC PLANTS (Flore du Rif)
  const rifPlants = [
    { scientific: "Abies pinsapo", common: "Sapin du Maroc", habitat: "Forêt de cèdres du Rif", iucn: "VU" },
    { scientific: "Quercus canariensis", common: "Chêne zéen", habitat: "Forêt méditerranéenne du Rif", iucn: "LC" },
    { scientific: "Quercus faginea", common: "Chêne tauzin", habitat: "Forêt de montagne du Rif", iucn: "LC" },
    { scientific: "Juniperus thurifera", common: "Genévrier thurifère", habitat: "Hautes altitudes du Rif", iucn: "LC" },
    { scientific: "Pinus pinaster", common: "Pin maritime", habitat: "Versants montagneux du Rif", iucn: "LC" },
    { scientific: "Cedrus atlantica", common: "Cèdre de l'Atlas", habitat: "Massifs montagneux du Rif", iucn: "EN" },
    { scientific: "Pistacia atlantica", common: "Pistachier de l'Atlas", habitat: "Forêt méditerranéenne du Rif", iucn: "LC" },
    { scientific: "Thymus broussonetii", common: "Thym du Rif", habitat: "Garrigues du Rif", iucn: "LC" },
    { scientific: "Rosa pouzinii", common: "Rose du Rif", habitat: "Zones rocheuses du Rif", iucn: "LC" },
    { scientific: "Narcissus tazetta", common: "Narcisse des prés", habitat: "Prairies humides du Rif", iucn: "LC" },
    { scientific: "Iris tingitana", common: "Iris de Tanger", habitat: "Zones humides côtières du Rif", iucn: "NT" },
    { scientific: "Olea europaea", common: "Olivier sauvage", habitat: "Versants du Rif", iucn: "LC" },
  ];
  
  // RIF TERRESTRIAL FAUNA (Faune terrestre du Rif)
  const rifTerrestrialFauna = [
    { scientific: "Macaca sylvanus", common: "Macaque de Barbarie", habitat: "Forêts de cèdres du Rif", iucn: "EN" },
    { scientific: "Gazella cuvieri", common: "Gazelle de Cuvier", habitat: "Zones ouvertes du Rif", iucn: "EN" },
    { scientific: "Ammotragus lervia", common: "Mouflon à manchettes", habitat: "Rochers et falaises du Rif", iucn: "VU" },
    { scientific: "Canis lupus", common: "Loup gris d'Afrique", habitat: "Forêts montagneuses du Rif", iucn: "EN" },
    { scientific: "Vulpes vulpes", common: "Renard roux", habitat: "Divers habitats du Rif", iucn: "LC" },
    { scientific: "Genetta genetta", common: "Genette commune", habitat: "Forêts et zones rocheuses du Rif", iucn: "LC" },
    { scientific: "Hystrix cristata", common: "Porc-épic à crête", habitat: "Zones boisées du Rif", iucn: "LC" },
    { scientific: "Lepus capensis", common: "Lièvre du Cap", habitat: "Prairies et garrigues du Rif", iucn: "LC" },
    { scientific: "Apodemus sylvaticus", common: "Mulot sylvestre", habitat: "Forêts du Rif", iucn: "LC" },
    { scientific: "Athene noctua", common: "Chouette chevêche", habitat: "Milieux ouverts du Rif", iucn: "LC" },
    { scientific: "Buteo rufinus", common: "Buse féroce", habitat: "Zones montagneuses du Rif", iucn: "LC" },
    { scientific: "Falco peregrinus", common: "Faucon pèlerin", habitat: "Falaises côtières du Rif", iucn: "LC" },
  ];
  
  // RIF MARINE FAUNA (Faune marine de la côte méditerranéenne du Rif)
  const rifMarineFauna = [
    { scientific: "Caretta caretta", common: "Tortue caouanne", habitat: "Eaux côtières méditerranéennes du Rif", iucn: "VU" },
    { scientific: "Chelonia mydas", common: "Tortue verte", habitat: "Eaux côtières du Rif", iucn: "EN" },
    { scientific: "Delphinus delphis", common: "Dauphin commun", habitat: "Eaux méditerranéennes du Rif", iucn: "LC" },
    { scientific: "Tursiops truncatus", common: "Grand dauphin", habitat: "Eaux côtières du Rif", iucn: "LC" },
    { scientific: "Sparus aurata", common: "Dorade royale", habitat: "Eaux côtières rocheuses du Rif", iucn: "LC" },
    { scientific: "Dicentrarchus labrax", common: "Bar commun", habitat: "Eaux côtières du Rif", iucn: "LC" },
    { scientific: "Mullus surmuletus", common: "Rouget-barbet", habitat: "Fonds marins côtiers du Rif", iucn: "LC" },
    { scientific: "Octopus vulgaris", common: "Poulpe commun", habitat: "Récifs et zones rocheuses côtières du Rif", iucn: "LC" },
  ];
  
  // RIF FRESHWATER SPECIES (Espèces d'eau douce des oueds du Rif)
  const rifFreshwater = [
    { scientific: "Salmo trutta", common: "Truite fario", habitat: "Oueds de montagne du Rif", iucn: "LC" },
    { scientific: "Luciobarbus maghrebensis", common: "Barbeau du Maghreb", habitat: "Oueds et rivières du Rif", iucn: "LC" },
    { scientific: "Anguilla anguilla", common: "Anguille européenne", habitat: "Oueds côtiers du Rif", iucn: "CR" },
    { scientific: "Alburnus alburnus", common: "Ablette", habitat: "Cours d'eau du Rif", iucn: "LC" },
    { scientific: "Cyprinus carpio", common: "Carpe commune", habitat: "Eaux douces du Rif", iucn: "LC" },
  ];
  
  const iucnStatuses: IUCNStatus[] = ["LC", "NT", "VU", "EN", "CR", "DD", "NE"];
  const iucnWeights = [40, 15, 20, 12, 5, 5, 3];
  
  const species = [];
  const usedNames = new Map<string, number>(); // Track how many times each species was used
  
  for (let i = 0; i < count; i++) {
    const type = weightedChoice<SpeciesType>(
      ["FLORE_TERRESTRE", "FAUNE_TERRESTRE", "FAUNE_MARINE", "ESPECE_EAU_DOUCE"],
      [30, 30, 25, 15] // More plants and terrestrial fauna in Rif
    );
    
    let scientificName: string;
    let commonName: string;
    let habitat: string;
    let iucnStatus: IUCNStatus;
    
    switch (type) {
      case "FLORE_TERRESTRE": {
        const plant = randomChoice(rifPlants);
        scientificName = plant.scientific;
        commonName = plant.common;
        habitat = plant.habitat;
        iucnStatus = plant.iucn as IUCNStatus;
        break;
      }
      case "FAUNE_TERRESTRE": {
        const animal = randomChoice(rifTerrestrialFauna);
        scientificName = animal.scientific;
        commonName = animal.common;
        habitat = animal.habitat;
        iucnStatus = animal.iucn as IUCNStatus;
        break;
      }
      case "FAUNE_MARINE": {
        const marine = randomChoice(rifMarineFauna);
        scientificName = marine.scientific;
        commonName = marine.common;
        habitat = marine.habitat;
        iucnStatus = marine.iucn as IUCNStatus;
        break;
      }
      case "ESPECE_EAU_DOUCE": {
        const freshwater = randomChoice(rifFreshwater);
        scientificName = freshwater.scientific;
        commonName = freshwater.common;
        habitat = freshwater.habitat;
        iucnStatus = freshwater.iucn as IUCNStatus;
        break;
      }
    }
    
    // Allow duplicates but add a suffix to make them unique
    const key = `${scientificName}-${commonName}`;
    const countUsed = usedNames.get(key) || 0;
    usedNames.set(key, countUsed + 1);
    
    // Add suffix for duplicates (represents different observations/populations)
    const finalScientificName = countUsed > 0 ? `${scientificName} (obs. ${countUsed + 1})` : scientificName;
    const finalCommonName = countUsed > 0 ? `${commonName} (${countUsed + 1})` : commonName;
    
    const description = `Espèce observée dans la région du Rif, au nord du Maroc. ${type === "FLORE_TERRESTRE" ? "Plante" : "Animal"} caractéristique de ${habitat.toLowerCase()}. Présente dans les montagnes du Rif, entre Chefchaouen et Al Hoceima.${countUsed > 0 ? ` Observation supplémentaire de cette espèce dans une zone différente du Rif.` : ''}`;
    
    species.push({
      scientificName: finalScientificName,
      commonName: finalCommonName,
      type,
      iucnStatus,
      habitat,
      description,
    });
  }
  
  return species;
}

/**
 * Generate realistic mission data with time patterns
 */
export function generateMissions(
  count: number,
  userIds: string[],
  startDate: Date,
  endDate: Date
): Array<{
  title: string;
  description: string;
  creatorId: string;
  startDate: Date;
  endDate: Date;
  location: string;
  latitude: number;
  longitude: number;
  objectives: string;
  status: MissionStatus;
  createdAt: Date;
}> {
  const missionTemplates = [
    "Inventaire de la biodiversité",
    "Suivi des populations",
    "Étude des écosystèmes",
    "Cartographie des habitats",
    "Recherche sur les espèces menacées",
    "Surveillance environnementale",
    "Collecte d'échantillons",
    "Évaluation de l'état de conservation",
  ];
  
  const missions = [];
  
  // RIF MOUNTAINS REGION - Focus only on this area
  // RIF bounds: Lat 34.2-35.6, Lon -6.0 to -3.5
  
  // Generate missions with realistic distribution over time
  // More missions in spring/summer (field season)
  for (let i = 0; i < count; i++) {
    const missionType = randomChoice(missionTemplates);
    const rifLocation = getRandomRifLocation();
    const creatorId = randomChoice(userIds);
    
    // Bias towards warmer months (March-September)
    let missionStart = randomDate(startDate, endDate);
    const month = missionStart.getMonth();
    if (month < 2 || month > 8) {
      // If outside peak season, 30% chance to regenerate
      if (Math.random() > 0.3) {
        missionStart = new Date(
          missionStart.getFullYear(),
          randomRange(2, 8), // March to September
          randomRange(1, 28)
        );
      }
    }
    
    // Mission duration: 1-14 days (most are 3-7 days)
    const duration = weightedChoice([1, 2, 3, 4, 5, 6, 7, 10, 14], [5, 8, 20, 25, 25, 15, 10, 5, 2]);
    const missionEnd = addDays(missionStart, duration);
    
    // Status based on date
    let status: MissionStatus;
    const now = new Date();
    if (missionEnd < now) {
      // Past missions: 85% completed, 10% cancelled, 5% still in progress (delayed)
      status = weightedChoice(["completed", "cancelled", "in_progress"], [85, 10, 5]);
    } else if (missionStart > now) {
      // Future missions: 70% planned, 30% might start early
      status = Math.random() > 0.3 ? "planned" : "in_progress";
    } else {
      // Current missions
      status = "in_progress";
    }
    
    const objectives = `${missionType} dans la région du Rif - ${rifLocation.name}. Objectifs: collecte de données, observation des espèces, évaluation de l'état écologique dans les montagnes du Rif.`;
    
    missions.push({
      title: `${missionType} - ${rifLocation.name}`,
      description: `Mission de recherche scientifique dans la région du Rif (${rifLocation.name})`,
      creatorId,
      startDate: missionStart,
      endDate: missionEnd,
      location: rifLocation.name,
      latitude: rifLocation.latitude,
      longitude: rifLocation.longitude,
      objectives,
      status,
      createdAt: addDays(missionStart, -randomRange(7, 30)), // Created 1-4 weeks before
    });
  }
  
  return missions.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

/**
 * Generate equipment with realistic status distribution
 */
export function generateEquipment(count: number): Array<{
  name: string;
  category: EquipmentCategory;
  serialNumber: string;
  purchaseDate: Date;
  purchasePrice: number;
  lifespan: number;
  status: EquipmentStatus;
  location: string;
  description: string;
}> {
  const vehicles = [
    "Véhicule tout-terrain Toyota Land Cruiser",
    "Véhicule 4x4 Nissan Patrol",
    "Camionnette Mitsubishi L200",
  ];
  
  const boats = [
    "Bateau de recherche Océan 15",
    "Bateau pneumatique Zodiac",
    "Embarcation scientifique",
  ];
  
  const scientific = [
    "GPS haute précision",
    "Dron aérien DJI Phantom",
    "Microscope électronique",
    "Analyseur d'eau portable",
    "Station météo automatique",
    "Capteur de température/humidité",
    "Jumelles professionnelles",
    "Télescope de terrain",
  ];
  
  const it = [
    "Ordinateur portable Dell",
    "Tablette Samsung Galaxy Tab",
    "Serveur HP ProLiant",
    "Imprimante laser",
  ];
  
  const camping = [
    "Tente de terrain 4 places",
    "Équipement de camping",
    "Réfrigérateur portable",
    "Générateur électrique",
  ];
  
  const lab = [
    "Centrifugeuse",
    "Autoclave",
    "Balance de précision",
    "Hotte à flux laminaire",
  ];
  
  const equipment = [];
  const usedSerials = new Set<string>();
  
  // Status distribution: 50% available, 25% in use, 20% maintenance, 5% retired
  const statuses: EquipmentStatus[] = ["AVAILABLE", "IN_USE", "MAINTENANCE", "RETIRED"];
  const statusWeights = [50, 25, 20, 5];
  
  // Generate serial numbers
  function generateSerial(category: string, index: number): string {
    const prefix = category.substring(0, 3).toUpperCase();
    return `${prefix}-${String(index).padStart(6, "0")}`;
  }
  
  let serialCounter = 1000;
  
  for (let i = 0; i < count; i++) {
    const category = weightedChoice<EquipmentCategory>(
      ["VEHICULE", "BATEAU", "EQUIPEMENT_SCIENTIFIQUE", "INFORMATIQUE", "CAMPING_TERRAIN", "LABORATOIRE"],
      [10, 5, 30, 20, 15, 20]
    );
    
    let name: string;
    let basePrice: number;
    let defaultLifespan: number;
    
    switch (category) {
      case "VEHICULE":
        name = randomChoice(vehicles);
        basePrice = 300000;
        defaultLifespan = 10;
        break;
      case "BATEAU":
        name = randomChoice(boats);
        basePrice = 500000;
        defaultLifespan = 15;
        break;
      case "EQUIPEMENT_SCIENTIFIQUE":
        name = randomChoice(scientific);
        basePrice = randomRange(5000, 50000);
        defaultLifespan = 8;
        break;
      case "INFORMATIQUE":
        name = randomChoice(it);
        basePrice = randomRange(3000, 15000);
        defaultLifespan = 5;
        break;
      case "CAMPING_TERRAIN":
        name = randomChoice(camping);
        basePrice = randomRange(1000, 5000);
        defaultLifespan = 7;
        break;
      case "LABORATOIRE":
        name = randomChoice(lab);
        basePrice = randomRange(10000, 80000);
        defaultLifespan = 12;
        break;
    }
    
    const serialNumber = generateSerial(category, serialCounter++);
    usedSerials.add(serialNumber);
    
    // Purchase date: 0-8 years ago
    const purchaseDate = addMonths(new Date(), -randomRange(0, 96));
    
    // Price varies ±20%
    const purchasePrice = Math.round(basePrice * randomFloat(0.8, 1.2));
    
    const status = weightedChoice(statuses, statusWeights);
    const lifespan = defaultLifespan;
    
    const location = randomChoice([
      "Bureau principal",
      "Entrepôt",
      "Laboratoire",
      "En mission",
      "Maintenance",
    ]);
    
    equipment.push({
      name,
      category,
      serialNumber,
      purchaseDate,
      purchasePrice,
      lifespan,
      status,
      location,
      description: `${name} - Équipement ${category.toLowerCase()}`,
    });
  }
  
  return equipment;
}

/**
 * Generate time-series climate data with seasonal patterns
 */
export function generateClimateData(
  count: number,
  startDate: Date,
  endDate: Date
): Array<{
  stationId: string;
  location: string;
  latitude: number;
  longitude: number;
  date: Date;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
}> {
  // RIF REGION Weather Stations
  const stations = [
    { id: "ST001", name: "Station Chefchaouen", lat: 35.1714, lon: -5.2694 },
    { id: "ST002", name: "Station Tétouan", lat: 35.5764, lon: -5.3714 },
    { id: "ST003", name: "Station Al Hoceima", lat: 35.2494, lon: -3.9373 },
    { id: "ST004", name: "Station Taza", lat: 34.2144, lon: -4.0089 },
    { id: "ST005", name: "Station Ketama", lat: 34.8847, lon: -4.5872 },
    { id: "ST006", name: "Station Jbel Tidirhine", lat: 35.1358, lon: -4.6231 },
    { id: "ST007", name: "Station Parc Talassemtane", lat: 35.0300, lon: -5.0167 },
  ];
  
  const data = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate && data.length < count) {
    const station = randomChoice(stations);
    const month = currentDate.getMonth();
    
    // Seasonal patterns for Morocco
    // Temperature: higher in summer (June-Aug), lower in winter (Dec-Feb)
    const baseTemp = 20;
    const seasonalVariation = Math.sin((month - 3) * (Math.PI / 6)) * 8; // ±8°C variation
    const temperature = baseTemp + seasonalVariation + normalDistribution(0, 3);
    
    // Humidity: higher in winter, lower in summer
    const baseHumidity = 60;
    const humidityVariation = Math.sin((month - 3) * (Math.PI / 6)) * -15;
    const humidity = Math.max(20, Math.min(90, baseHumidity + humidityVariation + normalDistribution(0, 5)));
    
    // Pressure: relatively stable with small variations
    const pressure = 1013 + normalDistribution(0, 10);
    
    // Wind speed: higher in spring
    const windSpeed = Math.max(0, 10 + Math.sin((month - 4) * (Math.PI / 6)) * 5 + normalDistribution(0, 3));
    
    // Wind direction: 0-360 degrees
    const windDirection = randomRange(0, 360);
    
    // Precipitation: higher in winter months
    const precipitationChance = month >= 10 || month <= 3 ? 0.3 : 0.05; // 30% in winter, 5% in summer
    const precipitation = Math.random() < precipitationChance
      ? Math.max(0, normalDistribution(5, 3))
      : 0;
    
    data.push({
      stationId: station.id,
      location: station.name,
      latitude: station.lat,
      longitude: station.lon,
      date: new Date(currentDate),
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(humidity * 10) / 10,
      pressure: Math.round(pressure * 10) / 10,
      windSpeed: Math.round(windSpeed * 10) / 10,
      windDirection,
      precipitation: Math.round(precipitation * 10) / 10,
    });
    
    // Move to next day (or skip some days for realistic sampling)
    currentDate.setDate(currentDate.getDate() + (Math.random() < 0.7 ? 1 : 0));
  }
  
  return data;
}

/**
 * Generate login logs with realistic patterns
 */
export function generateLoginLogs(
  userIds: string[],
  startDate: Date,
  endDate: Date,
  logsPerUser: number = 50
): Array<{
  userId: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  timestamp: Date;
}> {
  const ipRanges = [
    "41.143.", "212.95.", "105.154.", "197.251.", "105.155.",
  ];
  
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
  ];
  
  const logs = [];
  
  for (const userId of userIds) {
    // Active users log in more frequently
    const userLogCount = Math.floor(randomRange(logsPerUser * 0.5, logsPerUser * 1.5));
    
    for (let i = 0; i < userLogCount; i++) {
      const timestamp = realisticTimestamp(startDate, endDate);
      const ipBase = randomChoice(ipRanges);
      const ipAddress = `${ipBase}${randomRange(1, 255)}.${randomRange(1, 255)}`;
      const userAgent = randomChoice(userAgents);
      
      // 95% successful logins
      const success = Math.random() > 0.05;
      
      logs.push({
        userId,
        ipAddress,
        userAgent,
        success,
        timestamp,
      });
    }
  }
  
  return logs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

/**
 * Generate grants (research funding)
 */
export function generateGrants(count: number): Array<{
  name: string;
  provider: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  status: "active" | "completed" | "cancelled";
  description: string;
}> {
  const grantProviders = [
    "Ministère de l'Environnement",
    "Fondation pour la Biodiversité",
    "Union Européenne - Programme Horizon",
    "CNRST (Centre National de Recherche Scientifique)",
    "PNUD (Programme des Nations Unies)",
    "Fondation MAVA",
    "Agence Française de Développement",
    "Banque Mondiale",
  ];
  
  const grantTypes = [
    "Conservation de la biodiversité",
    "Recherche sur les écosystèmes",
    "Protection des espèces menacées",
    "Étude climatique",
    "Développement durable",
    "Science participative",
  ];
  
  const grants = [];
  
  for (let i = 0; i < count; i++) {
    const provider = randomChoice(grantProviders);
    const grantType = randomChoice(grantTypes);
    
    // Grant duration: 1-3 years
    const startDate = randomDate(addMonths(new Date(), -36), addMonths(new Date(), 6));
    const duration = randomRange(12, 36);
    const endDate = addMonths(startDate, duration);
    
    // Status based on dates
    let status: "active" | "completed" | "cancelled";
    if (endDate < new Date()) {
      status = weightedChoice(["completed", "cancelled"], [90, 10]);
    } else if (startDate > new Date()) {
      status = "active";
    } else {
      status = weightedChoice(["active", "completed", "cancelled"], [70, 20, 10]);
    }
    
    // Amount: 100K - 2M MAD
    const amount = randomRange(100000, 2000000);
    
    grants.push({
      name: `${grantType} - ${provider}`,
      provider,
      amount,
      startDate,
      endDate,
      status,
      description: `Subvention pour ${grantType.toLowerCase()} accordée par ${provider}.`,
    });
  }
  
  return grants;
}

/**
 * Generate suppliers (vendors/contractors)
 */
export function generateSuppliers(count: number): Array<{
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
}> {
  const supplierTypes = [
    "Fournisseur d'équipement scientifique",
    "Location de véhicules",
    "Services informatiques",
    "Fournitures de bureau",
    "Maintenance technique",
    "Transport et logistique",
  ];
  
  const cities = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir"];
  const firstNames = ["Mohamed", "Ahmed", "Hassan", "Fatima", "Aicha"];
  const lastNames = ["Alami", "Bennani", "Cherkaoui", "El Fassi", "Idrissi"];
  
  const suppliers = [];
  const usedNames = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    let name = randomChoice(supplierTypes);
    let counter = 1;
    while (usedNames.has(name)) {
      name = `${randomChoice(supplierTypes)} ${counter}`;
      counter++;
    }
    usedNames.add(name);
    
    const firstName = randomChoice(firstNames);
    const lastName = randomChoice(lastNames);
    const city = randomChoice(cities);
    const contact = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${name.toLowerCase().replace(/\s+/g, '')}.ma`;
    const phone = `+212 6${randomRange(10000000, 99999999)}`;
    const address = `${randomRange(1, 200)} Rue ${city}, ${city}`;
    
    suppliers.push({
      name,
      contact,
      email,
      phone,
      address,
    });
  }
  
  return suppliers;
}

/**
 * Generate invoices with realistic patterns
 */
export function generateInvoices(
  count: number,
  supplierIds: string[],
  startDate: Date,
  endDate: Date
): Array<{
  number: string;
  supplierId: string;
  amount: number;
  date: Date;
  dueDate: Date;
  status: "pending" | "paid" | "overdue";
  fileUrl: string | null;
}> {
  const invoices = [];
  const usedNumbers = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    // Generate unique invoice number
    const year = new Date().getFullYear();
    let invoiceNum = `INV-${year}-${String(i + 1).padStart(4, "0")}`;
    while (usedNumbers.has(invoiceNum)) {
      invoiceNum = `INV-${year}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;
    }
    usedNumbers.add(invoiceNum);
    
    const supplierId = randomChoice(supplierIds);
    const date = randomDate(startDate, endDate);
    const dueDays = randomRange(15, 45);
    const dueDate = addDays(date, dueDays);
    
    // Status based on dates
    let status: "pending" | "paid" | "overdue";
    if (dueDate < new Date()) {
      // Past due date: 60% overdue, 40% paid
      status = weightedChoice(["overdue", "paid"], [60, 40]);
    } else {
      // Future due date: 70% pending, 30% paid (early payment)
      status = weightedChoice(["pending", "paid"], [70, 30]);
    }
    
    const amount = randomRange(5000, 100000);
    const fileUrl = status === "paid" ? `/invoices/${invoiceNum}.pdf` : null;
    
    invoices.push({
      number: invoiceNum,
      supplierId,
      amount,
      date,
      dueDate,
      status,
      fileUrl,
    });
  }
  
  return invoices;
}

/**
 * Generate expenses with realistic patterns
 */
export function generateExpenses(
  count: number,
  budgetId: string,
  grantIds: string[],
  projectIds: string[],
  invoiceIds: string[],
  startDate: Date,
  endDate: Date
): Array<{
  budgetId: string;
  grantId: string | null;
  projectId: string | null;
  category: string;
  amount: number;
  description: string;
  date: Date;
  invoiceId: string | null;
}> {
  const categories = [
    "Personnel",
    "Équipement",
    "Transport",
    "Logistique",
    "Maintenance",
    "Recherche",
    "Services",
  ];
  
  const categoryWeights = [30, 20, 15, 10, 10, 10, 5];
  
  // Typical expense amounts by category (in MAD)
  const categoryAmounts: Record<string, { min: number; max: number }> = {
    Personnel: { min: 5000, max: 15000 },
    Équipement: { min: 10000, max: 100000 },
    Transport: { min: 500, max: 5000 },
    Logistique: { min: 1000, max: 10000 },
    Maintenance: { min: 500, max: 20000 },
    Recherche: { min: 2000, max: 50000 },
    Services: { min: 1000, max: 15000 },
  };
  
  const expenses = [];
  
  for (let i = 0; i < count; i++) {
    const category = weightedChoice(categories, categoryWeights);
    const range = categoryAmounts[category];
    const amount = Math.round(randomRange(range.min, range.max));
    const date = randomDate(startDate, endDate);
    
    // 30% linked to grants, 20% to projects, 40% to invoices, 10% standalone
    const linkType = weightedChoice(["grant", "project", "invoice", "none"], [30, 20, 40, 10]);
    const grantId = linkType === "grant" && grantIds.length > 0 ? randomChoice(grantIds) : null;
    const projectId = linkType === "project" && projectIds.length > 0 ? randomChoice(projectIds) : null;
    const invoiceId = linkType === "invoice" && invoiceIds.length > 0 ? randomChoice(invoiceIds) : null;
    
    const descriptions: Record<string, string[]> = {
      Personnel: ["Salaire mensuel", "Prime de mission", "Charges sociales"],
      Équipement: ["Achat équipement scientifique", "Matériel de terrain", "Consommables"],
      Transport: ["Carburant", "Location véhicule", "Frais de déplacement"],
      Logistique: ["Fournitures de bureau", "Communication", "Assurances"],
      Maintenance: ["Maintenance équipement", "Réparation véhicule", "Service technique"],
      Recherche: ["Subvention recherche", "Partenariat scientifique", "Publication"],
      Services: ["Prestation externe", "Consultation", "Formation"],
    };
    
    const description = `${randomChoice(descriptions[category])} - ${category}`;
    
    expenses.push({
      budgetId,
      grantId,
      projectId,
      category,
      amount,
      description,
      date,
      invoiceId,
    });
  }
  
  return expenses.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Generate sensor data
 */
export function generateSensorData(
  count: number,
  startDate: Date,
  endDate: Date
): Array<{
  sensorId: string;
  sensorType: string;
  location: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  value: number;
  unit: string;
  metadata: string | null;
}> {
  const sensorTypes = [
    { id: "TEMP-001", type: "Temperature", unit: "°C", min: 10, max: 35 },
    { id: "HUM-001", type: "Humidity", unit: "%", min: 30, max: 90 },
    { id: "PRES-001", type: "Pressure", unit: "hPa", min: 990, max: 1030 },
    { id: "WIND-001", type: "Wind Speed", unit: "m/s", min: 0, max: 15 },
    { id: "SOIL-001", type: "Soil Moisture", unit: "%", min: 5, max: 50 },
    { id: "PH-001", type: "pH", unit: "pH", min: 6.5, max: 8.5 },
    { id: "LIGHT-001", type: "Light", unit: "lux", min: 1000, max: 100000 },
  ];

  const data = [];
  
  // RIF MOUNTAINS REGION - Focus only on this area
  for (let i = 0; i < count; i++) {
    const sensor = randomChoice(sensorTypes);
    const rifLocation = getRandomRifLocation();
    const timestamp = realisticTimestamp(startDate, endDate);
    
    // Generate realistic value based on sensor type
    const value = randomFloat(sensor.min, sensor.max);
    
    data.push({
      sensorId: sensor.id,
      sensorType: sensor.type,
      location: rifLocation.name,
      latitude: rifLocation.latitude,
      longitude: rifLocation.longitude,
      timestamp,
      value: Math.round(value * 100) / 100,
      unit: sensor.unit,
      metadata: JSON.stringify({ quality: "good", battery: randomRange(70, 100), region: "RIF" }),
    });
  }
  
  return data;
}

/**
 * Generate map layers for GIS/Cartography
 */
export function generateMapLayers(): Array<{
  name: string;
  type: "HABITAT" | "SPECIES" | "STATION_METEO" | "POINT_EAU" | "GEOLOGIE" | "MISSION";
  description: string;
  geojson: string;
  style: string;
  isVisible: boolean;
}> {
  const layers = [
    {
      name: "Missions 2024",
      type: "MISSION" as const,
      description: "Couche des missions scientifiques réalisées en 2024",
      geojson: JSON.stringify({
        type: "FeatureCollection",
        features: [],
      }),
      style: JSON.stringify({ color: "#3b82f6", opacity: 0.6 }),
      isVisible: true,
    },
    {
      name: "Répartition des espèces",
      type: "SPECIES" as const,
      description: "Carte de répartition géographique des espèces cataloguées",
      geojson: JSON.stringify({
        type: "FeatureCollection",
        features: [],
      }),
      style: JSON.stringify({ color: "#10b981", opacity: 0.5 }),
      isVisible: true,
    },
    {
      name: "Stations météorologiques",
      type: "STATION_METEO" as const,
      description: "Localisation des stations de mesure météorologique",
      geojson: JSON.stringify({
        type: "FeatureCollection",
        features: [],
      }),
      style: JSON.stringify({ color: "#8b5cf6", opacity: 0.7 }),
      isVisible: true,
    },
    {
      name: "Points d'eau",
      type: "POINT_EAU" as const,
      description: "Sources, barrages et points d'eau surveillés",
      geojson: JSON.stringify({
        type: "FeatureCollection",
        features: [],
      }),
      style: JSON.stringify({ color: "#0ea5e9", opacity: 0.6 }),
      isVisible: true,
    },
    {
      name: "Zones d'habitat",
      type: "HABITAT" as const,
      description: "Cartographie des zones d'habitat naturel",
      geojson: JSON.stringify({
        type: "FeatureCollection",
        features: [],
      }),
      style: JSON.stringify({ color: "#f59e0b", opacity: 0.5 }),
      isVisible: false,
    },
    {
      name: "Géologie régionale",
      type: "GEOLOGIE" as const,
      description: "Données géologiques et types de sols",
      geojson: JSON.stringify({
        type: "FeatureCollection",
        features: [],
      }),
      style: JSON.stringify({ color: "#ef4444", opacity: 0.6 }),
      isVisible: false,
    },
  ];

  return layers;
}

/**
 * Generate documents
 */
export function generateDocuments(
  count: number,
  userIds: string[],
  missionIds: string[]
): Array<{
  title: string;
  type: "RAPPORT_SCIENTIFIQUE" | "RAPPORT_ADMINISTRATIF" | "DONNEE_BRUTE" | "PUBLICATION" | "AUTRE";
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  version: number;
  authorId: string;
  missionId: string | null;
  isPublic: boolean;
}> {
  const documentTypes = [
    "RAPPORT_SCIENTIFIQUE",
    "RAPPORT_ADMINISTRATIF",
    "DONNEE_BRUTE",
    "PUBLICATION",
    "AUTRE",
  ] as const;

  const typeWeights = [30, 20, 25, 15, 10];

  const mimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "text/csv",
    "application/json",
  ];

  const documents = [];

  for (let i = 0; i < count; i++) {
    const type = weightedChoice(documentTypes, typeWeights);
    const authorId = randomChoice(userIds);
    const linkedToMission = Math.random() < 0.4; // 40% linked to missions
    const missionId = linkedToMission && missionIds.length > 0
      ? randomChoice(missionIds)
      : null;

    const titles: Record<string, string[]> = {
      RAPPORT_SCIENTIFIQUE: [
        "Rapport d'étude - Biodiversité marine",
        "Analyse des écosystèmes forestiers",
        "Étude climatique 2024",
        "Rapport de mission terrain",
        "Analyse des données environnementales",
      ],
      RAPPORT_ADMINISTRATIF: [
        "Rapport d'activité annuel",
        "Compte-rendu de réunion",
        "Rapport financier trimestriel",
        "Procès-verbal d'assemblée",
      ],
      DONNEE_BRUTE: [
        "Données espèces 2024",
        "Mesures climatiques brutes",
        "Observations terrain",
        "Données capteurs station météo",
      ],
      PUBLICATION: [
        "Article scientifique - Biodiversité",
        "Publication annuelle",
        "Communication scientifique",
      ],
      AUTRE: [
        "Document divers",
        "Archive",
        "Note interne",
      ],
    };

    const title = randomChoice(titles[type]);
    const fileName = `${title.toLowerCase().replace(/\s+/g, "_")}.pdf`;
    const fileSize = randomRange(100000, 5000000); // 100KB to 5MB
    const mimeType = randomChoice(mimeTypes);

    documents.push({
      title,
      type,
      description: `Document de type ${type.toLowerCase()}. ${missionId ? "Lié à une mission." : ""}`,
      fileUrl: `/documents/${fileName}`,
      fileName,
      fileSize,
      mimeType,
      version: 1,
      authorId,
      missionId,
      isPublic: type === "PUBLICATION" ? Math.random() > 0.5 : false,
    });
  }

  return documents;
}

/**
 * Generate publications
 */
export function generatePublications(): Array<{
  title: string;
  year: number;
  type: string;
  content: string;
  coverImage: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  chapters: Array<{
    title: string;
    order: number;
    content: string;
  }>;
}> {
  const currentYear = new Date().getFullYear();
  
  const publications = [
    {
      title: "Livre Annuel de la Biodiversité 2024",
      year: currentYear,
      type: "livre_annuel",
      content: "# Livre Annuel de la Biodiversité 2024\n\nRapport complet des activités et recherches menées durant l'année 2024.",
      coverImage: "/covers/annuel-2024.jpg",
      isPublished: true,
      publishedAt: new Date(currentYear, 2, 15), // March 15
      chapters: [
        { title: "Introduction", order: 1, content: "Introduction générale..." },
        { title: "Biodiversité marine", order: 2, content: "Chapitre sur la biodiversité marine..." },
        { title: "Écosystèmes terrestres", order: 3, content: "Analyse des écosystèmes..." },
        { title: "Conservation", order: 4, content: "Stratégies de conservation..." },
        { title: "Conclusion", order: 5, content: "Conclusion et perspectives..." },
      ],
    },
    {
      title: "Étude sur les espèces menacées du Maroc",
      year: currentYear - 1,
      type: "article",
      content: "Article scientifique sur les espèces menacées...",
      coverImage: null,
      isPublished: true,
      publishedAt: new Date(currentYear - 1, 8, 20),
      chapters: [
        { title: "Méthodologie", order: 1, content: "Méthodes d'étude..." },
        { title: "Résultats", order: 2, content: "Résultats de la recherche..." },
        { title: "Discussion", order: 3, content: "Discussion des résultats..." },
      ],
    },
    {
      title: "Rapport Climatique 2024",
      year: currentYear,
      type: "rapport",
      content: "Analyse des données climatiques 2024...",
      coverImage: null,
      isPublished: false,
      publishedAt: null,
      chapters: [
        { title: "Données météorologiques", order: 1, content: "Analyse des données..." },
        { title: "Tendances climatiques", order: 2, content: "Évolution du climat..." },
      ],
    },
    {
      title: "Inventaire Faunistique de l'Atlas",
      year: currentYear - 1,
      type: "livre_annuel",
      content: "Compte-rendu de l'inventaire...",
      coverImage: "/covers/atlas-2023.jpg",
      isPublished: true,
      publishedAt: new Date(currentYear - 1, 11, 1),
      chapters: [
        { title: "Méthodologie", order: 1, content: "Méthodes d'inventaire..." },
        { title: "Espèces recensées", order: 2, content: "Liste complète..." },
        { title: "Cartographie", order: 3, content: "Répartition géographique..." },
      ],
    },
  ];

  return publications;
}

/**
 * Generate leaves (congés) for employees
 */
export function generateLeaves(
  employeeIds: string[],
  startDate: Date,
  endDate: Date
): Array<{
  employeeId: string;
  type: string;
  startDate: Date;
  endDate: Date;
  status: "pending" | "approved" | "rejected";
  reason: string | null;
}> {
  const leaveTypes = ["congé", "maladie", "formation", "personnel"];
  const statuses: ("pending" | "approved" | "rejected")[] = ["pending", "approved", "rejected"];
  const statusWeights = [20, 70, 10]; // 70% approved, 20% pending, 10% rejected

  const leaves = [];
  const activeEmployeeIds = employeeIds.slice(0, Math.floor(employeeIds.length * 0.8)); // 80% of employees have leaves

  for (const employeeId of activeEmployeeIds) {
    const leaveCount = randomRange(0, 3); // 0-3 leaves per employee
    
    for (let i = 0; i < leaveCount; i++) {
      const type = randomChoice(leaveTypes);
      const leaveStart = randomDate(startDate, endDate);
      const duration = randomRange(1, 14); // 1-14 days
      const leaveEnd = addDays(leaveStart, duration);
      const status = weightedChoice(statuses, statusWeights);

      const reasons: Record<string, string[]> = {
        congé: ["Congé annuel", "Repos", "Vacances"],
        maladie: ["Arrêt maladie", "Consultation médicale"],
        formation: ["Formation professionnelle", "Stage"],
        personnel: ["Raisons personnelles", "Urgence familiale"],
      };

      leaves.push({
        employeeId,
        type,
        startDate: leaveStart,
        endDate: leaveEnd,
        status,
        reason: randomChoice(reasons[type]),
      });
    }
  }

  return leaves;
}

/**
 * Generate bonuses for employees
 */
export function generateBonuses(
  employeeIds: string[],
  startDate: Date,
  endDate: Date
): Array<{
  employeeId: string;
  type: string;
  amount: number;
  reason: string | null;
  month: number;
  year: number;
  paidAt: Date | null;
}> {
  const bonusTypes = ["terrain", "mer", "risques", "performance", "exceptionnel"];
  const bonusReasons: Record<string, string[]> = {
    terrain: ["Prime de terrain", "Mission difficile", "Conditions extrêmes"],
    mer: ["Prime maritime", "Mission en mer", "Navigation"],
    risques: ["Prime de risques", "Zone dangereuse", "Intervention urgente"],
    performance: ["Prime de performance", "Objectifs atteints", "Excellence"],
    exceptionnel: ["Prime exceptionnelle", "Récompense spéciale"],
  };

  const bonuses = [];
  const activeEmployees = employeeIds.slice(0, Math.floor(employeeIds.length * 0.6)); // 60% reçoivent des primes

  for (const employeeId of activeEmployees) {
    // 1-3 primes par employé sur la période
    const bonusCount = randomRange(1, 3);
    
    for (let i = 0; i < bonusCount; i++) {
      const bonusDate = randomDate(startDate, endDate);
      const month = bonusDate.getMonth() + 1;
      const year = bonusDate.getFullYear();
      const type = randomChoice(bonusTypes);
      const amount = randomRange(500, 3000); // 500-3000 MAD
      const reason = randomChoice(bonusReasons[type]);
      const paidAt = addDays(bonusDate, randomRange(0, 15)); // Payé dans les 15 jours

      bonuses.push({
        employeeId,
        type,
        amount,
        reason,
        month,
        year,
        paidAt,
      });
    }
  }

  return bonuses;
}

/**
 * Generate evaluations for employees
 */
export function generateEvaluations(
  employeeIds: string[],
  evaluatorIds: string[],
  startYear: number,
  endYear: number
): Array<{
  employeeId: string;
  evaluatorId: string;
  period: string;
  year: number;
  score: number | null;
  comments: string | null;
}> {
  const periods = ["Q1", "Q2", "Q3", "Q4", "Annual"];
  const evaluations = [];

  for (const employeeId of employeeIds) {
    for (let year = startYear; year <= endYear; year++) {
      // 60% ont des évaluations trimestrielles, 40% seulement annuelle
      const hasQuarterly = Math.random() > 0.4;
      
      if (hasQuarterly) {
        // Évaluations trimestrielles (Q1-Q4)
        for (const period of ["Q1", "Q2", "Q3", "Q4"]) {
          const score = randomRange(6, 10); // Scores entre 6-10
          const evaluatorId = randomChoice(evaluatorIds);
          const comments = [
            "Performance satisfaisante",
            "Très bon travail",
            "Objectifs atteints",
            "Excellente contribution",
            "À améliorer sur certains points",
          ];

          evaluations.push({
            employeeId,
            evaluatorId,
            period,
            year,
            score,
            comments: randomChoice(comments),
          });
        }
      } else {
        // Seulement évaluation annuelle
        const score = randomRange(6, 10);
        const evaluatorId = randomChoice(evaluatorIds);
        
        evaluations.push({
          employeeId,
          evaluatorId,
          period: "Annual",
          year,
          score,
          comments: "Évaluation annuelle",
        });
      }
    }
  }

  return evaluations;
}

/**
 * Generate geology data
 */
export function generateGeologyData(
  count: number,
  startDate: Date,
  endDate: Date
): Array<{
  location: string;
  latitude: number;
  longitude: number;
  date: Date;
  soilType: string | null;
  rockType: string | null;
  composition: string | null;
  notes: string | null;
}> {
  const locations = MOROCCAN_LOCATIONS;
  const soilTypes = [
    "Argileux",
    "Sableux",
    "Limon",
    "Calcaire",
    "Basaltique",
    "Granitique",
    "Schisteux",
    "Marneux",
  ];
  
  const rockTypes = [
    "Calcaire",
    "Grès",
    "Granite",
    "Basalte",
    "Schiste",
    "Marbre",
    "Quartzite",
    "Gneiss",
  ];

  const compositions = [
    "Principalement silice",
    "Mélange carbonaté",
    "Composition métamorphique",
    "Roches sédimentaires",
    "Roches ignées",
  ];

  const data = [];

  for (let i = 0; i < count; i++) {
    const location = randomChoice(locations);
    const date = randomDate(startDate, endDate);
    const latitude = randomRange(21000, 36000) / 1000;
    const longitude = randomRange(-17000, -1000) / 1000;
    const soilType = randomChoice(soilTypes);
    const rockType = randomChoice(rockTypes);
    const composition = randomChoice(compositions);

    data.push({
      location,
      latitude,
      longitude,
      date,
      soilType,
      rockType,
      composition,
      notes: `Analyse géologique réalisée à ${location}. Type de sol: ${soilType}, Type de roche: ${rockType}.`,
    });
  }

  return data;
}

/**
 * Generate species references (bibliographic references)
 */
export function generateSpeciesReferences(
  speciesIds: string[]
): Array<{
  speciesId: string;
  title: string;
  authors: string | null;
  journal: string | null;
  year: number | null;
  url: string | null;
}> {
  const journals = [
    "Journal of Ecology",
    "Marine Biology",
    "Conservation Biology",
    "African Journal of Ecology",
    "Biodiversity and Conservation",
    "Biological Conservation",
  ];

  const authors = [
    "Smith et al.",
    "Johnson, M.",
    "Ben Ali, A.",
    "El Fassi, M.",
    "Bennani, K.",
    "Cherkaoui, S.",
    "Lamrani, H.",
  ];

  const references = [];
  
  // 50% des espèces ont des références (1-3 par espèce)
  const speciesWithRefs = speciesIds.slice(0, Math.floor(speciesIds.length * 0.5));

  for (const speciesId of speciesWithRefs) {
    const refCount = randomRange(1, 3);
    
    for (let i = 0; i < refCount; i++) {
      const year = randomRange(2015, new Date().getFullYear());
      const author = randomChoice(authors);
      const journal = randomChoice(journals);
      const title = `Study on species biodiversity in Morocco (${year})`;

      references.push({
        speciesId,
        title,
        authors: author,
        journal,
        year,
        url: `https://example.com/paper-${speciesId}-${i}`,
      });
    }
  }

  return references;
}

/**
 * Generate user permissions
 */
export function generateUserPermissions(
  userIds: string[]
): Array<{
  userId: string;
  module: string;
  permission: "READ" | "WRITE" | "VALIDATE" | "DELETE" | "ADMIN";
}> {
  const modules = [
    "missions",
    "species",
    "equipment",
    "documents",
    "finance",
    "rh",
    "environment",
    "publications",
  ];

  const permissions = ["READ", "WRITE", "VALIDATE", "DELETE", "ADMIN"] as const;
  
  // Permissions par rôle (simplifié)
  const rolePermissions: Record<string, { modules: string[]; permissions: string[] }> = {
    DIRECTEUR_SCIENTIFIQUE: {
      modules: ["missions", "species", "documents", "publications", "environment"],
      permissions: ["READ", "WRITE", "VALIDATE", "DELETE", "ADMIN"],
    },
    DIRECTEUR_ADMINISTRATIF_FINANCIER: {
      modules: ["finance", "rh", "equipment"],
      permissions: ["READ", "WRITE", "VALIDATE", "DELETE", "ADMIN"],
    },
    BOTANISTE: {
      modules: ["species", "missions", "environment"],
      permissions: ["READ", "WRITE", "VALIDATE"],
    },
    DATA_SCIENTIST_SIG: {
      modules: ["environment", "species", "missions"],
      permissions: ["READ", "WRITE"],
    },
    TECHNICIEN_TERRAIN: {
      modules: ["missions", "equipment"],
      permissions: ["READ", "WRITE"],
    },
  };

  const userPerms = [];

  for (const userId of userIds) {
    // Pour simplifier, donnons des permissions READ/WRITE basiques à tous
    // Dans un vrai système, cela dépendrait du rôle de l'utilisateur
    
    const userModules = randomChoices(modules, randomRange(2, 5));
    
    for (const moduleName of userModules) {
      // Donner READ à tous pour leurs modules
      userPerms.push({
        userId,
        module: moduleName,
        permission: "READ" as const,
      });

      // 70% ont aussi WRITE
      if (Math.random() > 0.3) {
        userPerms.push({
          userId,
          module: moduleName,
          permission: "WRITE" as const,
        });
      }

      // 20% ont VALIDATE
      if (Math.random() > 0.8) {
        userPerms.push({
          userId,
          module: moduleName,
          permission: "VALIDATE" as const,
        });
      }
    }
  }

  return userPerms;
}

/**
 * Generate payments for invoices
 */
export function generatePayments(
  invoices: Array<{ id: string; amount: number; date: Date; status: string }>
): Array<{
  invoiceId: string;
  amount: number;
  date: Date;
  method: string;
  reference: string;
}> {
  const paymentMethods = ["bank transfer", "check", "cash"];
  const payments = [];
  
  // Only generate payments for paid invoices
  const paidInvoices = invoices.filter((inv) => inv.status === "paid");
  
  for (const invoice of paidInvoices) {
    const method = randomChoice(paymentMethods);
    const paymentDate = addDays(invoice.date, randomRange(0, 45)); // Paid within 45 days
    
    // Generate payment reference
    const ref = `PAY-${new Date(paymentDate).getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`;
    
    payments.push({
      invoiceId: invoice.id,
      amount: invoice.amount,
      date: paymentDate,
      method,
      reference: ref,
    });
  }
  
  return payments;
}

