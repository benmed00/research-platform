/**
 * @file page.tsx
 * @description src/app/dashboard/calendar/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 70
 * @size 1.60 KB
 */
import { prisma } from "@/lib/prisma";
import { CalendarView } from "@/components/calendar/calendar-view";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CalendarPage() {
  // Fetch missions and leaves for the calendar
  const [missions, leaves] = await Promise.all([
    prisma.mission.findMany({
      orderBy: { startDate: "asc" },
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
    prisma.leave.findMany({
      orderBy: { startDate: "asc" },
      include: {
        employee: {
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
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Calendrier
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
          Visualisez les missions et congés sur le calendrier
        </p>
      </div>

      <CalendarView
        missions={missions.map((m) => ({
          id: m.id,
          title: m.title,
          startDate: m.startDate,
          endDate: m.endDate,
          status: m.status,
        }))}
        leaves={leaves}
      />
    </div>
  );
}

