/**
 * @file export-utils.test.ts
 * @description Unit tests for export utilities
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 100
 * @size 2.8 KB
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getExportFilename, downloadBlob, ExportType } from "./export-utils";

// Mock fetch
global.fetch = vi.fn();

describe("getExportFilename", () => {
  it("should generate filename for missions", () => {
    const filename = getExportFilename("missions", "xlsx");
    expect(filename).toContain("missions");
    expect(filename).toContain(".xlsx");
    expect(filename).toMatch(/\d{4}-\d{2}-\d{2}/); // Date format (anywhere in filename)
  });

  it("should generate filename for species", () => {
    const filename = getExportFilename("species", "pdf");
    expect(filename).toContain("especes");
    expect(filename).toContain(".pdf");
  });

  it("should generate filename for all export types", () => {
    const types: ExportType[] = [
      "missions",
      "species",
      "equipment",
      "expenses",
      "employees",
      "budgets",
      "publications",
      "documents",
      "leaves",
      "salaries",
    ];

    types.forEach((type) => {
      const xlsxFilename = getExportFilename(type, "xlsx");
      const pdfFilename = getExportFilename(type, "pdf");
      expect(xlsxFilename).toContain(".xlsx");
      expect(pdfFilename).toContain(".pdf");
    });
  });
});

describe("downloadBlob", () => {
  beforeEach(() => {
    // Mock DOM methods
    global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = vi.fn();
    document.createElement = vi.fn(() => {
      const element = {
        href: "",
        download: "",
        click: vi.fn(),
      } as any;
      return element;
    });
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create download link and trigger download", () => {
    const blob = new Blob(["test content"], { type: "text/plain" });
    downloadBlob(blob, "test.txt");

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("should set correct download attributes", () => {
    const blob = new Blob(["test"], { type: "application/pdf" });
    const mockElement = {
      href: "",
      download: "",
      click: vi.fn(),
    } as any;

    vi.mocked(document.createElement).mockReturnValue(mockElement);

    downloadBlob(blob, "report.pdf");

    expect(mockElement.href).toBe("blob:mock-url");
    expect(mockElement.download).toBe("report.pdf");
    expect(mockElement.click).toHaveBeenCalled();
  });
});

describe("exportToExcel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle successful export", async () => {
    const { exportToExcel } = await import("./export-utils");
    const mockBlob = new Blob(["excel content"], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      blob: vi.fn().mockResolvedValueOnce(mockBlob),
    } as any);

    const result = await exportToExcel("missions");
    expect(result).toBeInstanceOf(Blob);
    expect(global.fetch).toHaveBeenCalledWith("/api/export/excel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "missions", filters: undefined }),
    });
  });

  it("should handle export error", async () => {
    const { exportToExcel } = await import("./export-utils");
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValueOnce({ error: "Export failed" }),
    } as any);

    await expect(exportToExcel("missions")).rejects.toThrow("Export failed");
  });
});

describe("exportToPDF", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle successful export", async () => {
    const { exportToPDF } = await import("./export-utils");
    const mockBlob = new Blob(["pdf content"], { type: "application/pdf" });

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      blob: vi.fn().mockResolvedValueOnce(mockBlob),
    } as any);

    const result = await exportToPDF("missions", { status: "completed" });
    expect(result).toBeInstanceOf(Blob);
    expect(global.fetch).toHaveBeenCalledWith("/api/export/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "missions",
        filters: { status: "completed" },
        entityId: undefined,
      }),
    });
  });

  it("should handle export error", async () => {
    const { exportToPDF } = await import("./export-utils");
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValueOnce({ error: "PDF generation failed" }),
    } as any);

    await expect(exportToPDF("missions")).rejects.toThrow("PDF generation failed");
  });
});
