/**
 * @file page.tsx
 * @description src/app/dashboard/environment/water/new/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 192
 * @size 5.96 KB
 */
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { waterQualitySchema } from "@/lib/validations";
import type { z } from "zod";

type WaterQualityFormData = z.infer<typeof waterQualitySchema>;

const waterTypes = ["MER", "SOURCE", "BARRAGE"];

const waterTypeLabels: Record<string, string> = {
  MER: "Mer",
  SOURCE: "Source",
  BARRAGE: "Barrage",
};

export default function NewWaterQualityPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WaterQualityFormData>({
    resolver: zodResolver(waterQualitySchema),
    defaultValues: {
      type: "MER",
    },
  });

  const onSubmit = async (data: WaterQualityFormData) => {
    try {
      const response = await fetch("/api/water-quality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/dashboard/environment");
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la création");
      }
    } catch (error) {
      alert("Erreur lors de la création");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nouvelle mesure de qualité de l&apos;eau</h1>
        <p className="text-gray-600 mt-2">Enregistrer une nouvelle mesure</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d&apos;eau *
              </label>
              <select
                {...register("type")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {waterTypes.map((type) => (
                  <option key={type} value={type}>
                    {waterTypeLabels[type]}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localisation *
              </label>
              <Input
                {...register("location")}
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <Input {...register("latitude")} type="number" step="any" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <Input {...register("longitude")} type="number" step="any" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <Input
                {...register("date")}
                type="datetime-local"
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                pH
              </label>
              <Input {...register("ph")} type="number" step="0.1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Température (°C)
              </label>
              <Input {...register("temperature")} type="number" step="0.1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oxygène dissous (mg/L)
              </label>
              <Input {...register("dissolvedO2")} type="number" step="0.1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Turbidité (NTU)
              </label>
              <Input {...register("turbidity")} type="number" step="0.1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salinité (PSU)
              </label>
              <Input {...register("salinity")} type="number" step="0.1" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <Textarea {...register("notes")} rows={4} />
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Annuler
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

