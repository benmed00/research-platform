/**
 * @file route.ts
 * @description src/app/api/water-quality/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 116
 * @size 3.09 KB
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
      type,
      location,
      latitude,
      longitude,
      date,
      ph,
      temperature,
      dissolvedO2,
      turbidity,
      salinity,
      notes,
    } = data;

    const waterQuality = await prisma.waterQuality.create({
      data: {
        type,
        location,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        date: new Date(date),
        ph: ph ? parseFloat(ph) : undefined,
        temperature: temperature ? parseFloat(temperature) : undefined,
        dissolvedO2: dissolvedO2 ? parseFloat(dissolvedO2) : undefined,
        turbidity: turbidity ? parseFloat(turbidity) : undefined,
        salinity: salinity ? parseFloat(salinity) : undefined,
        notes: notes || undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "WaterQuality",
        entityId: waterQuality.id,
        changes: JSON.stringify({ type, location, date }),
      },
    });

    return NextResponse.json(waterQuality, { status: 201 });
  } catch (error: any) {
    console.error("Error creating water quality data:", error);
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
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (type) {
      where.type = type;
    }

    const [waterQuality, total] = await Promise.all([
      prisma.waterQuality.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { date: "desc" },
      }),
      prisma.waterQuality.count({ where }),
    ]);

    return NextResponse.json({
      data: waterQuality,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching water quality data:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

