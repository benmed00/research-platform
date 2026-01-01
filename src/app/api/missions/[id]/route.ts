/**
 * @file route.ts
 * @description src/app/api/missions/[id]/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 337
 * @size 9.07 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { missionSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const mission = await prisma.mission.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        teams: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
            employee: {
              select: {
                id: true,
                employeeNumber: true,
              },
            },
          },
        },
        equipment: {
          include: {
            equipment: {
              select: {
                id: true,
                name: true,
                category: true,
                serialNumber: true,
                status: true,
              },
            },
          },
        },
        report: true,
        documents: {
          select: {
            id: true,
            title: true,
            type: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        speciesObservations: {
          include: {
            species: {
              select: {
                id: true,
                scientificName: true,
                commonName: true,
              },
            },
          },
          take: 20,
        },
      },
    });

    if (!mission) {
      return NextResponse.json({ error: "Mission non trouvée" }, { status: 404 });
    }

    return NextResponse.json(mission);
  } catch (error) {
    console.error("Error fetching mission:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const validatedData = missionSchema.parse(data);

    // Check if mission exists
    const existingMission = await prisma.mission.findUnique({
      where: { id: params.id },
    });

    if (!existingMission) {
      return NextResponse.json({ error: "Mission non trouvée" }, { status: 404 });
    }

    // Update mission basic data
    const mission = await prisma.mission.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        description: validatedData.description || undefined,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
        location: validatedData.location || undefined,
        latitude: validatedData.latitude ? parseFloat(validatedData.latitude) : undefined,
        longitude: validatedData.longitude ? parseFloat(validatedData.longitude) : undefined,
        objectives: validatedData.objectives || undefined,
        status: data.status || existingMission.status, // Allow status update
      },
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
        equipment: {
          include: {
            equipment: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Update team members if provided
    if (data.teamMembers && Array.isArray(data.teamMembers)) {
      // Delete existing teams
      await prisma.missionTeam.deleteMany({
        where: { missionId: params.id },
      });

      // Create new teams
      if (data.teamMembers.length > 0) {
        await prisma.missionTeam.createMany({
          data: data.teamMembers.map((userId: string) => ({
            missionId: params.id,
            userId,
            role: "member",
          })),
        });
      }
    }

    // Update equipment if provided
    if (data.equipmentIds && Array.isArray(data.equipmentIds)) {
      // Delete existing equipment assignments
      await prisma.missionEquipment.deleteMany({
        where: { missionId: params.id },
      });

      // Create new equipment assignments
      if (data.equipmentIds.length > 0) {
        await prisma.missionEquipment.createMany({
          data: data.equipmentIds.map((equipmentId: string) => ({
            missionId: params.id,
            equipmentId,
            quantity: 1,
          })),
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "Mission",
        entityId: mission.id,
        changes: JSON.stringify({ title: validatedData.title, location: validatedData.location }),
      },
    });

    // Fetch updated mission with all relations
    const updatedMission = await prisma.mission.findUnique({
      where: { id: params.id },
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
        equipment: {
          include: {
            equipment: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedMission);
  } catch (error: any) {
    console.error("Error updating mission:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données de validation invalides", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Check if mission exists
    const mission = await prisma.mission.findUnique({
      where: { id: params.id },
      include: {
        teams: true,
        equipment: true,
        report: true,
        documents: true,
        speciesObservations: true,
      },
    });

    if (!mission) {
      return NextResponse.json({ error: "Mission non trouvée" }, { status: 404 });
    }

    // Check if mission can be deleted (no critical dependencies)
    // We'll allow deletion but warn if there are documents or reports
    if (mission.documents.length > 0 || mission.report) {
      // Option 1: Soft delete by changing status
      await prisma.mission.update({
        where: { id: params.id },
        data: { status: "cancelled" },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "DELETE",
          entity: "Mission",
          entityId: params.id,
          changes: JSON.stringify({ status: "cancelled", softDelete: true }),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Mission annulée (soft delete - documents préservés)",
      });
    } else {
      // Hard delete if no critical dependencies
      await prisma.mission.delete({
        where: { id: params.id },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "DELETE",
          entity: "Mission",
          entityId: params.id,
          changes: JSON.stringify({ deleted: true }),
        },
      });

      return NextResponse.json({ success: true, message: "Mission supprimée avec succès" });
    }
  } catch (error: any) {
    console.error("Error deleting mission:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
