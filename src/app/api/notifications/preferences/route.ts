/**
 * @file route.ts
 * @description src/app/api/notifications/preferences/route.ts
 * @author 1
 * @created 2026-01-05
 * @updated 2026-01-05
 * @updates 1
 * @lines 80
 * @size 2.15 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loggerHelpers } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        emailEnabled: true,
        pushEnabled: true,
        desktopEnabled: true,
        missionUpdates: true,
        documentUpdates: true,
        systemAlerts: true,
        weeklyDigest: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json({
      emailEnabled: user.emailEnabled ?? true,
      pushEnabled: user.pushEnabled ?? true,
      desktopEnabled: user.desktopEnabled ?? true,
      missionUpdates: user.missionUpdates ?? true,
      documentUpdates: user.documentUpdates ?? true,
      systemAlerts: user.systemAlerts ?? true,
      weeklyDigest: user.weeklyDigest ?? false,
    });
  } catch (error: any) {
    loggerHelpers.apiError(error as Error, {
      route: "/api/notifications/preferences",
      method: "GET",
    });
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const {
      emailEnabled,
      pushEnabled,
      desktopEnabled,
      missionUpdates,
      documentUpdates,
      systemAlerts,
      weeklyDigest,
    } = data;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        emailEnabled: emailEnabled ?? undefined,
        pushEnabled: pushEnabled ?? undefined,
        desktopEnabled: desktopEnabled ?? undefined,
        missionUpdates: missionUpdates ?? undefined,
        documentUpdates: documentUpdates ?? undefined,
        systemAlerts: systemAlerts ?? undefined,
        weeklyDigest: weeklyDigest ?? undefined,
      },
      select: {
        emailEnabled: true,
        pushEnabled: true,
        desktopEnabled: true,
        missionUpdates: true,
        documentUpdates: true,
        systemAlerts: true,
        weeklyDigest: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "User",
        entityId: session.user.id,
        changes: JSON.stringify({ notificationPreferences: data }),
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    const session = await getServerSession(authOptions);
    loggerHelpers.apiError(error as Error, {
      route: "/api/notifications/preferences",
      method: "PUT",
      userId: session?.user?.id,
    });
    return NextResponse.json(
      { error: error.message || "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

