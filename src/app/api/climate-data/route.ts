/**
 * @file route.ts
 * @description src/app/api/climate-data/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 118
 * @size 3.25 KB
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
      stationId,
      location,
      latitude,
      longitude,
      date,
      temperature,
      humidity,
      pressure,
      windSpeed,
      windDirection,
      precipitation,
      notes,
    } = data;

    const climateData = await prisma.climateData.create({
      data: {
        stationId: stationId || undefined,
        location,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        date: new Date(date),
        temperature: temperature ? parseFloat(temperature) : undefined,
        humidity: humidity ? parseFloat(humidity) : undefined,
        pressure: pressure ? parseFloat(pressure) : undefined,
        windSpeed: windSpeed ? parseFloat(windSpeed) : undefined,
        windDirection: windDirection ? parseFloat(windDirection) : undefined,
        precipitation: precipitation ? parseFloat(precipitation) : undefined,
        notes: notes || undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "ClimateData",
        entityId: climateData.id,
        changes: JSON.stringify({ location, date }),
      },
    });

    return NextResponse.json(climateData, { status: 201 });
  } catch (error: any) {
    console.error("Error creating climate data:", error);
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
    const stationId = searchParams.get("stationId");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (stationId) {
      where.stationId = stationId;
    }

    const [climateData, total] = await Promise.all([
      prisma.climateData.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { date: "desc" },
      }),
      prisma.climateData.count({ where }),
    ]);

    // Cache for 5 minutes
    return NextResponse.json({
      data: climateData,
      total,
      limit,
      offset,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error("Error fetching climate data:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

