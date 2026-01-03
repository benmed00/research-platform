/**
 * Script to create test notifications for all users
 * Run with: npx ts-node --project tsconfig.json src/scripts/create-test-notifications.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestNotifications() {
  try {
    console.log("Creating test notifications...");

    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (users.length === 0) {
      console.log("No users found. Please create users first.");
      return;
    }

    console.log(`Found ${users.length} users. Creating notifications...`);

    // Create notifications for each user
    for (const user of users) {
      await prisma.notification.createMany({
        data: [
          {
            userId: user.id,
            type: "info",
            title: "Bienvenue sur la plateforme",
            message: `Bonjour ${user.firstName}, bienvenue sur la plateforme de recherche. Le système de notifications est maintenant actif !`,
            link: "/dashboard",
          },
          {
            userId: user.id,
            type: "success",
            title: "Système de notifications activé",
            message: "Les notifications automatiques seront créées lors d'événements importants (nouvelles missions, espèces, etc.)",
          },
          {
            userId: user.id,
            type: "warning",
            title: "Action requise",
            message: "N'oubliez pas de configurer vos préférences de notifications",
            link: "/dashboard/notifications",
          },
        ],
      });
    }

    const totalNotifications = users.length * 3;
    console.log(`✅ Successfully created ${totalNotifications} test notifications for ${users.length} users.`);

    // Show summary
    const notificationCount = await prisma.notification.count();
    console.log(`\nTotal notifications in database: ${notificationCount}`);
  } catch (error) {
    console.error("Error creating test notifications:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTestNotifications()
  .then(() => {
    console.log("\n✅ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });

