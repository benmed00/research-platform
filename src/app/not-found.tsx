/**
 * @file not-found.tsx
 * @description src/app/not-found.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 37
 * @size 1.39 KB
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Card variant="elevated" className="max-w-md w-full p-8">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
              <FileQuestion className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Page non trouvée
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

