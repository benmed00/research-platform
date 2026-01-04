/**
 * @file page.tsx
 * @description src/app/dashboard/finance/budgets/new/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 2
 * @lines 343
 * @size 11.48 KB
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
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

const expenseCategories = [
  "SALAIRES",
  "EQUIPEMENT",
  "MATERIEL",
  "TRANSPORT",
  "MISSION",
  "MAINTENANCE",
  "FOURNITURES",
  "SERVICES",
  "FORMATION",
  "PUBLICATION",
  "AUTRE",
];

const categoryLabels: Record<string, string> = {
  SALAIRES: "Salaires",
  EQUIPEMENT: "Équipement",
  MATERIEL: "Matériel",
  TRANSPORT: "Transport",
  MISSION: "Mission",
  MAINTENANCE: "Maintenance",
  FOURNITURES: "Fournitures",
  SERVICES: "Services",
  FORMATION: "Formation",
  PUBLICATION: "Publication",
  AUTRE: "Autre",
};

interface Allocation {
  category: string;
  amount: string;
  description: string;
}

export default function NewBudgetPage() {
  const router = useRouter();
  const { handleApiCall } = useApi();
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    year: currentYear.toString(),
    totalAmount: "",
    description: "",
  });
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  const addAllocation = () => {
    setAllocations([
      ...allocations,
      { category: "AUTRE", amount: "", description: "" },
    ]);
  };

  const removeAllocation = (index: number) => {
    setAllocations(allocations.filter((_, i) => i !== index));
  };

  const updateAllocation = (index: number, field: keyof Allocation, value: string) => {
    const updated = [...allocations];
    updated[index] = { ...updated[index], [field]: value };
    setAllocations(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Calculate total allocations amount
    const allocationsTotal = allocations.reduce(
      (sum, alloc) => sum + (parseFloat(alloc.amount) || 0),
      0
    );

    // Validate that allocations don't exceed total amount
    if (allocations.length > 0 && allocationsTotal > parseFloat(formData.totalAmount || "0")) {
      alert(
        `Le total des allocations (${allocationsTotal.toFixed(2)} MAD) dépasse le montant total du budget (${formData.totalAmount} MAD)`
      );
      setLoading(false);
      return;
    }

    await handleApiCall(
      () =>
        fetch("/api/budgets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year: formData.year,
            totalAmount: formData.totalAmount,
            description: formData.description || undefined,
            allocations:
              allocations.length > 0
                ? allocations.map((alloc) => ({
                    category: alloc.category,
                    amount: alloc.amount,
                    description: alloc.description || undefined,
                  }))
                : undefined,
          }),
        }),
      {
        successMessage: "Budget créé avec succès!",
        redirect: "/dashboard/finance",
      }
    );

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/finance">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Nouveau budget
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Créer un nouveau budget annuel
          </p>
        </div>
      </div>

      <Card variant="elevated" className="max-w-4xl">
        <CardHeader>
          <CardTitle>Informations du budget</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour créer un nouveau budget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="year" required>
                  Année
                </Label>
                <Input
                  id="year"
                  type="number"
                  required
                  min="2020"
                  max="2100"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  placeholder={currentYear.toString()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalAmount" required>
                  Montant total (MAD)
                </Label>
                <Input
                  id="totalAmount"
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  value={formData.totalAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, totalAmount: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description du budget..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allocations par catégorie (optionnel)</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Répartissez le budget par catégorie de dépenses
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAllocation}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              {allocations.length > 0 && (
                <div className="space-y-3">
                  {allocations.map((allocation, index) => {
                    const allocationsTotal = allocations.reduce(
                      (sum, alloc) => sum + (parseFloat(alloc.amount) || 0),
                      0
                    );
                    const remaining =
                      parseFloat(formData.totalAmount || "0") - allocationsTotal;
                    return (
                      <div
                        key={index}
                        className="p-4 border border-border rounded-lg space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Allocation #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAllocation(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <Label>Catégorie</Label>
                            <Select
                              value={allocation.category}
                              onChange={(e) =>
                                updateAllocation(index, "category", e.target.value)
                              }
                            >
                              {expenseCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {categoryLabels[cat] || cat}
                                </option>
                              ))}
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Montant (MAD)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={allocation.amount}
                              onChange={(e) =>
                                updateAllocation(index, "amount", e.target.value)
                              }
                              placeholder="0.00"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description (optionnel)</Label>
                            <Input
                              type="text"
                              value={allocation.description}
                              onChange={(e) =>
                                updateAllocation(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Description..."
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {formData.totalAmount && (
                    <div className="text-sm text-muted-foreground pt-2 border-t border-border">
                      Total alloué:{" "}
                      {allocations
                        .reduce(
                          (sum, alloc) => sum + (parseFloat(alloc.amount) || 0),
                          0
                        )
                        .toFixed(2)}{" "}
                      MAD / {parseFloat(formData.totalAmount).toFixed(2)} MAD
                    </div>
                  )}
                </div>
              )}
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
                {loading ? "Création..." : "Créer le budget"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

