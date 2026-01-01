/**
 * @file dashboard-queries.ts
 * @description src/lib/dashboard-queries.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 525
 * @size 13.11 KB
 */
import { prisma } from "./prisma";
import { addDays, addMonths, startOfMonth, endOfMonth } from "date-fns";

// ============================================
// TIME-SERIES AGGREGATIONS
// ============================================

/**
 * Get missions grouped by month for the last N months
 */
export async function getMissionsByMonth(months: number = 6) {
  const startDate = addMonths(new Date(), -months);
  startDate.setDate(1); // Start of month

  const missions = await prisma.mission.findMany({
    where: {
      createdAt: { gte: startDate },
    },
    select: {
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const monthMap = new Map<string, number>();

  // Initialize all months with 0
  for (let i = months - 1; i >= 0; i--) {
    const date = addMonths(new Date(), -i);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    monthMap.set(monthKey, 0);
  }

  // Count missions by month
  missions.forEach((mission) => {
    const date = new Date(mission.createdAt);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    if (monthMap.has(monthKey)) {
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
    }
  });

  return Array.from(monthMap.entries()).map(([month, count]) => ({
    month,
    count,
  }));
}

/**
 * Get expenses grouped by month for the last N months
 */
export async function getExpensesByMonth(months: number = 6) {
  const startDate = addMonths(new Date(), -months);
  startDate.setDate(1);

  const expenses = await prisma.expense.findMany({
    where: {
      date: { gte: startDate },
    },
    select: {
      date: true,
      amount: true,
    },
    orderBy: { date: "asc" },
  });

  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const monthMap = new Map<string, number>();

  // Initialize all months with 0
  for (let i = months - 1; i >= 0; i--) {
    const date = addMonths(new Date(), -i);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    monthMap.set(monthKey, 0);
  }

  // Sum expenses by month
  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    if (monthMap.has(monthKey)) {
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + Number(expense.amount));
    }
  });

  return Array.from(monthMap.entries()).map(([month, amount]) => ({
    month,
    amount,
  }));
}

/**
 * Get user activity (logins) grouped by day for the last N days
 */
