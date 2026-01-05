/**
 * @file route.ts
 * @description src/app/api/publications/[id]/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 157
 * @size 4.30 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publicationSchema } from "@/lib/validations";

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
    const publication = await prisma.publication.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!publication) {
      return NextResponse.json(
        { error: "Publication non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(publication);
  } catch (error) {
    console.error("Error fetching publication:", error);
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
    
    // Check if publication exists
    const existingPublication = await prisma.publication.findUnique({
      where: { id },
    });

    if (!existingPublication) {
      return NextResponse.json({ error: "Publication non trouvée" }, { status: 404 });
    }

    // Validate data if provided
    let validatedData;
    try {
      validatedData = publicationSchema.parse(data);
    } catch (error: any) {
      // If validation fails, allow partial updates (for chapters, etc.)
      validatedData = data;
    }

    const publication = await prisma.publication.update({
      where: { id },
      data: {
        title: validatedData.title || existingPublication.title,
        year: validatedData.year ? parseInt(validatedData.year) : existingPublication.year,
        type: validatedData.type || existingPublication.type,
        content: validatedData.description || data.content || existingPublication.content,
        coverImage: data.coverImage || existingPublication.coverImage,
        isPublished: validatedData.status === "PUBLISHED" || data.isPublished !== undefined ? (validatedData.status === "PUBLISHED" || data.isPublished) : existingPublication.isPublished,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : (data.publishedAt ? new Date(data.publishedAt) : existingPublication.publishedAt),
      },
      include: {
        chapters: {
          orderBy: { order: "asc" },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "Publication",
        entityId: publication.id,
        changes: JSON.stringify(data),
      },
    });

    return NextResponse.json(publication);
  } catch (error: any) {
    console.error("Error updating publication:", error);
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
    await prisma.publication.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entity: "Publication",
        entityId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting publication:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}

