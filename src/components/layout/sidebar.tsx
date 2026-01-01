/**
 * @file sidebar.tsx
 * @description src/components/layout/sidebar.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 167
 * @size 4.65 KB
 */
"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Package,
  MapPin,
  Database,
  Cloud,
  Map,
  FileText,
  BookOpen,
  LogOut,
  Menu,
  X,
  Calendar,
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Utilisateurs",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Ressources Humaines",
    href: "/dashboard/rh",
    icon: Users,
  },
  {
    title: "Comptabilité",
    href: "/dashboard/finance",
    icon: DollarSign,
  },
  {
    title: "Matériel & Logistique",
    href: "/dashboard/equipment",
    icon: Package,
  },
  {
    title: "Missions",
    href: "/dashboard/missions",
    icon: MapPin,
  },
  {
    title: "Espèces",
    href: "/dashboard/species",
    icon: Database,
  },
  {
    title: "Données Environnementales",
    href: "/dashboard/environment",
    icon: Cloud,
  },
  {
    title: "Cartographie",
    href: "/dashboard/maps",
    icon: Map,
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
  },
  {
    title: "Publications",
    href: "/dashboard/publications",
    icon: BookOpen,
  },
  {
    title: "Calendrier",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
];

function SidebarComponent() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-gray-900 dark:bg-gray-950 text-white rounded-lg shadow-lg hover:bg-gray-800 dark:hover:bg-gray-900 transition-opacity duration-200 focus-ring"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static w-64 bg-gray-900 dark:bg-gray-950 text-white min-h-screen flex flex-col z-40 transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
      <div className="p-6 border-b border-gray-800 dark:border-gray-800">
        <h1 className="text-xl font-bold text-white">Plateforme Recherche</h1>
        <p className="text-sm text-gray-400 dark:text-gray-400 mt-1.5">Centre Environnemental</p>
      </div>
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileMenu}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 font-medium text-sm",
                isActive
                  ? "bg-primary-600 dark:bg-primary-700 text-white shadow-md"
                  : "text-gray-300 dark:text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800 dark:border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-300 dark:text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-800 hover:text-white w-full transition-colors duration-200 font-medium text-sm focus-ring"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Déconnexion</span>
        </button>
      </div>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMobileMenu}
        />
      )}
      </div>
    </>
  );
}

export const Sidebar = memo(SidebarComponent);

