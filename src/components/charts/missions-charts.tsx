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

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const statusLabels: Record<string, string> = {
  planned: "Planifiée",
  in_progress: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
};

interface MissionsChartsProps {
  missions: Array<{
    status: string;
    startDate: string;
    endDate: string | null;
    creator: {
      firstName: string;
      lastName: string;
    };
    teams: Array<{
      user: {
        firstName: string;
        lastName: string;
      };
    }>;
  }>;
}

export function MissionsCharts({ missions }: MissionsChartsProps) {
  // Distribution par statut
  const statusDistribution = Object.entries(
    missions.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({
    name: statusLabels[status] || status,
    value: count,
  }));

  // Missions par mois (12 derniers mois)
  const monthlyMissions = new Map<string, { started: number; completed: number }>();
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
    monthlyMissions.set(monthKey, { started: 0, completed: 0 });
  }

  missions.forEach((mission) => {
    // Missions démarrées
    if (mission.startDate) {
      const startDate = new Date(mission.startDate);
      const monthKey = `${monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`;
      const current = monthlyMissions.get(monthKey);
      if (current) {
        current.started += 1;
      }
    }

    // Missions terminées
    if (mission.endDate && mission.status === "completed") {
      const endDate = new Date(mission.endDate);
      const monthKey = `${monthNames[endDate.getMonth()]} ${endDate.getFullYear()}`;
      const current = monthlyMissions.get(monthKey);
      if (current) {
        current.completed += 1;
      }
    }
  });

  const missionsTrends = Array.from(monthlyMissions.entries()).map(
    ([month, data]) => ({
      month,
      démarrées: data.started,
      terminées: data.completed,
    })
  );

  // Missions par créateur (top 10)
  const missionsByCreator = Object.entries(
    missions.reduce((acc, m) => {
      const creatorName = `${m.creator.firstName} ${m.creator.lastName}`;
      acc[creatorName] = (acc[creatorName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, count]) => ({
      name: name.length > 20 ? name.substring(0, 20) + "..." : name,
      fullName: name,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Répartition par taille d'équipe
  const teamSizeDistribution = Object.entries(
    missions.reduce((acc, m) => {
      const teamSize = m.teams.length || 0;
      const sizeCategory =
        teamSize === 0
          ? "Aucun membre"
          : teamSize === 1
          ? "1 membre"
          : teamSize <= 3
          ? "2-3 membres"
          : teamSize <= 5
          ? "4-5 membres"
          : "6+ membres";
      acc[sizeCategory] = (acc[sizeCategory] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, count]) => ({
    name: category,
    value: count,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribution par statut */}
      <Card variant="elevated" className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Répartition par Statut
        </h3>
        {statusDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
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
                {statusDistribution.map((entry, index) => (
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

      {/* Répartition par taille d'équipe */}
      <Card variant="elevated" className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Répartition par Taille d&apos;Équipe
        </h3>
        {teamSizeDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamSizeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" name="Nombre de missions" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Aucune donnée disponible
          </div>
        )}
      </Card>

      {/* Évolution temporelle */}
      <Card variant="elevated" className="p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Évolution des Missions (12 derniers mois)
        </h3>
        {missionsTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={missionsTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="démarrées"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Missions démarrées"
              />
              <Line
                type="monotone"
                dataKey="terminées"
                stroke="#10b981"
                strokeWidth={2}
                name="Missions terminées"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Aucune donnée disponible
          </div>
        )}
      </Card>

      {/* Top 10 créateurs de missions */}
      {missionsByCreator.length > 0 && (
        <Card variant="elevated" className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Top 10 Créateurs de Missions
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={missionsByCreator} layout="vertical">
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
              <Bar dataKey="value" fill="#f59e0b" name="Nombre de missions" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}

