/**
 * API route for equipment maintenance
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
    const limit = parseInt(searchParams.get("limit") || "5");

    const maintenance = await prisma.maintenance.findMany({
      where: {
        nextDueDate: {
          lte: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      },
      include: {
        equipment: true,
      },
      take: limit,
      orderBy: { nextDueDate: "asc" },
    });

    // Cache for 5 minutes
    return NextResponse.json(maintenance, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error("Error fetching maintenance:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

