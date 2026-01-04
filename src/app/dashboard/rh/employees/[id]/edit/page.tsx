/**
 * @file page.tsx
 * @description src/app/dashboard/rh/employees/[id]/edit/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 218
 * @size 6.54 KB
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const contractTypes = ["CDI", "CDD", "STAGE", "CONSULTANT"];

const contractTypeLabels: Record<string, string> = {
  CDI: "CDI",
  CDD: "CDD",
  STAGE: "Stage",
  CONSULTANT: "Consultant",
};

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    employeeNumber: "",
    hireDate: "",
    contractType: "CDI",
    contractStart: "",
    contractEnd: "",
    baseSalary: "",
  });

  useEffect(() => {
    fetch(`/api/employees/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setFormData({
          employeeNumber: data.employeeNumber || "",
          hireDate: data.hireDate
            ? new Date(data.hireDate).toISOString().split("T")[0]
            : "",
          contractType: data.contractType || "CDI",
          contractStart: data.contractStart
            ? new Date(data.contractStart).toISOString().split("T")[0]
            : "",
          contractEnd: data.contractEnd
            ? new Date(data.contractEnd).toISOString().split("T")[0]
            : "",
          baseSalary: data.baseSalary?.toString() || "",
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
      const response = await fetch(`/api/employees/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/dashboard/rh/employees/${params.id}`);
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
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/rh/employees/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Modifier l&apos;employé</h1>
            <p className="text-gray-600 mt-2">Mettre à jour les informations de l&apos;employé</p>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro d&apos;employé
              </label>
              <Input
                value={formData.employeeNumber}
                onChange={(e) =>
                  setFormData({ ...formData, employeeNumber: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d&apos;embauche
              </label>
              <Input
                type="date"
                value={formData.hireDate}
                onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de contrat
              </label>
              <Select
                value={formData.contractType}
                onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                required
              >
                {contractTypes.map((type) => (
                  <option key={type} value={type}>
                    {contractTypeLabels[type] || type}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Début du contrat
              </label>
              <Input
                type="date"
                value={formData.contractStart}
                onChange={(e) => setFormData({ ...formData, contractStart: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fin du contrat (optionnel)
              </label>
              <Input
                type="date"
                value={formData.contractEnd}
                onChange={(e) => setFormData({ ...formData, contractEnd: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salaire de base
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.baseSalary}
                onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link href={`/dashboard/rh/employees/${params.id}`}>
              <Button type="button" variant="ghost">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

