/**
 * @file route.test.ts
 * @description Integration tests for global search API
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 100
 * @size 3.2 KB
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "./route";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    species: {
      findMany: vi.fn(),
    },
    mission: {
      findMany: vi.fn(),
    },
    equipment: {
      findMany: vi.fn(),
    },
    employee: {
      findMany: vi.fn(),
    },
    document: {
      findMany: vi.fn(),
    },
    publication: {
      findMany: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
    },
    expense: {
      findMany: vi.fn(),
    },
    budget: {
      findMany: vi.fn(),
    },
    waterQuality: {
      findMany: vi.fn(),
    },
    airQuality: {
      findMany: vi.fn(),
    },
    climateData: {
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

describe("GET /api/search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty results for query less than 2 characters", async () => {
    const { getServerSession } = await import("next-auth");
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "1", email: "test@example.com" },
    } as any);

    const request = new NextRequest("http://localhost:3000/api/search?q=a");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.total).toBe(0);
    expect(data.results).toBeDefined();
  });

  it("should search across all entities", async () => {
    const { getServerSession } = await import("next-auth");
    const { prisma } = await import("@/lib/prisma");

    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "1", email: "test@example.com" },
    } as any);

    vi.mocked(prisma.species.findMany).mockResolvedValue([
      { id: "1", scientificName: "Test Species" },
    ] as any);
    vi.mocked(prisma.mission.findMany).mockResolvedValue([
      { id: "1", title: "Test Mission" },
    ] as any);
    vi.mocked(prisma.equipment.findMany).mockResolvedValue([]);
    vi.mocked(prisma.employee.findMany).mockResolvedValue([]);
    vi.mocked(prisma.document.findMany).mockResolvedValue([]);
    vi.mocked(prisma.publication.findMany).mockResolvedValue([]);
    vi.mocked(prisma.user.findMany).mockResolvedValue([]);
    vi.mocked(prisma.expense.findMany).mockResolvedValue([]);
    vi.mocked(prisma.budget.findMany).mockResolvedValue([]);
    vi.mocked(prisma.waterQuality.findMany).mockResolvedValue([]);
    vi.mocked(prisma.airQuality.findMany).mockResolvedValue([]);
    vi.mocked(prisma.climateData.findMany).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/search?q=test");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.results.species).toHaveLength(1);
    expect(data.total).toBeGreaterThan(0);
  });

  it("should return 401 for unauthenticated requests", async () => {
    const { getServerSession } = await import("next-auth");
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest("http://localhost:3000/api/search?q=test");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Non autorisé");
  });

  it("should filter by entity types", async () => {
    const { getServerSession } = await import("next-auth");
    const { prisma } = await import("@/lib/prisma");

    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "1", email: "test@example.com" },
    } as any);

    vi.mocked(prisma.species.findMany).mockResolvedValue([]);
    vi.mocked(prisma.mission.findMany).mockResolvedValue([]);
    vi.mocked(prisma.equipment.findMany).mockResolvedValue([]);
    vi.mocked(prisma.employee.findMany).mockResolvedValue([]);
    vi.mocked(prisma.document.findMany).mockResolvedValue([]);
    vi.mocked(prisma.publication.findMany).mockResolvedValue([
      { id: "1", title: "Test Publication" },
    ] as any);
    vi.mocked(prisma.user.findMany).mockResolvedValue([]);
    vi.mocked(prisma.expense.findMany).mockResolvedValue([]);
    vi.mocked(prisma.budget.findMany).mockResolvedValue([]);
    vi.mocked(prisma.waterQuality.findMany).mockResolvedValue([]);
    vi.mocked(prisma.airQuality.findMany).mockResolvedValue([]);
    vi.mocked(prisma.climateData.findMany).mockResolvedValue([]);

    const request = new NextRequest(
      "http://localhost:3000/api/search?q=test&types=publications"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(prisma.publication.findMany).toHaveBeenCalled();
  });
});
