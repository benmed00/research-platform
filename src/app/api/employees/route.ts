/**
 * @file route.ts
 * @description src/app/api/employees/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 97
 * @size 2.44 KB
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
      userId,
      employeeNumber,
      hireDate,
      contractType,
      contractStart,
      contractEnd,
      baseSalary,
    } = data;

    const employee = await prisma.employee.create({
      data: {
        userId: userId || undefined,
        employeeNumber,
        hireDate: new Date(hireDate),
        contractType,
        contractStart: new Date(contractStart),
        contractEnd: contractEnd ? new Date(contractEnd) : undefined,
        baseSalary: parseFloat(baseSalary),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Employee",
        entityId: employee.id,
        changes: JSON.stringify({ employeeNumber, contractType }),
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    console.error("Error creating employee:", error);
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

    const employees = await prisma.employee.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

