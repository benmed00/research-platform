/**
 * @file route.ts
 * @description src/app/api/budgets/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 101
 * @size 2.61 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const { year, totalAmount, description, allocations } = data;

    const budget = await prisma.budget.create({
      data: {
        year: parseInt(year),
        totalAmount: parseFloat(totalAmount),
        description: description || undefined,
        allocations: allocations
          ? {
              create: allocations.map((allocation: any) => ({
                category: allocation.category,
                amount: parseFloat(allocation.amount),
                description: allocation.description || undefined,
              })),
            }
          : undefined,
      },
      include: {
        allocations: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Budget",
        entityId: budget.id,
        changes: JSON.stringify({ year, totalAmount }),
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error: any) {
    console.error("Error creating budget:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");

    const where = year ? { year: parseInt(year) } : {};

    const budgets = await prisma.budget.findMany({
      where,
      include: {
        allocations: true,
      },
      orderBy: { year: "desc" },
    });

    // Cache for 5 minutes
    return NextResponse.json(budgets, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

