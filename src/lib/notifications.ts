/**
 * @file notifications.ts
 * @description src/lib/notifications.ts
 * @author github-actions[bot]
 * @created 2026-01-04
 * @updated 2026-01-04
 * @updates 1
 * @lines 205
 * @size 5.08 KB
 */
import { prisma } from "@/lib/prisma";

export interface CreateNotificationParams {
  userId: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  link?: string;
}

/**
 * Create a notification for a user
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    // Verify user exists before creating notification
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { id: true },
    });

    if (!user) {
      throw new Error(`User with id ${params.userId} does not exist`);
    }

    return await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message || null,
        link: params.link || null,
      },
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

/**
 * Create notifications for multiple users
 */
export async function createNotificationsForUsers(
  userIds: string[],
  params: Omit<CreateNotificationParams, "userId">
) {
  try {
    const notifications = await Promise.all(
      userIds.map((userId) =>
        prisma.notification.create({
          data: {
            userId,
            type: params.type,
            title: params.title,
            message: params.message || null,
            link: params.link || null,
          },
        })
      )
    );
    return notifications;
  } catch (error) {
    console.error("Error creating notifications for users:", error);
    throw error;
  }
}

/**
 * Create notification when a new mission is created
 */
export async function notifyNewMission(missionId: string, creatorId: string) {
  try {
    // Notify admins about new mission
    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: ["DIRECTEUR_SCIENTIFIQUE", "DIRECTEUR_ADMINISTRATIF_FINANCIER"],
        },
      },
      select: { id: true },
    });

    if (admins.length > 0) {
      await createNotificationsForUsers(
        admins.map((a) => a.id),
        {
          type: "info",
          title: "Nouvelle mission créée",
          message: "Une nouvelle mission scientifique a été créée",
          link: `/dashboard/missions/${missionId}`,
        }
      );
    }
  } catch (error) {
    console.error("Error notifying new mission:", error);
  }
}

/**
 * Create notification when a mission is completed
 */
export async function notifyMissionCompleted(missionId: string, missionTitle: string) {
  try {
    // Notify mission creator
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        teams: {
          include: {
            user: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (mission) {
      const userIds = [
        mission.creatorId,
        ...mission.teams.map((t) => t.user.id),
      ].filter((id, index, self) => self.indexOf(id) === index); // Remove duplicates

      await createNotificationsForUsers(userIds, {
        type: "success",
        title: "Mission terminée",
        message: `La mission "${missionTitle}" a été marquée comme terminée`,
        link: `/dashboard/missions/${missionId}`,
      });
    }
  } catch (error) {
    console.error("Error notifying mission completed:", error);
  }
}

/**
 * Create notification when equipment maintenance is due
 */
export async function notifyMaintenanceDue(equipmentId: string, equipmentName: string) {
  try {
    const logistics = await prisma.user.findMany({
      where: {
        role: "LOGISTICIEN",
      },
      select: { id: true },
    });

    if (logistics.length > 0) {
      await createNotificationsForUsers(
        logistics.map((l) => l.id),
        {
          type: "warning",
          title: "Maintenance prévue",
          message: `La maintenance de l'équipement "${equipmentName}" est prévue`,
          link: `/dashboard/equipment/${equipmentId}`,
        }
      );
    }
  } catch (error) {
    console.error("Error notifying maintenance due:", error);
  }
}

/**
 * Create notification when a new species is added
 */
export async function notifyNewSpecies(speciesId: string, scientificName: string) {
  try {
    const scientists = await prisma.user.findMany({
      where: {
        role: {
          in: [
            "DIRECTEUR_SCIENTIFIQUE",
            "BOTANISTE",
            "ZOOLOGISTE_TERRESTRE",
            "BIOLOGISTE_MARIN",
            "HYDROBIOLOGISTE",
          ],
        },
      },
      select: { id: true },
    });

    if (scientists.length > 0) {
      await createNotificationsForUsers(
        scientists.map((s) => s.id),
        {
          type: "info",
          title: "Nouvelle espèce ajoutée",
          message: `L'espèce "${scientificName}" a été ajoutée à la base de données`,
          link: `/dashboard/species/${speciesId}`,
        }
      );
    }
  } catch (error) {
    console.error("Error notifying new species:", error);
  }
}

