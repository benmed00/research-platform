/**
 * @file route.ts
 * @description src/app/api/employees/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 102
 * @size 2.49 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { employeeSchema } from "@/lib/validations";
import { validateRequest } from "@/lib/validation-helpers";
import { loggerHelpers } from "@/lib/logger";
import { parsePagination, createPaginatedResponse } from "@/lib/pagination";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate request data
    const validation = validateRequest(employeeSchema, data, "/api/employees");
    if (!validation.success) {
      return validation.response;
    }
    
    const {
      userId,
      employeeNumber,
      hireDate,
      contractType,
      contractStart,
      contractEnd,
      baseSalary,
    } = validation.data;

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
    const session = await getServerSession(authOptions);
    loggerHelpers.apiError(error as Error, {
      route: "/api/employees",
      method: "POST",
      userId: session?.user?.id,
    });
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

    const { page, limit, skip, take } = parsePagination(request);

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
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
        take,
        skip,
      }),
      prisma.employee.count(),
    ]);

    // Cache for 5 minutes
    return NextResponse.json(
      createPaginatedResponse(employees, total, page, limit),
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    loggerHelpers.apiError(error as Error, {
      route: "/api/employees",
      method: "GET",
    });
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

