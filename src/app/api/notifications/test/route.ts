/**
 * @file route.ts
 * @description src/app/api/notifications/test/route.ts
 * @author github-actions[bot]
 * @created 2026-01-04
 * @updated 2026-01-04
 * @updates 1
 * @lines 69
 * @size 2.14 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Verify user exists in database
    const { prisma } = await import("@/lib/prisma");
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé dans la base de données. Veuillez vous reconnecter." },
        { status: 400 }
      );
    }

    // Create a few test notifications
    const notifications = await Promise.all([
      createNotification({
        userId: session.user.id,
        type: "info",
        title: "Bienvenue sur la plateforme",
        message: "Ceci est votre première notification de test. Le système de notifications est maintenant actif !",
        link: "/dashboard",
      }),
      createNotification({
        userId: session.user.id,
        type: "success",
        title: "Système de notifications activé",
        message: "Les notifications automatiques seront créées lors d'événements importants (nouvelles missions, espèces, etc.)",
      }),
      createNotification({
        userId: session.user.id,
        type: "warning",
        title: "Action requise",
        message: "N'oubliez pas de configurer vos préférences de notifications",
        link: "/dashboard/notifications",
      }),
    ]);

    return NextResponse.json({
      message: "Notifications de test créées",
      count: notifications.length,
      notifications,
    });
  } catch (error: any) {
    console.error("Error creating test notifications:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création" },
      { status: 500 }
    );
  }
}

