/**
 * @file route.ts
 * @description src/app/api/publications/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 121
 * @size 3.13 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publicationSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const validatedData = publicationSchema.parse(data);

    const publication = await prisma.publication.create({
      data: {
        title: validatedData.title,
        year: parseInt(validatedData.year),
        type: validatedData.type,
        content: validatedData.description || undefined,
        isPublished: validatedData.status === "PUBLISHED",
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Publication",
        entityId: publication.id,
        changes: JSON.stringify({ 
          title: validatedData.title, 
          year: validatedData.year, 
          type: validatedData.type 
        }),
      },
    });

    return NextResponse.json(publication, { status: 201 });
  } catch (error: any) {
    console.error("Error creating publication:", error);
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
    const year = searchParams.get("year");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (year) {
      where.year = parseInt(year);
    }
    if (type) {
      where.type = type;
    }

    const [publications, total] = await Promise.all([
      prisma.publication.findMany({
        where,
        take: limit,
        skip: offset,
        include: {
          chapters: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { year: "desc" },
      }),
      prisma.publication.count({ where }),
    ]);

    // Cache for 5 minutes
    return NextResponse.json(
      {
        data: publications,
        total,
        limit,
        offset,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error("Error fetching publications:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

