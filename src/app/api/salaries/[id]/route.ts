/**
 * @file route.ts
 * @description src/app/api/salaries/[id]/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 137
 * @size 3.60 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { salarySchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const salary = await prisma.salary.findUnique({
      where: { id },
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
    });

    if (!salary) {
      return NextResponse.json(
        { error: "Salaire non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(salary);
  } catch (error) {
    console.error("Error fetching salary:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    const validatedData = salarySchema.partial().parse(data);

    const salary = await prisma.salary.update({
      where: { id },
      data: {
        amount: validatedData.amount ? parseFloat(validatedData.amount) : undefined,
        month: validatedData.month ? parseInt(validatedData.month) : undefined,
        year: validatedData.year ? parseInt(validatedData.year) : undefined,
        paidAt: validatedData.paidAt ? new Date(validatedData.paidAt) : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "Salary",
        entityId: salary.id,
        changes: JSON.stringify(validatedData),
      },
    });

    return NextResponse.json(salary);
  } catch (error: any) {
    console.error("Error updating salary:", error);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.salary.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entity: "Salary",
        entityId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting salary:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}


