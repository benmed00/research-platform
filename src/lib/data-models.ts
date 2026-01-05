/**
 * @file data-models.ts
 * @description src/lib/data-models.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 320
 * @size 6.49 KB
 */
// ============================================
// CORE ENTITY MODELS
// ============================================

/**
 * User Model
 * Represents platform users with role-based access control
 */
export interface UserModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole =
  | "DIRECTEUR_SCIENTIFIQUE"
  | "DIRECTEUR_ADMINISTRATIF_FINANCIER"
  | "BOTANISTE"
  | "ZOOLOGISTE_TERRESTRE"
  | "BIOLOGISTE_MARIN"
  | "HYDROBIOLOGISTE"
  | "GEOLOGUE"
  | "CLIMATOLOGUE"
  | "DATA_SCIENTIST_SIG"
  | "INGENIEUR_PLATEFORMES"
  | "TECHNICIEN_LABORATOIRE"
  | "TECHNICIEN_TERRAIN"
  | "MARIN_PILOTE_BATEAU"
  | "LOGISTICIEN"
  | "COMMUNICATION_EDITION";

/**
 * Employee Model
 * Represents organizational employees with HR information
 */
export interface EmployeeModel {
  id: string;
  userId: string | null;
  employeeNumber: string;
  hireDate: Date;
  contractType: ContractType;
  contractStart: Date;
  contractEnd: Date | null;
  baseSalary: number;
  isActive: boolean;
}

export type ContractType = "CDI" | "CDD" | "Stage" | "Consultant" | "Volontaire";

/**
 * Mission Model
 * Represents field research missions and campaigns
 */
export interface MissionModel {
  id: string;
  title: string;
  description: string | null;
  creatorId: string;
  startDate: Date;
  endDate: Date;
  location: string;
  latitude: number | null;
  longitude: number | null;
  objectives: string | null;
  status: MissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type MissionStatus = "planned" | "in_progress" | "completed" | "cancelled";

/**
 * Species Model
 * Represents cataloged biological species
 */
export interface SpeciesModel {
  id: string;
  scientificName: string;
  commonName: string | null;
  type: SpeciesType;
  iucnStatus: IUCNStatus | null;
  habitat: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SpeciesType =
  | "FLORE_TERRESTRE"
  | "FAUNE_TERRESTRE"
  | "FAUNE_MARINE"
  | "ESPECE_EAU_DOUCE";

export type IUCNStatus =
  | "LC" // Least Concern
  | "NT" // Near Threatened
  | "VU" // Vulnerable
  | "EN" // Endangered
  | "CR" // Critically Endangered
  | "EW" // Extinct in the Wild
  | "EX" // Extinct
  | "DD" // Data Deficient
  | "NE"; // Not Evaluated

/**
 * Species Observation Model
 * Time-series data of species sightings and counts
 */
export interface SpeciesObservationModel {
  id: string;
  speciesId: string;
  date: Date;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  quantity: number | null;
  notes: string | null;
  observerId: string | null;
  missionId: string | null;
  createdAt: Date;
}

/**
 * Equipment Model
 * Represents physical equipment and assets
 */
export interface EquipmentModel {
  id: string;
  name: string;
  category: EquipmentCategory;
  serialNumber: string | null;
  purchaseDate: Date | null;
  purchasePrice: number | null;
  lifespan: number | null;
  status: EquipmentStatus;
  location: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type EquipmentCategory =
  | "VEHICULE"
  | "BATEAU"
  | "EQUIPEMENT_SCIENTIFIQUE"
  | "INFORMATIQUE"
  | "CAMPING_TERRAIN"
  | "LABORATOIRE";

export type EquipmentStatus = "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "RETIRED";

/**
 * Financial Models
 */
export interface BudgetModel {
  id: string;
  year: number;
  totalAmount: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseModel {
  id: string;
  budgetId: string | null;
  grantId: string | null;
  projectId: string | null;
  category: string;
  amount: number;
  description: string;
  date: Date;
  invoiceId: string | null;
  createdAt: Date;
}

/**
 * Environmental Data Models
 */
export interface ClimateDataModel {
  id: string;
  stationId: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  date: Date;
  temperature: number | null;
  humidity: number | null;
  pressure: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  precipitation: number | null;
  notes: string | null;
  createdAt: Date;
}

export interface AirQualityModel {
  id: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  date: Date;
  pm25: number | null;
  pm10: number | null;
  no2: number | null;
  o3: number | null;
  co: number | null;
  notes: string | null;
  createdAt: Date;
}

/**
 * Activity & Audit Models
 */
export interface LoginLogModel {
  id: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  success: boolean;
  timestamp: Date;
}

export interface AuditLogModel {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  changes: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  timestamp: Date;
}

// ============================================
// DASHBOARD ANALYTICS MODELS
// ============================================

/**
 * Time-series data point for charts
 */
export interface TimeSeriesPoint {
  date: Date;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

/**
 * Aggregated metric for KPI cards
 */
export interface Metric {
  label: string;
  value: number | string;
  change?: number; // percentage change
  trend?: "up" | "down" | "stable";
  unit?: string;
}

/**
 * Segmented data for pie/bar charts
 */
export interface SegmentedData {
  label: string;
  value: number;
  percentage?: number;
  color?: string;
}

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  timeRange: {
    days: number; // 30, 90, 365
    startDate: Date;
    endDate: Date;
  };
  metrics: {
    totalUsers: number;
    totalEmployees: number;
    totalEquipment: number;
    totalMissions: number;
    totalSpecies: number;
    activeMissions: number;
    completedMissions: number;
    budgetUtilization: number;
    equipmentUtilization: number;
  };
  trends: {
    missionsOverTime: TimeSeriesPoint[];
    speciesDiscoveredOverTime: TimeSeriesPoint[];
    expensesOverTime: TimeSeriesPoint[];
    userActivityOverTime: TimeSeriesPoint[];
  };
  segmentations: {
    missionsByStatus: SegmentedData[];
    speciesByType: SegmentedData[];
    equipmentByStatus: SegmentedData[];
    expensesByCategory: SegmentedData[];
  };
}

