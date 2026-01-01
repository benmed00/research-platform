/**
 * @file page.tsx
 * @description src/app/dashboard/finance/expenses/new/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 247
 * @size 7.67 KB
 */
"use client";

import { useState, useEffect } from "react";
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

export default function NewExpensePage() {
  const router = useRouter();
  const { handleApiCall } = useApi();
  const [loading, setLoading] = useState(false);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    category: "AUTRE",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    budgetId: "",
    grantId: "",
    projectId: "",
    invoiceId: "",
  });

  useEffect(() => {
    // Load budgets for dropdown
    fetch("/api/budgets")
      .then((r) => r.json())
      .then((data) => {
        setBudgets(data || []);
      })
      .catch(() => {
        setBudgets([]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await handleApiCall(
      () =>
        fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            budgetId: formData.budgetId || undefined,
            grantId: formData.grantId || undefined,
            projectId: formData.projectId || undefined,
            invoiceId: formData.invoiceId || undefined,
          }),
        }),
      {
        successMessage: "Dépense créée avec succès!",
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
            Nouvelle dépense
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Enregistrer une nouvelle dépense
          </p>
        </div>
      </div>

      <Card variant="elevated" className="max-w-4xl">
        <CardHeader>
          <CardTitle>Informations de la dépense</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour enregistrer une nouvelle dépense
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {expenseCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryLabels[cat] || cat}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" required>
                  Montant (MAD)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" required>
                Description
              </Label>
              <Textarea
                id="description"
                rows={3}
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description détaillée de la dépense..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" required>
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetId">Budget associé</Label>
                <Select
                  id="budgetId"
                  value={formData.budgetId}
                  onChange={(e) =>
                    setFormData({ ...formData, budgetId: e.target.value })
                  }
                >
                  <option value="">Aucun</option>
                  {budgets.map((budget) => (
                    <option key={budget.id} value={budget.id}>
                      Budget {budget.year} - {budget.totalAmount} MAD
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceId">Facture associée (optionnel)</Label>
              <Input
                id="invoiceId"
                type="text"
                value={formData.invoiceId}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceId: e.target.value })
                }
                placeholder="ID de la facture"
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
                {loading ? "Enregistrement..." : "Enregistrer la dépense"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

