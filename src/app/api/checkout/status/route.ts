import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import * as Sentry from "@sentry/nextjs";

const getConvexClient = () => {
  const convexUrl = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("Missing CONVEX_URL for server-side Convex client");
  }
  return new ConvexHttpClient(convexUrl);
};

export async function GET(request: NextRequest): Promise<Response> {
  const convexUrl = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return NextResponse.json(
      { success: false, error: "missing_convex_url" },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const reference = url.searchParams.get("reference");
  const transactionId = url.searchParams.get("transactionId");

  try {
    if (!reference && !transactionId) {
      return NextResponse.json(
        { success: false, error: "missing_reference_or_transactionId" },
        { status: 400 },
      );
    }

    // Prefer lookup by reference
    if (reference) {
      const convex = getConvexClient();
      const payment = await convex.query(api.orders.getPaymentStatus, {
        reference,
      });
      return NextResponse.json({ success: true, payment: payment ?? null });
    }

    // If only transactionId provided, use Convex query by transactionId
    if (transactionId) {
      const convex = getConvexClient();
      const paymentByTx = await convex.query(
        api.orders.getPaymentByTransactionId,
        {
          transactionId,
        },
      );
      return NextResponse.json({ success: true, payment: paymentByTx ?? null });
    }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { endpoint: "/api/checkout/status" },
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "unknown",
      },
      { status: 500 },
    );
  }

  // Fallback return to satisfy TypeScript control-flow analysis. All code paths
  // above should return, but include a safe default response here.
  return NextResponse.json(
    { success: false, error: "missing_reference_or_transactionId" },
    { status: 400 },
  );
}
