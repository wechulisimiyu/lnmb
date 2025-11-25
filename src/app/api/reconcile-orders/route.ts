import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import * as Sentry from "@sentry/nextjs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface Payment {
  orderReference: string;
  status: string;
  transactionId?: string;
  orderAmount?: number;
  amount?: number;
}

export async function POST(): Promise<Response> {
  try {
    // Get all payments with status "paid"
    const allPayments = await convex.query(api.orders.getAllPayments, {});
    const paidPayments = (allPayments as Payment[]).filter(
      (payment: Payment) => payment.status === "paid",
    );

    if (!paidPayments || paidPayments.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No paid payments found to reconcile",
        reconciled: 0,
        skipped: 0,
      });
    }

    let reconciled = 0;
    let skipped = 0;
    const errors: string[] = [];

    // For each paid payment, update the corresponding order
    for (const payment of paidPayments) {
      const orderReference = payment.orderReference;

      try {
        // Update the order status to paid
        await convex.mutation(api.orders.updateOrderPaymentStatus, {
          orderReference,
          paid: true,
          transactionId: payment.transactionId,
        });

        reconciled++;
      } catch (error) {
        skipped++;
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        errors.push(
          `Failed to update order ${orderReference}: ${errorMsg}`,
        );

        // Log individual errors but continue processing
        console.error(
          `[reconcile-orders] Failed to update order ${orderReference}:`,
          error,
        );
      }
    }

    // Capture any errors that occurred
    if (errors.length > 0) {
      Sentry.captureMessage(
        `Reconciliation completed with errors: ${errors.join("; ")}`,
        "warning",
      );
    }

    return NextResponse.json({
      success: true,
      message: `Reconciliation completed. ${reconciled} orders updated.`,
      reconciled,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("[reconcile-orders] Fatal error:", error);

    Sentry.captureException(error, {
      tags: { endpoint: "/api/reconcile-orders" },
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to reconcile orders",
      },
      { status: 500 },
    );
  }
}
