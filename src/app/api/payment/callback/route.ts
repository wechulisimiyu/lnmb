import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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

export async function POST(request: NextRequest) {
  try {
    const body: STKPushCallback = await request.json();
    
    if (!body.transactionReference) {
      return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 });
    }

    const status = mapCallbackStatus(body.code);
    
    await convex.mutation(api.checkout.handlePaymentCallback, {
      transactionId: body.telcoReference || body.transactionReference,
      status,
      orderReference: body.transactionReference,
      amount: body.requestAmount?.toString(),
      desc: `${body.telco} - ${body.message}`,
      extraData: JSON.stringify({
        telcoReference: body.telcoReference,
        debitedAmount: body.debitedAmount,
        charge: body.charge,
        currency: body.currency,
        mobileNumber: body.mobileNumber
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
