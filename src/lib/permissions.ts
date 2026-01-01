/**
 * @file permissions.ts
 * @description src/lib/permissions.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 80
 * @size 1.90 KB
 */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = [
  "DIRECTEUR_SCIENTIFIQUE",
  "DIRECTEUR_ADMINISTRATIF_FINANCIER",
] as const;

/**
 * Check if a user has an admin role
 */
export function isAdminRole(role: string): boolean {
  return ADMIN_ROLES.includes(role as any);
}

/**
 * Get the current user's session and check if they are an admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    return false;
  }
  return isAdminRole(session.user.role);
}

/**
 * Check if the current user can access a resource
 * Returns true if user is admin or is the owner of the resource
 */
export async function canAccessResource(
  resourceOwnerId: string | null | undefined
): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return false;
  }

  // Admin can access everything
  if (session.user.role && isAdminRole(session.user.role)) {
    return true;
  }

  // User can access their own resources
  if (resourceOwnerId && resourceOwnerId === session.user.id) {
    return true;
  }

  return false;
}

/**
 * Get the current user's session
 * Throws an error if not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Non authentifié");
  }
  return session;
}

/**
 * Require admin access
 * Throws an error if user is not an admin
 */
export async function requireAdmin() {
  const session = await requireAuth();
  if (!session.user.role || !isAdminRole(session.user.role)) {
    throw new Error("Accès administrateur requis");
  }
  return session;
}

