/**
 * @file auth.ts
 * @description src/lib/auth.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 90
 * @size 1.95 KB
 */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  isAccountLocked,
  getLockoutExpiration,
  defaultPasswordPolicy,
  isPasswordExpired,
  daysUntilPasswordExpires,
} from "@/lib/password-policy";
import { isTwoFactorEnabled, verifyTwoFactorToken, verifyBackupCode, removeBackupCode, parseBackupCodesFromStorage } from "@/lib/two-factor";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.isActive) {
          return null;
        }

        // Check if account is locked
        if (isAccountLocked(user.accountLockedUntil)) {
          await prisma.loginLog.create({
            data: {
              userId: user.id,
              success: false,
            },
          });
          throw new Error("Compte verrouillé. Veuillez réessayer plus tard.");
        }

        // Check password expiration
        if (isPasswordExpired(user.passwordChangedAt, defaultPasswordPolicy.maxAge)) {
          // Password expired - user needs to change it
          // We'll allow login but flag it in the session
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          // Increment failed login attempts
          const failedAttempts = (user.failedLoginAttempts || 0) + 1;
          const shouldLockAccount = failedAttempts >= defaultPasswordPolicy.lockoutAttempts;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: failedAttempts,
              accountLockedUntil: shouldLockAccount
                ? getLockoutExpiration(defaultPasswordPolicy.lockoutDuration)
                : user.accountLockedUntil,
            },
          });

          await prisma.loginLog.create({
            data: {
              userId: user.id,
              success: false,
            },
          });

          if (shouldLockAccount) {
            throw new Error(
              `Trop de tentatives échouées. Compte verrouillé pendant ${defaultPasswordPolicy.lockoutDuration} minutes.`
            );
          }

          throw new Error(
            `Identifiants incorrects. ${defaultPasswordPolicy.lockoutAttempts - failedAttempts} tentatives restantes.`
          );
        }

        // Reset failed attempts on successful login
        if (user.failedLoginAttempts > 0) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: 0,
              accountLockedUntil: null,
            },
          });
        }

        // Check if 2FA is required
        const requires2FA = isTwoFactorEnabled(user.twoFactorEnabled, user.twoFactorSecret);
        const twoFactorToken = (credentials as any).twoFactorToken;
        const backupCode = (credentials as any).backupCode;

        if (requires2FA) {
          if (!twoFactorToken && !backupCode) {
            // Return special indicator that 2FA is required
            throw new Error("2FA_REQUIRED");
          }

          let twoFactorValid = false;

          if (twoFactorToken && user.twoFactorSecret) {
            twoFactorValid = verifyTwoFactorToken(twoFactorToken, user.twoFactorSecret);
          } else if (backupCode && user.twoFactorBackupCodes) {
            const backupCodes = parseBackupCodesFromStorage(user.twoFactorBackupCodes);
            if (verifyBackupCode(backupCode, backupCodes)) {
              twoFactorValid = true;
              // Remove used backup code
              const updatedCodes = removeBackupCode(backupCode, backupCodes);
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  twoFactorBackupCodes: JSON.stringify(updatedCodes),
                },
              });
            }
          }

          if (!twoFactorValid) {
            await prisma.loginLog.create({
              data: {
                userId: user.id,
                success: false,
              },
            });
            throw new Error("Code 2FA invalide");
          }
        }

        // Log successful login
        await prisma.loginLog.create({
          data: {
            userId: user.id,
            success: true,
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          passwordExpired: isPasswordExpired(user.passwordChangedAt, defaultPasswordPolicy.maxAge),
          daysUntilExpiration: daysUntilPasswordExpires(user.passwordChangedAt, defaultPasswordPolicy.maxAge),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.passwordExpired = (user as any).passwordExpired;
        token.daysUntilExpiration = (user as any).daysUntilExpiration;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).passwordExpired = token.passwordExpired;
        (session.user as any).daysUntilExpiration = token.daysUntilExpiration;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

