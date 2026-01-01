/**
 * @file route.ts
 * @description src/app/api/species/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 90
 * @size 2.30 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const where = type ? { type } : {};

    const species = await prisma.species.findMany({
      where,
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
    });

    return NextResponse.json(species);
  } catch (error) {
    console.error("Error fetching species:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

