"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
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

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

const typeLabels: Record<string, string> = {
  FLORE_TERRESTRE: "Flore Terrestre",
  FAUNE_TERRESTRE: "Faune Terrestre",
  FAUNE_MARINE: "Faune Marine",
  ESPECE_EAU_DOUCE: "Espèce Eau Douce",
};

const iucnLabels: Record<string, string> = {
  LC: "Préoccupation mineure",
  NT: "Quasi menacé",
  VU: "Vulnérable",
  EN: "En danger",
  CR: "En danger critique",
  EW: "Éteint à l'état sauvage",
  EX: "Éteint",
  DD: "Données insuffisantes",
  NE: "Non évalué",
};

interface SpeciesChartsProps {
  species: Array<{
    type: string;
    iucnStatus: string | null;
    habitat: string | null;
    _count: {
      observations: number;
    };
  }>;
  observations: Array<{
    date: string;
    quantity?: number | null;
  }>;
}

export function SpeciesCharts({ species, observations }: SpeciesChartsProps) {
  // Distribution par type
  const typeDistribution = Object.entries(
    species.reduce((acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count]) => ({
    name: typeLabels[type] || type,
    value: count,
  }));

  // Répartition par statut IUCN
  const iucnDistribution = Object.entries(
    species.reduce((acc, s) => {
      const status = s.iucnStatus || "NE";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({
    name: iucnLabels[status] || status,
    value: count,
  }));

  // Répartition par habitat
  const habitatDistribution = Object.entries(
    species
      .filter((s) => s.habitat)
      .reduce((acc, s) => {
        const habitat = s.habitat || "Non spécifié";
        acc[habitat] = (acc[habitat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
  )
    .map(([habitat, count]) => ({
      name: habitat.length > 20 ? habitat.substring(0, 20) + "..." : habitat,
      fullName: habitat,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Évolution temporelle des observations (par mois, 12 derniers mois)
  const monthlyObservations = new Map<string, number>();
  const monthNames = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    monthlyObservations.set(monthKey, 0);
  }

  observations.forEach((obs) => {
    const date = new Date(obs.date);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    const current = monthlyObservations.get(monthKey) || 0;
    monthlyObservations.set(
      monthKey,
      current + (obs.quantity || 1)
    );
  });

  const observationTrends = Array.from(monthlyObservations.entries()).map(
    ([month, count]) => ({
      month,
      observations: count,
    })
  );

  // Total observations par espèce (top 10)
  const topSpecies = species
    .map((s) => ({
      name: (s as any).scientificName?.substring(0, 20) || "Inconnu",
      observations: s._count.observations,
    }))
    .sort((a, b) => b.observations - a.observations)
    .slice(0, 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribution par type */}
      <Card variant="elevated" className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Distribution par Type
        </h3>
        {typeDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {typeDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Aucune donnée disponible
          </div>
        )}
      </Card>

      {/* Répartition par statut IUCN */}
      <Card variant="elevated" className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Répartition par Statut IUCN
        </h3>
        {iucnDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={iucnDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" name="Nombre d'espèces" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Aucune donnée disponible
          </div>
        )}
      </Card>

      {/* Évolution temporelle des observations */}
      <Card variant="elevated" className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Évolution des Observations (12 derniers mois)
        </h3>
        {observationTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={observationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="observations"
                stroke="#10b981"
                strokeWidth={2}
                name="Observations"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Aucune donnée disponible
          </div>
        )}
      </Card>

      {/* Répartition par habitat */}
      <Card variant="elevated" className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Répartition par Habitat (Top 10)
        </h3>
        {habitatDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={habitatDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  value,
                  props.payload.fullName || props.payload.name,
                ]}
              />
              <Bar dataKey="value" fill="#8b5cf6" name="Nombre d'espèces" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Aucune donnée disponible
          </div>
        )}
      </Card>

      {/* Top 10 espèces les plus observées */}
      {topSpecies.length > 0 && (
        <Card variant="elevated" className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Top 10 Espèces les Plus Observées
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSpecies}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="observations" fill="#f59e0b" name="Observations" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}

