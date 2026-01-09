/**
 * @file route.test.ts
 * @description Integration tests for Excel export API
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 80
 * @size 2.5 KB
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    mission: {
      findMany: vi.fn(),
    },
    species: {
      findMany: vi.fn(),
    },
    expense: {
      findMany: vi.fn(),
    },
    employee: {
      findMany: vi.fn(),
    },
    equipment: {
      findMany: vi.fn(),
    },
    document: {
      findMany: vi.fn(),
    },
    publication: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/rate-limit", () => ({
  withRateLimit: vi.fn((req, config, handler) => handler()),
  rateLimitConfigs: {
    api: { limit: 100, window: 60 },
  },
}));

describe("POST /api/export/excel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export missions to Excel", async () => {
    const { getServerSession } = await import("next-auth");
    const { prisma } = await import("@/lib/prisma");

    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "1", email: "test@example.com" },
    } as any);

    vi.mocked(prisma.mission.findMany).mockResolvedValue([
      {
        id: "1",
        title: "Test Mission",
        description: "Test",
        startDate: new Date(),
        endDate: new Date(),
        status: "completed",
        teams: [],
      },
    ] as any);

    const request = new NextRequest("http://localhost:3000/api/export/excel", {
      method: "POST",
      body: JSON.stringify({ type: "missions" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("spreadsheetml");
  });

  it("should return 401 for unauthenticated requests", async () => {
    const { getServerSession } = await import("next-auth");
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest("http://localhost:3000/api/export/excel", {
      method: "POST",
      body: JSON.stringify({ type: "missions" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Non autorisé");
  });

  it("should handle invalid export type", async () => {
    const { getServerSession } = await import("next-auth");
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "1", email: "test@example.com" },
    } as any);

    const request = new NextRequest("http://localhost:3000/api/export/excel", {
      method: "POST",
      body: JSON.stringify({ type: "invalid" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("non valide");
  });
});
