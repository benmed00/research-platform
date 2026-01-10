/**
 * @file route.ts
 * @description src/app/api/employees/[id]/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 226
 * @size 6.00 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { employeeSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
        salaries: {
          orderBy: [{ year: "desc" }, { month: "desc" }],
          take: 12, // Last 12 months
        },
        bonuses: {
          orderBy: [{ year: "desc" }, { month: "desc" }],
          take: 12,
        },
        leaves: {
          orderBy: { startDate: "desc" },
          take: 20,
        },
        evaluations: {
          orderBy: [{ year: "desc" }, { createdAt: "desc" }],
          take: 10,
        },
        missionAssignments: {
          include: {
            mission: {
              select: {
                id: true,
                title: true,
                startDate: true,
                endDate: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employé non trouvé" }, { status: 404 });
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const validatedData = employeeSchema.parse(data);

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: params.id },
    });

    if (!existingEmployee) {
      return NextResponse.json({ error: "Employé non trouvé" }, { status: 404 });
    }

    const employee = await prisma.employee.update({
      where: { id: params.id },
      data: {
        userId: validatedData.userId || undefined,
        employeeNumber: validatedData.employeeNumber,
        hireDate: new Date(validatedData.hireDate),
        contractType: validatedData.contractType,
        contractStart: new Date(validatedData.contractStart),
        contractEnd: validatedData.contractEnd
          ? new Date(validatedData.contractEnd)
          : undefined,
        baseSalary: parseFloat(validatedData.baseSalary),
      },
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
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "Employee",
        entityId: employee.id,
        changes: JSON.stringify({
          employeeNumber: validatedData.employeeNumber,
          contractType: validatedData.contractType,
        }),
      },
    });

    return NextResponse.json(employee);
  } catch (error: any) {
    console.error("Error updating employee:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données de validation invalides", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
      include: {
        salaries: true,
        bonuses: true,
        leaves: true,
        evaluations: true,
        missionAssignments: true,
      },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employé non trouvé" }, { status: 404 });
    }

    // Check for dependencies - we'll do a soft delete by setting isActive to false
    // instead of hard delete to preserve historical data
    if (employee.salaries.length > 0 || employee.bonuses.length > 0 || 
        employee.leaves.length > 0 || employee.evaluations.length > 0 ||
        employee.missionAssignments.length > 0) {
      // Soft delete
      await prisma.employee.update({
        where: { id: params.id },
        data: { isActive: false },
      });
    } else {
      // Hard delete if no dependencies
      await prisma.employee.delete({
        where: { id: params.id },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entity: "Employee",
        entityId: params.id,
        changes: JSON.stringify({ deleted: true }),
      },
    });

    return NextResponse.json({ success: true, message: "Employé supprimé avec succès" });
  } catch (error: any) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
