/**
 * @file badge.tsx
 * @description src/components/ui/badge.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 51
 * @size 1.78 KB
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "secondary" | "outline";
  size?: "sm" | "default" | "lg";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium transition-colors",
          {
            // Variants
            "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200": variant === "default",
            "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300": variant === "success",
            "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300": variant === "warning",
            "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300": variant === "error",
            "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300": variant === "info",
            "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100": variant === "secondary",
            "border border-gray-300 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300": variant === "outline",
            // Sizes
            "px-2 py-0.5 text-xs": size === "sm",
            "px-2.5 py-1 text-xs": size === "default",
            "px-3 py-1.5 text-sm": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };

