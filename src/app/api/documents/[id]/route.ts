/**
 * @file route.ts
 * @description src/app/api/documents/[id]/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 205
 * @size 5.68 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { documentSchema } from "@/lib/validations";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { canAccessResource } from "@/lib/permissions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        mission: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document non trouvé" }, { status: 404 });
    }

    // Check if document is public or user has access
    if (!document.isPublic) {
      if (!(await canAccessResource(document.authorId))) {
        return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
      }
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
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
    const validatedData = documentSchema.parse(data);

    // Check if document exists
    const existingDocument = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!existingDocument) {
      return NextResponse.json({ error: "Document non trouvé" }, { status: 404 });
    }

    // Check permission: author or admin
    if (!(await canAccessResource(existingDocument.authorId))) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const document = await prisma.document.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        type: validatedData.type,
        description: validatedData.description || undefined,
        missionId: validatedData.missionId || undefined,
        isPublic: validatedData.isPublic,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        mission: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "Document",
        entityId: document.id,
        changes: JSON.stringify({ title: validatedData.title, type: validatedData.type }),
      },
    });

    return NextResponse.json(document);
  } catch (error: any) {
    console.error("Error updating document:", error);
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

    // Check if document exists
    const document = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json({ error: "Document non trouvé" }, { status: 404 });
    }

    // Check permission: author or admin
    if (!(await canAccessResource(document.authorId))) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Delete physical file if it exists
    if (document.fileUrl) {
      const filepath = join(process.cwd(), "public", document.fileUrl);
      if (existsSync(filepath)) {
        try {
          await unlink(filepath);
        } catch (error) {
          console.error("Error deleting file:", error);
          // Continue with database deletion even if file deletion fails
        }
      }
    }

    // Delete document record
    await prisma.document.delete({
      where: { id: params.id },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entity: "Document",
        entityId: params.id,
        changes: JSON.stringify({ deleted: true }),
      },
    });

    return NextResponse.json({ success: true, message: "Document supprimé avec succès" });
  } catch (error: any) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
