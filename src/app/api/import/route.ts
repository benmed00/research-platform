/**
 * @file route.ts
 * @description src/app/api/import/route.ts
 * @author github-actions[bot]
 * @created 2026-01-04
 * @updated 2026-01-04
 * @updates 1
 * @lines 328
 * @size 10.19 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";
import Papa from "papaparse";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    const buffer = Buffer.from(await file.arrayBuffer());

    let data: any[] = [];

    // Parse file based on extension
    if (fileExtension === ".csv") {
      const text = buffer.toString("utf-8");
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
      });
      data = result.data as any[];
    } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(worksheet);
    } else if (fileExtension === ".json" || fileExtension === ".geojson") {
      const text = buffer.toString("utf-8");
      const jsonData = JSON.parse(text);

      // Handle GeoJSON FeatureCollection
      if (jsonData.type === "FeatureCollection" && jsonData.features) {
        data = jsonData.features.map((feature: any) => ({
          ...feature.properties,
          longitude: feature.geometry?.coordinates?.[0],
          latitude: feature.geometry?.coordinates?.[1],
        }));
      } else if (Array.isArray(jsonData)) {
        data = jsonData;
      } else {
        data = [jsonData];
      }
    } else {
      return NextResponse.json(
        { error: "Format de fichier non supporté" },
        { status: 400 }
      );
    }

    if (data.length === 0) {
      return NextResponse.json(
        { error: "Aucune donnée trouvée dans le fichier" },
        { status: 400 }
      );
    }

    // Import based on type
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    let result: { imported: number; skipped: number };
    try {
      switch (type) {
        case "species":
          result = await importSpecies(data, errors);
          imported = result.imported;
          skipped = result.skipped;
          break;
        case "missions":
          result = await importMissions(data, errors, session.user.id);
          imported = result.imported;
          skipped = result.skipped;
          break;
        case "equipment":
          result = await importEquipment(data, errors);
          imported = result.imported;
          skipped = result.skipped;
          break;
        case "locations":
          result = await importLocations(data, errors);
          imported = result.imported;
          skipped = result.skipped;
          break;
        default:
          return NextResponse.json(
            { error: "Type d'import non supporté" },
            { status: 400 }
          );
      }
    } catch (importError: any) {
      return NextResponse.json(
        {
          error: "Erreur lors de l'import",
          details: {
            imported,
            skipped,
            errors: [importError.message, ...errors],
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Import terminé",
      details: {
        imported,
        skipped,
        errors: errors.slice(0, 10), // Limit errors to first 10
      },
    });
  } catch (error: any) {
    console.error("Error importing data:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'import" },
      { status: 500 }
    );
  }
}

async function importSpecies(
  data: any[],
  errors: string[]
): Promise<{ imported: number; skipped: number }> {
  let importCount = 0;
  let skipCount = 0;
  for (const row of data) {
    try {
      // Map column names (case-insensitive)
      const scientificName = row.scientificName || row["nom scientifique"] || row["Nom scientifique"];
      const type = row.type || row["type"] || row["Type"];
      
      if (!scientificName || !type) {
        skipCount++;
        errors.push(`Ligne ${data.indexOf(row) + 1}: Nom scientifique et type requis`);
        continue;
      }

      // Check if species already exists
      const existing = await prisma.species.findFirst({
        where: {
          scientificName: { equals: scientificName, mode: "insensitive" },
        },
      });

      if (existing) {
        skipCount++;
        continue;
      }

      await prisma.species.create({
        data: {
          scientificName: scientificName.trim(),
          commonName: row.commonName || row["nom commun"] || row["Nom commun"] || null,
          type: type.trim().toUpperCase().replace(/\s+/g, "_"),
          iucnStatus: row.iucnStatus || row["statut iucn"] || row["Statut IUCN"] || null,
          habitat: row.habitat || row["habitat"] || null,
          description: row.description || row["description"] || null,
        },
      });

      importCount++;
    } catch (err: any) {
      skipCount++;
      errors.push(`Ligne ${data.indexOf(row) + 1}: ${err.message}`);
    }
  }
  return { imported: importCount, skipped: skipCount };
}

async function importMissions(
  data: any[],
  errors: string[],
  userId: string
): Promise<{ imported: number; skipped: number }> {
  let importCount = 0;
  let skipCount = 0;
  for (const row of data) {
    try {
      const title = row.title || row["titre"] || row["Titre"];
      const startDate = row.startDate || row["date début"] || row["Date début"] || row["date_debut"];
      
      if (!title || !startDate) {
        skipCount++;
        errors.push(`Ligne ${data.indexOf(row) + 1}: Titre et date de début requis`);
        continue;
      }

      const endDateValue = row.endDate || row["date fin"] || row["Date fin"] || row["date_fin"];
      const startDateObj = new Date(startDate);
      
      await prisma.mission.create({
        data: {
          title: title.trim(),
          description: row.description || row["description"] || null,
          location: row.location || row["localisation"] || row["Location"] || null,
          startDate: startDateObj,
          endDate: endDateValue ? new Date(endDateValue) : startDateObj,
          status: (row.status || row["statut"] || row["Statut"] || "planned")
            .toLowerCase()
            .replace(/\s+/g, "_"),
          creatorId: userId,
        },
      });

      importCount++;
    } catch (err: any) {
      skipCount++;
      errors.push(`Ligne ${data.indexOf(row) + 1}: ${err.message}`);
    }
  }
  return { imported: importCount, skipped: skipCount };
}

async function importEquipment(
  data: any[],
  errors: string[]
): Promise<{ imported: number; skipped: number }> {
  let importCount = 0;
  let skipCount = 0;
  for (const row of data) {
    try {
      const name = row.name || row["nom"] || row["Nom"];
      const category = row.category || row["catégorie"] || row["Catégorie"];
      
      if (!name || !category) {
        skipCount++;
        errors.push(`Ligne ${data.indexOf(row) + 1}: Nom et catégorie requis`);
        continue;
      }

      await prisma.equipment.create({
        data: {
          name: name.trim(),
          category: category.trim().toUpperCase().replace(/\s+/g, "_"),
          serialNumber: row.serialNumber || row["numéro série"] || row["Numéro de série"] || null,
          status: (row.status || row["statut"] || row["Statut"] || "AVAILABLE")
            .toUpperCase()
            .replace(/\s+/g, "_"),
          location: row.location || row["localisation"] || row["Location"] || null,
          purchasePrice: row.purchasePrice || row["prix achat"] || row["Prix d'achat"]
            ? parseFloat(row.purchasePrice || row["prix achat"] || row["Prix d'achat"])
            : null,
          purchaseDate: row.purchaseDate || row["date achat"] || row["Date d'achat"]
            ? new Date(row.purchaseDate || row["date achat"] || row["Date d'achat"])
            : null,
        },
      });

      importCount++;
    } catch (err: any) {
      skipCount++;
      errors.push(`Ligne ${data.indexOf(row) + 1}: ${err.message}`);
    }
  }
  return { imported: importCount, skipped: skipCount };
}

async function importLocations(
  data: any[],
  errors: string[]
): Promise<{ imported: number; skipped: number }> {
  let importCount = 0;
  let skipCount = 0;
  for (const row of data) {
    try {
      const latitude = row.latitude || row["latitude"] || row["Latitude"];
      const longitude = row.longitude || row["longitude"] || row["Longitude"];
      const speciesId = row.speciesId || row["species_id"] || row["Species ID"] || row["id espèce"];
      
      if (!latitude || !longitude || !speciesId) {
        skipCount++;
        errors.push(`Ligne ${data.indexOf(row) + 1}: Latitude, longitude et ID espèce requis`);
        continue;
      }

      // Check if species exists
      const species = await prisma.species.findUnique({
        where: { id: speciesId },
      });

      if (!species) {
        skipCount++;
        errors.push(`Ligne ${data.indexOf(row) + 1}: Espèce non trouvée (ID: ${speciesId})`);
        continue;
      }

      await prisma.speciesLocation.create({
        data: {
          speciesId: speciesId,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          observedAt: row.observedAt || row["date observation"] || row["Date observation"]
            ? new Date(row.observedAt || row["date observation"] || row["Date observation"])
            : new Date(),
        },
      });

      importCount++;
    } catch (err: any) {
      skipCount++;
      errors.push(`Ligne ${data.indexOf(row) + 1}: ${err.message}`);
    }
  }
  return { imported: importCount, skipped: skipCount };
}

