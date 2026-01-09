/**
 * @file two-factor.ts
 * @description Two-Factor Authentication (2FA) implementation using TOTP
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 200
 * @size 6.0 KB
 */
import { authenticator } from "otplib";
import * as crypto from "crypto";
import * as QRCode from "qrcode";

// Configure authenticator
authenticator.options = {
  step: 30, // 30 seconds
  window: 1, // Allow 1 step tolerance
};

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

/**
 * Generate a new 2FA secret for a user
 */
export function generateTwoFactorSecret(email: string, serviceName: string = "Research Platform"): string {
  return authenticator.generateSecret();
}

/**
 * Generate QR code data URL for 2FA setup
 */
export async function generateQRCode(secret: string, email: string, serviceName: string = "Research Platform"): Promise<string> {
  const otpAuthUrl = authenticator.keyuri(email, serviceName, secret);
  
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);
    return qrCodeDataUrl;
  } catch (error) {
    throw new Error("Erreur lors de la génération du QR code");
  }
}

/**
 * Verify TOTP token
 */
export function verifyTwoFactorToken(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch (error) {
    return false;
  }
}

/**
 * Generate backup codes for 2FA
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // Generate 8-digit backup code
    const code = crypto.randomInt(10000000, 99999999).toString();
    codes.push(code);
  }
  return codes;
}

/**
 * Verify backup code
 */
export function verifyBackupCode(code: string, backupCodes: string[]): boolean {
  const normalizedCode = code.trim();
  return backupCodes.includes(normalizedCode);
}

/**
 * Remove used backup code
 */
export function removeBackupCode(code: string, backupCodes: string[]): string[] {
  const normalizedCode = code.trim();
  return backupCodes.filter((c) => c !== normalizedCode);
}

/**
 * Setup 2FA for a user
 */
export async function setupTwoFactor(
  email: string,
  serviceName: string = "Research Platform"
): Promise<TwoFactorSetup> {
  const secret = generateTwoFactorSecret(email, serviceName);
  const qrCode = await generateQRCode(secret, email, serviceName);
  const backupCodes = generateBackupCodes();

  return {
    secret,
    qrCode,
    backupCodes,
  };
}

/**
 * Validate 2FA setup token
 */
export function validateTwoFactorSetup(token: string, secret: string): boolean {
  return verifyTwoFactorToken(token, secret);
}

/**
 * Check if 2FA is enabled for user
 */
export function isTwoFactorEnabled(twoFactorEnabled: boolean, twoFactorSecret: string | null): boolean {
  return twoFactorEnabled && twoFactorSecret !== null && twoFactorSecret.length > 0;
}

/**
 * Format backup codes for storage (JSON array)
 */
export function formatBackupCodesForStorage(codes: string[]): string {
  return JSON.stringify(codes);
}

/**
 * Parse backup codes from storage
 */
export function parseBackupCodesFromStorage(stored: string | null): string[] {
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

