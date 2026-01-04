/**
 * @file route.ts
 * @description src/app/api/export/excel/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 198
 * @size 5.96 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { type, entityId, filters } = await request.json();

    let data: any[] = [];
    let title = "";

    switch (type) {
      case "missions":
        const missions = await prisma.mission.findMany({
          where: filters || {},
          include: {
            teams: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        });
        data = missions.map((m) => ({
          Titre: m.title,
          Description: m.description || "",
          "Date début": m.startDate.toISOString().split("T")[0],
          "Date fin": m.endDate ? m.endDate.toISOString().split("T")[0] : "",
          Statut: m.status,
          Équipe: m.teams.map((t: any) => `${t.user.firstName} ${t.user.lastName}`).join(", "),
        }));
        title = "Missions";
        break;

      case "species":
        const species = await prisma.species.findMany({
          where: filters || {},
        });
        data = species.map((s) => ({
          "Nom scientifique": s.scientificName,
          "Nom commun": s.commonName || "",
          Type: s.type,
          "Statut UICN": s.iucnStatus || "",
          Habitat: s.habitat || "",
        }));
        title = "Espèces";
        break;

      case "expenses":
        const expenses = await prisma.expense.findMany({
          where: filters || {},
          include: {
            budget: true,
          },
        });
        data = expenses.map((e) => ({
          Description: e.description,
          Montant: Number(e.amount),
          Catégorie: e.category,
          Date: e.date.toISOString().split("T")[0],
          Budget: e.budget?.year || "",
        }));
        title = "Dépenses";
        break;

      case "employees":
        const employees = await prisma.employee.findMany({
          where: filters || {},
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
        data = employees.map((e) => ({
          "Numéro employé": e.employeeNumber,
          "Prénom": e.user?.firstName || "",
          "Nom": e.user?.lastName || "",
          "Email": e.user?.email || "",
          "Rôle": e.user?.role || "",
          "Type contrat": e.contractType,
          "Date embauche": e.hireDate.toISOString().split("T")[0],
          "Salaire de base": Number(e.baseSalary),
          "Statut": e.isActive ? "Actif" : "Inactif",
        }));
        title = "Employés";
        break;

      case "equipment":
        const equipment = await prisma.equipment.findMany({
          where: filters || {},
        });
        data = equipment.map((e) => ({
          Nom: e.name,
          Catégorie: e.category,
          "Numéro de série": e.serialNumber || "",
          Statut: e.status,
          Localisation: e.location || "",
          "Date d'achat": e.purchaseDate ? e.purchaseDate.toISOString().split("T")[0] : "",
          "Prix d'achat": e.purchasePrice ? Number(e.purchasePrice) : "",
          "Durée de vie": e.lifespan || "",
        }));
        title = "Équipements";
        break;

      case "documents":
        const documents = await prisma.document.findMany({
          where: filters || {},
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        });
        data = documents.map((d) => ({
          Titre: d.title,
          Type: d.type,
          Auteur: `${d.author.firstName} ${d.author.lastName}`,
          "Nom fichier": d.fileName,
          "Taille (KB)": d.fileSize ? (d.fileSize / 1024).toFixed(2) : "",
          "Date création": d.createdAt.toISOString().split("T")[0],
          Public: d.isPublic ? "Oui" : "Non",
        }));
        title = "Documents";
        break;

      case "publications":
        const publications = await prisma.publication.findMany({
          where: filters || {},
        });
        data = publications.map((p) => ({
          Titre: p.title,
          Année: p.year,
          Type: p.type,
          "Date publication": p.publishedAt ? p.publishedAt.toISOString().split("T")[0] : "",
          Publié: p.isPublished ? "Oui" : "Non",
          "Date création": p.createdAt.toISOString().split("T")[0],
        }));
        title = "Publications";
        break;

      default:
        return NextResponse.json({ error: "Type d'export non valide" }, { status: 400 });
    }

    // Generate Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${title}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating Excel:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la génération du fichier Excel" },
      { status: 500 }
    );
  }
}

