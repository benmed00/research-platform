/**
 * @file route.ts
 * @description src/app/api/documents/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 293
 * @size 8.19 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { documentSchema } from "@/lib/validations";
import { canAccessResource, isAdminRole } from "@/lib/permissions";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const type = formData.get("type") as "RAPPORT_SCIENTIFIQUE" | "RAPPORT_ADMINISTRATIF" | "DONNEE_BRUTE" | "PUBLICATION" | "AUTRE";
    const description = formData.get("description") as string | null;
    const missionId = formData.get("missionId") as string | null;
    const isPublic = formData.get("isPublic") === "true";

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "documents");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Create document record
    const fileUrl = `/uploads/documents/${filename}`;
    const document = await prisma.document.create({
      data: {
        title,
        type,
        description: description || undefined,
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || undefined,
        authorId: session.user.id,
        missionId: missionId || undefined,
        isPublic: isPublic || false,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Document",
        entityId: document.id,
        changes: JSON.stringify({ title, type }),
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error: any) {
    console.error("Error creating document:", error);
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
    const missionId = searchParams.get("missionId");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (type) {
      where.type = type;
    }
    if (missionId) {
      where.missionId = missionId;
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        take: limit,
        skip: offset,
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
        orderBy: { createdAt: "desc" },
      }),
      prisma.document.count({ where }),
    ]);

    return NextResponse.json({
      data: documents,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "ID du document requis" }, { status: 400 });
    }

    // Check if document exists and user has permission
    const existingDocument = await prisma.document.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return NextResponse.json({ error: "Document non trouvé" }, { status: 404 });
    }

    // Check permission: author or admin
    if (!(await canAccessResource(existingDocument.authorId))) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Validate data
    const validatedData = documentSchema.parse(updateData);

    const document = await prisma.document.update({
      where: { id },
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

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID du document requis" }, { status: 400 });
    }

    // Check if document exists
    const document = await prisma.document.findUnique({
      where: { id },
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
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entity: "Document",
        entityId: id,
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

