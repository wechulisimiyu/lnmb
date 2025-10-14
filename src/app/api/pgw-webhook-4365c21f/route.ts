/**
 * Secure Jenga Payment Gateway Webhook Handler
 * 
 * Security Features:
 * - Signature verification using hash from Jenga PGW
 * - Request validation and sanitization
 * - Idempotency checks to prevent duplicate processing
 * - Secure logging without sensitive data
 * - Unpredictable endpoint path
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import {
  verifyJengaSignature,
  validateCallbackPayload,
  PaymentSecurityLogger,
  generateIdempotencyKey,
} from "@/lib/paymentSecurity";
import * as Sentry from "@sentry/nextjs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const { logger } = Sentry;

// Site URL (can default to localhost for tests)
const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

// Jenga PGW callback interface
interface JengaPaymentCallback {
  transactionId?: string;
  status?: string;
  date?: string;
  desc?: string; // Payment channel (CARD, EQUITEL, MPESA, AIRTEL)
  amount?: string;
  orderReference?: string;
  hash?: string; // Security hash
  extraData?: string;
}

// Store processed transaction IDs to prevent duplicate processing
// In production, this should use Redis or a database with TTL
const processedTransactions = new Set<string>();

/**
 * Verify that the webhook request is legitimate
 */
function verifyWebhookAuthenticity(
  body: JengaPaymentCallback,
  callbackUrl: string
): { valid: boolean; reason?: string } {
  // Check if hash is provided
  if (!body.hash) {
    return { valid: false, reason: "Missing signature hash" };
  }

  // Verify required fields
  const validation = validateCallbackPayload(body);
  if (!validation.valid) {
    return {
      valid: false,
      reason: `Missing required fields: ${validation.missing.join(", ")}`,
    };
  }

  // Verify signature - read merchant code at call time so tests can mock env
  const MERCHANT_CODE = process.env.JENGA_MERCHANT_CODE;
  if (!MERCHANT_CODE) {
    PaymentSecurityLogger.logSecurityError("MISSING_MERCHANT_CODE", {
      message: "Cannot verify signature without merchant code",
    });
    return { valid: false, reason: "Server configuration error" };
  }

  const signatureValid = verifyJengaSignature(
    {
      orderReference: body.orderReference!,
      amount: body.amount || "0",
      currency: "KES",
      callbackUrl,
    },
    body.hash,
    MERCHANT_CODE!
  );

  if (!signatureValid) {
    return { valid: false, reason: "Invalid signature" };
  }

  return { valid: true };
}

/**
 * Check if this transaction has already been processed (idempotency)
 */
function checkIdempotency(
  orderReference: string,
  transactionId?: string
): { isDuplicate: boolean; key: string } {
  const key = generateIdempotencyKey(orderReference, transactionId);
  const isDuplicate = processedTransactions.has(key);

  if (!isDuplicate) {
    processedTransactions.add(key);
    // Clean up old entries after 1 hour (simple memory-based approach)
    // In production, use Redis with TTL
    setTimeout(() => processedTransactions.delete(key), 60 * 60 * 1000);
  }

  return { isDuplicate, key };
}

/**
 * Handle GET callback (user redirect after payment)
 * GET requests don't have signature verification in Jenga's implementation,
 * so we treat them as informational redirects only
 */
export async function GET(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: "http.server",
      name: "GET /api/pgw-webhook-4365c21f",
    },
    async () => {
      try {
        // Support both NextRequest (with nextUrl) and standard Request objects used in tests
        const urlObj = (request as any).nextUrl
          ? (request as any).nextUrl
          : new URL((request as any).url);
        const searchParams = urlObj.searchParams;

        // Extract payment response parameters
        const transactionId = searchParams.get("transactionId");
        const status = searchParams.get("status");
        const orderReference = searchParams.get("orderReference");
        const amount = searchParams.get("amount");
      // const desc = searchParams.get("desc"); // not used on GET
      // const date = searchParams.get("date"); // not used on GET

        PaymentSecurityLogger.logSecurityEvent("CALLBACK_GET_RECEIVED", {
          orderReference,
          status,
          transactionId,
          hasAmount: !!amount,
        });

        logger.info("Secure webhook GET callback received", {
          orderReference,
          status,
          hasTransactionId: !!transactionId,
        });

        // Validate required fields
        if (!orderReference) {
          PaymentSecurityLogger.logSecurityWarning("CALLBACK_GET_MISSING_REFERENCE", {
            params: Array.from(searchParams.keys()),
          });

          logger.warn("GET callback missing order reference", {
            availableParams: Array.from(searchParams.keys()),
          });
          
          const redirectUrl = new URL("/checkout/result", request.url);
          redirectUrl.searchParams.set("status", "error");
          redirectUrl.searchParams.set("message", "Invalid payment reference");
          return NextResponse.redirect(redirectUrl);
        }

        // Note: GET callbacks are redirects and don't have hash verification
        // We redirect user but don't update payment status - that's done via POST webhook
        const redirectUrl = new URL("/checkout/result", request.url);
        redirectUrl.searchParams.set("status", status || "pending");
        redirectUrl.searchParams.set("reference", orderReference);

        if (transactionId) {
          redirectUrl.searchParams.set("transactionId", transactionId);
        }

        PaymentSecurityLogger.logSecurityEvent("CALLBACK_GET_REDIRECT", {
          orderReference,
          status,
        });

        return NextResponse.redirect(redirectUrl);
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            endpoint: "/api/pgw-webhook-4365c21f",
            method: "GET",
          },
        });

        PaymentSecurityLogger.logSecurityError("CALLBACK_GET_ERROR", {
          error: error instanceof Error ? error.message : "Unknown error",
        });

        logger.error("Error processing GET webhook callback", {
          error: error instanceof Error ? error.message : "Unknown error",
        });

        const redirectUrl = new URL("/checkout/result", request.url);
        redirectUrl.searchParams.set("status", "error");
        redirectUrl.searchParams.set("message", "Payment processing failed");

        return NextResponse.redirect(redirectUrl);
      }
    }
  );
}

