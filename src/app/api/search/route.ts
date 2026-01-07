/**
 * @file route.ts
 * @description src/app/api/search/route.ts
 * @author github-actions[bot]
 * @created 2026-01-04
 * @updated 2026-01-04
 * @updates 1
 * @lines 197
 * @size 5.00 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withRateLimit(
    request,
    { ...rateLimitConfigs.api, identifier: "search" },
    async () => {
      try {
        const session = await getServerSession(authOptions);
        if (!session) {
          return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q") || "";
        const limit = parseInt(searchParams.get("limit") || "10");
        const entityTypes = searchParams.get("types")?.split(",") || [];

        if (!query || query.trim().length < 2) {
          return NextResponse.json({
            results: {
              species: [],
              missions: [],
              equipment: [],
              employees: [],
              documents: [],
              publications: [],
              users: [],
              expenses: [],
              budgets: [],
              waterQuality: [],
              airQuality: [],
              climateData: [],
            },
            total: 0,
          });
        }

        const searchQuery = query.trim();
        const shouldSearch = (type: string) => entityTypes.length === 0 || entityTypes.includes(type);

        // Search in parallel - enhanced with more entities
        const [
          species,
          missions,
          equipment,
          employees,
          documents,
          publications,
          users,
          expenses,
          budgets,
          waterQuality,
          airQuality,
          climateData,
        ] = await Promise.all([
      // Species
      prisma.species.findMany({
        where: {
          OR: [
            { scientificName: { contains: searchQuery, mode: "insensitive" } },
            { commonName: { contains: searchQuery, mode: "insensitive" } },
            { habitat: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          scientificName: true,
          commonName: true,
          type: true,
          iucnStatus: true,
        },
        take: limit,
        orderBy: { scientificName: "asc" },
      }),

      // Missions
      prisma.mission.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
            { location: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          status: true,
          startDate: true,
          location: true,
        },
        take: limit,
        orderBy: { startDate: "desc" },
      }),

      // Equipment
      prisma.equipment.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { serialNumber: { contains: searchQuery, mode: "insensitive" } },
            { location: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          category: true,
          status: true,
          serialNumber: true,
        },
        take: limit,
        orderBy: { name: "asc" },
      }),

      // Employees
      prisma.employee.findMany({
        where: {
          user: {
            OR: [
              { firstName: { contains: searchQuery, mode: "insensitive" } },
              { lastName: { contains: searchQuery, mode: "insensitive" } },
              { email: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
        },
        select: {
          id: true,
          employeeNumber: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
        take: limit,
        orderBy: { createdAt: "desc" },
      }),

      // Documents
      prisma.document.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { fileName: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          type: true,
          fileName: true,
          createdAt: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        take: limit,
        orderBy: { createdAt: "desc" },
      }),

          // Publications
          shouldSearch("publications")
            ? prisma.publication.findMany({
                where: {
                  OR: [
                    { title: { contains: searchQuery, mode: "insensitive" } },
                    { type: { contains: searchQuery, mode: "insensitive" } },
                  ],
                },
                select: {
                  id: true,
                  title: true,
                  year: true,
                  type: true,
                  isPublished: true,
                },
                take: limit,
                orderBy: { year: "desc" },
              })
            : [],

          // Users
          shouldSearch("users")
            ? prisma.user.findMany({
                where: {
                  OR: [
                    { firstName: { contains: searchQuery, mode: "insensitive" } },
                    { lastName: { contains: searchQuery, mode: "insensitive" } },
                    { email: { contains: searchQuery, mode: "insensitive" } },
                  ],
                },
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  role: true,
                  isActive: true,
                },
                take: limit,
                orderBy: { createdAt: "desc" },
              })
            : [],

          // Expenses
          shouldSearch("expenses")
            ? prisma.expense.findMany({
                where: {
                  OR: [
                    { description: { contains: searchQuery, mode: "insensitive" } },
                    { category: { contains: searchQuery, mode: "insensitive" } },
                  ],
                },
                select: {
                  id: true,
                  category: true,
                  amount: true,
                  description: true,
                  date: true,
                },
                take: limit,
                orderBy: { date: "desc" },
              })
            : [],

          // Budgets
          shouldSearch("budgets")
            ? prisma.budget.findMany({
                where: {
                  OR: [
                    { description: { contains: searchQuery, mode: "insensitive" as const } },
                    ...(isNaN(parseInt(searchQuery)) ? [] : [{ year: parseInt(searchQuery) }]),
                  ],
                },
                select: {
                  id: true,
                  year: true,
                  totalAmount: true,
                  description: true,
                },
                take: limit,
                orderBy: { year: "desc" },
              })
            : [],

          // Water Quality
          shouldSearch("waterQuality")
            ? prisma.waterQuality.findMany({
                where: {
                  location: { contains: searchQuery, mode: "insensitive" as const },
                },
                select: {
                  id: true,
                  type: true,
                  location: true,
                  date: true,
                  ph: true,
                  temperature: true,
                },
                take: limit,
                orderBy: { date: "desc" },
              })
            : [],

          // Air Quality
          shouldSearch("airQuality")
            ? prisma.airQuality.findMany({
                where: {
                  location: { contains: searchQuery, mode: "insensitive" },
                },
                select: {
                  id: true,
                  location: true,
                  date: true,
                  pm25: true,
                  pm10: true,
                },
                take: limit,
                orderBy: { date: "desc" },
              })
            : [],

          // Climate Data
          shouldSearch("climateData")
            ? prisma.climateData.findMany({
                where: {
                  OR: [
                    { location: { contains: searchQuery, mode: "insensitive" } },
                    { stationId: { contains: searchQuery, mode: "insensitive" } },
                  ],
                },
                select: {
                  id: true,
                  stationId: true,
                  location: true,
                  date: true,
                  temperature: true,
                },
                take: limit,
                orderBy: { date: "desc" },
              })
            : [],
        ]);

        const total =
          species.length +
          missions.length +
          equipment.length +
          employees.length +
          documents.length +
          publications.length +
          users.length +
          expenses.length +
          budgets.length +
          waterQuality.length +
          airQuality.length +
          climateData.length;

        return NextResponse.json(
          {
            results: {
              species,
              missions,
              equipment,
              employees,
              documents,
              publications,
              users,
              expenses,
              budgets,
              waterQuality,
              airQuality,
              climateData,
            },
            total,
            query: searchQuery,
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
            },
          }
        );
      } catch (error: any) {
        console.error("Error in global search:", error);
        return NextResponse.json(
          { error: "Erreur lors de la recherche" },
          { status: 500 }
        );
      }
    }
  );
}

