/**
 * @file route.ts
 * @description src/app/api/users/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 104
 * @size 2.44 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { withRateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { loggerHelpers } from "@/lib/logger";
import { parsePagination, createPaginatedResponse } from "@/lib/pagination";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  return withRateLimit(
    request,
    { ...rateLimitConfigs.api, identifier: session.user.id },
    async () => {
      try {

    const data = await request.json();
    const { firstName, lastName, email, password, role } = data;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Log de l'action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "User",
        entityId: user.id,
        changes: JSON.stringify({ email, role }),
      },
    });

        return NextResponse.json(user, { status: 201 });
      } catch (error) {
        loggerHelpers.apiError(error as Error, {
          route: "/api/users",
          method: "POST",
          userId: session.user.id,
        });
        return NextResponse.json(
          { error: "Erreur lors de la création" },
          { status: 500 }
        );
      }
    }
  );
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { page, limit, skip, take } = parsePagination(request);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json(createPaginatedResponse(users, total, page, limit));
  } catch (error) {
    loggerHelpers.apiError(error as Error, {
      route: "/api/users",
      method: "GET",
    });
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

