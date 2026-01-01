/**
 * @file route.ts
 * @description src/app/api/leaves/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 114
 * @size 3.12 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { leaveSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const validatedData = leaveSchema.parse(data);

    const leave = await prisma.leave.create({
      data: {
        employeeId: validatedData.employeeId,
        type: validatedData.type,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        status: validatedData.status,
        reason: validatedData.reason || undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Leave",
        entityId: leave.id,
        changes: JSON.stringify({ employeeId: validatedData.employeeId, type: validatedData.type }),
      },
    });

    return NextResponse.json(leave, { status: 201 });
  } catch (error: any) {
    console.error("Error creating leave:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données de validation invalides", details: error.errors },
        { status: 400 }
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
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (employeeId) {
      where.employeeId = employeeId;
    }
    if (status) {
      where.status = status;
    }

    const [leaves, total] = await Promise.all([
      prisma.leave.findMany({
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
        orderBy: { startDate: "desc" },
      }),
      prisma.leave.count({ where }),
    ]);

    return NextResponse.json({
      data: leaves,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}


