/**
 * @file route.ts
 * @description src/app/api/air-quality/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 107
 * @size 2.69 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { airQualitySchema } from "@/lib/validations";
import { validateRequest } from "@/lib/validation-helpers";
import { loggerHelpers } from "@/lib/logger";
import { parsePagination, createPaginatedResponse } from "@/lib/pagination";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate request data
    const validation = validateRequest(airQualitySchema, data, "/api/air-quality");
    if (!validation.success) {
      return validation.response;
    }
    
    const {
      location,
      latitude,
      longitude,
      date,
      pm25,
      pm10,
      no2,
      o3,
      co,
      notes,
    } = validation.data;

    const airQuality = await prisma.airQuality.create({
      data: {
        location,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        date: new Date(date),
        pm25: pm25 ? parseFloat(pm25) : undefined,
        pm10: pm10 ? parseFloat(pm10) : undefined,
        no2: no2 ? parseFloat(no2) : undefined,
        o3: o3 ? parseFloat(o3) : undefined,
        co: co ? parseFloat(co) : undefined,
        notes: notes || undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "AirQuality",
        entityId: airQuality.id,
        changes: JSON.stringify({ location, date }),
      },
    });

    return NextResponse.json(airQuality, { status: 201 });
  } catch (error: any) {
    const session = await getServerSession(authOptions);
    loggerHelpers.apiError(error as Error, {
      route: "/api/air-quality",
      method: "POST",
      userId: session?.user?.id,
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

    const [airQuality, total] = await Promise.all([
      prisma.airQuality.findMany({
        take,
        skip,
        orderBy: { date: "desc" },
      }),
      prisma.airQuality.count(),
    ]);

    return NextResponse.json(
      createPaginatedResponse(airQuality, total, page, limit)
    );
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

