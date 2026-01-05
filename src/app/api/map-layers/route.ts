/**
 * @file route.ts
 * @description src/app/api/map-layers/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 30
 * @size 0.61 KB
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const layers = await prisma.mapLayer.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(layers);
  } catch (error) {
    console.error("Error fetching map layers:", error);
    return NextResponse.json(
      { error: "Failed to fetch map layers" },
      { status: 500 }
    );
  }
}

