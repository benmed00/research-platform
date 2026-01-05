/**
 * @file route.ts
 * @description src/app/api/export/pdf/route.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 268
 * @size 7.98 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import jsPDF from "jspdf";

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
        data = missions;
        title = "Rapport des Missions";
        break;

      case "species":
        const species = await prisma.species.findMany({
          where: filters || {},
        });
        data = species;
        title = "Rapport des Espèces";
        break;

      case "expenses":
        const expenses = await prisma.expense.findMany({
          where: filters || {},
          include: {
            budget: true,
          },
        });
        data = expenses;
        title = "Rapport des Dépenses";
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
        data = employees;
        title = "Rapport des Employés";
        break;

      case "equipment":
        const equipment = await prisma.equipment.findMany({
          where: filters || {},
        });
        data = equipment;
        title = "Rapport des Équipements";
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
        data = documents;
        title = "Rapport des Documents";
        break;

      case "publications":
        const publications = await prisma.publication.findMany({
          where: filters || {},
        });
        data = publications;
        title = "Rapport des Publications";
        break;

      default:
        return NextResponse.json({ error: "Type d'export non valide" }, { status: 400 });
    }

    // Generate PDF with better formatting
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, 20);
    
    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Généré le: ${new Date().toLocaleDateString("fr-FR")}`, 14, 30);
    
    let y = 40;
    doc.setFontSize(12);

    if (data.length === 0) {
      doc.text("Aucune donnée disponible", 14, y);
    } else {
      data.forEach((item: any, index: number) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }

        // Item header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        const itemTitle = type === "missions" ? item.title :
                         type === "species" ? item.scientificName :
                         type === "expenses" ? item.description :
                         type === "employees" ? `${item.user?.firstName || ""} ${item.user?.lastName || ""}` :
                         type === "equipment" ? item.name :
                         type === "documents" ? item.title :
                         type === "publications" ? item.title :
                         `Item ${index + 1}`;
        
        doc.text(itemTitle, 14, y);
        y += 7;

        // Item details
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        if (type === "missions") {
          doc.text(`Description: ${item.description || "N/A"}`, 14, y);
          y += 5;
          doc.text(`Dates: ${item.startDate ? new Date(item.startDate).toLocaleDateString("fr-FR") : ""} - ${item.endDate ? new Date(item.endDate).toLocaleDateString("fr-FR") : ""}`, 14, y);
          y += 5;
          doc.text(`Statut: ${item.status}`, 14, y);
          y += 5;
          if (item.teams && item.teams.length > 0) {
            const teamNames = item.teams.map((t: any) => `${t.user.firstName} ${t.user.lastName}`).join(", ");
            doc.text(`Équipe: ${teamNames}`, 14, y);
            y += 5;
          }
        } else if (type === "species") {
          doc.text(`Nom scientifique: ${item.scientificName}`, 14, y);
          y += 5;
          if (item.commonName) {
            doc.text(`Nom commun: ${item.commonName}`, 14, y);
            y += 5;
          }
          doc.text(`Type: ${item.type}`, 14, y);
          y += 5;
          if (item.iucnStatus) {
            doc.text(`Statut UICN: ${item.iucnStatus}`, 14, y);
            y += 5;
          }
        } else if (type === "expenses") {
          doc.text(`Description: ${item.description}`, 14, y);
          y += 5;
          doc.text(`Montant: ${Number(item.amount).toFixed(2)} MAD`, 14, y);
          y += 5;
          doc.text(`Catégorie: ${item.category}`, 14, y);
          y += 5;
          doc.text(`Date: ${new Date(item.date).toLocaleDateString("fr-FR")}`, 14, y);
          y += 5;
        } else if (type === "employees") {
          doc.text(`Numéro: ${item.employeeNumber}`, 14, y);
          y += 5;
          if (item.user) {
            doc.text(`Nom: ${item.user.firstName} ${item.user.lastName}`, 14, y);
            y += 5;
            doc.text(`Email: ${item.user.email}`, 14, y);
            y += 5;
            doc.text(`Rôle: ${item.user.role}`, 14, y);
            y += 5;
          }
          doc.text(`Contrat: ${item.contractType}`, 14, y);
          y += 5;
        } else if (type === "equipment") {
          doc.text(`Nom: ${item.name}`, 14, y);
          y += 5;
          doc.text(`Catégorie: ${item.category}`, 14, y);
          y += 5;
          doc.text(`Statut: ${item.status}`, 14, y);
          y += 5;
          if (item.serialNumber) {
            doc.text(`S/N: ${item.serialNumber}`, 14, y);
            y += 5;
          }
        } else if (type === "documents") {
          doc.text(`Titre: ${item.title}`, 14, y);
          y += 5;
          doc.text(`Type: ${item.type}`, 14, y);
          y += 5;
          if (item.author) {
            doc.text(`Auteur: ${item.author.firstName} ${item.author.lastName}`, 14, y);
            y += 5;
          }
          doc.text(`Fichier: ${item.fileName}`, 14, y);
          y += 5;
        } else if (type === "publications") {
          doc.text(`Titre: ${item.title}`, 14, y);
          y += 5;
          doc.text(`Année: ${item.year}`, 14, y);
          y += 5;
          doc.text(`Type: ${item.type}`, 14, y);
          y += 5;
          doc.text(`Statut: ${item.isPublished ? "Publié" : "Brouillon"}`, 14, y);
          y += 5;
        }

        y += 5; // Space between items
      });
    }

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${title.replace(/\s/g, "_")}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la génération du PDF" },
      { status: 500 }
    );
  }
}

