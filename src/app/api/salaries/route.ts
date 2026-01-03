/**
 * @file route.ts
 * @description src/app/api/salaries/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 133
 * @size 3.63 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { salarySchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const validatedData = salarySchema.parse(data);

    const salary = await prisma.salary.create({
      data: {
        employeeId: validatedData.employeeId,
        amount: parseFloat(validatedData.amount),
        month: parseInt(validatedData.month),
        year: parseInt(validatedData.year),
        paidAt: validatedData.paidAt ? new Date(validatedData.paidAt) : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Salary",
        entityId: salary.id,
        changes: JSON.stringify({ employeeId: validatedData.employeeId, month: validatedData.month, year: validatedData.year }),
      },
    });

    return NextResponse.json(salary, { status: 201 });
  } catch (error: any) {
    console.error("Error creating salary:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données de validation invalides", details: error.errors },
        { status: 400 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Un salaire existe déjà pour cet employé, ce mois et cette année" },
        { status: 409 }
      );
    }
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
    const employeeId = searchParams.get("employeeId");
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (employeeId) {
      where.employeeId = employeeId;
    }
    if (year) {
      where.year = parseInt(year);
    }
    if (month) {
      where.month = parseInt(month);
    }

    const [salaries, total] = await Promise.all([
      prisma.salary.findMany({
        where,
        take: limit,
        skip: offset,
        include: {
          employee: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.salary.count({ where }),
    ]);

    // Cache for 5 minutes
    return NextResponse.json(
      {
        data: salaries,
        total,
        limit,
        offset,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error("Error fetching salaries:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}


