/**
 * Sentry Server-Side Configuration
 * This configuration runs on the Node.js server
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

  // Optionally capture errors only in production
  enabled: process.env.NODE_ENV === "production",
});
