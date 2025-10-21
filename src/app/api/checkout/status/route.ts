import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import * as Sentry from "@sentry/nextjs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
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
      const payment = await convex.query(api.orders.getPaymentStatus, {
        reference,
      });
      return NextResponse.json({ success: true, payment: payment ?? null });
    }

    // If only transactionId provided, do a broader search on payments using Convex query (server-side)
    // There's no direct query by transactionId in convex functions, so return null if not provided.
    return NextResponse.json({ success: true, payment: null });
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
}
