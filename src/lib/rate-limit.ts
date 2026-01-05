/**
 * @file rate-limit.ts
 * @description Rate limiting utility for API routes
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 120
 * @size 3.2 KB
 */
import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  limit: number; // Maximum number of requests
  window: number; // Time window in seconds
  identifier?: string; // Custom identifier (defaults to IP)
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp when the limit resets
  retryAfter?: number; // Seconds until retry is allowed
}

// In-memory store for rate limiting (development)
// In production, consider using Redis or Upstash
class RateLimitStore {
  private store: Map<string, { count: number; resetTime: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.store.entries()) {
        if (value.resetTime < now) {
          this.store.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  get(key: string): { count: number; resetTime: number } | undefined {
    return this.store.get(key);
  }

  set(key: string, count: number, resetTime: number): void {
    this.store.set(key, { count, resetTime });
  }

  increment(key: string, resetTime: number): number {
    const current = this.get(key);
    if (!current || current.resetTime < Date.now()) {
      this.set(key, 1, resetTime);
      return 1;
    }
    const newCount = current.count + 1;
    this.set(key, newCount, resetTime);
    return newCount;
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Global rate limit store instance
const rateLimitStore = new RateLimitStore();

/**
 * Get identifier for rate limiting (IP address or custom)
 */
function getIdentifier(request: NextRequest, config?: RateLimitConfig): string {
  if (config?.identifier) {
    return config.identifier;
  }

  // Get IP address from headers (works with proxies)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";
  return ip;
}

/**
 * Rate limit middleware
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const identifier = getIdentifier(request, config);
  const now = Date.now();
  const resetTime = now + config.window * 1000;
  const key = `${identifier}:${config.limit}:${config.window}`;

  const count = rateLimitStore.increment(key, resetTime);
  const remaining = Math.max(0, config.limit - count);
  const success = count <= config.limit;

  return {
    success,
    limit: config.limit,
    remaining,
    reset: Math.floor(resetTime / 1000),
    retryAfter: success ? undefined : Math.ceil((resetTime - now) / 1000),
  };
}

/**
 * Rate limit response helper
 */
export function rateLimitResponse(result: RateLimitResult): NextResponse {
  const response = NextResponse.json(
    {
      error: "Trop de requêtes. Veuillez réessayer plus tard.",
      retryAfter: result.retryAfter,
    },
    { status: 429 }
  );

  // Add rate limit headers
  response.headers.set("X-RateLimit-Limit", result.limit.toString());
  response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
  response.headers.set("X-RateLimit-Reset", result.reset.toString());
  if (result.retryAfter) {
    response.headers.set("Retry-After", result.retryAfter.toString());
  }

  return response;
}

/**
 * Predefined rate limit configurations
 */
export const rateLimitConfigs = {
  // Login endpoint: 5 attempts per 15 minutes
  login: {
    limit: 5,
    window: 15 * 60, // 15 minutes
  },
  // API routes: 100 requests per minute
  api: {
    limit: 100,
    window: 60, // 1 minute
  },
  // File upload: 10 uploads per hour
  upload: {
    limit: 10,
    window: 60 * 60, // 1 hour
  },
  // Strict: 10 requests per minute (for sensitive operations)
  strict: {
    limit: 10,
    window: 60, // 1 minute
  },
};

/**
 * Rate limit wrapper for API routes
 */
export async function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const result = await rateLimit(request, config);

  if (!result.success) {
    return rateLimitResponse(result);
  }

  const response = await handler();

  // Add rate limit headers to successful responses
  response.headers.set("X-RateLimit-Limit", result.limit.toString());
  response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
  response.headers.set("X-RateLimit-Reset", result.reset.toString());

  return response;
}

