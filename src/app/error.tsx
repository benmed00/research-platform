/**
 * @file error.tsx
 * @description src/app/error.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 63
 * @size 1.89 KB
 */
"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Card variant="elevated" className="max-w-md w-full p-8">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Une erreur est survenue
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
            {error.message || "Une erreur inattendue s&apos;est produite"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} size="lg" className="w-full sm:w-auto">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Retour au tableau de bord
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

