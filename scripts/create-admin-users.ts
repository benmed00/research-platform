/**
 * Script to create admin and superadmin user accounts
 * Run with: npx tsx scripts/create-admin-users.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdminUsers() {
  try {
    console.log("🔐 Creating admin and superadmin accounts...\n");

    // Check if users already exist
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@research-platform.ma" },
    });

    const existingSuperAdmin = await prisma.user.findUnique({
      where: { email: "superadmin@research-platform.ma" },
    });

    // Create admin account (Directeur Scientifique)
    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash("admin123", 10);
      const admin = await prisma.user.create({
        data: {
          email: "admin@research-platform.ma",
          password: adminPassword,
          firstName: "Admin",
          lastName: "System",
          role: "DIRECTEUR_SCIENTIFIQUE",
          isActive: true,
        },
      });
      console.log("✅ Admin account created:");
      console.log(`   Email: admin@research-platform.ma`);
      console.log(`   Password: admin123`);
      console.log(`   Role: DIRECTEUR_SCIENTIFIQUE`);
      console.log(`   ID: ${admin.id}\n`);
    } else {
      console.log("ℹ️  Admin account already exists:");
      console.log(`   Email: admin@research-platform.ma`);
      console.log(`   ID: ${existingAdmin.id}\n`);
    }

    // Create superadmin account (Directeur Administratif & Financier)
    if (!existingSuperAdmin) {
      const superAdminPassword = await bcrypt.hash("superadmin123", 10);
      const superAdmin = await prisma.user.create({
        data: {
          email: "superadmin@research-platform.ma",
          password: superAdminPassword,
          firstName: "Super",
          lastName: "Admin",
          role: "DIRECTEUR_ADMINISTRATIF_FINANCIER",
          isActive: true,
        },
      });
      console.log("✅ Superadmin account created:");
      console.log(`   Email: superadmin@research-platform.ma`);
      console.log(`   Password: superadmin123`);
      console.log(`   Role: DIRECTEUR_ADMINISTRATIF_FINANCIER`);
      console.log(`   ID: ${superAdmin.id}\n`);
    } else {
      console.log("ℹ️  Superadmin account already exists:");
      console.log(`   Email: superadmin@research-platform.ma`);
      console.log(`   ID: ${existingSuperAdmin.id}\n`);
    }

    console.log("🎉 Done! You can now log in with these accounts.");
    console.log("\n⚠️  IMPORTANT: Change the passwords after first login!");
  } catch (error) {
    console.error("❌ Error creating admin users:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUsers();

