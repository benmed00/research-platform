/**
 * @file route.ts
 * @description src/app/api/auth/[...nextauth]/route.ts
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 25
 * @size 0.8 KB
 */
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, rateLimitResponse, rateLimitConfigs } from "@/lib/rate-limit";

const handler = NextAuth(authOptions);

// Wrap handlers with rate limiting for login attempts
async function rateLimitedHandler(
  request: NextRequest,
  params: { params: Promise<{ nextauth: string[] }> }
) {
  // Only rate limit POST requests (login attempts) to signin endpoint
  const url = new URL(request.url);
  if (request.method === "POST" && url.pathname.includes("signin")) {
    const result = await rateLimit(request, rateLimitConfigs.login);
    if (!result.success) {
      return rateLimitResponse(result);
    }
  }

  // Call the original handler
  return handler(request, params);
}

export async function GET(
  request: NextRequest,
  params: { params: Promise<{ nextauth: string[] }> }
) {
  return rateLimitedHandler(request, params);
}

export async function POST(
  request: NextRequest,
  params: { params: Promise<{ nextauth: string[] }> }
) {
  return rateLimitedHandler(request, params);
}

