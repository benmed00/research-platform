/**
 * @file utils.test.ts
 * @description Unit tests for utility functions
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 60
 * @size 1.5 KB
 */
import { describe, it, expect } from "vitest";
import { cn, formatDate, formatCurrency } from "./utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", true && "conditional")).toBe("base conditional");
    expect(cn("base", false && "conditional")).toBe("base");
  });

  it("should handle undefined and null", () => {
    expect(cn("base", undefined, null)).toBe("base");
  });

  it("should merge Tailwind classes correctly", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should handle empty strings", () => {
    expect(cn("base", "")).toBe("base");
  });
});

describe("formatDate", () => {
  it("should format Date object correctly", () => {
    const date = new Date("2024-01-15");
    const formatted = formatDate(date);
    expect(formatted).toContain("2024");
    expect(formatted).toContain("janvier");
  });

  it("should format date string correctly", () => {
    const formatted = formatDate("2024-01-15");
    expect(formatted).toContain("2024");
  });

  it("should handle different date formats", () => {
    const date = new Date("2024-12-25");
    const formatted = formatDate(date);
    expect(formatted).toContain("décembre");
  });
});

describe("formatCurrency", () => {
  it("should format number as currency", () => {
    expect(formatCurrency(1234.56)).toContain("1");
    expect(formatCurrency(1234.56)).toContain("234");
    expect(formatCurrency(1234.56)).toContain("€");
  });

  it("should format string as currency", () => {
    expect(formatCurrency("1234.56")).toContain("€");
  });

  it("should handle zero", () => {
    expect(formatCurrency(0)).toContain("0");
    expect(formatCurrency(0)).toContain("€");
  });

  it("should handle negative numbers", () => {
    const formatted = formatCurrency(-100);
    expect(formatted).toContain("-");
  });
});

