/**
 * @file calendar-view.tsx
 * @description src/components/calendar/calendar-view.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 247
 * @size 8.27 KB
 */
"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import Link from "next/link";

interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date | string;
  endDate: Date | string;
  type: "mission" | "leave";
  status?: string;
  color?: string;
}

interface CalendarViewProps {
  missions: Array<{
    id: string;
    title: string;
    startDate: Date | string;
    endDate: Date | string;
    status: string;
  }>;
  leaves: Array<{
    id: string;
    employee: {
      user?: { firstName: string; lastName: string } | null;
      employeeNumber: string;
    };
    type: string;
    startDate: Date | string;
    endDate: Date | string;
    status: string;
  }>;
}

export function CalendarView({ missions, leaves }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week">("month");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Prepare events
  const events: CalendarEvent[] = useMemo(() => {
    const missionEvents: CalendarEvent[] = missions.map((mission) => ({
      id: mission.id,
      title: mission.title,
      startDate: new Date(mission.startDate),
      endDate: new Date(mission.endDate),
      type: "mission" as const,
      status: mission.status,
      color: mission.status === "completed" ? "bg-green-500" :
             mission.status === "in_progress" ? "bg-blue-500" :
             mission.status === "cancelled" ? "bg-red-500" :
             "bg-yellow-500",
    }));

    const leaveEvents: CalendarEvent[] = leaves.map((leave) => ({
      id: leave.id,
      title: leave.employee.user
        ? `${leave.employee.user.firstName} ${leave.employee.user.lastName} - ${leave.type}`
        : `Employé #${leave.employee.employeeNumber} - ${leave.type}`,
      startDate: new Date(leave.startDate),
      endDate: new Date(leave.endDate),
      type: "leave" as const,
      status: leave.status,
      color: leave.status === "approved" ? "bg-green-500" :
             leave.status === "rejected" ? "bg-red-500" :
             "bg-yellow-500",
    }));

    return [...missionEvents, ...leaveEvents];
  }, [missions, leaves]);

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return (
        (start <= day && end >= day) ||
        isSameDay(start, day) ||
        isSameDay(end, day)
      );
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={goToToday} size="sm">
            <ChevronsLeft className="w-4 h-4 mr-1" />
            Aujourd&apos;hui
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={goToPreviousMonth} size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 min-w-[200px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <Button variant="outline" onClick={goToNextMonth} size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "month" ? "default" : "outline"}
            onClick={() => setView("month")}
            size="sm"
          >
            Mois
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            onClick={() => setView("week")}
            size="sm"
          >
            Semaine
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Missions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Congés</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, dayIdx) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={dayIdx}
                className={`min-h-[100px] p-1 border border-gray-200 dark:border-gray-800 ${
                  isCurrentMonth
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-950"
                } ${isToday ? "ring-2 ring-primary-500" : ""}`}
              >
                <div
                  className={`text-sm mb-1 ${
                    isCurrentMonth
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-400 dark:text-gray-600"
                  } ${isToday ? "font-bold text-primary-600 dark:text-primary-400" : ""}`}
                >
                  {format(day, "d")}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <Link
                      key={event.id}
                      href={
                        event.type === "mission"
                          ? `/dashboard/missions/${event.id}`
                          : `/dashboard/rh/leaves/${event.id}`
                      }
                    >
                      <div
                        className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 ${
                          event.type === "mission"
                            ? event.color || "bg-blue-500"
                            : "bg-purple-500"
                        } text-white`}
                        title={event.title}
                      >
                        {event.title.length > 15
                          ? `${event.title.substring(0, 15)}...`
                          : event.title}
                      </div>
                    </Link>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{dayEvents.length - 3} autre(s)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