export async function getUserActivityByDay(days: number = 30) {
  const startDate = addDays(new Date(), -days);

  const loginLogs = await prisma.loginLog.findMany({
    where: {
      timestamp: { gte: startDate },
      success: true,
    },
    select: {
      timestamp: true,
      userId: true,
    },
  });

  // Group by date and count unique users
  const dayMap = new Map<string, Set<string>>();

  loginLogs.forEach((log) => {
    const date = new Date(log.timestamp);
    const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

    if (!dayMap.has(dateKey)) {
      dayMap.set(dateKey, new Set());
    }
    dayMap.get(dateKey)!.add(log.userId);
  });

  // Convert to array and sort
  return Array.from(dayMap.entries())
    .map(([date, userIds]) => ({
      date,
      activeUsers: userIds.size,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ============================================
// SEGMENTATION AGGREGATIONS
// ============================================

/**
 * Get species grouped by type
 */
export async function getSpeciesByType() {
  const result = await prisma.species.groupBy({
    by: ["type"],
    _count: { type: true },
  });

  const typeLabels: Record<string, string> = {
    FLORE_TERRESTRE: "Flore Terrestre",
    FAUNE_TERRESTRE: "Faune Terrestre",
    FAUNE_MARINE: "Faune Marine",
    ESPECE_EAU_DOUCE: "Eau Douce",
  };

  return result.map((item) => ({
    name: typeLabels[item.type] || item.type,
    value: item._count.type,
  }));
}

/**
 * Get equipment grouped by status
 */
export async function getEquipmentByStatus() {
  const result = await prisma.equipment.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const statusLabels: Record<string, string> = {
    AVAILABLE: "Disponible",
    IN_USE: "En utilisation",
    MAINTENANCE: "En maintenance",
    RETIRED: "Retiré",
  };

  return result.map((item) => ({
    name: statusLabels[item.status] || item.status,
    value: item._count.status,
  }));
}

/**
 * Get missions grouped by status
 */
export async function getMissionsByStatus() {
  const result = await prisma.mission.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const statusLabels: Record<string, string> = {
    planned: "Planifiée",
    in_progress: "En cours",
    completed: "Terminée",
    cancelled: "Annulée",
  };

  return result.map((item) => ({
    name: statusLabels[item.status] || item.status,
    value: item._count.status,
  }));
}

/**
 * Get expenses grouped by category
 */
export async function getExpensesByCategory(startDate?: Date, endDate?: Date) {
  const where: any = {};
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = startDate;
    if (endDate) where.date.lte = endDate;
  }

  const expenses = await prisma.expense.findMany({
    where,
    select: {
      category: true,
      amount: true,
    },
  });

  const categoryMap = new Map<string, number>();
  expenses.forEach((expense) => {
    const category = expense.category || "Autre";
    const current = categoryMap.get(category) || 0;
    categoryMap.set(category, current + Number(expense.amount));
  });

  return Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

// ============================================
// KPI CALCULATIONS
// ============================================

/**
 * Calculate growth rate between two periods
 */
export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Calculate equipment utilization rate
 */
export async function getEquipmentUtilization() {
  const [inUse, total] = await Promise.all([
    prisma.equipment.count({ where: { status: "IN_USE" } }),
    prisma.equipment.count(),
  ]);

  return total > 0 ? (inUse / total) * 100 : 0;
}

/**
 * Calculate budget utilization
 */
export async function getBudgetUtilization(year: number) {
  const [budget, expenses] = await Promise.all([
    prisma.budget.findFirst({ where: { year } }),
    prisma.expense.findMany({
      where: {
        budgetId: { not: null },
        budget: { year },
      },
      select: { amount: true },
    }),
  ]);

  if (!budget) return 0;

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  return (totalSpent / Number(budget.totalAmount)) * 100;
}

/**
 * Get daily active users (DAU)
 */
export async function getDailyActiveUsers(date: Date = new Date()) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const uniqueUsers = await prisma.loginLog.findMany({
    where: {
      timestamp: {
        gte: startOfDay,
        lte: endOfDay,
      },
      success: true,
    },
    select: {
      userId: true,
    },
    distinct: ["userId"],
  });

  return uniqueUsers.length;
}

/**
 * Get monthly active users (MAU)
 */
export async function getMonthlyActiveUsers(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = endOfMonth(startDate);

  const uniqueUsers = await prisma.loginLog.findMany({
    where: {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
      success: true,
    },
    select: {
      userId: true,
    },
    distinct: ["userId"],
  });

  return uniqueUsers.length;
}

/**
 * Calculate mission completion rate
 */
export async function getMissionCompletionRate() {
  const [completed, total] = await Promise.all([
    prisma.mission.count({ where: { status: "completed" } }),
    prisma.mission.count(),
  ]);

  return total > 0 ? (completed / total) * 100 : 0;
}

// ============================================
// BUDGET & FINANCIAL HELPERS
// ============================================

/**
 * Get budget vs spent by category
 */
export async function getBudgetVsSpent(year: number) {
  const budget = await prisma.budget.findFirst({
    where: { year },
    include: { allocations: true },
  });

  if (!budget) return [];

  const expenses = await prisma.expense.findMany({
    where: {
      budgetId: budget.id,
    },
    select: {
      category: true,
      amount: true,
    },
  });

  // Sum expenses by category
  const spentByCategory = new Map<string, number>();
  expenses.forEach((expense) => {
    const category = expense.category;
    const current = spentByCategory.get(category) || 0;
    spentByCategory.set(category, current + Number(expense.amount));
  });

  // Combine with budget allocations
  return budget.allocations.map((allocation) => ({
    name: allocation.category,
    budget: Number(allocation.amount),
    spent: spentByCategory.get(allocation.category) || 0,
  }));
}

// ============================================
// RECENT ACTIVITY
// ============================================

/**
 * Get recent missions
 */
export async function getRecentMissions(limit: number = 5) {
  return prisma.mission.findMany({
    take: limit,
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
  });
}

/**
 * Get recent expenses
 */
export async function getRecentExpenses(limit: number = 10) {
  return prisma.expense.findMany({
    take: limit,
    orderBy: { date: "desc" },
    select: {
      id: true,
      category: true,
      amount: true,
      description: true,
      date: true,
    },
  });
}

/**
 * Get pending invoices
 */
export async function getPendingInvoices(limit: number = 10) {
  return prisma.invoice.findMany({
    where: {
      status: "pending",
    },
    take: limit,
    orderBy: { dueDate: "asc" },
    include: {
      supplier: true,
    },
  });
}

// ============================================
// ENVIRONMENTAL DATA HELPERS
// ============================================

/**
 * Get climate data for a date range
 */
export async function getClimateData(startDate: Date, endDate: Date) {
  return prisma.climateData.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: "asc" },
  });
}

/**
 * Get average climate metrics by station
 */
export async function getAverageClimateByStation(days: number = 30) {
  const startDate = addDays(new Date(), -days);

  const data = await prisma.climateData.findMany({
    where: {
      date: { gte: startDate },
    },
    select: {
      stationId: true,
      location: true,
      temperature: true,
      humidity: true,
      precipitation: true,
    },
  });

  // Group by station and calculate averages
  const stationMap = new Map<
    string,
    {
      location: string;
      temperature: number[];
      humidity: number[];
      precipitation: number[];
    }
  >();

  data.forEach((record) => {
    const key = record.stationId || record.location;
    if (!stationMap.has(key)) {
      stationMap.set(key, {
        location: record.location,
        temperature: [],
        humidity: [],
        precipitation: [],
      });
    }

    const station = stationMap.get(key)!;
    if (record.temperature) station.temperature.push(record.temperature);
    if (record.humidity) station.humidity.push(record.humidity);
    if (record.precipitation) station.precipitation.push(record.precipitation);
  });

  // Calculate averages
  return Array.from(stationMap.entries()).map(([stationId, data]) => {
    const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

    return {
      stationId,
      location: data.location,
      avgTemperature: Math.round(avg(data.temperature) * 10) / 10,
      avgHumidity: Math.round(avg(data.humidity) * 10) / 10,
      avgPrecipitation: Math.round(avg(data.precipitation) * 10) / 10,
    };
  });
}

