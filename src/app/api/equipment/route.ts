/**
 * @file route.ts
 * @description src/app/api/equipment/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 100
 * @size 2.52 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
      name,
      category,
      serialNumber,
      purchaseDate,
      purchasePrice,
      lifespan,
      location,
      description,
    } = data;

    const equipment = await prisma.equipment.create({
      data: {
        name,
        category,
        serialNumber: serialNumber || undefined,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
        lifespan: lifespan ? parseInt(lifespan) : undefined,
        location: location || undefined,
        description: description || undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Equipment",
        entityId: equipment.id,
        changes: JSON.stringify({ name, category }),
      },
    });

    return NextResponse.json(equipment, { status: 201 });
  } catch (error: any) {
    const currentSession = await getServerSession(authOptions);
    loggerHelpers.apiError(error as Error, {
      route: "/api/equipment",
      method: "POST",
      userId: currentSession?.user?.id,
    });
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

    const { page, limit, skip, take } = parsePagination(request);

    const [equipment, total] = await Promise.all([
      prisma.equipment.findMany({
        skip,
        take,
        include: {
          maintenances: {
            take: 1,
            orderBy: { date: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.equipment.count(),
    ]);

    // Cache for 5 minutes
    return NextResponse.json(createPaginatedResponse(equipment, total, page, limit), {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    loggerHelpers.apiError(error as Error, {
      route: "/api/equipment",
      method: "GET",
    });
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

