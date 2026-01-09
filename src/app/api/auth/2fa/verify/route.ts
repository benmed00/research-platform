/**
 * @file route.ts
 * @description 2FA verification API endpoint
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 70
 * @size 2.2 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateTwoFactorSetup } from "@/lib/two-factor";
import { withRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    { ...rateLimitConfigs.strict, identifier: "2fa-verify" },
    async () => {
      try {
        const session = await getServerSession(authOptions);
        if (!session) {
          return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { token } = await request.json();

        if (!token || token.length !== 6) {
          return NextResponse.json(
            { error: "Code de vérification invalide" },
            { status: 400 }
          );
        }

        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
        });

        if (!user || !user.twoFactorSecret) {
          return NextResponse.json(
            { error: "Configuration 2FA non trouvée" },
            { status: 404 }
          );
        }

        const isValid = validateTwoFactorSetup(token, user.twoFactorSecret);

        if (!isValid) {
          return NextResponse.json(
            { error: "Code de vérification invalide" },
            { status: 400 }
          );
        }

        // Enable 2FA
        await prisma.user.update({
          where: { id: user.id },
          data: {
            twoFactorEnabled: true,
            twoFactorVerifiedAt: new Date(),
          },
        });

        return NextResponse.json({ success: true, message: "2FA activé avec succès" });
      } catch (error: any) {
        console.error("Error verifying 2FA:", error);
        return NextResponse.json(
          { error: error.message || "Erreur lors de la vérification 2FA" },
          { status: 500 }
        );
      }
    }
  );
}

