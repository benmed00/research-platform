/**
 * @file page.tsx
 * @description src/app/dashboard/environment/air/new/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 162
 * @size 5.00 KB
 */
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { airQualitySchema } from "@/lib/validations";
import type { z } from "zod";

type AirQualityFormData = z.infer<typeof airQualitySchema>;

export default function NewAirQualityPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AirQualityFormData>({
    resolver: zodResolver(airQualitySchema),
  });

  const onSubmit = async (data: AirQualityFormData) => {
    try {
      const response = await fetch("/api/air-quality", {
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
        <h1 className="text-3xl font-bold text-gray-900">Nouvelle mesure de qualité de l&apos;air</h1>
        <p className="text-gray-600 mt-2">Enregistrer une nouvelle mesure</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                PM2.5 (µg/m³)
              </label>
              <Input {...register("pm25")} type="number" step="0.1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PM10 (µg/m³)
              </label>
              <Input {...register("pm10")} type="number" step="0.1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NO₂ (µg/m³)
              </label>
              <Input {...register("no2")} type="number" step="0.1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O₃ (µg/m³)
              </label>
              <Input {...register("o3")} type="number" step="0.1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CO (mg/m³)
              </label>
              <Input {...register("co")} type="number" step="0.1" />
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

