/**
 * @file page.tsx
 * @description src/app/dashboard/users/new/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 224
 * @size 7.06 KB
 */
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/use-api";
import { userSchema } from "@/lib/validations";
import type { z } from "zod";

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

type UserFormData = z.infer<typeof userSchema>;

export default function NewUserPage() {
  const router = useRouter();
  const { handleApiCall } = useApi();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "BOTANISTE",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    await handleApiCall(
      () =>
        fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
      {
        successMessage: "Utilisateur créé avec succès!",
        redirect: "/dashboard/users",
      }
    );
  };

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
            Nouvel utilisateur
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Créer un nouveau compte utilisateur
          </p>
        </div>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Informations de l&apos;utilisateur</CardTitle>
          <CardDescription>
            Remplissez les informations pour créer un nouveau compte utilisateur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" required>
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  type="text"
                  className={errors.firstName ? "border-destructive" : ""}
                />
                {errors.firstName && (
                  <p className="text-destructive text-sm mt-1.5">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" required>
                  Nom
                </Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  type="text"
                  className={errors.lastName ? "border-destructive" : ""}
                />
                {errors.lastName && (
                  <p className="text-destructive text-sm mt-1.5">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email" required>
                Email
              </Label>
              <Input
                id="email"
                {...register("email")}
                type="email"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" required>
                Mot de passe
              </Label>
              <Input
                id="password"
                {...register("password")}
                type="password"
                autoComplete="new-password"
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-destructive text-sm mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="role" required>
                Rôle
              </Label>
              <Select
                id="role"
                {...register("role")}
                className={errors.role ? "border-destructive" : ""}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </Select>
              {errors.role && (
                <p className="text-destructive text-sm mt-1.5">{errors.role.message}</p>
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-border pt-6 mt-6">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer l&apos;utilisateur"}
              </Button>
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

