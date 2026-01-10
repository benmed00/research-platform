/**
 * @file route.ts
 * @description src/app/api/equipment/[id]/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 204
 * @size 5.59 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { equipmentSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        maintenances: {
          orderBy: { date: "desc" },
          take: 20,
        },
        missionEquipment: {
          include: {
            mission: {
              select: {
                id: true,
                title: true,
                startDate: true,
                endDate: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!equipment) {
      return NextResponse.json({ error: "Équipement non trouvé" }, { status: 404 });
    }

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    const validatedData = equipmentSchema.parse(data);

    // Check if equipment exists
    const existingEquipment = await prisma.equipment.findUnique({
      where: { id },
    });

    if (!existingEquipment) {
      return NextResponse.json({ error: "Équipement non trouvé" }, { status: 404 });
    }

    const equipment = await prisma.equipment.update({
      where: { id },
      data: {
        name: validatedData.name,
        category: validatedData.category,
        serialNumber: validatedData.serialNumber || undefined,
        purchaseDate: validatedData.purchaseDate
          ? new Date(validatedData.purchaseDate)
          : undefined,
        purchasePrice: validatedData.purchasePrice
          ? parseFloat(validatedData.purchasePrice)
          : undefined,
        lifespan: validatedData.lifespan ? parseInt(validatedData.lifespan) : undefined,
        location: validatedData.location || undefined,
        description: validatedData.description || undefined,
        status: validatedData.status || existingEquipment.status,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "Equipment",
        entityId: equipment.id,
        changes: JSON.stringify({ name: validatedData.name, category: validatedData.category }),
      },
    });

    return NextResponse.json(equipment);
  } catch (error: any) {
    console.error("Error updating equipment:", error);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    // Check if equipment exists
    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        maintenances: true,
        missionEquipment: true,
      },
    });

    if (!equipment) {
      return NextResponse.json({ error: "Équipement non trouvé" }, { status: 404 });
    }

    // Check for dependencies
    if (equipment.missionEquipment.length > 0) {
      // Soft delete by changing status to RETIRED
      await prisma.equipment.update({
        where: { id },
        data: { status: "RETIRED" },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "DELETE",
          entity: "Equipment",
          entityId: id,
          changes: JSON.stringify({ status: "RETIRED", softDelete: true }),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Équipement retiré (soft delete - affectations préservées)",
      });
    } else {
      // Hard delete if no dependencies
      await prisma.equipment.delete({
        where: { id },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "DELETE",
          entity: "Equipment",
          entityId: id,
          changes: JSON.stringify({ deleted: true }),
        },
      });

      return NextResponse.json({ success: true, message: "Équipement supprimé avec succès" });
    }
  } catch (error: any) {
    console.error("Error deleting equipment:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
