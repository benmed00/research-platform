/**
 * @file password-policy.test.ts
 * @description Unit tests for password policy validation
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 200
 * @size 5.5 KB
 */
import { describe, it, expect, vi } from "vitest";
import {
  validatePassword,
  isPasswordExpired,
  daysUntilPasswordExpires,
  isAccountLocked,
  getLockoutExpiration,
  isPasswordInHistory,
  addPasswordToHistory,
  defaultPasswordPolicy,
} from "./password-policy";

describe("validatePassword", () => {
  it("should validate a strong password", () => {
    const result = validatePassword("StrongPass123!@#");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.strength).toBe("strong");
  });

  it("should reject password that is too short", () => {
    const result = validatePassword("Short1!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      `Le mot de passe doit contenir au moins ${defaultPasswordPolicy.minLength} caractères`
    );
  });

  it("should reject password without uppercase", () => {
    const result = validatePassword("lowercase123!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Le mot de passe doit contenir au moins une majuscule");
  });

  it("should reject password without lowercase", () => {
    const result = validatePassword("UPPERCASE123!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Le mot de passe doit contenir au moins une minuscule");
  });

  it("should reject password without numbers", () => {
    const result = validatePassword("NoNumbers!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Le mot de passe doit contenir au moins un chiffre");
  });

  it("should reject password without special characters", () => {
    const result = validatePassword("NoSpecial123");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Le mot de passe doit contenir au moins un caractère spécial");
  });

  it("should identify weak passwords", () => {
    // A password that meets minimum requirements but is short
    const result = validatePassword("Weak1!");
    expect(result.strength).toBe("weak");
  });

  it("should identify medium strength passwords", () => {
    const result = validatePassword("MediumPass123!");
    expect(result.strength).toBe("medium");
  });

  it("should identify strong passwords", () => {
    const result = validatePassword("VeryStrongPassword123!@#");
    expect(result.strength).toBe("strong");
  });

  it("should handle custom policy", () => {
    const customPolicy = {
      ...defaultPasswordPolicy,
      minLength: 8,
      requireSpecialChars: false,
    };
    const result = validatePassword("Simple8Pass", customPolicy);
    expect(result.valid).toBe(true);
  });
});

describe("isPasswordExpired", () => {
  it("should return false for new password", () => {
    expect(isPasswordExpired(null)).toBe(false);
  });

  it("should return false for recent password", () => {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 30); // 30 days ago
    expect(isPasswordExpired(recentDate)).toBe(false);
  });

  it("should return true for expired password", () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 100); // 100 days ago
    expect(isPasswordExpired(oldDate, 90)).toBe(true);
  });

  it("should handle custom max age", () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 60); // 60 days ago
    expect(isPasswordExpired(oldDate, 30)).toBe(true);
    expect(isPasswordExpired(oldDate, 90)).toBe(false);
  });
});

describe("daysUntilPasswordExpires", () => {
  it("should return null for new password", () => {
    expect(daysUntilPasswordExpires(null)).toBeNull();
  });

  it("should calculate days correctly", () => {
    const date = new Date();
    date.setDate(date.getDate() - 60); // 60 days ago
    const days = daysUntilPasswordExpires(date, 90);
    expect(days).toBeGreaterThan(0);
    expect(days).toBeLessThanOrEqual(30);
  });

  it("should return 0 for expired password", () => {
    const date = new Date();
    date.setDate(date.getDate() - 100); // 100 days ago
    const days = daysUntilPasswordExpires(date, 90);
    expect(days).toBe(0);
  });
});

describe("isAccountLocked", () => {
  it("should return false when not locked", () => {
    expect(isAccountLocked(null)).toBe(false);
  });

  it("should return true when locked", () => {
    const lockDate = new Date();
    lockDate.setMinutes(lockDate.getMinutes() + 30); // Locked for 30 more minutes
    expect(isAccountLocked(lockDate)).toBe(true);
  });

  it("should return false when lock expired", () => {
    const lockDate = new Date();
    lockDate.setMinutes(lockDate.getMinutes() - 10); // Lock expired 10 minutes ago
    expect(isAccountLocked(lockDate)).toBe(false);
  });
});

describe("getLockoutExpiration", () => {
  it("should create future expiration date", () => {
    const expiration = getLockoutExpiration(30);
    expect(expiration.getTime()).toBeGreaterThan(Date.now());
    expect(expiration.getTime()).toBeLessThanOrEqual(Date.now() + 31 * 60 * 1000);
  });

  it("should use default duration", () => {
    const expiration = getLockoutExpiration();
    const minutes = Math.floor((expiration.getTime() - Date.now()) / (60 * 1000));
    expect(minutes).toBeGreaterThanOrEqual(defaultPasswordPolicy.lockoutDuration - 1);
    expect(minutes).toBeLessThanOrEqual(defaultPasswordPolicy.lockoutDuration);
  });
});

describe("isPasswordInHistory", () => {
  it("should return false for empty history", async () => {
    const result = await isPasswordInHistory("NewPassword123!", null);
    expect(result).toBe(false);
  });

  it("should return false for password not in history", async () => {
    // Note: bcrypt.compare is not easily mockable in ESM, so we test with actual behavior
    // In a real scenario, this would use actual bcrypt hashes
    const history = ["$2a$10$fakehash1", "$2a$10$fakehash2"];
    const result = await isPasswordInHistory("NewPassword123!", history);
    // Will return false since these are not valid hashes for the password
    expect(result).toBe(false);
  });

  it("should return true for password in history", async () => {
    // Test with actual bcrypt hash generation
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash("OldPassword123!", 10);
    const history = [hashedPassword];

    const result = await isPasswordInHistory("OldPassword123!", history);
    expect(result).toBe(true);
  });
});

describe("addPasswordToHistory", () => {
  it("should add password to empty history", async () => {
    const history = await addPasswordToHistory("NewPassword123!", null, 5);
    expect(history).toHaveLength(1);
  });

  it("should add password to existing history", async () => {
    const existingHistory = ["hash1", "hash2"];
    const history = await addPasswordToHistory("NewPassword123!", existingHistory, 5);
    expect(history).toHaveLength(3);
    expect(history[0]).not.toBe("hash1");
  });

  it("should limit history to max count", async () => {
    const existingHistory = ["hash1", "hash2", "hash3", "hash4", "hash5", "hash6"];
    const history = await addPasswordToHistory("NewPassword123!", existingHistory, 5);
    expect(history).toHaveLength(5);
  });

  it("should hash the password", async () => {
    const history = await addPasswordToHistory("NewPassword123!", null, 5);
    expect(history[0]).not.toBe("NewPassword123!");
    expect(history[0].length).toBeGreaterThan(20); // bcrypt hash length
  });
});
