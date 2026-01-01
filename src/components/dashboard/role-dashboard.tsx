/**
 * @file role-dashboard.tsx
 * @description src/components/dashboard/role-dashboard.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 246
 * @size 8.71 KB
 */
"use client";

import { useMemo, memo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  DollarSign,
  Package,
  MapPin,
  Database,
  Cloud,
  FileText,
  BookOpen,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface RoleDashboardProps {
  role: string;
  stats: {
    totalUsers?: number;
    totalEmployees?: number;
    totalEquipment?: number;
    totalMissions?: number;
    totalSpecies?: number;
    currentYearBudget?: string;
  };
}

const roleConfig: Record<string, {
  title: string;
  quickActions: Array<{ label: string; href: string; icon: any }>;
  relevantStats: string[];
  description: string;
}> = {
  DIRECTEUR_SCIENTIFIQUE: {
    title: "Tableau de bord - Directeur Scientifique",
    description: "Vue d'ensemble des activités scientifiques et de recherche",
    quickActions: [
      { label: "Nouvelle mission", href: "/dashboard/missions/new", icon: MapPin },
      { label: "Nouvelle espèce", href: "/dashboard/species/new", icon: Database },
      { label: "Nouvelle publication", href: "/dashboard/publications/new", icon: BookOpen },
      { label: "Calendrier", href: "/dashboard/calendar", icon: Calendar },
    ],
    relevantStats: ["totalMissions", "totalSpecies"],
  },
  DIRECTEUR_ADMINISTRATIF_FINANCIER: {
    title: "Tableau de bord - Directeur Administratif & Financier",
    description: "Vue d'ensemble administrative et financière",
    quickActions: [
      { label: "Finances", href: "/dashboard/finance", icon: DollarSign },
      { label: "Ressources Humaines", href: "/dashboard/rh", icon: Users },
      { label: "Matériel", href: "/dashboard/equipment", icon: Package },
      { label: "Calendrier", href: "/dashboard/calendar", icon: Calendar },
    ],
    relevantStats: ["totalEmployees", "currentYearBudget"],
  },
  BOTANISTE: {
    title: "Tableau de bord - Botaniste",
    description: "Gestion des espèces végétales et missions terrain",
    quickActions: [
      { label: "Espèces", href: "/dashboard/species", icon: Database },
      { label: "Nouvelle espèce", href: "/dashboard/species/new", icon: Database },
      { label: "Missions", href: "/dashboard/missions", icon: MapPin },
      { label: "Cartographie", href: "/dashboard/maps", icon: MapPin },
    ],
    relevantStats: ["totalSpecies", "totalMissions"],
  },
  ZOOLOGISTE_TERRESTRE: {
    title: "Tableau de bord - Zoologiste Terrestre",
    description: "Gestion de la faune terrestre",
    quickActions: [
      { label: "Espèces", href: "/dashboard/species", icon: Database },
      { label: "Missions", href: "/dashboard/missions", icon: MapPin },
      { label: "Cartographie", href: "/dashboard/maps", icon: MapPin },
    ],
    relevantStats: ["totalSpecies", "totalMissions"],
  },
  BIOLOGISTE_MARIN: {
    title: "Tableau de bord - Biologiste Marin",
    description: "Gestion de la faune marine",
    quickActions: [
      { label: "Espèces", href: "/dashboard/species", icon: Database },
      { label: "Données environnementales", href: "/dashboard/environment", icon: Cloud },
      { label: "Missions", href: "/dashboard/missions", icon: MapPin },
    ],
    relevantStats: ["totalSpecies", "totalMissions"],
  },
  DATA_SCIENTIST_SIG: {
    title: "Tableau de bord - Data Scientist / SIG",
    description: "Gestion des données et cartographie",
    quickActions: [
      { label: "Cartographie", href: "/dashboard/maps", icon: MapPin },
      { label: "Données environnementales", href: "/dashboard/environment", icon: Cloud },
      { label: "Documents", href: "/dashboard/documents", icon: FileText },
    ],
    relevantStats: ["totalSpecies", "totalMissions"],
  },
  TECHNICIEN_TERRAIN: {
    title: "Tableau de bord - Technicien Terrain",
    description: "Missions et équipements terrain",
    quickActions: [
      { label: "Missions", href: "/dashboard/missions", icon: MapPin },
      { label: "Calendrier", href: "/dashboard/calendar", icon: Calendar },
      { label: "Équipements", href: "/dashboard/equipment", icon: Package },
    ],
    relevantStats: ["totalMissions", "totalEquipment"],
  },
};

const statLabels: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
  totalUsers: {
    label: "Utilisateurs actifs",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900",
  },
  totalEmployees: {
    label: "Employés",
    icon: Users,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900",
  },
  totalEquipment: {
    label: "Équipements",
    icon: Package,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900",
  },
  totalMissions: {
    label: "Missions",
    icon: MapPin,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900",
  },
  totalSpecies: {
    label: "Espèces cataloguées",
    icon: Database,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900",
  },
  currentYearBudget: {
    label: "Budget annuel",
    icon: DollarSign,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900",
  },
};

function RoleDashboardComponent({ role, stats }: RoleDashboardProps) {
  const config = useMemo(() => roleConfig[role] || {
    title: "Tableau de bord",
    description: "Vue d'ensemble de la plateforme",
    quickActions: [
      { label: "Tableau de bord", href: "/dashboard", icon: TrendingUp },
    ],
    relevantStats: [],
  }, [role]);

  const relevantStats = useMemo(() => {
    return config.relevantStats
      .map((key) => {
        const statConfig = statLabels[key];
        if (!statConfig) return null;
        return {
          key,
          ...statConfig,
          value: stats[key as keyof typeof stats],
        };
      })
      .filter(Boolean) as Array<{
        key: string;
        label: string;
        icon: any;
        color: string;
        bgColor: string;
        value: number | string | undefined;
      }>;
  }, [config.relevantStats, stats]);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {config.title}
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400">{config.description}</p>
      </div>

      {/* Relevant Stats */}
      {relevantStats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relevantStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.key} className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                      {stat.value ?? "N/A"}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <Card className="p-6" variant="elevated">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Actions rapides
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {config.quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col items-center justify-center p-5 gap-3 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 transition-colors duration-200"
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export const RoleDashboard = memo(RoleDashboardComponent);