/**
 * Handle POST callback (server-to-server webhook)
 * This is the authoritative callback with signature verification
 */
export async function POST(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: "http.server",
      name: "POST /api/pgw-webhook-4365c21f",
    },
    async () => {
      try {
        const body = await request.json();

        PaymentSecurityLogger.logSecurityEvent("CALLBACK_POST_RECEIVED", {
          orderReference: body.orderReference,
          status: body.status,
          hasHash: !!body.hash,
        });

        logger.info("Secure webhook POST callback received", {
          orderReference: body.orderReference,
          status: body.status,
          hasHash: !!body.hash,
        });

        // Validate payload structure
        const validation = validateCallbackPayload(body);
        if (!validation.valid) {
          PaymentSecurityLogger.logSecurityWarning("CALLBACK_INVALID_PAYLOAD", {
            missing: validation.missing,
          });

          logger.warn("Invalid webhook payload", {
            missing: validation.missing,
          });

          // Return 200 to prevent retries even for invalid payloads
          return NextResponse.json(
            { success: false, error: "Invalid payload", missing: validation.missing },
            { status: 200 }
          );
        }

        const {
          transactionId,
          status,
          orderReference,
          desc,
        }: JengaPaymentCallback = body;

        // Check if payment record exists before processing
        // This helps avoid errors when webhook arrives before order is created
        if (orderReference) {
          try {
            const paymentExists = await convex.query(api.orders.getPaymentStatus, {
              reference: orderReference,
            });

            if (!paymentExists) {
              logger.warn("Payment record not found for order reference", {
                orderReference,
                status,
                transactionId,
              });

              // Return 200 to acknowledge receipt but log for investigation
              return NextResponse.json(
                {
                  success: true,
                  message: "Payment record not found - may arrive later",
                  orderReference,
                },
                { status: 200 }
              );
            }
          } catch (error) {
            logger.error("Error checking payment record existence", {
              orderReference,
              error: error instanceof Error ? error.message : "Unknown error",
            });
            
            // Continue processing - don't fail on query errors
          }
        }

        // Build callback URL for signature verification
        const callbackUrl = `${SITE_URL}/api/pgw-webhook-4365c21f`;

        // Verify webhook authenticity
        const authCheck = verifyWebhookAuthenticity(body, callbackUrl);
        if (!authCheck.valid) {
          Sentry.captureException(new Error("Webhook authentication failed"), {
            tags: {
              endpoint: "/api/pgw-webhook-4365c21f",
              reason: authCheck.reason,
            },
            extra: {
              orderReference,
            },
          });

          PaymentSecurityLogger.logSecurityError("CALLBACK_AUTH_FAILED", {
            reason: authCheck.reason,
            orderReference,
          });

          logger.error("Webhook authentication failed", {
            reason: authCheck.reason,
            orderReference,
          });

          // Return 200 to prevent retries even for auth failures
          return NextResponse.json(
            { success: false, error: "Webhook authentication failed", reason: authCheck.reason },
            { status: 200 }
          );
        }

        // Check idempotency
        const idempotencyCheck = checkIdempotency(orderReference!, transactionId);
        if (idempotencyCheck.isDuplicate) {
          PaymentSecurityLogger.logSecurityWarning("CALLBACK_DUPLICATE", {
            orderReference,
            transactionId,
            idempotencyKey: idempotencyCheck.key,
          });

          logger.warn("Duplicate webhook callback detected", {
            orderReference,
            transactionId,
          });

          return NextResponse.json({
            success: true,
            message: "Already processed",
            duplicate: true,
          });
        }

        // Map Jenga status to system status
        let paymentStatus = "failed";
        if (status === "paid") {
          paymentStatus = "paid";
        } else if (status === "pending") {
          paymentStatus = "processing";
        }

        // Update payment status in database
        try {
          await convex.mutation(api.orders.updatePaymentStatus, {
            orderReference: orderReference!,
            status: paymentStatus,
            transactionId: transactionId || undefined,
            paymentChannel: desc || undefined,
          });

          PaymentSecurityLogger.logSecurityEvent("CALLBACK_PROCESSED", {
            orderReference,
            status: paymentStatus,
            transactionId,
            channel: desc,
          });

          logger.info("Payment status updated successfully", {
            orderReference,
            status: paymentStatus,
            transactionId,
          });
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              endpoint: "/api/pgw-webhook-4365c21f",
              operation: "updatePaymentStatus",
            },
            extra: {
              orderReference,
              status: paymentStatus,
            },
          });

          logger.error("Failed to update payment status", {
            orderReference,
            error: error instanceof Error ? error.message : "Unknown error",
          });

          // Return 200 even on update failure to prevent retries
          return NextResponse.json(
            {
              success: false,
              message: "Failed to update payment status",
              error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 200 }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Payment status updated",
        });
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            endpoint: "/api/pgw-webhook-4365c21f",
            method: "POST",
          },
        });

        PaymentSecurityLogger.logSecurityError("CALLBACK_PROCESSING_ERROR", {
          error: error instanceof Error ? error.message : "Unknown error",
        });

        logger.error("Error processing webhook callback", {
          error: error instanceof Error ? error.message : "Unknown error",
        });

        // Return 200 even on error to prevent Jenga retries
        return NextResponse.json(
          { success: false, error: "Failed to process payment callback" },
          { status: 200 }
        );
      }
    }
  );
}
