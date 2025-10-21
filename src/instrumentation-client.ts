// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// Defensive shim: some in-app browsers (Instagram WKWebView) don't expose
// window.webkit.messageHandlers immediately. Third-party scripts (Facebook/
// Instagram pixel) may attempt to access it and throw a TypeError. We create
// a minimal, non-invasive no-op shim so those scripts don't crash the page.
if (typeof window !== "undefined") {
  try {
    // Only create a shim when the native bridge is missing
    type WebkitWindow = Window & {
      webkit?: {
        messageHandlers?: Record<
          string,
          { postMessage: (...args: unknown[]) => void }
        >;
      };
    };

    const w = window as unknown as WebkitWindow;
    if (!w.webkit || !w.webkit.messageHandlers) {
      // Keep window.webkit if it exists, otherwise create a minimal object
      // that won't interfere with native bridges that register later.
      // The structure mirrors the expected API: messageHandlers.{handler}.postMessage
      // Each handler is a no-op that accepts any args but does nothing with them.
      w.webkit = w.webkit || {};
      w.webkit.messageHandlers = new Proxy(
        {},
        {
          get: function () {
            // Return a faux handler with a postMessage no-op that consumes args
            return {
              postMessage: (...args: unknown[]) => {
                void args;
              },
            };
          },
        },
      );
    }
  } catch (e) {
    // Swallow any unexpected errors during shim installation to avoid
    // causing additional issues in client runtime.

    console.warn("Failed to install webkit.messageHandlers shim", e);
  }
}

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://e5ad05a1a0341bd4fe3733c2b4f6efab@o4510184047116288.ingest.us.sentry.io/4510184059961344",

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
