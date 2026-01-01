/**
 * @file page.tsx
 * @description src/app/dashboard/missions/new/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 278
 * @size 8.97 KB
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/use-api";

export default function NewMissionPage() {
  const router = useRouter();
  const { handleApiCall } = useApi();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    latitude: "",
    longitude: "",
    objectives: "",
    teamMembers: [] as string[],
    equipmentIds: [] as string[],
  });

  useEffect(() => {
    // Charger les utilisateurs et équipements
    Promise.all([
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/equipment").then((r) => r.json()),
    ]).then(([usersData, equipmentData]) => {
      setUsers(usersData);
      setEquipment(equipmentData);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await handleApiCall(
      () =>
        fetch("/api/missions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }),
      {
        successMessage: "Mission créée avec succès!",
        redirect: "/dashboard/missions",
      }
    );

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/missions">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Nouvelle mission
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Créer une nouvelle mission terrain
          </p>
        </div>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Détails de la mission</CardTitle>
          <CardDescription>
            Remplissez les informations pour créer une nouvelle mission.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" required>
                Titre
              </Label>
              <Input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ex: Mission d'étude de la biodiversité marine"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description détaillée de la mission..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="startDate" required>
                  Date de début
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="endDate" required>
                  Date de fin
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location" required>
                Localisation
              </Label>
              <Input
                id="location"
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Ex: Parc National d'Ifrane"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  placeholder="Ex: 33.5333"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  placeholder="Ex: -5.1100"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="objectives">Objectifs</Label>
              <Textarea
                id="objectives"
                rows={3}
                value={formData.objectives}
                onChange={(e) =>
                  setFormData({ ...formData, objectives: e.target.value })
                }
                placeholder="Objectifs de la mission..."
              />
            </div>

            <div>
              <Label htmlFor="teamMembers">Membres de l&apos;équipe</Label>
              <Select
                id="teamMembers"
                multiple
                value={formData.teamMembers}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    teamMembers: Array.from(e.target.selectedOptions, (o) => o.value),
                  })
                }
                className="min-h-[120px]"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </Select>
              <p className="text-xs text-muted-foreground mt-1.5">
                Maintenez Ctrl/Cmd pour sélectionner plusieurs membres
              </p>
            </div>

            <div>
              <Label htmlFor="equipmentIds">Équipements</Label>
              <Select
                id="equipmentIds"
                multiple
                value={formData.equipmentIds}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    equipmentIds: Array.from(e.target.selectedOptions, (o) => o.value),
                  })
                }
                className="min-h-[120px]"
              >
                {equipment
                  .filter((eq) => eq.status === "AVAILABLE")
                  .map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name} ({eq.category})
                    </option>
                  ))}
              </Select>
            </div>

            <div className="flex items-center gap-4 border-t border-border pt-6 mt-6">
              <Button type="submit" disabled={loading}>
                {loading ? "Création..." : "Créer la mission"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

