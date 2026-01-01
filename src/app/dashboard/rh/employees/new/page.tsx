/**
 * @file page.tsx
 * @description src/app/dashboard/rh/employees/new/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 211
 * @size 7.28 KB
 */
"use client";

import { useState, useEffect } from "react";
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
import { employeeSchema } from "@/lib/validations";
import type { z } from "zod";

type EmployeeFormData = z.infer<typeof employeeSchema>;

export default function NewEmployeePage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      contractType: "CDI",
    },
  });

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => setUsers(data.filter((u: any) => !u.employee)));
  }, []);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/dashboard/rh/employees");
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la création");
      }
    } catch (error) {
      alert("Erreur lors de la création");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/rh/employees">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Nouvel employé
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Créer une fiche employé
          </p>
        </div>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Informations de l&apos;employé</CardTitle>
          <CardDescription>
            Remplissez les informations pour créer une nouvelle fiche employé.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="userId">Utilisateur (optionnel)</Label>
              <Select id="userId" {...register("userId")}>
                <option value="">Sélectionner un utilisateur</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="employeeNumber" required>
                Numéro d&apos;employé
              </Label>
              <Input
                id="employeeNumber"
                {...register("employeeNumber")}
                type="text"
                className={errors.employeeNumber ? "border-destructive" : ""}
                placeholder="Ex: EMP001"
              />
              {errors.employeeNumber && (
                <p className="text-destructive text-sm mt-1.5">
                  {errors.employeeNumber.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="hireDate" required>
                  Date d&apos;embauche
                </Label>
                <Input
                  id="hireDate"
                  {...register("hireDate")}
                  type="date"
                  className={errors.hireDate ? "border-destructive" : ""}
                />
                {errors.hireDate && (
                  <p className="text-destructive text-sm mt-1.5">
                    {errors.hireDate.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="contractType" required>
                  Type de contrat
                </Label>
                <Select
                  id="contractType"
                  {...register("contractType")}
                  className={errors.contractType ? "border-destructive" : ""}
                >
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="STAGE">Stage</option>
                  <option value="CONSULTANT">Consultant</option>
                </Select>
                {errors.contractType && (
                  <p className="text-destructive text-sm mt-1.5">
                    {errors.contractType.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="contractStart" required>
                  Début du contrat
                </Label>
                <Input
                  id="contractStart"
                  {...register("contractStart")}
                  type="date"
                  className={errors.contractStart ? "border-destructive" : ""}
                />
                {errors.contractStart && (
                  <p className="text-destructive text-sm mt-1.5">
                    {errors.contractStart.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="contractEnd">Fin du contrat (si CDD)</Label>
                <Input id="contractEnd" {...register("contractEnd")} type="date" />
              </div>
            </div>

            <div>
              <Label htmlFor="baseSalary" required>
                Salaire de base (MAD)
              </Label>
              <Input
                id="baseSalary"
                {...register("baseSalary")}
                type="number"
                step="0.01"
                className={errors.baseSalary ? "border-destructive" : ""}
                placeholder="0.00"
              />
              {errors.baseSalary && (
                <p className="text-destructive text-sm mt-1.5">
                  {errors.baseSalary.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-border pt-6 mt-6">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer l&apos;employé"}
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

