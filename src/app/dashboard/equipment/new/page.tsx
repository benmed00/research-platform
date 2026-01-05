/**
 * @file page.tsx
 * @description src/app/dashboard/equipment/new/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 240
 * @size 7.52 KB
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/use-api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const categories = [
  "VEHICULE",
  "BATEAU",
  "EQUIPEMENT_SCIENTIFIQUE",
  "INFORMATIQUE",
  "CAMPING_TERRAIN",
  "LABORATOIRE",
];

const categoryLabels: Record<string, string> = {
  VEHICULE: "Véhicule",
  BATEAU: "Bateau",
  EQUIPEMENT_SCIENTIFIQUE: "Équipement Scientifique",
  INFORMATIQUE: "Informatique",
  CAMPING_TERRAIN: "Camping & Terrain",
  LABORATOIRE: "Laboratoire",
};

export default function NewEquipmentPage() {
  const router = useRouter();
  const { handleApiCall } = useApi();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "EQUIPEMENT_SCIENTIFIQUE",
    serialNumber: "",
    purchaseDate: "",
    purchasePrice: "",
    lifespan: "",
    location: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await handleApiCall(
      () =>
        fetch("/api/equipment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }),
      {
        successMessage: "Équipement créé avec succès!",
        redirect: "/dashboard/equipment",
      }
    );

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/equipment">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Nouvel équipement
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Ajouter un nouvel équipement à l&apos;inventaire
          </p>
        </div>
      </div>

      <Card variant="elevated" className="max-w-4xl">
        <CardHeader>
          <CardTitle>Informations de l&apos;équipement</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour créer un nouvel équipement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" required>
                Nom
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Microscope électronique"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" required>
                Catégorie
              </Label>
              <Select
                id="category"
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Numéro de série</Label>
                <Input
                  id="serialNumber"
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, serialNumber: e.target.value })
                  }
                  placeholder="Ex: SN-2024-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Ex: Laboratoire principal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Date d&apos;achat</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Prix d&apos;achat (MAD)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, purchasePrice: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lifespan">Durée de vie (années)</Label>
                <Input
                  id="lifespan"
                  type="number"
                  value={formData.lifespan}
                  onChange={(e) =>
                    setFormData({ ...formData, lifespan: e.target.value })
                  }
                  placeholder="Ex: 5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description détaillée de l'équipement..."
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Création en cours..." : "Créer l&apos;équipement"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

