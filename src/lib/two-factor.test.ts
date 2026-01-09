/**
 * @file two-factor.test.ts
 * @description Unit tests for two-factor authentication
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 150
 * @size 4.2 KB
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateTwoFactorSecret,
  generateQRCode,
  verifyTwoFactorToken,
  generateBackupCodes,
  verifyBackupCode,
  removeBackupCode,
  setupTwoFactor,
  validateTwoFactorSetup,
  isTwoFactorEnabled,
  formatBackupCodesForStorage,
  parseBackupCodesFromStorage,
} from "./two-factor";
import { authenticator } from "otplib";

describe("generateTwoFactorSecret", () => {
  it("should generate a secret", () => {
    const secret = generateTwoFactorSecret("test@example.com");
    expect(secret).toBeDefined();
    expect(secret.length).toBeGreaterThan(0);
  });

  it("should generate different secrets", () => {
    const secret1 = generateTwoFactorSecret("test1@example.com");
    const secret2 = generateTwoFactorSecret("test2@example.com");
    expect(secret1).not.toBe(secret2);
  });
});

describe("generateQRCode", () => {
  it("should generate QR code data URL", async () => {
    const secret = generateTwoFactorSecret("test@example.com");
    const qrCode = await generateQRCode(secret, "test@example.com");
    expect(qrCode).toBeDefined();
    expect(qrCode).toContain("data:image");
  });

  it("should handle errors gracefully", async () => {
    // Mock QRCode.toDataURL to throw an error
    const QRCode = await import("qrcode");
    vi.spyOn(QRCode, "toDataURL").mockRejectedValue(new Error("QR generation failed"));

    const secret = generateTwoFactorSecret("test@example.com");
    await expect(generateQRCode(secret, "test@example.com")).rejects.toThrow(
      "Erreur lors de la génération du QR code"
    );
  });
});

describe("verifyTwoFactorToken", () => {
  it("should verify valid token", () => {
    const secret = generateTwoFactorSecret("test@example.com");
    const token = authenticator.generate(secret);
    expect(verifyTwoFactorToken(token, secret)).toBe(true);
  });

  it("should reject invalid token", () => {
    const secret = generateTwoFactorSecret("test@example.com");
    expect(verifyTwoFactorToken("000000", secret)).toBe(false);
  });

  it("should reject token for wrong secret", () => {
    const secret1 = generateTwoFactorSecret("test1@example.com");
    const secret2 = generateTwoFactorSecret("test2@example.com");
    const token = authenticator.generate(secret1);
    expect(verifyTwoFactorToken(token, secret2)).toBe(false);
  });
});

describe("generateBackupCodes", () => {
  it("should generate backup codes", () => {
    const codes = generateBackupCodes(10);
    expect(codes).toHaveLength(10);
    codes.forEach((code) => {
      expect(code).toMatch(/^\d{8}$/); // 8 digits
    });
  });

  it("should generate unique codes", () => {
    const codes = generateBackupCodes(10);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(10);
  });

  it("should generate custom count", () => {
    const codes = generateBackupCodes(5);
    expect(codes).toHaveLength(5);
  });
});

describe("verifyBackupCode", () => {
  it("should verify valid backup code", () => {
    const codes = ["12345678", "87654321", "11111111"];
    expect(verifyBackupCode("12345678", codes)).toBe(true);
  });

  it("should reject invalid backup code", () => {
    const codes = ["12345678", "87654321"];
    expect(verifyBackupCode("99999999", codes)).toBe(false);
  });

  it("should handle whitespace", () => {
    const codes = ["12345678", "87654321"];
    expect(verifyBackupCode(" 12345678 ", codes)).toBe(true);
  });
});

describe("removeBackupCode", () => {
  it("should remove used backup code", () => {
    const codes = ["12345678", "87654321", "11111111"];
    const updated = removeBackupCode("12345678", codes);
    expect(updated).not.toContain("12345678");
    expect(updated).toHaveLength(2);
  });

  it("should handle whitespace", () => {
    const codes = ["12345678", "87654321"];
    const updated = removeBackupCode(" 12345678 ", codes);
    expect(updated).not.toContain("12345678");
  });

  it("should not modify array if code not found", () => {
    const codes = ["12345678", "87654321"];
    const updated = removeBackupCode("99999999", codes);
    expect(updated).toEqual(codes);
  });
});

describe("setupTwoFactor", () => {
  it("should setup 2FA with all components", async () => {
    const setup = await setupTwoFactor("test@example.com");
    expect(setup.secret).toBeDefined();
    expect(setup.qrCode).toBeDefined();
    expect(setup.backupCodes).toHaveLength(10);
  });

  it("should generate valid secret", async () => {
    const setup = await setupTwoFactor("test@example.com");
    const token = authenticator.generate(setup.secret);
    expect(verifyTwoFactorToken(token, setup.secret)).toBe(true);
  });
});

describe("validateTwoFactorSetup", () => {
  it("should validate correct token", () => {
    const secret = generateTwoFactorSecret("test@example.com");
    const token = authenticator.generate(secret);
    expect(validateTwoFactorSetup(token, secret)).toBe(true);
  });

  it("should reject incorrect token", () => {
    const secret = generateTwoFactorSecret("test@example.com");
    expect(validateTwoFactorSetup("000000", secret)).toBe(false);
  });
});

describe("isTwoFactorEnabled", () => {
  it("should return true when enabled", () => {
    expect(isTwoFactorEnabled(true, "secret123")).toBe(true);
  });

  it("should return false when disabled", () => {
    expect(isTwoFactorEnabled(false, "secret123")).toBe(false);
  });

  it("should return false when no secret", () => {
    expect(isTwoFactorEnabled(true, null)).toBe(false);
  });

  it("should return false when empty secret", () => {
    expect(isTwoFactorEnabled(true, "")).toBe(false);
  });
});

describe("formatBackupCodesForStorage", () => {
  it("should format codes as JSON", () => {
    const codes = ["12345678", "87654321"];
    const formatted = formatBackupCodesForStorage(codes);
    expect(formatted).toBe('["12345678","87654321"]');
  });
});

describe("parseBackupCodesFromStorage", () => {
  it("should parse valid JSON", () => {
    const stored = '["12345678","87654321"]';
    const codes = parseBackupCodesFromStorage(stored);
    expect(codes).toEqual(["12345678", "87654321"]);
  });

  it("should return empty array for null", () => {
    expect(parseBackupCodesFromStorage(null)).toEqual([]);
  });

  it("should return empty array for invalid JSON", () => {
    expect(parseBackupCodesFromStorage("invalid json")).toEqual([]);
  });
});
