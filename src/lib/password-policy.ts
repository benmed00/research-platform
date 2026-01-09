/**
 * @file password-policy.ts
 * @description Password policy validation and management
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 150
 * @size 4.5 KB
 */
import bcrypt from "bcryptjs";
import { z } from "zod";

export interface PasswordPolicyConfig {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number; // Days until password expires
  historyCount: number; // Number of previous passwords to remember
  lockoutAttempts: number; // Failed attempts before lockout
  lockoutDuration: number; // Minutes to lock account
}

export const defaultPasswordPolicy: PasswordPolicyConfig = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90, // 90 days
  historyCount: 5, // Remember last 5 passwords
  lockoutAttempts: 5,
  lockoutDuration: 30, // 30 minutes
};

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
}

/**
 * Validate password against policy
 */
export function validatePassword(
  password: string,
  policy: PasswordPolicyConfig = defaultPasswordPolicy
): PasswordValidationResult {
  const errors: string[] = [];
  let strength: "weak" | "medium" | "strong" = "weak";
  let score = 0;

  // Length check
  if (password.length < policy.minLength) {
    errors.push(`Le mot de passe doit contenir au moins ${policy.minLength} caractères`);
  } else {
    score += 1;
  }

  // Uppercase check
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une majuscule");
  } else if (/[A-Z]/.test(password)) {
    score += 1;
  }

  // Lowercase check
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une minuscule");
  } else if (/[a-z]/.test(password)) {
    score += 1;
  }

  // Numbers check
  if (policy.requireNumbers && !/[0-9]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre");
  } else if (/[0-9]/.test(password)) {
    score += 1;
  }

  // Special characters check
  if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un caractère spécial");
  } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  }

  // Additional length bonus
  if (password.length >= 16) score += 1;
  if (password.length >= 20) score += 1;

  // Determine strength
  if (score >= 6) strength = "strong";
  else if (score >= 4) strength = "medium";
  else strength = "weak";

  return {
    valid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Check if password is in history
 */
export async function isPasswordInHistory(
  password: string,
  passwordHistory: string[] | null
): Promise<boolean> {
  if (!passwordHistory || passwordHistory.length === 0) {
    return false;
  }

  for (const hashedPassword of passwordHistory) {
    const match = await bcrypt.compare(password, hashedPassword);
    if (match) {
      return true;
    }
  }

  return false;
}

/**
 * Add password to history
 */
export async function addPasswordToHistory(
  password: string,
  currentHistory: string[] | null,
  maxHistory: number = defaultPasswordPolicy.historyCount
): Promise<string[]> {
  const hashedPassword = await bcrypt.hash(password, 10);
  const history = currentHistory || [];
  const newHistory = [hashedPassword, ...history].slice(0, maxHistory);
  return newHistory;
}

/**
 * Check if password is expired
 */
export function isPasswordExpired(
  passwordChangedAt: Date | null,
  maxAge: number = defaultPasswordPolicy.maxAge
): boolean {
  if (!passwordChangedAt) {
    return false; // New users haven't changed password yet
  }

  const expirationDate = new Date(passwordChangedAt);
  expirationDate.setDate(expirationDate.getDate() + maxAge);
  return new Date() > expirationDate;
}

/**
 * Calculate days until password expires
 */
export function daysUntilPasswordExpires(
  passwordChangedAt: Date | null,
  maxAge: number = defaultPasswordPolicy.maxAge
): number | null {
  if (!passwordChangedAt) {
    return null;
  }

  const expirationDate = new Date(passwordChangedAt);
  expirationDate.setDate(expirationDate.getDate() + maxAge);
  const daysLeft = Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return daysLeft > 0 ? daysLeft : 0;
}

/**
 * Check if account is locked
 */
export function isAccountLocked(lockedUntil: Date | null): boolean {
  if (!lockedUntil) {
    return false;
  }
  return new Date() < new Date(lockedUntil);
}

/**
 * Calculate lockout expiration time
 */
export function getLockoutExpiration(
  lockoutDuration: number = defaultPasswordPolicy.lockoutDuration
): Date {
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + lockoutDuration);
  return expiration;
}

/**
 * Password schema for validation
 */
export const passwordSchema = z
  .string()
  .min(defaultPasswordPolicy.minLength, {
    message: `Le mot de passe doit contenir au moins ${defaultPasswordPolicy.minLength} caractères`,
  })
  .refine(
    (password) => {
      const validation = validatePassword(password);
      return validation.valid;
    },
    {
      message: "Le mot de passe ne respecte pas la politique de sécurité",
    }
  );

