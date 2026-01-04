/**
 * @file map-charts.tsx
 * @description src/components/map/map-charts.tsx
 * @author github-actions[bot]
 * @created 2026-01-04
 * @updated 2026-01-04
 * @updates 1
 * @lines 295
 * @size 8.65 KB
 */
"use client";

import { useMemo, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

interface MapChartsProps {
  species?: Array<{
    type?: string;
    iucnStatus?: string;
    observedAt?: string;
  }>;
  missions?: Array<{
    status?: string;
    startDate?: string;
  }>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const SPECIES_TYPE_LABELS: Record<string, string> = {
  FLORE_TERRESTRE: "🌿 Flore",
  FAUNE_TERRESTRE: "🦌 Faune terrestre",
  FAUNE_MARINE: "🐠 Faune marine",
  ESPECE_EAU_DOUCE: "🐟 Eau douce",
};

const IUCN_LABELS: Record<string, string> = {
  LC: "Préoccupation mineure",
  NT: "Quasi menacé",
  VU: "Vulnérable",
  EN: "En danger",
  CR: "En danger critique",
};

export function MapCharts({ species = [], missions = [] }: MapChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  // Calculate species by type
  const speciesByType = useMemo(() => {
    const typeMap = new Map<string, number>();
    species.forEach((s) => {
      if (s.type) {
        const current = typeMap.get(s.type) || 0;
        typeMap.set(s.type, current + 1);
      }
    });

    return Array.from(typeMap.entries())
      .map(([type, count]) => ({
        name: SPECIES_TYPE_LABELS[type] || type,
        value: count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [species]);

  // Calculate species by IUCN status
  const speciesByIUCN = useMemo(() => {
    const iucnMap = new Map<string, number>();
    species.forEach((s) => {
      if (s.iucnStatus) {
        const current = iucnMap.get(s.iucnStatus) || 0;
        iucnMap.set(s.iucnStatus, current + 1);
      }
    });

    return Array.from(iucnMap.entries())
      .map(([status, count]) => ({
        name: IUCN_LABELS[status] || status,
        value: count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [species]);

  // Calculate observations by month (last 6 months)
  const observationsByMonth = useMemo(() => {
    const monthMap = new Map<string, number>();
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthMap.set(monthKey, 0);
    }

    species.forEach((s) => {
      if (s.observedAt) {
        const date = new Date(s.observedAt);
        const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        if (monthMap.has(monthKey)) {
          const current = monthMap.get(monthKey) || 0;
          monthMap.set(monthKey, current + 1);
        }
      }
    });

    return Array.from(monthMap.entries()).map(([month, count]) => ({
      month,
      count,
    }));
  }, [species]);

  // Calculate missions by status
  const missionsByStatus = useMemo(() => {
    const statusMap = new Map<string, number>();
    missions.forEach((m) => {
      if (m.status) {
        const current = statusMap.get(m.status) || 0;
        statusMap.set(m.status, current + 1);
      }
    });

    return Array.from(statusMap.entries()).map(([status, count]) => {
      let label = status;
      if (status === "completed") label = "Terminées";
      else if (status === "in_progress") label = "En cours";
      else if (status === "planned") label = "Planifiées";
      else if (status === "cancelled") label = "Annulées";

      return { name: label, value: count };
    });
  }, [missions]);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6" variant="elevated">
            <div className="h-[280px] flex items-center justify-center text-muted-foreground">
              Chargement...
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Statistiques & Graphiques
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution des espèces par type */}
        {speciesByType.length > 0 && (
          <Card className="p-6" variant="elevated">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Distribution des espèces par type
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={speciesByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {speciesByType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Distribution par statut IUCN */}
        {speciesByIUCN.length > 0 && (
          <Card className="p-6" variant="elevated">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Distribution par statut IUCN
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={speciesByIUCN}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Nombre d'espèces" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Évolution des observations */}
        {observationsByMonth.some((m) => m.count > 0) && (
          <Card className="p-6" variant="elevated">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Évolution des observations (6 derniers mois)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={observationsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Observations"
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Missions par statut */}
        {missionsByStatus.length > 0 && (
          <Card className="p-6" variant="elevated">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Missions par statut
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={missionsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {missionsByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </div>
  );
}

