/**
 * @file validations.ts
 * @description src/lib/validations.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 267
 * @size 8.05 KB
 */
import { z } from "zod";

// SchÃ©ma de validation pour les utilisateurs
export const userSchema = z.object({
  firstName: z.string().min(2, "Le prÃ©nom doit contenir au moins 2 caractÃ¨res"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractÃ¨res"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractÃ¨res"),
  role: z.enum([
    "DIRECTEUR_SCIENTIFIQUE",
    "DIRECTEUR_ADMINISTRATIF_FINANCIER",
    "BOTANISTE",
    "ZOOLOGISTE_TERRESTRE",
    "BIOLOGISTE_MARIN",
    "HYDROBIOLOGISTE",
    "GEOLOGUE",
    "CLIMATOLOGUE",
    "DATA_SCIENTIST_SIG",
    "INGENIEUR_PLATEFORMES",
    "TECHNICIEN_LABORATOIRE",
    "TECHNICIEN_TERRAIN",
    "MARIN_PILOTE_BATEAU",
    "LOGISTICIEN",
    "COMMUNICATION_EDITION",
  ]),
});

// SchÃ©ma de validation pour les employÃ©s
export const employeeSchema = z.object({
  userId: z.string().optional(),
  employeeNumber: z.string().min(1, "Le numÃ©ro d'employÃ© est requis"),
  hireDate: z.string().min(1, "La date d'embauche est requise"),
  contractType: z.enum(["CDI", "CDD", "STAGE", "CONSULTANT"]),
  contractStart: z.string().min(1, "La date de dÃ©but du contrat est requise"),
  contractEnd: z.string().optional(),
  baseSalary: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    },
    { message: "Le salaire doit Ãªtre un nombre positif" }
  ),
});

// SchÃ©ma de validation pour les Ã©quipements
export const equipmentSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  category: z.enum([
    "VEHICULE",
    "BATEAU",
    "EQUIPEMENT_SCIENTIFIQUE",
    "INFORMATIQUE",
    "CAMPING_TERRAIN",
    "LABORATOIRE",
  ]),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.string().optional().refine(
    (val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    },
    { message: "Le prix doit Ãªtre un nombre positif" }
  ),
  lifespan: z.string().optional().refine(
    (val) => {
      if (!val) return true;
      const num = parseInt(val);
      return !isNaN(num) && num > 0;
    },
    { message: "La durÃ©e de vie doit Ãªtre un nombre positif" }
  ),
  location: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["AVAILABLE", "IN_USE", "MAINTENANCE", "RETIRED"]),
});

// SchÃ©ma de validation pour les missions
export const missionSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  startDate: z.string().min(1, "La date de dÃ©but est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  location: z.string().min(1, "La localisation est requise"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  objectives: z.string().optional(),
});

// SchÃ©ma de validation pour les espÃ¨ces
export const speciesSchema = z.object({
  scientificName: z.string().min(1, "Le nom scientifique est requis"),
  commonName: z.string().optional(),
  type: z.enum(["FLORE_TERRESTRE", "FAUNE_TERRESTRE", "FAUNE_MARINE", "ESPECE_EAU_DOUCE"]),
  iucnStatus: z.enum([
    "LC",
    "NT",
    "VU",
    "EN",
    "CR",
    "EW",
    "EX",
    "DD",
    "NE",
  ]).optional(),
  habitat: z.string().optional(),
  description: z.string().optional(),
});

// SchÃ©ma de validation pour les budgets
export const budgetSchema = z.object({
  year: z.string().refine(
    (val) => {
      const year = parseInt(val);
      return !isNaN(year) && year >= 2020 && year <= 2100;
    },
    { message: "L'annÃ©e doit Ãªtre entre 2020 et 2100" }
  ),
  totalAmount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    },
    { message: "Le montant total doit Ãªtre un nombre positif" }
  ),
});

// SchÃ©ma de validation pour les dÃ©penses
export const expenseSchema = z.object({
  description: z.string().min(1, "La description est requise"),
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Le montant doit Ãªtre un nombre positif" }
  ),
  category: z.string().min(1, "La catÃ©gorie est requise"),
  date: z.string().min(1, "La date est requise"),
  projectId: z.string().optional(),
});

// SchÃ©ma de validation pour la qualitÃ© de l'eau
export const waterQualitySchema = z.object({
  type: z.enum(["MER", "SOURCE", "BARRAGE"]),
  location: z.string().min(1, "La localisation est requise"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  date: z.string().min(1, "La date est requise"),
  ph: z.string().optional(),
  temperature: z.string().optional(),
  dissolvedO2: z.string().optional(),
  turbidity: z.string().optional(),
  salinity: z.string().optional(),
  notes: z.string().optional(),
});

// SchÃ©ma de validation pour la qualitÃ© de l'air
export const airQualitySchema = z.object({
  location: z.string().min(1, "La localisation est requise"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  date: z.string().min(1, "La date est requise"),
  pm25: z.string().optional(),
  pm10: z.string().optional(),
  no2: z.string().optional(),
  o3: z.string().optional(),
  co: z.string().optional(),
  notes: z.string().optional(),
});

// SchÃ©ma de validation pour les donnÃ©es climatiques
export const climateDataSchema = z.object({
  stationId: z.string().optional(),
  location: z.string().min(1, "La localisation est requise"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  date: z.string().min(1, "La date est requise"),
  temperature: z.string().optional(),
  humidity: z.string().optional(),
  pressure: z.string().optional(),
  windSpeed: z.string().optional(),
  windDirection: z.string().optional(),
  precipitation: z.string().optional(),
  notes: z.string().optional(),
});

// SchÃ©ma de validation pour les congÃ©s
export const leaveSchema = z.object({
  employeeId: z.string().min(1, "L'employÃ© est requis"),
  type: z.string().min(1, "Le type de congÃ© est requis"),
  startDate: z.string().min(1, "La date de dÃ©but est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
  status: z.enum(["pending", "approved", "rejected"]).optional().default("pending"),
  reason: z.string().optional(),
});

// SchÃ©ma de validation pour les salaires
export const salarySchema = z.object({
  employeeId: z.string().min(1, "L'employÃ© est requis"),
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Le montant doit Ãªtre un nombre positif" }
  ),
  month: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 1 && num <= 12;
    },
    { message: "Le mois doit Ãªtre entre 1 et 12" }
  ),
  year: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 2020 && num <= 2100;
    },
    { message: "L'annÃ©e doit Ãªtre entre 2020 et 2100" }
  ),
  paidAt: z.string().optional(),
});

// SchÃ©ma de validation pour les documents
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
  isPublic: z.boolean().optional().default(false),
});

// SchÃ©ma de validation pour les publications
export const publicationSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  type: z.enum(["LIVRE_ANNUEL", "ARTICLE", "RAPPORT", "AUTRE"]),
  year: z.string().refine(
    (val) => {
      const year = parseInt(val);
      return !isNaN(year) && year >= 2020 && year <= 2100;
    },
    { message: "L'annÃ©e doit Ãªtre entre 2020 et 2100" }
  ),
  status: z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED"]).optional().default("DRAFT"),
  description: z.string().optional(),
});

