/**
 * @file page.tsx
 * @description src/app/dashboard/users/[id]/edit/page.tsx
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/components/ui/toast";
import { SkeletonCard } from "@/components/ui/skeleton";

const roles = [
  "DIRECTEUR_SCIENTIFIQUE",
  "DIRECTEUR_ADMINISTRATIF_FINANCIER",
  "BOTANISTE",
  "ZOOLOGISTE_TERRESTRE",
  "BIOLOGISTE_MARIN",
  "HYDROBIOLOGISTE",
  "GEOLOGUE",
  "CLIMATOLOGUE",
  "DATA_SCIENTIST_SIG",
  "INGENIEUR_PLATEFORMES",
  "TECHNICIEN_LABORATOIRE",
  "TECHNICIEN_TERRAIN",
  "MARIN_PILOTE_BATEAU",
  "LOGISTICIEN",
  "COMMUNICATION_EDITION",
];

const roleLabels: Record<string, string> = {
  DIRECTEUR_SCIENTIFIQUE: "Directeur Scientifique",
  DIRECTEUR_ADMINISTRATIF_FINANCIER: "Directeur Administratif & Financier",
  BOTANISTE: "Botaniste",
  ZOOLOGISTE_TERRESTRE: "Zoologiste Terrestre",
  BIOLOGISTE_MARIN: "Biologiste Marin",
  HYDROBIOLOGISTE: "Hydrobiologiste",
  GEOLOGUE: "Géologue",
  CLIMATOLOGUE: "Climatologue",
  DATA_SCIENTIST_SIG: "Data Scientist / SIG",
  INGENIEUR_PLATEFORMES: "Ingénieur Plateformes",
  TECHNICIEN_LABORATOIRE: "Technicien Laboratoire",
  TECHNICIEN_TERRAIN: "Technicien Terrain",
  MARIN_PILOTE_BATEAU: "Marin / Pilote Bateau",
  LOGISTICIEN: "Logisticien",
  COMMUNICATION_EDITION: "Communication / Édition",
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { handleApiCall } = useApi();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "BOTANISTE",
    isActive: true,
  });

  useEffect(() => {
    fetch(`/api/users/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          showToast(data.error, "error");
          router.back();
          return;
        }
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          password: "", // Don't pre-fill password
          role: data.role || "BOTANISTE",
          isActive: data.isActive !== undefined ? data.isActive : true,
        });
        setLoading(false);
      })
      .catch(() => {
        showToast("Erreur lors du chargement", "error");
        router.back();
      });
  }, [params.id, router, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      showToast("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    // Prepare data (exclude empty password)
    const updateData: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role,
      isActive: formData.isActive,
    };

    // Only include password if provided
    if (formData.password && formData.password.trim() !== "") {
      if (formData.password.length < 8) {
        showToast("Le mot de passe doit contenir au moins 8 caractères", "error");
        return;
      }
      updateData.password = formData.password;
    }

    await handleApiCall(
      () =>
        fetch(`/api/users/${params.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }),
      {
        successMessage: "Utilisateur modifié avec succès!",
        redirect: "/dashboard/users",
      }
    );
  };

  if (loading) {
    return <SkeletonCard count={1} className="h-[400px]" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/users">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Modifier l&apos;utilisateur
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Modifier les informations de l&apos;utilisateur
          </p>
        </div>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Informations de l&apos;utilisateur</CardTitle>
          <CardDescription>
            Modifiez les informations de l&apos;utilisateur. Laissez le mot de passe vide pour ne pas le modifier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" required>
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" required>
                  Nom
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" required>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="password">
                Mot de passe (laisser vide pour ne pas modifier)
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                autoComplete="new-password"
                placeholder="Laissez vide pour ne pas modifier"
              />
            </div>

            <div>
              <Label htmlFor="role" required>
                Rôle
              </Label>
              <Select
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="isActive">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="mr-2"
                />
                Utilisateur actif
              </Label>
            </div>

            <div className="flex items-center gap-4 border-t border-border pt-6 mt-6">
              <Button type="submit">Enregistrer les modifications</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

