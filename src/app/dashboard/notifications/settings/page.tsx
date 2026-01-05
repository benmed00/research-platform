/**
 * @file page.tsx
 * @description src/app/dashboard/notifications/settings/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 2
 * @lines 240
 * @size 8.53 KB
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Bell, Mail, Smartphone } from "lucide-react";
import Link from "next/link";
import { useNotifications } from "@/components/notifications/notification-provider";

export default function NotificationSettingsPage() {
  const router = useRouter();
  const { success, error: showError } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  
  const [settings, setSettings] = useState({
    emailEnabled: true,
    pushEnabled: true,
    desktopEnabled: true,
    missionUpdates: true,
    documentUpdates: true,
    systemAlerts: true,
    weeklyDigest: false,
  });

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch("/api/notifications/preferences");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setLoadingPreferences(false);
      }
    };

    loadPreferences();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la sauvegarde");
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      success("Préférences de notification sauvegardées");
    } catch (error: any) {
      console.error("Error saving preferences:", error);
      showError("Erreur", error.message || "Erreur lors de la sauvegarde des préférences");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/notifications">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Préférences de notification
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Gérez vos préférences de notification
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Canaux de notification
            </CardTitle>
            <CardDescription>
              Choisissez comment vous souhaitez recevoir les notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="emailEnabled" className="cursor-pointer">
                    Notifications par email
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir les notifications par email
                  </p>
                </div>
              </div>
              <Checkbox
                id="emailEnabled"
                checked={settings.emailEnabled}
                onCheckedChange={() => handleToggle("emailEnabled")}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="pushEnabled" className="cursor-pointer">
                    Notifications push
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications push dans le navigateur
                  </p>
                </div>
              </div>
              <Checkbox
                id="pushEnabled"
                checked={settings.pushEnabled}
                onCheckedChange={() => handleToggle("pushEnabled")}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="desktopEnabled" className="cursor-pointer">
                    Notifications de bureau
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Afficher les notifications sur le bureau
                  </p>
                </div>
              </div>
              <Checkbox
                id="desktopEnabled"
                checked={settings.desktopEnabled}
                onCheckedChange={() => handleToggle("desktopEnabled")}
              />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Types de notifications</CardTitle>
            <CardDescription>
              Choisissez les types de notifications que vous souhaitez recevoir
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <Label htmlFor="missionUpdates" className="cursor-pointer">
                  Mises à jour de missions
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notifications pour les missions qui vous concernent
                </p>
              </div>
              <Checkbox
                id="missionUpdates"
                checked={settings.missionUpdates}
                onCheckedChange={() => handleToggle("missionUpdates")}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <Label htmlFor="documentUpdates" className="cursor-pointer">
                  Mises à jour de documents
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notifications pour les nouveaux documents partagés
                </p>
              </div>
              <Checkbox
                id="documentUpdates"
                checked={settings.documentUpdates}
                onCheckedChange={() => handleToggle("documentUpdates")}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <Label htmlFor="systemAlerts" className="cursor-pointer">
                  Alertes système
                </Label>
                <p className="text-sm text-muted-foreground">
                  Alertes importantes du système
                </p>
              </div>
              <Checkbox
                id="systemAlerts"
                checked={settings.systemAlerts}
                onCheckedChange={() => handleToggle("systemAlerts")}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <Label htmlFor="weeklyDigest" className="cursor-pointer">
                  Résumé hebdomadaire
                </Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir un résumé hebdomadaire par email
                </p>
              </div>
              <Checkbox
                id="weeklyDigest"
                checked={settings.weeklyDigest}
                onCheckedChange={() => handleToggle("weeklyDigest")}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Sauvegarde..." : "Enregistrer les préférences"}
        </Button>
      </div>
    </div>
  );
}

