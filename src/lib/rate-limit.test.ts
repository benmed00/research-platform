/**
 * @file rate-limit.test.ts
 * @description Unit tests for rate limiting utility
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 80
 * @size 2.1 KB
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { rateLimit, rateLimitConfigs, rateLimitResponse } from "./rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    // Reset rate limit store by creating a new instance
    vi.clearAllMocks();
  });

  it("should allow requests within limit", async () => {
    const request = new NextRequest("http://localhost:3000/api/test", {
      headers: { "x-forwarded-for": "127.0.0.1" },
    });

    const result = await rateLimit(request, { limit: 5, window: 60 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.limit).toBe(5);
  });

  it("should block requests exceeding limit", async () => {
    const request = new NextRequest("http://localhost:3000/api/test", {
      headers: { "x-forwarded-for": "127.0.0.1" },
    });

    const config = { limit: 2, window: 60 };

    // Make requests up to limit
    await rateLimit(request, config);
    await rateLimit(request, config);

    // This should exceed the limit
    const result = await rateLimit(request, config);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfter).toBeDefined();
  });

  it("should use custom identifier when provided", async () => {
    const request = new NextRequest("http://localhost:3000/api/test");
    const result = await rateLimit(request, {
      limit: 5,
      window: 60,
      identifier: "custom-id",
    });

    expect(result.success).toBe(true);
  });

  it("should reset after time window", async () => {
    const request = new NextRequest("http://localhost:3000/api/test", {
      headers: { "x-forwarded-for": "127.0.0.1" },
    });

    const config = { limit: 1, window: 1 }; // 1 second window

    // First request should succeed
    const result1 = await rateLimit(request, config);
    expect(result1.success).toBe(true);

    // Second request should fail
    const result2 = await rateLimit(request, config);
    expect(result2.success).toBe(false);

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // Should succeed again
    const result3 = await rateLimit(request, config);
    expect(result3.success).toBe(true);
  });
});

describe("rateLimitConfigs", () => {
  it("should have correct login configuration", () => {
    expect(rateLimitConfigs.login.limit).toBe(5);
    expect(rateLimitConfigs.login.window).toBe(15 * 60);
  });

  it("should have correct API configuration", () => {
    expect(rateLimitConfigs.api.limit).toBe(100);
    expect(rateLimitConfigs.api.window).toBe(60);
  });

  it("should have correct upload configuration", () => {
    expect(rateLimitConfigs.upload.limit).toBe(10);
    expect(rateLimitConfigs.upload.window).toBe(60 * 60);
  });
});

describe("rateLimitResponse", () => {
  it("should create 429 response with headers", () => {
    const result = {
      success: false,
      limit: 5,
      remaining: 0,
      reset: Math.floor(Date.now() / 1000) + 60,
      retryAfter: 60,
    };

    const response = rateLimitResponse(result);
    expect(response.status).toBe(429);
    expect(response.headers.get("X-RateLimit-Limit")).toBe("5");
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(response.headers.get("Retry-After")).toBe("60");
  });
});

