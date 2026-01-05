/**
 * @file route.ts
 * @description src/app/api/documents/upload/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 67
 * @size 1.77 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { withRateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { loggerHelpers } from "@/lib/logger";

export async function POST(request: NextRequest) {
  // Get session first for identifier
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  return withRateLimit(
    request,
    { ...rateLimitConfigs.upload, identifier: session.user.id },
    async () => {
      try {
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

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
    const filename = `${timestamp}-${file.name}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return file URL
    const fileUrl = `/uploads/documents/${filename}`;

        return NextResponse.json({
          fileUrl,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        });
      } catch (error: any) {
        loggerHelpers.apiError(error as Error, {
          route: "/api/documents/upload",
          method: "POST",
          userId: session.user.id,
        });
        return NextResponse.json(
          { error: error.message || "Erreur lors de l'upload" },
          { status: 500 }
        );
      }
    }
  );
}


