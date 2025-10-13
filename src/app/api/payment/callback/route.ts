/**
 * DEPRECATED CALLBACK ENDPOINT
 * 
 * This endpoint is maintained for backward compatibility only.
 * New integrations should use the secure webhook endpoint at /api/pgw-webhook-4365c21f
 * 
 * This endpoint redirects to the secure webhook for POST requests
 * and handles GET requests as user redirects only.
 */

import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

const { logger } = Sentry;

function logDeprecationWarning(method: string, data: Record<string, unknown>) {
  const ref =
    (data && (data.orderReference || data.transactionReference)) ||
    "unknown";
  
  logger.warn(logger.fmt`[DEPRECATED] /api/payment/callback ${method} endpoint is deprecated. Use /api/pgw-webhook-4365c21f instead`, {
    method,
    reference: String(ref),
    endpoint: "/api/payment/callback",
  });
}

// Handle Jenga PGW GET callback (redirect after payment)
// GET requests are user redirects - forward them to the secure webhook endpoint
export async function GET(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: "http.server",
      name: "GET /api/payment/callback (deprecated)",
    },
    async () => {
      try {
        const searchParams = request.nextUrl.searchParams;
        
        // Extract payment response parameters from Jenga PGW
        const orderReference = searchParams.get("orderReference");
        const transactionId = searchParams.get("transactionId");

        logDeprecationWarning("GET", { orderReference, transactionId });

        // Build the secure webhook URL with all parameters
        const secureWebhookUrl = new URL(
          "/api/pgw-webhook-4365c21f",
          request.url
        );
        
        // Copy all search parameters to the secure webhook
        searchParams.forEach((value, key) => {
          secureWebhookUrl.searchParams.set(key, value);
        });

        logger.info("Redirecting deprecated GET callback to secure webhook", {
          orderReference,
          transactionId,
          targetUrl: "/api/pgw-webhook-4365c21f",
        });

        // Forward to the secure webhook endpoint
        return NextResponse.redirect(secureWebhookUrl);
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            endpoint: "/api/payment/callback",
            method: "GET",
          },
        });

        logger.error("Error processing deprecated payment callback", {
          error: error instanceof Error ? error.message : "Unknown error",
        });

        // Don't fail the user experience - redirect to result page with error
        const redirectUrl = new URL("/checkout/result", request.url);
        redirectUrl.searchParams.set("status", "error");
        redirectUrl.searchParams.set("message", "Payment processing failed");

        return NextResponse.redirect(redirectUrl);
      }
    }
  );
}

// Handle POST callback - forward to secure webhook endpoint
export async function POST(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: "http.server",
      name: "POST /api/payment/callback (deprecated)",
    },
    async () => {
      try {
        const body = await request.json();

        logDeprecationWarning("POST", body);

        logger.info("Forwarding deprecated POST callback to secure webhook", {
          hasOrderReference: !!body.orderReference,
          hasTransactionId: !!body.transactionId,
        });

        // Forward to the secure webhook endpoint
        const secureWebhookUrl = new URL(
          "/api/pgw-webhook-4365c21f",
          request.url
        );

        const response = await fetch(secureWebhookUrl.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Forwarded-From": "/api/payment/callback",
          },
          body: JSON.stringify(body),
        });

        const responseData = await response.json();

        // Always return 200 to Jenga to acknowledge receipt
        // even if processing fails - this prevents retries
        return NextResponse.json(
          {
            success: true,
            message: "Callback forwarded to secure webhook",
            ...responseData,
          },
          { status: 200 }
        );
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            endpoint: "/api/payment/callback",
            method: "POST",
          },
        });

        logger.error("Error forwarding deprecated payment callback", {
          error: error instanceof Error ? error.message : "Unknown error",
        });

        // Return 200 even on error to prevent Jenga retries
        // Log the error but don't fail the request
        return NextResponse.json(
          {
            success: false,
            message: "Callback received but processing failed",
            error: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 200 }
        );
      }
    }
  );
}
