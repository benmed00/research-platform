/**
 * @file use-api.ts
 * @description src/hooks/use-api.ts
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 69
 * @size 1.64 KB
 */
"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

interface ApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  successMessage?: string;
  errorMessage?: string;
  redirect?: string;
}

export function useApi() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleApiCall = async (
    apiCall: () => Promise<Response>,
    options: ApiOptions = {}
  ) => {
    const {
      onSuccess,
      onError,
      successMessage = "Opération réussie",
      errorMessage = "Une erreur est survenue",
      redirect,
    } = options;

    try {
      const response = await apiCall();

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        showToast(successMessage, "success");
        onSuccess?.(data);
        if (redirect) {
          router.push(redirect);
        }
        return { success: true, data };
      } else {
        const error = await response.json().catch(() => ({ error: errorMessage }));
        const errorMsg = error.error || errorMessage;
        showToast(errorMsg, "error");
        onError?.(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error: any) {
      const errorMsg = error.message || errorMessage;
      showToast(errorMsg, "error");
      onError?.(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  return { handleApiCall, showToast, router };
}

