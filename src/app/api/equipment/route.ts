/**
 * @file route.ts
 * @description src/app/api/equipment/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 89
 * @size 2.34 KB
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
    console.error("Error creating equipment:", error);
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

    const equipment = await prisma.equipment.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

