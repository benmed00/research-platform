/**
 * Global search API route
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        results: {
          species: [],
          missions: [],
          equipment: [],
          employees: [],
          documents: [],
          publications: [],
        },
        total: 0,
      });
    }

    const searchQuery = query.trim();
    const searchPattern = `%${searchQuery}%`;

    // Search in parallel
    const [species, missions, equipment, employees, documents, publications] = await Promise.all([
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
      prisma.publication.findMany({
        where: {
          title: { contains: searchQuery, mode: "insensitive" },
        },
        select: {
          id: true,
          title: true,
          year: true,
          type: true,
        },
        take: limit,
        orderBy: { year: "desc" },
      }),
    ]);

    const total = species.length + missions.length + equipment.length + employees.length + documents.length + publications.length;

    return NextResponse.json(
      {
        results: {
          species,
          missions,
          equipment,
          employees,
          documents,
          publications,
        },
        total,
        query: searchQuery,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
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

