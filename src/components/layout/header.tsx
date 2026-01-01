/**
 * @file header.tsx
 * @description src/components/layout/header.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 83
 * @size 3.56 KB
 */
"use client";

import { memo } from "react";
import { useSession } from "next-auth/react";
import { Bell, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

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

function HeaderComponent() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-card border-b border-border px-4 lg:px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground placeholder:text-muted-foreground transition-colors duration-200 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 ease-in-out rounded-md focus-ring"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>
          <button 
            className="p-2 text-muted-foreground hover:text-foreground relative transition-colors duration-200 ease-in-out rounded-md focus-ring"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
          </button>
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">
                {session?.user?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.role && roleLabels[session.user.role]}
              </p>
            </div>
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm lg:text-base ring-2 ring-primary/50 dark:ring-primary-foreground/50">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export const Header = memo(HeaderComponent);

