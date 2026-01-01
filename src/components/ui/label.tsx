/**
 * @file label.tsx
 * @description src/components/ui/label.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 32
 * @size 0.73 KB
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-tight",
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="text-red-500 dark:text-red-400 ml-1">*</span>
        )}
      </label>
    );
  }
);
Label.displayName = "Label";

export { Label };

