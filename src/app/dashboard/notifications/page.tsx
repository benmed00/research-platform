/**
 * @file page.tsx
 * @description src/app/dashboard/notifications/page.tsx
 * @author github-actions[bot]
 * @created 2026-01-04
 * @updated 2026-01-04
 * @updates 1
 * @lines 382
 * @size 13.07 KB
 */
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck, Trash2, Settings, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { useNotifications } from "@/components/notifications/notification-provider";

interface NotificationItem {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  read: boolean;
  createdAt: string;
  readAt?: string | null;
  link?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const { info, success, error: showError } = useNotifications();

  useEffect(() => {
    fetchNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notifications?limit=100");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n))
        );
        success("Notification marquée comme lue");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "POST",
      });
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true, readAt: new Date().toISOString() })));
        success("Toutes les notifications ont été marquées comme lues");
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        info("Notification supprimée");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const iconColors = {
    success: "text-green-600 dark:text-green-400",
    error: "text-red-600 dark:text-red-400",
    info: "text-blue-600 dark:text-blue-400",
    warning: "text-yellow-600 dark:text-yellow-400",
  };

  const cardColors = {
    success: "border-l-4 border-l-green-500",
    error: "border-l-4 border-l-red-500",
    info: "border-l-4 border-l-blue-500",
    warning: "border-l-4 border-l-yellow-500",
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Notifications
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
              Gérez vos notifications
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Notifications
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Gérez vos notifications et préférences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={async () => {
              try {
                const response = await fetch("/api/notifications/test", { method: "POST" });
                const data = await response.json();
                if (response.ok) {
                  await fetchNotifications();
                  success("Notifications de test créées avec succès");
                } else {
                  // Show error message to user
                  showError(data.error || "Erreur lors de la création des notifications");
                }
              } catch (error) {
                console.error("Error creating test notifications:", error);
                showError("Erreur lors de la création des notifications");
              }
            }}
            variant="outline"
            size="sm"
          >
            Créer des notifications de test
          </Button>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <CheckCheck className="w-4 h-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
          <Link href="/dashboard/notifications/settings">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Préférences
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {notifications.length}
              </p>
            </div>
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Non lues
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {unreadCount}
              </p>
            </div>
            <Badge variant="error" className="text-lg px-3 py-1">
              {unreadCount}
            </Badge>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Lues
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {readCount}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          Toutes ({notifications.length})
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
        >
          Non lues ({unreadCount})
        </Button>
        <Button
          variant={filter === "read" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("read")}
        >
          Lues ({readCount})
        </Button>
      </div>

      {/* Liste des notifications */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12">
            <EmptyState
              icon={Bell}
              title="Aucune notification"
              description={
                filter === "unread"
                  ? "Vous n'avez aucune notification non lue"
                  : filter === "read"
                  ? "Vous n'avez aucune notification lue"
                  : "Vous n'avez aucune notification pour le moment"
              }
            />
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = icons[notification.type];
            return (
              <Card
                key={notification.id}
                variant="elevated"
                className={`p-6 ${cardColors[notification.type]} ${
                  !notification.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 ${iconColors[notification.type]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-lg font-semibold ${
                              !notification.read
                                ? "text-gray-900 dark:text-gray-100"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge variant="default" className="text-xs">
                              Nouveau
                            </Badge>
                          )}
                        </div>
                        {notification.message && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {notification.message}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-500">
                          <span>
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                          {notification.readAt && (
                            <span>
                              Lu {formatDistanceToNow(new Date(notification.readAt), { addSuffix: true })}
                            </span>
                          )}
                          <span>
                            {format(new Date(notification.createdAt), "dd/MM/yyyy à HH:mm")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            title="Marquer comme lu"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {notification.link && (
                          <Link href={notification.link}>
                            <Button variant="outline" size="sm">
                              Voir
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          title="Supprimer"
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

