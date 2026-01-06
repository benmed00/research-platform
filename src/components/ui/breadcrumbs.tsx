/**
 * @file breadcrumbs.tsx
 * @description Breadcrumb navigation component
 * @author 1
 * @created 2026-01-05
 * @updated 2026-01-05
 * @updates 1
 * @lines 80
 * @size 2.5 KB
 */
"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      className={cn("flex items-center space-x-2 text-sm", className)}
      aria-label="Breadcrumb"
    >
      <Link
        href="/dashboard"
        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
            {isLast ? (
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href || "#"}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
