/**
 * @file route.ts
 * @description src/app/api/species/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 109
 * @size 2.70 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyNewSpecies } from "@/lib/notifications";
import { parsePagination, createPaginatedResponse } from "@/lib/pagination";
import { loggerHelpers } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const {
      scientificName,
      commonName,
      type,
      iucnStatus,
      habitat,
      description,
    } = data;

    const species = await prisma.species.create({
      data: {
        scientificName,
        commonName: commonName || undefined,
        type,
        iucnStatus: iucnStatus || undefined,
        habitat: habitat || undefined,
        description: description || undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Species",
        entityId: species.id,
        changes: JSON.stringify({ scientificName, type }),
      },
    });

    // Create notification for scientists
    await notifyNewSpecies(species.id, species.scientificName).catch(console.error);

    return NextResponse.json(species, { status: 201 });
  } catch (error: any) {
    console.error("Error creating species:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as any;
    const { page, limit, skip, take } = parsePagination(request);

    const where = type ? { type } : {};

    const [species, total] = await Promise.all([
      prisma.species.findMany({
        where,
        skip,
        take,
        include: {
          _count: {
            select: {
              observations: true,
              locations: true,
              photos: true,
            },
          },
        },
        orderBy: { scientificName: "asc" },
      }),
      prisma.species.count({ where }),
    ]);

    // Cache for 5 minutes
    return NextResponse.json(createPaginatedResponse(species, total, page, limit), {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    loggerHelpers.apiError(error as Error, {
      route: "/api/species",
      method: "GET",
    });
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

