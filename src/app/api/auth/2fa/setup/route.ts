/**
 * @file route.ts
 * @description 2FA setup API endpoint
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 80
 * @size 2.5 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { setupTwoFactor } from "@/lib/two-factor";
import { withRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    { ...rateLimitConfigs.strict, identifier: "2fa-setup" },
    async () => {
      try {
        const session = await getServerSession(authOptions);
        if (!session) {
          return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
        });

        if (!user) {
          return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
        }

        if (user.twoFactorEnabled) {
          return NextResponse.json(
            { error: "L'authentification à deux facteurs est déjà activée" },
            { status: 400 }
          );
        }

        // Generate 2FA setup
        const setup = await setupTwoFactor(user.email, "Research Platform");

        // Store secret temporarily (user needs to verify before enabling)
        await prisma.user.update({
          where: { id: user.id },
          data: {
            twoFactorSecret: setup.secret,
            twoFactorBackupCodes: JSON.stringify(setup.backupCodes),
          },
        });

        return NextResponse.json({
          secret: setup.secret,
          qrCode: setup.qrCode,
          backupCodes: setup.backupCodes,
        });
      } catch (error: any) {
        console.error("Error setting up 2FA:", error);
        return NextResponse.json(
          { error: error.message || "Erreur lors de la configuration 2FA" },
          { status: 500 }
        );
      }
    }
  );
}

