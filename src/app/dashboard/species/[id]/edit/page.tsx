/**
 * @file page.tsx
 * @description src/app/dashboard/species/[id]/edit/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 242
 * @size 7.32 KB
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

export default function EditSpeciesPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    scientificName: "",
    commonName: "",
    type: "FLORE_TERRESTRE",
    iucnStatus: "",
    habitat: "",
    description: "",
  });

  useEffect(() => {
    fetch(`/api/species/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setFormData({
          scientificName: data.scientificName || "",
          commonName: data.commonName || "",
          type: data.type || "FLORE_TERRESTRE",
          iucnStatus: data.iucnStatus || "",
          habitat: data.habitat || "",
          description: data.description || "",
        });
        setLoading(false);
      })
      .catch(() => {
        alert("Erreur lors du chargement");
        router.back();
      });
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/species/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/dashboard/species/${params.id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Modifier l&apos;espèce</h1>
        <p className="text-gray-600 mt-2">
          Modifier les informations de l&apos;espèce
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom scientifique *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.scientificName}
              onChange={(e) =>
                setFormData({ ...formData, scientificName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom commun
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.commonName}
              onChange={(e) =>
                setFormData({ ...formData, commonName: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut UICN
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habitat
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.habitat}
              onChange={(e) =>
                setFormData({ ...formData, habitat: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
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
      </Card>
    </div>
  );
}

