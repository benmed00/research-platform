/**
 * @file route.ts
 * @description Password change API endpoint with policy validation
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 100
 * @size 3.2 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  validatePassword,
  isPasswordInHistory,
  addPasswordToHistory,
  defaultPasswordPolicy,
} from "@/lib/password-policy";
import { withRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    { ...rateLimitConfigs.strict, identifier: "password-change" },
    async () => {
      try {
        const session = await getServerSession(authOptions);
        if (!session) {
          return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
          return NextResponse.json(
            { error: "Mot de passe actuel et nouveau mot de passe requis" },
            { status: 400 }
          );
        }

        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
        });

        if (!user) {
          return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
          return NextResponse.json(
            { error: "Mot de passe actuel incorrect" },
            { status: 400 }
          );
        }

        // Check if new password is same as current
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
          return NextResponse.json(
            { error: "Le nouveau mot de passe doit être différent de l'actuel" },
            { status: 400 }
          );
        }

        // Validate new password against policy
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
          return NextResponse.json(
            {
              error: "Le nouveau mot de passe ne respecte pas la politique de sécurité",
              details: passwordValidation.errors,
              strength: passwordValidation.strength,
            },
            { status: 400 }
          );
        }

        // Check if password is in history
        const passwordHistory = user.passwordHistory
          ? JSON.parse(user.passwordHistory)
          : [];
        const isInHistory = await isPasswordInHistory(newPassword, passwordHistory);
        if (isInHistory) {
          return NextResponse.json(
            {
              error: "Ce mot de passe a déjà été utilisé récemment. Veuillez en choisir un autre.",
            },
            { status: 400 }
          );
        }

        // Hash new password and update history
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedHistory = await addPasswordToHistory(
          newPassword,
          passwordHistory,
          defaultPasswordPolicy.historyCount
        );

        // Update user password
        const now = new Date();
        await prisma.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            passwordChangedAt: now,
            passwordHistory: JSON.stringify(updatedHistory),
            failedLoginAttempts: 0, // Reset failed attempts
            accountLockedUntil: null, // Unlock account if locked
          },
        });

        // Log password change
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "UPDATE",
            entity: "User",
            entityId: user.id,
            changes: JSON.stringify({ passwordChanged: true }),
          },
        });

        return NextResponse.json({
          success: true,
          message: "Mot de passe modifié avec succès",
          strength: passwordValidation.strength,
        });
      } catch (error: any) {
        console.error("Error changing password:", error);
        return NextResponse.json(
          { error: error.message || "Erreur lors du changement de mot de passe" },
          { status: 500 }
        );
      }
    }
  );
}

