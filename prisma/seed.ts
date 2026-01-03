/**
 * @file seed.ts
 * @description prisma/seed.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 970
 * @size 35.10 KB
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  generateUsers,
  generateSpecies,
  generateMissions,
  generateEquipment,
  generateClimateData,
  generateLoginLogs,
  generateExpenses,
  generateGrants,
  generateSuppliers,
  generateInvoices,
  generatePayments,
  generateSensorData,
  generateMapLayers,
  generateDocuments,
  generatePublications,
  generateLeaves,
  generateBonuses,
  generateEvaluations,
  generateGeologyData,
  generateSpeciesReferences,
  generateUserPermissions,
  getRandomRifLocation,
  RIF_LOCATIONS,
  type RifLocation,
  randomDate,
  randomFloat,
  addDays,
  addMonths,
  randomChoice,
  randomRange,
  weightedChoice,
  realisticTimestamp,
} from "../src/lib/data-generators";

type ContractType = "CDI" | "CDD" | "Stage" | "Consultant";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting comprehensive database seeding...");
  console.log("This will generate production-grade sample data with realistic patterns.\n");

  // Clear existing data (optional - comment out if you want to keep existing data)
  // Note: This will fail silently if tables don't exist (e.g., after db:reset)
  console.log("🧹 Cleaning existing data...");
  
  // Helper function to safely delete (ignore errors if tables don't exist)
  const safeDelete = async (deleteFn: () => Promise<any>) => {
    try {
      await deleteFn();
    } catch (error: any) {
      // Ignore P2021 (table does not exist) errors
      if (error.code !== 'P2021') {
        throw error;
      }
    }
  };

  await safeDelete(() => prisma.auditLog.deleteMany());
  await safeDelete(() => prisma.loginLog.deleteMany());
  await safeDelete(() => prisma.speciesObservation.deleteMany());
  await safeDelete(() => prisma.speciesLocation.deleteMany());
  await safeDelete(() => prisma.speciesPhoto.deleteMany());
  await safeDelete(() => prisma.speciesReference.deleteMany());
  await safeDelete(() => prisma.missionReport.deleteMany());
  await safeDelete(() => prisma.missionEquipment.deleteMany());
  await safeDelete(() => prisma.missionTeam.deleteMany());
  await safeDelete(() => prisma.document.deleteMany());
  await safeDelete(() => prisma.expense.deleteMany());
  await safeDelete(() => prisma.payment.deleteMany());
  await safeDelete(() => prisma.invoice.deleteMany());
  await safeDelete(() => prisma.supplier.deleteMany());
  await safeDelete(() => prisma.maintenance.deleteMany());
  await safeDelete(() => prisma.salary.deleteMany());
  await safeDelete(() => prisma.bonus.deleteMany());
  await safeDelete(() => prisma.leave.deleteMany());
  await safeDelete(() => prisma.evaluation.deleteMany());
  await safeDelete(() => prisma.species.deleteMany());
  await safeDelete(() => prisma.mission.deleteMany());
  await safeDelete(() => prisma.equipment.deleteMany());
  await safeDelete(() => prisma.employee.deleteMany());
  await safeDelete(() => prisma.user.deleteMany());
  await safeDelete(() => prisma.budgetAllocation.deleteMany());
  await safeDelete(() => prisma.budget.deleteMany());
  await safeDelete(() => prisma.grant.deleteMany());
  await safeDelete(() => prisma.project.deleteMany());
  await safeDelete(() => prisma.publicationChapter.deleteMany());
  await safeDelete(() => prisma.publication.deleteMany());
  await safeDelete(() => prisma.mapLayer.deleteMany());
  await safeDelete(() => prisma.climateData.deleteMany());
  await safeDelete(() => prisma.airQuality.deleteMany());
  await safeDelete(() => prisma.waterQuality.deleteMany());
  await safeDelete(() => prisma.geologyData.deleteMany());
  await safeDelete(() => prisma.sensorData.deleteMany());

  // ============================================
  // 1. USERS (45 users)
  // ============================================
  console.log("\n👥 Generating users...");
  const startDate = addMonths(new Date(), -24); // 2 years ago
  const userData = generateUsers(45, startDate);
  
  const hashedPassword = await bcrypt.hash("password123", 10);
  const users = await Promise.all(
    userData.map((user) =>
      prisma.user.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      })
    )
  );
  console.log(`✅ Created ${users.length} users`);

  // ============================================
  // 2. EMPLOYEES (linked to users)
  // ============================================
  console.log("\n💼 Generating employees...");
  const employeeNumbers = new Set<string>();
  const employees = await Promise.all(
    users.slice(0, 35).map(async (user, index) => {
      let empNum = `EMP${String(index + 1).padStart(4, "0")}`;
      while (employeeNumbers.has(empNum)) {
        empNum = `EMP${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;
      }
      employeeNumbers.add(empNum);

      const contractTypes = ["CDI", "CDD", "Stage", "Consultant"] as const;
      const contractWeights = [60, 25, 10, 5];
      const contractType = weightedChoice(contractTypes, contractWeights) as ContractType;

      const hireDate = randomDate(user.createdAt, new Date());
      const contractStart = hireDate;
      const contractEnd =
        contractType === "CDD" || contractType === "Stage"
          ? addMonths(contractStart, contractType === "Stage" ? 6 : 24)
          : null;

      // Salary range: 8000-25000 MAD (realistic for Morocco)
      const baseSalary = randomRange(8000, 25000);

      return prisma.employee.create({
        data: {
          userId: user.id,
          employeeNumber: empNum,
          hireDate,
          contractType,
          contractStart,
          contractEnd,
          baseSalary,
          isActive: user.isActive,
        },
      });
    })
  );
  console.log(`✅ Created ${employees.length} employees`);

  // ============================================
  // 3. BUDGETS (last 3 years + current year)
  // ============================================
  console.log("\n💰 Generating budgets...");
  const currentYear = new Date().getFullYear();
  const budgets = [];
  
  for (let year = currentYear - 2; year <= currentYear + 1; year++) {
    const totalAmount = year === currentYear + 1 ? 6000000 : 5000000 + randomRange(-200000, 500000);
    
    const budget = await prisma.budget.create({
      data: {
        year,
        totalAmount,
        description: `Budget annuel ${year}`,
        allocations: {
          create: [
            {
              category: "Recherche",
              amount: Math.round(totalAmount * 0.35),
              description: "Budget recherche scientifique",
            },
            {
              category: "Personnel",
              amount: Math.round(totalAmount * 0.35),
              description: "Salaires et charges sociales",
            },
            {
              category: "Équipement",
              amount: Math.round(totalAmount * 0.15),
              description: "Achat et maintenance équipements",
            },
            {
              category: "Logistique",
              amount: Math.round(totalAmount * 0.15),
              description: "Missions terrain et transport",
            },
          ],
        },
      },
    });
    budgets.push(budget);
  }
  console.log(`✅ Created ${budgets.length} budgets`);

  const currentBudget = budgets.find((b) => b.year === currentYear)!;

  // ============================================
  // 4. GRANTS (research funding)
  // ============================================
  console.log("\n🎓 Generating grants...");
  const grantData = generateGrants(12);
  const grants = await Promise.all(
    grantData.map((grant) =>
      prisma.grant.create({
        data: grant,
      })
    )
  );
  console.log(`✅ Created ${grants.length} grants`);

  // ============================================
  // 5. SUPPLIERS (vendors/contractors)
  // ============================================
  console.log("\n🏢 Generating suppliers...");
  const supplierData = generateSuppliers(15);
  const suppliers = await Promise.all(
    supplierData.map((supplier) =>
      prisma.supplier.create({
        data: supplier,
      })
    )
  );
  console.log(`✅ Created ${suppliers.length} suppliers`);

  // ============================================
  // 6. INVOICES (bills from suppliers)
  // ============================================
  console.log("\n📄 Generating invoices...");
  const invoiceStartDate = addDays(new Date(), -180);
  const invoiceData = generateInvoices(45, suppliers.map((s) => s.id), invoiceStartDate, new Date());
  const invoices = await Promise.all(
    invoiceData.map((invoice) =>
      prisma.invoice.create({
        data: invoice,
      })
    )
  );
  console.log(`✅ Created ${invoices.length} invoices`);

  // ============================================
  // 7. PAYMENTS (payments for invoices)
  // ============================================
  console.log("\n💳 Generating payments...");
  const paymentData = generatePayments(invoices.map((inv) => ({ id: inv.id, amount: Number(inv.amount), date: inv.date, status: inv.status })));
  
  for (let i = 0; i < paymentData.length; i += 50) {
    const batch = paymentData.slice(i, i + 50);
    await prisma.payment.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${paymentData.length} payments`);

  // ============================================
  // 8. PROJECTS (10 active projects)
  // ============================================
  console.log("\n📁 Generating projects...");
  const projectNames = [
    "Biodiversité marine côtière",
    "Conservation des écosystèmes forestiers",
    "Suivi climatique régional",
    "Inventaire faunistique Atlas",
    "Étude des espèces menacées",
    "Cartographie SIG habitats",
    "Recherche eau douce",
    "Pollution atmosphérique",
    "Géologie régionale",
    "Publications scientifiques",
  ];
  
  const projects = await Promise.all(
    projectNames.map((name, index) => {
      const startDate = addMonths(new Date(), -randomRange(6, 24));
      const duration = randomRange(12, 36);
      const endDate = addMonths(startDate, duration);
      const status = endDate > new Date() ? "active" : randomChoice(["completed", "cancelled"]);
      const budget = randomRange(50000, 500000);
      
      return prisma.project.create({
        data: {
          name,
          description: `Projet de recherche: ${name}`,
          startDate,
          endDate: status === "active" ? null : endDate,
          status,
          budget,
        },
      });
    })
  );
  console.log(`✅ Created ${projects.length} projects`);

  // ============================================
  // 9. EXPENSES (time-series over last 365 days, linked to grants/projects/invoices)
  // ============================================
  console.log("\n💸 Generating expenses...");
  const expensesStartDate = addDays(new Date(), -365);
  const expenseData = generateExpenses(
    180,
    currentBudget.id,
    grants.map((g) => g.id),
    projects.map((p) => p.id),
    invoices.map((inv) => inv.id),
    expensesStartDate,
    new Date()
  );
  
  const expenses = await Promise.all(
    expenseData.map((expense) =>
      prisma.expense.create({
        data: expense,
      })
    )
  );
  console.log(`✅ Created ${expenses.length} expenses`);

  // ============================================
  // 10. SPECIES (150 species)
  // ============================================
  console.log("\n🦎 Generating species data...");
  const speciesData = generateSpecies(150).map((spec) => ({
    ...spec,
    createdAt: randomDate(startDate, new Date()),
  }));
  console.log(`  Generated ${speciesData.length} species records`);
  
  console.log("  Inserting species into database...");
  // Use createMany for better performance
  const createResult = await prisma.species.createMany({
    data: speciesData,
    skipDuplicates: true,
  });
  console.log(`  Inserted ${createResult.count} species`);
  
  // Fetch all created species
  console.log("  Fetching created species...");
  const species = await prisma.species.findMany({
    orderBy: { createdAt: 'desc' },
    take: 150,
  });
  console.log(`✅ Created ${species.length} species`);

  // ============================================
  // 11. MISSIONS (120 missions over last 365 days)
  // ============================================
  console.log("\n🗺️ Generating missions...");
  const missionStartDate = addDays(new Date(), -365);
  const missionData = generateMissions(120, users.map((u) => u.id), missionStartDate, new Date());
  
  const missions = await Promise.all(
    missionData.map(async (mission) => {
      // Create mission team (2-5 members)
      const teamSize = randomRange(2, 5);
      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
      const teamMembers = shuffledUsers.slice(0, teamSize);
      
      return prisma.mission.create({
        data: {
          ...mission,
          teams: {
            create: teamMembers.map((member, idx) => ({
              userId: member.id,
              employeeId: employees.find((e) => e.userId === member.id)?.id || null,
              role: idx === 0 ? "Chef de mission" : idx === 1 ? "Co-chef" : "Membre",
            })),
          },
        },
      });
    })
  );
  console.log(`✅ Created ${missions.length} missions`);

  // ============================================
  // 12. SPECIES OBSERVATIONS (time-series data, linked to missions)
  // ============================================
  console.log("\n🔍 Generating species observations...");
  const observationStartDate = addDays(new Date(), -365);
  const completedMissions = missions.filter((m) => m.status === "completed");
  const observations = [];
  
  // Generate 2-8 observations per species over the past year
  for (const spec of species) {
    const observationCount = randomRange(2, 8);
    
    for (let i = 0; i < observationCount; i++) {
      const observationDate = randomDate(observationStartDate, new Date());
      const rifLocation = getRandomRifLocation();
      
      // 50% of observations are linked to completed missions
      const linkedToMission = Math.random() < 0.5 && completedMissions.length > 0;
      const missionId = linkedToMission
        ? completedMissions[Math.floor(Math.random() * completedMissions.length)].id
        : null;
      
      observations.push({
        speciesId: spec.id,
        date: observationDate,
        location: rifLocation.name,
        latitude: rifLocation.latitude,
        longitude: rifLocation.longitude,
        quantity: randomRange(1, 50),
        notes: `Observation de ${spec.commonName || spec.scientificName} dans le Rif - ${rifLocation.name}.`,
        observerId: randomChoice(users).id,
        missionId,
        createdAt: observationDate,
      });
    }
  }
  
  // Batch create observations
  for (let i = 0; i < observations.length; i += 100) {
    const batch = observations.slice(i, i + 100);
    await prisma.speciesObservation.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${observations.length} species observations`);

  // Generate species locations (for mapping)
  console.log("\n📍 Generating species locations...");
  const speciesLocations = [];
  for (const spec of species.slice(0, Math.floor(species.length * 0.7))) {
    // 70% of species have location data
    const locationCount = randomRange(1, 4);
    for (let i = 0; i < locationCount; i++) {
      const rifLocation = getRandomRifLocation();
      const observedAt = randomDate(addDays(new Date(), -730), new Date());
      
      speciesLocations.push({
        speciesId: spec.id,
        latitude: rifLocation.latitude,
        longitude: rifLocation.longitude,
        location: rifLocation.name,
        observedAt,
        observerId: randomChoice(users).id,
        notes: `Observation de ${spec.commonName || spec.scientificName} dans le Rif - ${rifLocation.name}`,
      });
    }
  }
  
  for (let i = 0; i < speciesLocations.length; i += 100) {
    const batch = speciesLocations.slice(i, i + 100);
    await prisma.speciesLocation.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${speciesLocations.length} species locations`);

  // Generate species photos
  console.log("\n📷 Generating species photos...");
  const speciesPhotos = [];
  for (const spec of species.slice(0, Math.floor(species.length * 0.5))) {
    // 50% of species have photos
    const photoCount = randomRange(1, 3);
    for (let i = 0; i < photoCount; i++) {
      // Use placeholder images from Unsplash with species-related keywords
      const speciesKeywords = spec.commonName || spec.scientificName.replace(" ", "-").toLowerCase();
      const photoUrl = `https://source.unsplash.com/400x300/?${speciesKeywords},nature,morocco`;
      
      speciesPhotos.push({
        speciesId: spec.id,
        url: photoUrl,
        caption: `Photo de ${spec.commonName || spec.scientificName} - Rif, Maroc`,
        takenAt: randomDate(addDays(new Date(), -365), new Date()),
      });
    }
  }
  
  for (let i = 0; i < speciesPhotos.length; i += 100) {
    const batch = speciesPhotos.slice(i, i + 100);
    await prisma.speciesPhoto.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${speciesPhotos.length} species photos`);

  // Generate mission reports for completed missions
  const reports = await Promise.all(
    completedMissions.map((mission) =>
      prisma.missionReport.create({
        data: {
          missionId: mission.id,
          content: `# Rapport de Mission: ${mission.title}\n\n## Résumé\n\nMission réalisée avec succès dans la région de ${mission.location}.\n\n## Résultats\n\n- Collecte de données scientifiques\n- Observations terrain effectuées\n- Échantillons collectés\n\n## Recommandations\n\nPoursuivre les recherches dans cette zone.`,
          summary: `Mission ${mission.status} dans ${mission.location}`,
          findings: "Données collectées avec succès",
          recommendations: "Poursuivre le suivi régulier",
        },
      })
    )
  );
  console.log(`✅ Created ${reports.length} mission reports`);

  // ============================================
  // 13. EQUIPMENT (75 pieces of equipment)
  // ============================================
  console.log("\n🔧 Generating equipment...");
  const equipmentData = generateEquipment(75);
  const equipment = await Promise.all(
    equipmentData.map((eq) =>
      prisma.equipment.create({
        data: eq,
      })
    )
  );
  console.log(`✅ Created ${equipment.length} equipment items`);

  // Link equipment to missions
  const inUseMissions = missions.filter((m) => m.status === "in_progress" || m.status === "planned");
  for (const mission of inUseMissions.slice(0, 30)) {
    const availableEquipment = equipment.filter((e) => e.status === "AVAILABLE");
    const equipmentCount = Math.min(randomRange(1, 4), availableEquipment.length);
    const shuffledEquipment = [...availableEquipment].sort(() => 0.5 - Math.random());
    const selectedEquipment = shuffledEquipment.slice(0, equipmentCount);
    
    await Promise.all(
      selectedEquipment.map((eq) =>
        prisma.missionEquipment.create({
          data: {
            missionId: mission.id,
            equipmentId: eq.id,
            quantity: 1,
          },
        })
      )
    );
    
    // Update equipment status
    await prisma.equipment.updateMany({
      where: { id: { in: selectedEquipment.map((e) => e.id) } },
      data: { status: "IN_USE" },
    });
  }

  // Generate maintenance records
  const maintenanceRecords = [];
  for (const eq of equipment) {
    const maintenanceCount = randomRange(0, 5);
    for (let i = 0; i < maintenanceCount; i++) {
      const maintenanceDate = randomDate(eq.purchaseDate || eq.createdAt, new Date());
      maintenanceRecords.push({
        equipmentId: eq.id,
        type: randomChoice(["preventive", "corrective"]),
        description: `Maintenance ${i + 1} - ${eq.name}`,
        cost: randomRange(500, 5000),
        date: maintenanceDate,
        nextDueDate: addMonths(maintenanceDate, randomRange(6, 12)),
      });
    }
  }
  
  for (let i = 0; i < maintenanceRecords.length; i += 50) {
    const batch = maintenanceRecords.slice(i, i + 50);
    await prisma.maintenance.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${maintenanceRecords.length} maintenance records`);

  // ============================================
  // 14. CLIMATE DATA (daily data for last 365 days)
  // ============================================
  console.log("\n🌡️ Generating climate data...");
  const climateData = generateClimateData(1500, addDays(new Date(), -365), new Date());
  
  for (let i = 0; i < climateData.length; i += 100) {
    const batch = climateData.slice(i, i + 100);
    await prisma.climateData.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${climateData.length} climate data records`);

  // ============================================
  // 15. AIR QUALITY DATA (RIF REGION ONLY)
  // ============================================
  console.log("\n💨 Generating air quality data (RIF region)...");
  const airQualityData = [];
  
  for (let i = 0; i < 400; i++) {
    const date = randomDate(addDays(new Date(), -365), new Date());
    const rifLocation = getRandomRifLocation();
    
    airQualityData.push({
      location: rifLocation.name,
      latitude: rifLocation.latitude,
      longitude: rifLocation.longitude,
      date,
      // RIF region has generally good air quality (mountain region)
      pm25: randomRange(5, 30),
      pm10: randomRange(10, 50),
      no2: randomRange(10, 40),
      o3: randomRange(20, 80),
      co: randomRange(0.5, 3),
    });
  }
  
  for (let i = 0; i < airQualityData.length; i += 100) {
    const batch = airQualityData.slice(i, i + 100);
    await prisma.airQuality.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${airQualityData.length} air quality records`);

  // ============================================
  // 16. WATER QUALITY DATA (RIF REGION ONLY)
  // ============================================
  console.log("\n💧 Generating water quality data (RIF region)...");
  const waterTypes = ["MER", "SOURCE", "BARRAGE"];
  
  // Filter RIF locations for water sources
  const rifWaterLocations: RifLocation[] = RIF_LOCATIONS.filter(loc => 
    loc.type === "coast" || loc.type === "river"
  );
  
  const waterQualityData = [];
  for (let i = 0; i < 300; i++) {
    const date = randomDate(addDays(new Date(), -365), new Date());
    // Use RIF coastal/river locations, or fall back to a random water location
    const rifLocation: RifLocation = rifWaterLocations.length > 0 
      ? randomChoice(rifWaterLocations)
      : randomChoice(RIF_LOCATIONS.filter(loc => loc.type === "coast" || loc.type === "river"));
    
    // Determine water type based on location type
    let waterType: "MER" | "SOURCE" | "BARRAGE";
    if (rifLocation.type === "coast") {
      waterType = "MER";
    } else if (rifLocation.type === "river") {
      waterType = weightedChoice(["SOURCE", "BARRAGE"], [70, 30]);
    } else {
      waterType = randomChoice(waterTypes) as "MER" | "SOURCE" | "BARRAGE";
    }
    
    // Realistic water quality ranges
    const ph = randomFloat(6.5, 8.5);
    const temperature = randomFloat(10, 28);
    const dissolvedO2 = randomFloat(5, 12);
    const turbidity = randomFloat(0.1, 50);
    const salinity = waterType === "MER" ? randomFloat(30, 38) : randomFloat(0, 5);
    
    waterQualityData.push({
      type: waterType,
      location: rifLocation.name,
      latitude: rifLocation.latitude,
      longitude: rifLocation.longitude,
      date,
      ph: Math.round(ph * 10) / 10,
      temperature: Math.round(temperature * 10) / 10,
      dissolvedO2: Math.round(dissolvedO2 * 10) / 10,
      turbidity: Math.round(turbidity * 10) / 10,
      salinity: Math.round(salinity * 10) / 10,
    });
  }
  
  for (let i = 0; i < waterQualityData.length; i += 100) {
    const batch = waterQualityData.slice(i, i + 100);
    await prisma.waterQuality.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${waterQualityData.length} water quality records`);

  // ============================================
  // 17. SENSOR DATA (données capteurs)
  // ============================================
  console.log("\n📡 Generating sensor data...");
  const sensorData = generateSensorData(200, addDays(new Date(), -90), new Date());
  
  for (let i = 0; i < sensorData.length; i += 100) {
    const batch = sensorData.slice(i, i + 100);
    await prisma.sensorData.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${sensorData.length} sensor data records`);

  // ============================================
  // 18. MAP LAYERS (couches cartographiques)
  // ============================================
  console.log("\n🗺️ Generating map layers...");
  const mapLayerData = generateMapLayers();
  const mapLayers = await Promise.all(
    mapLayerData.map((layer) =>
      prisma.mapLayer.create({
        data: layer,
      })
    )
  );
  console.log(`✅ Created ${mapLayers.length} map layers`);

  // ============================================
  // 19. DOCUMENTS (gestion documentaire)
  // ============================================
  console.log("\n📄 Generating documents...");
  const completedMissionIds = missions.filter((m) => m.status === "completed").map((m) => m.id);
  const documentData = generateDocuments(35, users.map((u) => u.id), completedMissionIds);
  const documents = await Promise.all(
    documentData.map((doc) =>
      prisma.document.create({
        data: doc,
      })
    )
  );
  console.log(`✅ Created ${documents.length} documents`);

  // ============================================
  // 20. PUBLICATIONS (édition & publication)
  // ============================================
  console.log("\n📚 Generating publications...");
  const publicationData = generatePublications();
  const publications = await Promise.all(
    publicationData.map(async (pub) => {
      const { chapters, ...pubData } = pub;
      return prisma.publication.create({
        data: {
          ...pubData,
          chapters: {
            create: chapters,
          },
        },
      });
    })
  );
  console.log(`✅ Created ${publications.length} publications`);

  // ============================================
  // 21. LEAVES (congés pour RH)
  // ============================================
  console.log("\n🏖️ Generating leaves...");
  const leaveData = generateLeaves(
    employees.map((e) => e.id),
    addDays(new Date(), -180),
    addDays(new Date(), 90)
  );
  
  for (let i = 0; i < leaveData.length; i += 50) {
    const batch = leaveData.slice(i, i + 50);
    await prisma.leave.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${leaveData.length} leave records`);

  // ============================================
  // 22. LOGIN LOGS (user activity tracking)
  // ============================================
  console.log("\n🔐 Generating login logs...");
  const loginLogData = generateLoginLogs(users.map((u) => u.id), addDays(new Date(), -90), new Date(), 30);
  
  for (let i = 0; i < loginLogData.length; i += 500) {
    const batch = loginLogData.slice(i, i + 500);
    await prisma.loginLog.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${loginLogData.length} login logs`);

  // ============================================
  // 23. AUDIT LOGS (system activity)
  // ============================================
  console.log("\n📋 Generating audit logs...");
  const actions = ["CREATE", "UPDATE", "DELETE", "VIEW", "EXPORT"];
  const entities = ["Mission", "Species", "Equipment", "Document", "Budget", "User"];
  const auditLogs = [];
  
  for (let i = 0; i < 500; i++) {
    const timestamp = realisticTimestamp(addDays(new Date(), -90), new Date());
    const user = randomChoice(users);
    const action = randomChoice(actions);
    const entity = randomChoice(entities);
    
    auditLogs.push({
      userId: user.id,
      action,
      entity,
      entityId: randomChoice([missions, species, equipment].flat().map((e) => e.id)),
      changes: JSON.stringify({ field: "example", oldValue: "old", newValue: "new" }),
      ipAddress: `192.168.1.${randomRange(1, 255)}`,
      userAgent: "Mozilla/5.0 (compatible)",
      timestamp,
    });
  }
  
  for (let i = 0; i < auditLogs.length; i += 100) {
    const batch = auditLogs.slice(i, i + 100);
    await prisma.auditLog.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${auditLogs.length} audit logs`);

  // ============================================
  // 24. BONUSES (employee bonuses)
  // ============================================
  console.log("\n🎁 Generating bonuses...");
  const bonusData = generateBonuses(
    employees.map((e) => e.id),
    addMonths(new Date(), -12),
    new Date()
  );
  
  for (let i = 0; i < bonusData.length; i += 50) {
    const batch = bonusData.slice(i, i + 50);
    await prisma.bonus.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${bonusData.length} bonus records`);

  // ============================================
  // 25. EVALUATIONS (employee performance evaluations)
  // ============================================
  console.log("\n📊 Generating evaluations...");
  const evaluationYear = new Date().getFullYear();
  const evaluationData = generateEvaluations(
    employees.map((e) => e.id),
    users.filter((u) => u.role === "DIRECTEUR_SCIENTIFIQUE" || u.role === "DIRECTEUR_ADMINISTRATIF_FINANCIER").map((u) => u.id),
    evaluationYear - 2,
    evaluationYear
  );
  
  for (let i = 0; i < evaluationData.length; i += 100) {
    const batch = evaluationData.slice(i, i + 100);
    await prisma.evaluation.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${evaluationData.length} evaluation records`);

  // ============================================
  // 26. GEOLOGY DATA
  // ============================================
  console.log("\n⛰️ Generating geology data...");
  const geologyData = generateGeologyData(150, addDays(new Date(), -365), new Date());
  
  for (let i = 0; i < geologyData.length; i += 100) {
    const batch = geologyData.slice(i, i + 100);
    await prisma.geologyData.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${geologyData.length} geology data records`);

  // ============================================
  // 27. SPECIES REFERENCES (bibliographic references)
  // ============================================
  console.log("\n📚 Generating species references...");
  const speciesRefData = generateSpeciesReferences(species.map((s) => s.id));
  
  for (let i = 0; i < speciesRefData.length; i += 100) {
    const batch = speciesRefData.slice(i, i + 100);
    await prisma.speciesReference.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${speciesRefData.length} species reference records`);

  // ============================================
  // 28. USER PERMISSIONS
  // ============================================
  console.log("\n🔐 Generating user permissions...");
  const userPermData = generateUserPermissions(users.map((u) => u.id));
  
  for (let i = 0; i < userPermData.length; i += 100) {
    const batch = userPermData.slice(i, i + 100);
    await prisma.userPermission.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${userPermData.length} user permission records`);

  // ============================================
  // 29. SALARIES (monthly payroll data)
  // ============================================
  console.log("\n💵 Generating salaries...");
  const salaries = [];
  const monthsAgo = 12;
  
  for (const employee of employees) {
    for (let monthOffset = monthsAgo; monthOffset >= 0; monthOffset--) {
      const date = new Date();
      date.setMonth(date.getMonth() - monthOffset);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      salaries.push({
        employeeId: employee.id,
        amount: employee.baseSalary,
        month,
        year,
        paidAt: addDays(new Date(year, month - 1, 1), randomRange(25, 28)),
      });
    }
  }
  
  for (let i = 0; i < salaries.length; i += 200) {
    const batch = salaries.slice(i, i + 200);
    await prisma.salary.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${salaries.length} salary records`);

  // ============================================
  // 30. NOTIFICATIONS (test notifications for all users)
  // ============================================
  console.log("\n🔔 Generating test notifications...");
  const notifications = [];
  
  for (const user of users) {
    // Create 3 test notifications per user
    notifications.push(
      {
        userId: user.id,
        type: "info",
        title: "Bienvenue sur la plateforme",
        message: `Bonjour ${user.firstName}, bienvenue sur la plateforme de recherche. Le système de notifications est maintenant actif !`,
        link: "/dashboard",
        read: false,
      },
      {
        userId: user.id,
        type: "success",
        title: "Système de notifications activé",
        message: "Les notifications automatiques seront créées lors d'événements importants (nouvelles missions, espèces, etc.)",
        read: false,
      },
      {
        userId: user.id,
        type: "warning",
        title: "Action requise",
        message: "N'oubliez pas de configurer vos préférences de notifications",
        link: "/dashboard/notifications",
        read: false,
      }
    );
  }
  
  for (let i = 0; i < notifications.length; i += 200) {
    const batch = notifications.slice(i, i + 200);
    await prisma.notification.createMany({
      data: batch,
    });
  }
  console.log(`✅ Created ${notifications.length} notification records`);

  // ============================================
  // SUMMARY
  // ============================================
  console.log("\n" + "=".repeat(50));
  console.log("🎉 SEEDING COMPLETED SUCCESSFULLY!");
  console.log("=".repeat(50));
  console.log("\n📊 Data Summary:");
  console.log(`   👥 Users: ${users.length}`);
  console.log(`   💼 Employees: ${employees.length}`);
  console.log(`   🦎 Species: ${species.length}`);
  console.log(`   🔍 Observations: ${observations.length}`);
  console.log(`   🗺️ Missions: ${missions.length}`);
  console.log(`   🔧 Equipment: ${equipment.length}`);
  console.log(`   💰 Budgets: ${budgets.length}`);
  console.log(`   💸 Expenses: ${expenses.length}`);
  console.log(`   🌡️ Climate Data: ${climateData.length}`);
  console.log(`   💨 Air Quality: ${airQualityData.length}`);
  console.log(`   🔐 Login Logs: ${loginLogData.length}`);
  console.log(`   📋 Audit Logs: ${auditLogs.length}`);
  console.log(`   💵 Salaries: ${salaries.length}`);
  console.log(`   📁 Projects: ${projects.length}`);
  console.log(`   🎓 Grants: ${grants.length}`);
  console.log(`   🏢 Suppliers: ${suppliers.length}`);
  console.log(`   📄 Invoices: ${invoices.length}`);
  console.log(`   💳 Payments: ${paymentData.length}`);
  console.log(`   💧 Water Quality: ${waterQualityData.length}`);
  console.log(`   📡 Sensor Data: ${sensorData.length}`);
  console.log(`   🗺️ Map Layers: ${mapLayers.length}`);
  console.log(`   📄 Documents: ${documents.length}`);
  console.log(`   📚 Publications: ${publications.length}`);
  console.log(`   🏖️ Leaves: ${leaveData.length}`);
  console.log(`   📍 Species Locations: ${speciesLocations.length}`);
  console.log(`   📷 Species Photos: ${speciesPhotos.length}`);
  console.log(`   🎁 Bonuses: ${bonusData.length}`);
  console.log(`   📊 Evaluations: ${evaluationData.length}`);
  console.log(`   ⛰️ Geology Data: ${geologyData.length}`);
  console.log(`   📚 Species References: ${speciesRefData.length}`);
  console.log(`   🔐 User Permissions: ${userPermData.length}`);
  console.log(`   🔔 Notifications: ${notifications.length}`);
  console.log("\n✨ Your dashboard is now ready with realistic sample data!");
  console.log("\n🔑 Default credentials:");
  console.log("   Email: admin@research-platform.ma");
  console.log("   Password: admin123");
  console.log("\n   (All other users: password123)");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
