/**
 * @file page.tsx
 * @description src/app/dashboard/species/new/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 225
 * @size 7.12 KB
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

const types = [
  "FLORE_TERRESTRE",
  "FAUNE_TERRESTRE",
  "FAUNE_MARINE",
  "ESPECE_EAU_DOUCE",
];

const typeLabels: Record<string, string> = {
  FLORE_TERRESTRE: "Flore Terrestre",
  FAUNE_TERRESTRE: "Faune Terrestre",
  FAUNE_MARINE: "Faune Marine",
  ESPECE_EAU_DOUCE: "Espèce Eau Douce",
};

const iucnStatuses = ["LC", "NT", "VU", "EN", "CR", "EW", "EX", "DD", "NE"];

const iucnLabels: Record<string, string> = {
  LC: "Préoccupation mineure",
  NT: "Quasi menacé",
  VU: "Vulnérable",
  EN: "En danger",
  CR: "En danger critique",
  EW: "Éteint à l&apos;état sauvage",
  EX: "Éteint",
  DD: "Données insuffisantes",
  NE: "Non évalué",
};

export default function NewSpeciesPage() {
  const router = useRouter();
  const { handleApiCall } = useApi();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    scientificName: "",
    commonName: "",
    type: "FLORE_TERRESTRE",
    iucnStatus: "",
    habitat: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await handleApiCall(
      () =>
        fetch("/api/species", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }),
      {
        successMessage: "Espèce créée avec succès!",
        redirect: "/dashboard/species",
      }
    );

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/species">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Nouvelle espèce
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Ajouter une nouvelle espèce au catalogue
          </p>
        </div>
      </div>

      <Card variant="elevated" className="max-w-4xl">
        <CardHeader>
          <CardTitle>Informations de l&apos;espèce</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour créer une nouvelle espèce
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="scientificName" required>
                Nom scientifique
              </Label>
              <Input
                id="scientificName"
                type="text"
                required
                value={formData.scientificName}
                onChange={(e) =>
                  setFormData({ ...formData, scientificName: e.target.value })
                }
                placeholder="Ex: Quercus suber"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commonName">Nom commun</Label>
              <Input
                id="commonName"
                type="text"
                value={formData.commonName}
                onChange={(e) =>
                  setFormData({ ...formData, commonName: e.target.value })
                }
                placeholder="Ex: Chêne-liège"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type" required>Type</Label>
                <Select
                  id="type"
                  required
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {typeLabels[type]}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="iucnStatus">Statut UICN</Label>
                <Select
                  id="iucnStatus"
                  value={formData.iucnStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, iucnStatus: e.target.value })
                  }
                >
                  <option value="">Non spécifié</option>
                  {iucnStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status} - {iucnLabels[status]}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="habitat">Habitat</Label>
              <Input
                id="habitat"
                type="text"
                value={formData.habitat}
                onChange={(e) =>
                  setFormData({ ...formData, habitat: e.target.value })
                }
                placeholder="Ex: Forêts méditerranéennes, zones côtières"
              />
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
                placeholder="Description de l&apos;espèce, caractéristiques, etc."
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
                {loading ? "Création en cours..." : "Créer l&apos;espèce"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

