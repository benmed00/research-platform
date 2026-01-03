/**
 * @file route.ts
 * @description src/app/api/missions/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 130
 * @size 3.17 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyNewMission } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      latitude,
      longitude,
      objectives,
      teamMembers,
      equipmentIds,
    } = data;

    const mission = await prisma.mission.create({
      data: {
        title,
        description,
        creatorId: session.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
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

    const missions = await prisma.mission.findMany({
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
    });

    // Cache for 5 minutes
    return NextResponse.json(missions, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error("Error fetching missions:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

