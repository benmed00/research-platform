# Logging Guidelines

## Overview

This project uses **Pino** for structured logging. All logging should use the logger utility instead of `console.*` methods.

## Logger Setup

The logger is configured in `src/lib/logger.ts` and automatically:
- Uses pretty formatting in development
- Uses JSON formatting in production
- Sets appropriate log levels based on environment

## Usage

### Basic Logging

```typescript
import { log } from "@/lib/logger";

// Error logging
log.error("Something went wrong");
log.error({ userId: "123", action: "create" }, "Failed to create user");

// Warning logging
log.warn("Rate limit approaching");
log.warn({ limit: 100, remaining: 10 }, "Rate limit warning");

// Info logging
log.info("User logged in");
log.info({ userId: "123", email: "user@example.com" }, "Authentication successful");

// Debug logging (only in development)
log.debug("Processing request");
log.debug({ route: "/api/users", method: "GET" }, "Request details");
```

### Helper Functions

For common patterns, use the helper functions:

```typescript
import { loggerHelpers } from "@/lib/logger";

// API errors
try {
  // ... code
} catch (error) {
  loggerHelpers.apiError(error as Error, {
    route: "/api/users",
    method: "POST",
    userId: session.user.id,
  });
}

// Authentication events
loggerHelpers.authEvent("login", {
  userId: user.id,
  email: user.email,
  success: true,
});

// Database operations
loggerHelpers.dbOperation("create", {
  entity: "User",
  entityId: user.id,
});

// Rate limiting
loggerHelpers.rateLimit({
  identifier: "127.0.0.1",
  limit: 100,
  remaining: 0,
});
```

## Log Levels

- **error**: Critical errors that need immediate attention
- **warn**: Warnings that should be monitored
- **info**: General informational messages
- **debug**: Detailed debugging information (development only)
- **trace**: Very detailed tracing (development only)

## Best Practices

1. **Use structured logging** - Always include context objects
2. **Log errors with stack traces** - Use `loggerHelpers.apiError()` for errors
3. **Include relevant context** - userId, route, method, entity, etc.
4. **Don't log sensitive data** - Never log passwords, tokens, or PII
5. **Use appropriate log levels** - Don't use `error` for warnings
6. **Remove console.* calls** - Use the logger instead

## Migration from console.*

Replace:
```typescript
console.error("Error:", error);
```

With:
```typescript
import { loggerHelpers } from "@/lib/logger";
loggerHelpers.apiError(error as Error, { route: "/api/users" });
```

## Environment Configuration

- **Development**: Pretty formatted logs, debug level
- **Production**: JSON logs, info level
- **Log Level**: Set via `LOG_LEVEL` environment variable

## Examples

### API Route Error Handling

```typescript
export async function POST(request: NextRequest) {
  try {
    // ... code
  } catch (error) {
    loggerHelpers.apiError(error as Error, {
      route: "/api/users",
      method: "POST",
    });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

### Authentication Logging

```typescript
loggerHelpers.authEvent("login_success", {
  userId: user.id,
  email: user.email,
});
```

## Resources

- [Pino Documentation](https://getpino.io/)
- [Structured Logging Best Practices](https://www.datadoghq.com/blog/logging-best-practices/)

