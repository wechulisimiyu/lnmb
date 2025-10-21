# Sentry Integration for LNMB

This document explains how Sentry has been integrated into the LNMB Next.js application for error tracking and monitoring.

## Overview

Sentry has been configured to provide:

- **Error tracking**: Automatic capture of exceptions and errors
- **Performance monitoring**: Tracking of API calls, UI interactions, and function execution
- **Structured logging**: Centralized logs with context and metadata
- **Session replay**: Optional recording of user sessions (configured but can be adjusted)

## Configuration Files

### Client-Side (`sentry.client.config.ts`)

Runs in the browser and tracks:

- Client-side errors
- UI interactions
- Browser performance

### Server-Side (`sentry.server.config.ts`)

Runs on the Node.js server and tracks:

- API route errors
- Server-side rendering errors
- Backend operations

### Edge Runtime (`sentry.edge.config.ts`)

Runs on Vercel Edge Functions and tracks:

- Edge function errors
- Middleware errors

### Instrumentation (`instrumentation.ts`)

Loads Sentry before the application starts, ensuring all errors are captured from the beginning.

## Environment Variables

The DSN (Data Source Name) is already configured in the code:

```
dsn: "https://e5ad05a1a0341bd4fe3733c2b4f6efab@o4510184047116288.ingest.us.sentry.io/4510184059961344"
```

### Optional Configuration

You can customize Sentry behavior with these environment variables:

- `SENTRY_ENVIRONMENT`: Set the environment (e.g., "production", "staging", "development")
- `SENTRY_RELEASE`: Set the release version for tracking

## Usage Examples

### Capturing Exceptions

```typescript
import * as Sentry from "@sentry/nextjs";

try {
  // Your code here
  riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      component: "payment",
      operation: "process",
    },
    extra: {
      orderReference: "ORD123",
      amount: 1000,
    },
  });
}
```

### Performance Tracing

```typescript
import * as Sentry from "@sentry/nextjs";

function handleCheckout() {
  return Sentry.startSpan(
    {
      op: "ui.action",
      name: "Checkout Process",
    },
    async (span) => {
      span.setAttribute("orderAmount", 1000);

      // Your checkout logic here
      await processPayment();

      span.setAttribute("success", true);
    },
  );
}
```

### Structured Logging

```typescript
import * as Sentry from "@sentry/nextjs";

const { logger } = Sentry;

// Info log
logger.info("Payment processed successfully", {
  orderReference: "ORD123",
  amount: 1000,
});

// Warning log
logger.warn(logger.fmt`Rate limit approaching for user: ${userId}`, {
  userId,
  currentRate: 95,
});

// Error log
logger.error("Payment processing failed", {
  error: error.message,
  orderReference: "ORD123",
});
```

## Implementation Details

### Webhook Error Handling

Both webhook endpoints (`/api/payment/callback` and `/api/pgw-webhook-4365c21f`) have been updated to:

1. **Capture exceptions with Sentry**

   ```typescript
   Sentry.captureException(error, {
     tags: { endpoint: "/api/pgw-webhook-4365c21f" },
   });
   ```

2. **Return 200 status even on errors**
   - Prevents Jenga from retrying failed webhooks
   - Logs errors for investigation without disrupting payment flow

3. **Use structured logging**
   - All logs include context (orderReference, status, etc.)
   - Sensitive data is sanitized before logging

### Payment Security Logger Integration

The `PaymentSecurityLogger` class has been enhanced to use Sentry:

```typescript
// Logs security events with Sentry
PaymentSecurityLogger.logSecurityEvent("CALLBACK_RECEIVED", {
  orderReference: "ORD123",
  status: "paid",
});

// Captures security errors as Sentry exceptions
PaymentSecurityLogger.logSecurityError("AUTH_FAILED", {
  reason: "Invalid signature",
});
```

### Checkout Flow Tracing

The checkout page tracks:

- Payment processing operations
- Form submissions to Jenga PGW
- Success/failure metrics

## Testing

A comprehensive test suite has been added at:
`src/app/api/pgw-webhook-4365c21f/__tests__/webhook.test.ts`

These tests simulate:

- Valid webhook payloads from production
- Invalid/tampered payloads
- Different payment statuses (paid, pending, failed)
- Hash verification
- Idempotency checks

Run tests with:

```bash
npm test
```

## Monitoring in Production

When `NODE_ENV=production`, Sentry will:

- Capture errors automatically
- Track performance metrics
- Send logs to the Sentry dashboard

In development, Sentry is disabled to avoid noise, but you can enable it by removing the `enabled` check in the config files.

## Best Practices

1. **Always add context to errors**

   ```typescript
   Sentry.captureException(error, {
     tags: { component: "payment" },
     extra: { orderReference: "ORD123" },
   });
   ```

2. **Use structured logging**

   ```typescript
   logger.info("Action completed", { metric: value });
   ```

3. **Sanitize sensitive data**
   - Never log passwords, API keys, or full card numbers
   - The `PaymentSecurityLogger` already sanitizes common sensitive fields

4. **Set appropriate sample rates**
   - Adjust `tracesSampleRate` in production to control costs
   - Current setting: 100% (suitable for low-traffic applications)

## Troubleshooting

### Sentry not capturing errors in development

- Check that `enabled: process.env.NODE_ENV === "production"` is set appropriately
- For testing, temporarily set `enabled: true`

### Missing source maps

- Ensure `hideSourceMaps: true` is set in `next.config.ts`
- Check that build process completes successfully

### Too many events

- Reduce `tracesSampleRate` in the config files
- Adjust `replaysSessionSampleRate` to sample fewer sessions

## Additional Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Error Tracking Best Practices](https://docs.sentry.io/platforms/javascript/best-practices/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
