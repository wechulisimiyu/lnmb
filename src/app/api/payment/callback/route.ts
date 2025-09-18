import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Jenga PGW callback interface
interface JengaPaymentCallback {
  transactionId?: string;
  status?: string;
  date?: string;
  desc?: string; // Payment channel (CARD, EQUITEL, MPESA, AIRTEL)
  amount?: string;
  orderReference?: string;
  hash?: string;
  extraData?: string;
}

// Legacy STK Push callback interface (keeping for backward compatibility)
interface STKPushCallback {
  status: boolean;
  code: number;
  message: string;
  transactionReference: string;
  telcoReference: string;
  mobileNumber: string;
  currency: string;
  requestAmount: number;
  debitedAmount: number;
  charge: number;
  telco: string;
}

function mapCallbackStatus(code: number): string {
  switch (code) {
    case 0: return "pending";
    case 1: return "failed";
    case 2: return "awaiting_settlement";
    case 3: return "paid"; // COMPLETED/CREDITED
    case 4: return "awaiting_settlement";
    case 5:
    case 6: return "cancelled";
    case 7: return "failed"; // REJECTED
    default: return "failed";
  }
}

// Handle Jenga PGW GET callback (redirect after payment)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract payment response parameters from Jenga PGW
    const transactionId = searchParams.get("transactionId");
    const status = searchParams.get("status");
    const orderReference = searchParams.get("orderReference");
    const amount = searchParams.get("amount");
    const desc = searchParams.get("desc"); // Payment channel (MPESA, CARD, etc.)
    const date = searchParams.get("date");
    // const hash = searchParams.get("hash"); // Unused for now
    // const extraData = searchParams.get("extraData"); // Unused for now

    console.log("Jenga Payment callback received:", {
      transactionId,
      status,
      orderReference,
      amount,
      desc,
      date,
    });

    if (!orderReference) {
      return NextResponse.json(
        { error: "Missing order reference" },
        { status: 400 }
      );
    }

    // Map Jenga status to our system status
    let paymentStatus = "failed";
    if (status === "paid") {
      paymentStatus = "paid";
    } else if (status === "pending") {
      paymentStatus = "processing";
    }

    // Update payment status in Convex
    await convex.mutation(api.orders.updatePaymentStatus, {
      orderReference,
      status: paymentStatus,
      transactionId: transactionId || undefined,
      paymentChannel: desc || undefined,
    });

    // Redirect user based on payment status
    const redirectUrl = new URL("/checkout/result", request.url);
    redirectUrl.searchParams.set("status", paymentStatus);
    redirectUrl.searchParams.set("reference", orderReference);
    
    if (transactionId) {
      redirectUrl.searchParams.set("transactionId", transactionId);
    }

    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error("Error processing Jenga payment callback:", error);
    
    const redirectUrl = new URL("/checkout/result", request.url);
    redirectUrl.searchParams.set("status", "error");
    redirectUrl.searchParams.set("message", "Payment processing failed");

    return NextResponse.redirect(redirectUrl);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Payment callback POST received:", body);

    // Check if this is a Jenga PGW callback or legacy STK Push callback
    if (body.orderReference || body.transactionId) {
      // Handle Jenga PGW POST callback
      const {
        transactionId,
        status,
        orderReference,
        // amount, // Unused for now
        desc,
        // date, // Unused for now
        // hash, // Unused for now
        // extraData, // Unused for now
      }: JengaPaymentCallback = body;

      if (!orderReference) {
        return NextResponse.json(
          { error: "Missing order reference" },
          { status: 400 }
        );
      }

      // Map Jenga status to our system status
      let paymentStatus = "failed";
      if (status === "paid") {
        paymentStatus = "paid";
      } else if (status === "pending") {
        paymentStatus = "processing";
      }

      // Update payment status in Convex
      await convex.mutation(api.orders.updatePaymentStatus, {
        orderReference,
        status: paymentStatus,
        transactionId: transactionId || undefined,
        paymentChannel: desc || undefined,
      });

      return NextResponse.json({ 
        success: true, 
        message: "Payment status updated" 
      });

    } else {
      // Handle legacy STK Push callback
      const stkBody: STKPushCallback = body;
      
      if (!stkBody.transactionReference) {
        return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 });
      }

      const status = mapCallbackStatus(stkBody.code);
      
      // Try to update using the old checkout API if it exists, otherwise use orders API
      try {
        // Check if checkout API exists first
        if (typeof api.checkout?.handlePaymentCallback !== "undefined") {
          await convex.mutation(api.checkout.handlePaymentCallback, {
            transactionId: stkBody.telcoReference || stkBody.transactionReference,
            status,
            orderReference: stkBody.transactionReference,
            amount: stkBody.requestAmount?.toString(),
            desc: `${stkBody.telco} - ${stkBody.message}`,
          });
        } else {
          throw new Error("Checkout API not available, using orders API");
        }
      } catch (error) {
        // Fallback to orders API
        console.log("Fallback to orders API due to:", error);
        await convex.mutation(api.orders.updatePaymentStatus, {
          orderReference: stkBody.transactionReference,
          status,
          transactionId: stkBody.telcoReference || stkBody.transactionReference,
          paymentChannel: stkBody.telco,
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: "STK Push callback processed" 
      });
    }

  } catch (error) {
    console.error("Error processing payment callback:", error);
    return NextResponse.json(
      { error: "Failed to process payment callback" },
      { status: 500 }
    );
  }
}
