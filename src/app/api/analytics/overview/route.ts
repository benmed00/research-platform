/**
 * @file route.ts
 * @description src/app/api/analytics/overview/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 88
 * @size 2.25 KB
 */
import { NextResponse } from "next/server";
import {
  getMissionsByMonth,
  getExpensesByMonth,
  getEquipmentUtilization,
  getBudgetUtilization,
  getMissionCompletionRate,
  getSpeciesByType,
  getEquipmentByStatus,
} from "@/lib/dashboard-queries";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();

    // Fetch all data in parallel for better performance
    const [
      totalUsers,
      totalEmployees,
      totalEquipment,
      totalMissions,
      totalSpecies,
      currentYearBudget,
      missionsByMonth,
      expensesByMonth,
      equipmentUtilization,
      budgetUtilization,
      missionCompletionRate,
      speciesByType,
      equipmentByStatus,
    ] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.employee.count({ where: { isActive: true } }),
      prisma.equipment.count(),
      prisma.mission.count(),
      prisma.species.count(),
      prisma.budget.findFirst({ where: { year: currentYear } }),
      getMissionsByMonth(6),
      getExpensesByMonth(6),
      getEquipmentUtilization(),
      getBudgetUtilization(currentYear),
      getMissionCompletionRate(),
      getSpeciesByType(),
      getEquipmentByStatus(),
    ]);

    return NextResponse.json({
      kpis: {
        totalUsers,
        totalEmployees,
        totalEquipment,
        totalMissions,
        totalSpecies,
        currentYearBudget: currentYearBudget
          ? Number(currentYearBudget.totalAmount)
          : 0,
        equipmentUtilization: Math.round(equipmentUtilization * 10) / 10,
        budgetUtilization: Math.round(budgetUtilization * 10) / 10,
        missionCompletionRate: Math.round(missionCompletionRate * 10) / 10,
      },
      charts: {
        missionsByMonth,
        expensesByMonth,
        speciesByType,
        equipmentByStatus,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics overview:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}

