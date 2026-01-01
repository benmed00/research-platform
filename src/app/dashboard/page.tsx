/**
 * @file page.tsx
 * @description src/app/dashboard/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 301
 * @size 9.80 KB
 */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  Package,
  MapPin,
  Database,
  TrendingUp,
} from "lucide-react";
import { DashboardCharts } from "@/components/dashboard-charts";
import { RoleDashboard } from "@/components/dashboard/role-dashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  // Check if we should show role-based dashboard
  const showRoleDashboard = session.user?.role && 
    ["DIRECTEUR_SCIENTIFIQUE", "DIRECTEUR_ADMINISTRATIF_FINANCIER", "BOTANISTE", 
     "ZOOLOGISTE_TERRESTRE", "BIOLOGISTE_MARIN", "DATA_SCIENTIST_SIG", "TECHNICIEN_TERRAIN"].includes(session.user.role);

  // Récupération des statistiques - Optimisé avec requêtes agrégées
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const [
    totalUsers,
    totalEmployees,
    totalEquipment,
    totalMissions,
    totalSpecies,
    currentYearBudget,
    recentMissions,
    missionsForCharts,
    speciesByTypeData,
    equipmentByStatusData,
  ] = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
    prisma.employee.count({ where: { isActive: true } }),
    prisma.equipment.count(),
    prisma.mission.count(),
    prisma.species.count(),
    prisma.budget.findFirst({
      where: { year: now.getFullYear() },
    }),
    prisma.mission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        location: true,
        startDate: true,
        status: true,
        creator: {
          select: { firstName: true, lastName: true },
        },
      },
    }),
    // Only fetch missions from last 6 months for charts
    prisma.mission.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    }),
    // Use groupBy for species aggregation (more efficient)
    prisma.species.groupBy({
      by: ["type"],
      _count: { type: true },
    }),
    // Use groupBy for equipment aggregation (more efficient)
    prisma.equipment.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  // Préparer les données pour les graphiques - Optimisé
  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const missionsByMonthMap = new Map<string, number>();
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    missionsByMonthMap.set(monthKey, 0);
  }
  
  // Count missions by month (only from last 6 months)
  missionsForCharts.forEach((mission) => {
    const date = new Date(mission.createdAt);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    if (missionsByMonthMap.has(monthKey)) {
      missionsByMonthMap.set(monthKey, (missionsByMonthMap.get(monthKey) || 0) + 1);
    }
  });
  const missionsByMonth = Array.from(missionsByMonthMap.entries()).map(([month, count]) => ({
    month,
    count,
  }));

  // Espèces par type - Utilise les données groupBy
  const typeLabels: Record<string, string> = {
    FLORE_TERRESTRE: "Flore Terrestre",
    FAUNE_TERRESTRE: "Faune Terrestre",
    FAUNE_MARINE: "Faune Marine",
    ESPECE_EAU_DOUCE: "Eau Douce",
  };
  const speciesByType = speciesByTypeData.map((item) => ({
    name: typeLabels[item.type] || item.type,
    value: item._count.type,
  }));

  // Équipements par statut - Utilise les données groupBy
  const statusLabels: Record<string, string> = {
    AVAILABLE: "Disponible",
    IN_USE: "En utilisation",
    MAINTENANCE: "En maintenance",
    RETIRED: "Retiré",
  };
  const equipmentByStatus = equipmentByStatusData.map((item) => ({
    name: statusLabels[item.status] || item.status,
    value: item._count.status,
  }));

  const stats = [
    {
      title: "Utilisateurs actifs",
      value: totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Employés",
      value: totalEmployees,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Équipements",
      value: totalEquipment,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Missions",
      value: totalMissions,
      icon: MapPin,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Espèces cataloguées",
      value: totalSpecies,
      icon: Database,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Budget annuel",
      value: currentYearBudget
        ? `${(Number(currentYearBudget.totalAmount) / 1000000).toFixed(1)}M MAD`
        : "N/A",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ];

  // If role-based dashboard is enabled, show it
  if (showRoleDashboard && session.user?.role) {
    return (
      <RoleDashboard
        role={session.user.role}
        stats={{
          totalUsers,
          totalEmployees,
          totalEquipment,
          totalMissions,
          totalSpecies,
          currentYearBudget: currentYearBudget
            ? `${(Number(currentYearBudget.totalAmount) / 1000000).toFixed(1)}M MAD`
            : undefined,
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Bienvenue, <span className="font-medium text-gray-900 dark:text-gray-100">{session.user?.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.bgColor} ${stat.color} p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Graphiques */}
      <DashboardCharts
        missionsByMonth={missionsByMonth}
        speciesByType={speciesByType}
        equipmentByStatus={equipmentByStatus}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6" variant="elevated">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Missions récentes</h2>
          <div className="space-y-3">
            {recentMissions.map((mission) => (
              <div
                key={mission.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">{mission.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {mission.location} •{" "}
                    {new Date(mission.startDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ml-4 flex-shrink-0 ${
                    mission.status === "completed"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      : mission.status === "in_progress"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  {mission.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6" variant="elevated">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Activité récente</h2>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Les activités récentes seront affichées ici
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

