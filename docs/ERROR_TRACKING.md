# Error Tracking with Sentry

## Overview

This project uses **Sentry** for error tracking and monitoring. Sentry automatically captures errors, exceptions, and performance issues across the application.

## Configuration

Sentry is configured in three files:
- `sentry.client.config.ts` - Client-side configuration
- `sentry.server.config.ts` - Server-side configuration
- `sentry.edge.config.ts` - Edge runtime configuration

## Environment Variables

Add these to your `.env` file:

```env
# Sentry Configuration
SENTRY_DSN=your-sentry-dsn-here
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

**Note**: Sentry will only be active if `SENTRY_DSN` or `NEXT_PUBLIC_SENTRY_DSN` is configured. The application will work normally without it.

## Features

### Automatic Error Capture

- **Client-side errors**: Automatically captured from React components
- **Server-side errors**: Captured from API routes and server components
- **Edge runtime errors**: Captured from edge functions

### Error Context

Errors are automatically enriched with:
- User information (when available)
- Request context (route, method)
- Stack traces
- Environment information

### Integration with Logger

The logger helper `apiError` automatically sends errors to Sentry:

```typescript
import { loggerHelpers } from "@/lib/logger";

try {
  // ... code
} catch (error) {
  loggerHelpers.apiError(error as Error, {
    route: "/api/users",
    method: "POST",
    userId: session.user.id,
  });
}
```

## Usage

### Manual Error Reporting

```typescript
import * as Sentry from "@sentry/nextjs";

// Capture exception
Sentry.captureException(error);

// Capture message
Sentry.captureMessage("Something went wrong", "error");

// Set user context
Sentry.setUser({ id: user.id, email: user.email });

// Add breadcrumbs
Sentry.addBreadcrumb({
  category: "auth",
  message: "User logged in",
  level: "info",
});
```

### Error Boundaries

The `error.tsx` file automatically captures errors:

```typescript
// src/app/error.tsx
useEffect(() => {
  Sentry.captureException(error);
}, [error]);
```

## Performance Monitoring

Sentry automatically tracks:
- Page load times
- API route performance
- Database query performance (with Prisma integration)

## Source Maps

Source maps are automatically uploaded during build when Sentry is configured. This provides readable stack traces in production.

## Best Practices

1. **Use loggerHelpers.apiError()** - Automatically logs and sends to Sentry
2. **Include context** - Always provide route, method, userId when available
3. **Don't log sensitive data** - Sentry will capture it
4. **Use appropriate log levels** - Errors go to Sentry, warnings/info don't
5. **Test error tracking** - Verify errors appear in Sentry dashboard

## Testing

To test error tracking:

1. Configure Sentry DSN in `.env`
2. Trigger an error in development
3. Check Sentry dashboard for the error

## Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Dashboard](https://sentry.io)

