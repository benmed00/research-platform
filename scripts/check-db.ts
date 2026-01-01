/**
 * @file check-db.ts
 * @description scripts/check-db.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 108
 * @size 3.25 KB
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("🔍 Vérification de la base de données...\n");

    // Vérifier la connexion
    await prisma.$connect();
    console.log("✅ Connexion à la base de données réussie\n");

    // Vérifier les tables principales
    // Mapping: Nom du modèle → Nom dans Prisma Client (camelCase)
    const tables: Array<[string, string]> = [
      ["User", "user"],
      ["Mission", "mission"],
      ["Species", "species"],
      ["Equipment", "equipment"],
      ["Budget", "budget"],
      ["Expense", "expense"],
      ["Grant", "grant"],
      ["Invoice", "invoice"],
      ["WaterQuality", "waterQuality"],
      ["AirQuality", "airQuality"],
      ["ClimateData", "climateData"],
      ["SensorData", "sensorData"],
      ["MapLayer", "mapLayer"],
      ["Document", "document"],
      ["Publication", "publication"],
      ["Employee", "employee"],
      ["SpeciesObservation", "speciesObservation"],
      ["SpeciesLocation", "speciesLocation"],
      ["SpeciesPhoto", "speciesPhoto"],
    ];

    console.log("📊 Vérification des tables :\n");

    for (const [modelName, clientName] of tables) {
      try {
        const model = (prisma as any)[clientName];
        if (model) {
          const count = await model.count();
          console.log(`  ✅ ${modelName}: ${count} enregistrements`);
        } else {
          console.log(`  ⚠️  ${modelName}: modèle non trouvé dans Prisma Client`);
        }
      } catch (error: any) {
        if (error.code === "P2021" || error.message?.includes("does not exist")) {
          console.log(`  ❌ ${modelName}: Table n'existe pas dans la base de données`);
        } else {
          console.log(`  ⚠️  ${modelName}: Erreur - ${error.message}`);
        }
      }
    }

    // Vérifier les relations
    console.log("\n🔗 Vérification des relations :\n");

    try {
      const users = await prisma.user.count();
      const employees = await prisma.employee.count();
      const missions = await prisma.mission.count();
      const species = await prisma.species.count();

      console.log(`  Utilisateurs: ${users}`);
      console.log(`  Employés: ${employees}`);
      console.log(`  Missions: ${missions}`);
      console.log(`  Espèces: ${species}`);
    } catch (error: any) {
      console.log(`  ❌ Erreur lors de la vérification des relations: ${error.message}`);
    }

    console.log("\n✅ Vérification terminée\n");

    // Recommandations
    console.log("💡 Recommandations :\n");

    const userCount = await prisma.user.count().catch(() => 0);
    if (userCount === 0) {
      console.log("  → Aucun utilisateur trouvé. Exécutez: npm run db:seed");
    }

    const missionCount = await prisma.mission.count().catch(() => 0);
    if (missionCount === 0) {
      console.log("  → Aucune mission trouvée. Exécutez: npm run db:seed");
    }

    // Vérifier les données environnementales
    try {
      const waterQualityCount = await prisma.waterQuality.count();
      const airQualityCount = await prisma.airQuality.count();
      const climateDataCount = await prisma.climateData.count();
      const sensorDataCount = await prisma.sensorData.count();
      
      if (waterQualityCount === 0) {
        console.log("  → Aucune donnée de qualité d'eau. Exécutez: npm run db:seed");
      }
      if (airQualityCount === 0) {
        console.log("  → Aucune donnée de qualité d'air. Exécutez: npm run db:seed");
      }
      if (climateDataCount === 0) {
        console.log("  → Aucune donnée climatique. Exécutez: npm run db:seed");
      }
      if (sensorDataCount === 0) {
        console.log("  → Aucune donnée de capteur. Exécutez: npm run db:seed");
      }
    } catch (error: any) {
      console.log(`  ⚠️  Impossible de vérifier les données environnementales: ${error.message}`);
      console.log("  → Si le Prisma Client semble désynchronisé, exécutez: npm run db:fix-client");
    }

  } catch (error: any) {
    console.error("\n❌ Erreur lors de la vérification:\n");
    console.error(error.message);

    if (error.code === "P1001") {
      console.error("\n💡 PostgreSQL n'est pas accessible. Vérifiez:");
      console.error("  - Que PostgreSQL est démarré");
      console.error("  - Que la DATABASE_URL dans .env est correcte");
    } else if (error.code === "P2021") {
      console.error("\n💡 Les tables n'existent pas. Exécutez:");
      console.error("  npm run db:push");
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

