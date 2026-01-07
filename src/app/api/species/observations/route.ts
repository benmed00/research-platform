/**
 * @file route.ts
 * @description src/app/api/species/observations/route.ts
 * @author github-actions[bot]
 * @created 2026-01-04
 * @updated 2026-01-04
 * @updates 1
 * @lines 48
 * @size 1.23 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const observations = await prisma.speciesObservation.findMany({
      take: limit,
      orderBy: { date: "desc" },
      include: {
        species: {
          select: {
            id: true,
            scientificName: true,
            commonName: true,
          },
        },
      },
    });

    // Cache for 5 minutes
    return NextResponse.json(observations, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error("Error fetching species observations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

