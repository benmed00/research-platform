/**
 * @file route.ts
 * @description src/app/api/species/[id]/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 199
 * @size 5.34 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { speciesSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const species = await prisma.species.findUnique({
      where: { id: id },
      include: {
        observations: {
          orderBy: { date: "desc" },
          take: 50,
          include: {
            mission: {
              select: {
                id: true,
                title: true,
                startDate: true,
              },
            },
          },
        },
        locations: {
          orderBy: { observedAt: "desc" },
          take: 100,
        },
        photos: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        references: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!species) {
      return NextResponse.json({ error: "Espèce non trouvée" }, { status: 404 });
    }

    return NextResponse.json(species);
  } catch (error) {
    console.error("Error fetching species:", error);
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

    const data = await request.json();
    const validatedData = speciesSchema.parse(data);

    // Check if species exists
    const existingSpecies = await prisma.species.findUnique({
      where: { id: id },
    });

    if (!existingSpecies) {
      return NextResponse.json({ error: "Espèce non trouvée" }, { status: 404 });
    }

    const species = await prisma.species.update({
      where: { id: id },
      data: {
        scientificName: validatedData.scientificName,
        commonName: validatedData.commonName || undefined,
        type: validatedData.type,
        iucnStatus: validatedData.iucnStatus || undefined,
        habitat: validatedData.habitat || undefined,
        description: validatedData.description || undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "Species",
        entityId: species.id,
        changes: JSON.stringify({
          scientificName: validatedData.scientificName,
          type: validatedData.type,
        }),
      },
    });

    return NextResponse.json(species);
  } catch (error: any) {
    console.error("Error updating species:", error);
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

    // Check if species exists
    const species = await prisma.species.findUnique({
      where: { id: id },
      include: {
        observations: true,
        locations: true,
        photos: true,
        references: true,
      },
    });

    if (!species) {
      return NextResponse.json({ error: "Espèce non trouvée" }, { status: 404 });
    }

    // For scientific data, we should NEVER hard delete
    // Instead, we mark it as archived or keep it but mark as inactive
    // Since there's no isActive field, we'll preserve all data
    // In a real scenario, you might want to add an isActive or isArchived field
    
    // For now, we'll prevent deletion if there are observations
    if (species.observations.length > 0 || species.locations.length > 0) {
      return NextResponse.json(
        {
          error: "Impossible de supprimer une espèce avec des observations. Les données scientifiques doivent être préservées.",
        },
        { status: 400 }
      );
    }

    // Only allow deletion if no scientific data exists
    await prisma.species.delete({
      where: { id: id },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entity: "Species",
        entityId: id,
        changes: JSON.stringify({ deleted: true }),
      },
    });

    return NextResponse.json({ success: true, message: "Espèce supprimée avec succès" });
  } catch (error: any) {
    console.error("Error deleting species:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
