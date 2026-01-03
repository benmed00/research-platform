/**
 * @file providers.tsx
 * @description src/components/providers.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 27
 * @size 0.64 KB
 */
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { NotificationProvider } from "@/components/notifications/notification-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={false}>
      <ThemeProvider>
        <ToastProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

