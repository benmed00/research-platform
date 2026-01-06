/**
 * @file validation-helpers.ts
 * @description Helper functions for API route validation
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 30
 * @size 0.9 KB
 */
import { z } from "zod";
import { NextResponse } from "next/server";
import { loggerHelpers } from "./logger";

/**
 * Validate request data with Zod schema
 * Returns validated data or error response
 */
export function validateRequest<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  route: string
): { success: true; data: z.infer<T> } | { success: false; response: NextResponse } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      loggerHelpers.apiError(error as Error, {
        route,
        method: "POST",
        validationError: true,
      });
      return {
        success: false,
        response: NextResponse.json(
          {
            error: "Données de validation invalides",
            details: error.errors,
          },
          { status: 400 }
        ),
      };
    }
    throw error;
  }
}

