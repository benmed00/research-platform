/**
 * @file route.ts
 * @description src/app/api/expenses/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 106
 * @size 2.70 KB
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
    const {
      budgetId,
      grantId,
      projectId,
      category,
      amount,
      description,
      date,
      invoiceId,
    } = data;

    const expense = await prisma.expense.create({
      data: {
        budgetId: budgetId || undefined,
        grantId: grantId || undefined,
        projectId: projectId || undefined,
        category,
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        invoiceId: invoiceId || undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Expense",
        entityId: expense.id,
        changes: JSON.stringify({ category, amount }),
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    console.error("Error creating expense:", error);
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
    const budgetId = searchParams.get("budgetId");
    const grantId = searchParams.get("grantId");
    const projectId = searchParams.get("projectId");

    const where: any = {};
    if (budgetId) where.budgetId = budgetId;
    if (grantId) where.grantId = grantId;
    if (projectId) where.projectId = projectId;

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        budget: true,
        grant: true,
        project: true,
        invoice: true,
      },
      orderBy: { date: "desc" },
    });

    // Cache for 5 minutes
    return NextResponse.json(expenses, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

