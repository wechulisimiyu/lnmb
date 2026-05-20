/**
 * Sentry Client-Side Configuration
 * This configuration runs in the browser
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://e5ad05a1a0341bd4fe3733c2b4f6efab@o4510184047116288.ingest.us.sentry.io/4510184059961344",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Enable experimental features
  _experiments: {
    enableLogs: true,
  },

  // Integrations
  integrations: [
    // Send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Optionally capture errors only in production
  enabled: process.env.NODE_ENV === "production",
});
