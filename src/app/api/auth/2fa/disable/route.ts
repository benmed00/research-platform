/**
 * @file route.ts
 * @description 2FA disable API endpoint
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 60
 * @size 2.0 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    { ...rateLimitConfigs.strict, identifier: "2fa-disable" },
    async () => {
      try {
        const session = await getServerSession(authOptions);
        if (!session) {
          return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { password } = await request.json();

        if (!password) {
          return NextResponse.json(
            { error: "Mot de passe requis pour désactiver 2FA" },
            { status: 400 }
          );
        }

        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
        });

        if (!user) {
          return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
        }

        // Verify password
        const bcrypt = require("bcryptjs");
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return NextResponse.json(
            { error: "Mot de passe incorrect" },
            { status: 400 }
          );
        }

        // Disable 2FA
        await prisma.user.update({
          where: { id: user.id },
          data: {
            twoFactorEnabled: false,
            twoFactorSecret: null,
            twoFactorBackupCodes: null,
            twoFactorVerifiedAt: null,
          },
        });

        return NextResponse.json({ success: true, message: "2FA désactivé avec succès" });
      } catch (error: any) {
        console.error("Error disabling 2FA:", error);
        return NextResponse.json(
          { error: error.message || "Erreur lors de la désactivation 2FA" },
          { status: 500 }
        );
      }
    }
  );
}

