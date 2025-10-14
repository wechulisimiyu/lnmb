/**
 * Next.js Instrumentation
 * This file is loaded before your application starts.
 * Used to initialize Sentry and other monitoring tools.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
