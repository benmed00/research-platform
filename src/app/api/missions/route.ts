/**
 * @file route.ts
 * @description src/app/api/missions/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 144
 * @size 3.45 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyNewMission } from "@/lib/notifications";
import { parsePagination, createPaginatedResponse } from "@/lib/pagination";
import { loggerHelpers } from "@/lib/logger";
import { missionSchema } from "@/lib/validations";
import { validateRequest } from "@/lib/validation-helpers";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate request data
    const validation = validateRequest(missionSchema, data, "/api/missions");
    if (!validation.success) {
      return validation.response;
    }
    
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      latitude,
      longitude,
      objectives,
      status,
    } = validation.data;
    
    const { teamMembers, equipmentIds } = data; // These are arrays, not in schema

    const mission = await prisma.mission.create({
      data: {
        title,
        description,
        creatorId: session.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status || "PLANNED",
        location,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        objectives,
        teams: teamMembers
          ? {
              create: teamMembers.map((userId: string) => ({
                userId,
                role: "member",
              })),
            }
          : undefined,
        equipment: equipmentIds
          ? {
              create: equipmentIds.map((equipmentId: string) => ({
                equipmentId,
                quantity: 1,
              })),
            }
          : undefined,
      },
      include: {
        teams: true,
        equipment: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Mission",
        entityId: mission.id,
        changes: JSON.stringify({ title, location }),
      },
    });

    // Create notification for admins
    await notifyNewMission(mission.id, session.user.id).catch(console.error);

    return NextResponse.json(mission, { status: 201 });
  } catch (error: any) {
    console.error("Error creating mission:", error);
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

    const [missions, total] = await Promise.all([
      prisma.mission.findMany({
        skip,
        take,
        include: {
          creator: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          teams: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          _count: {
            select: {
              equipment: true,
            },
          },
        },
        orderBy: { startDate: "desc" },
      }),
      prisma.mission.count(),
    ]);

    // Cache for 5 minutes
    return NextResponse.json(createPaginatedResponse(missions, total, page, limit), {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    loggerHelpers.apiError(error as Error, {
      route: "/api/missions",
      method: "GET",
    });
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

