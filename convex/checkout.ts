import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import authToken from "./utils/generateAccessToken";

interface PaymentRequest {
  order: {
    orderReference: string;
    orderAmount: number;
    orderCurrency: string;
    source?: string;
    countryCode?: string;
    description?: string;
  };
  customer: {
    name: string;
    email?: string;
    phoneNumber?: string;
    identityNumber?: string;
    firstAddress?: string;
    secondAddress?: string;
  };
  payment: {
    paymentReference: string;
    paymentCurrency: string;
    channel?: string;
    service?: string;
    provider?: string;
    callbackUrl?: string;
    details?: {
      msisdn: string;
      paymentAmount: number;
    };
  };
}

interface STKPushResponse {
  transactionId?: string;
  status: "initiated" | "failed";
  message: string;
  reference: string;
}

interface STKPayload {
  merchant: {
    accountNumber: string;
    countryCode: string;
    name: string;
  };
  payment: {
    ref: string;
    amount: string;
    currency: string;
    telco: string;
    mobileNumber: string;
    date: string;
    callBackUrl: string;
    pushType: string;
  };
}

interface PaymentRecord {
  phoneNumber: string;
  amount: number;
  orderReference: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerAddress?: string;
  productDescription?: string;
  status: string;
  createdAt: number;
  updatedAt: number;
}

/*
 DEPRECATION NOTICE

 The code in this file implements an older Convex-based checkout / STK flow.
 We are moving to the pattern where the Next.js frontend obtains the Jenga
 token and POSTs a standard checkout form to Jenga's /processPayment endpoint
 (client-side). The Convex-side checkout and STK push functions are retained
 below only for backward compatibility and debugging, but they are deprecated.

 - Do not add new behaviour here.
 - If you need to restore server-side checkout logic, prefer creating a
   clearly-named server action in a new file and document it explicitly.

 The exported functions are annotated with @deprecated and will throw a
 descriptive error at runtime to make accidental usage fail fast.
*/

class PaymentService {
  private readonly baseUrl = process.env.JENGA_BASE_URL || "https://uat.finserve.africa";
  private readonly merchantAccountNumber = "0170280594893";

  private createSTKPayload(request: PaymentRequest): STKPayload {
    const siteUrl = process.env.SITE_URL || "http://localhost:3000";

    // Build payload matching the API used in the test script
    return {
      merchant: {
        accountNumber: this.merchantAccountNumber,
        countryCode: "KE",
        name: process.env.JENGA_MERCHANT_NAME || "Merchant Name",
      },
      payment: {
        ref: request.order.orderReference,
        amount:
          request.payment.details?.paymentAmount.toString() ||
          String(request.order.orderAmount),
        currency:
          request.payment.paymentCurrency ||
          request.order.orderCurrency ||
          "KES",
        telco: "Safaricom",
        mobileNumber:
          request.payment.details?.msisdn || request.customer.phoneNumber || "",
        date: new Date().toISOString().split("T")[0],
        callBackUrl:
          request.payment.callbackUrl || `${siteUrl}/api/pgw-webhook-4365c21f`,
        pushType: "STK",
      },
    };
  }

  /**
   * Generate RSA-SHA256 signature (base64) for the signature data
   * Note: Signature generation moved to action with "use node" directive
   */
  private generateSignature(request: PaymentRequest): string {
    // For now, return empty signature since we're using Jenga PGW flow
    // TODO: Move signature generation to action with "use node" if needed
    return "";
  }

  private async makeSTKRequest(
    payload: STKPayload,
    signature: string,
  ): Promise<Response> {
    const token = await authToken();

    // Use the new endpoint used in the test script
    return fetch(`${this.baseUrl}/api-checkout/mpesa-stk-push/v3.0/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Signature: signature,
      },
      body: JSON.stringify(payload),
    });
  }

  private createSuccessResponse(
    responseData: any,
    request: PaymentRequest,
  ): STKPushResponse {
    return {
      status: responseData.status ? "initiated" : "failed",
      message: responseData.message || "STK push initiated successfully",
      reference: responseData.reference || request.order.orderReference,
      transactionId: responseData.transactionId || `stk_${Date.now()}`,
    };
  }

  private createErrorResponse(
    error: unknown,
    request: PaymentRequest,
  ): STKPushResponse {
    const message =
      error instanceof Error
        ? error.message
        : "STK Push failed - please try again";

    return {
      status: "failed",
      message,
      reference: request.order.orderReference,
    };
  }

  private createSimulationResponse(request: PaymentRequest): STKPushResponse {
    return {
      status: "initiated",
      message: `STK push simulated for ${request.customer?.name || ""} (${request.customer?.phoneNumber || ""})`,
      reference: request.order.orderReference,
      transactionId: `sim_${Date.now()}`,
    };
  }

  async initiateSTKPush(request: PaymentRequest): Promise<STKPushResponse> {
    try {
      const payload = this.createSTKPayload(request);
      const signature = this.generateSignature(request);
      const response = await this.makeSTKRequest(payload, signature);

      if (response.ok) {
        const responseData = await response.json();
        return this.createSuccessResponse(responseData, request);
      }

      const errorData = await response.json();
      throw new Error(
        `STK Push API error: ${response.status} - ${errorData.message || "Unknown error"}`,
      );
    } catch (error) {
      const isDevelopment =
        process.env.NODE_ENV === "development" || !process.env.JENGA_API_KEY;

      if (isDevelopment) {
        return this.createSimulationResponse(request);
      }

      return this.createErrorResponse(error, request);
    }
  }
}

/**
 * @deprecated Convex-side checkout flow is deprecated. The frontend now posts
 * directly to Jenga /processPayment. Keep this function for compatibility only.
 */
export const createPaymentRecord = mutation({
  args: {
    order: v.object({
      orderReference: v.string(),
      orderAmount: v.number(),
      orderCurrency: v.string(),
      source: v.optional(v.string()),
      countryCode: v.optional(v.string()),
      description: v.optional(v.string()),
    }),
    customer: v.object({
      name: v.string(),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      identityNumber: v.optional(v.string()),
      firstAddress: v.optional(v.string()),
      secondAddress: v.optional(v.string()),
    }),
    payment: v.object({
      paymentReference: v.string(),
      paymentCurrency: v.string(),
      channel: v.optional(v.string()),
      service: v.optional(v.string()),
      provider: v.optional(v.string()),
      callbackUrl: v.optional(v.string()),
      details: v.optional(
        v.object({
          msisdn: v.string(),
          paymentAmount: v.number(),
        }),
      ),
    }),
    status: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    console.warn(
      "Deprecated: convex/checkout.createPaymentRecord called — this Convex-side checkout is deprecated. Use the Next.js frontend /processPayment flow instead.",
    );

    /*
    Original implementation (kept here as reference):

    const timestamp = Date.now();

    // sanitize orderReference for storage and future use
    const sanitize = (ref: string) => ref.replace(/[^A-Za-z0-9-]/g, "");
    const cleanRef = sanitize(args.order.orderReference);

    // Generate token and other Jenga PGW required fields
    const token = await authToken();

    // insert flattened record to match schema with generated values
    return await ctx.db.insert("payments", {
      // Jenga PGW required fields (generated or default values)
      token,
      merchantCode: process.env.JENGA_MERCHANT_CODE || "001",
      currency: args.order.orderCurrency,
      orderAmount: args.order.orderAmount,
      orderReference: cleanRef,
      productType: "LNMB_TSHIRT",
      productDescription: args.order.description || "LNMB T-Shirt Purchase",
      paymentTimeLimit: "3600",
      customerFirstName: args.customer.name.split(" ")[0] || args.customer.name,
      customerLastName: args.customer.name.split(" ").slice(1).join(" ") || "",
      customerPostalCodeZip: "00100",
      customerAddress: args.customer.firstAddress || "",
      customerEmail: args.customer.email || "",
      customerPhone: args.customer.phoneNumber || "",
      callbackUrl: args.payment.callbackUrl,
      countryCode: "KE",
      secondaryReference: `SEC_${cleanRef}`,

      // Payment status tracking
      status: args.status,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    */

    throw new Error(
      "Deprecated: convex/checkout.createPaymentRecord is removed from active use. Use client-side checkout flow.",
    );
  },
});

export const updatePaymentStatus = mutation({
  args: {
    reference: v.string(),
    status: v.string(),
    transactionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("orderReference"), args.reference))
      .first();

    if (!payment) {
      throw new Error(`Payment with reference ${args.reference} not found`);
    }

    await ctx.db.patch(payment._id, {
      status: args.status,
      transactionId: args.transactionId,
      updatedAt: Date.now(),
    });

    return payment;
  },
});

export const triggerSTKPush = action({
  args: {
    order: v.object({
      orderReference: v.string(),
      orderAmount: v.number(),
      orderCurrency: v.string(),
    }),
    customer: v.object({
      name: v.string(),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
    }),
    payment: v.object({
      paymentReference: v.string(),
      paymentCurrency: v.string(),
      details: v.optional(
        v.object({ msisdn: v.string(), paymentAmount: v.number() }),
      ),
    }),
  },
  handler: async (ctx, args): Promise<STKPushResponse> => {
    console.warn(
      "Deprecated: convex/checkout.triggerSTKPush called — STK push from Convex is deprecated. Use client-side Jenga checkout instead.",
    );

    /*
    Original implementation (kept here as reference):

    const paymentService = new PaymentService();

    const paymentRequest: PaymentRequest = {
      order: args.order,
      customer: args.customer,
      payment: args.payment,
    };

    const stkResponse = await paymentService.initiateSTKPush(paymentRequest);

    if (stkResponse.status === "initiated") {
      await ctx.runMutation(api.checkout.updatePaymentStatus, {
        reference: args.order.orderReference,
        status: "initiated",
        transactionId: stkResponse.transactionId,
      });
    }

    return stkResponse;
    */

    throw new Error(
      "Deprecated: convex/checkout.triggerSTKPush is no longer supported.",
    );
  },
});

interface CheckoutResponse extends STKPushResponse {
  orderReference: string;
}

export const initiateCheckout = action({
  args: {
    phoneNumber: v.string(),
    amount: v.number(),
    customerFirstName: v.string(),
    customerLastName: v.string(),
    customerEmail: v.string(),
    customerAddress: v.optional(v.string()),
    productDescription: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<CheckoutResponse> => {
    console.warn(
      "Deprecated: convex/checkout.initiateCheckout called — convex-side checkout is deprecated. Use frontend checkout form to post to Jenga.",
    );

    /*
    Original implementation (kept here as reference):

    // Build structured payload from existing flat args for backward compatibility
    const rawOrderReference = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const sanitize = (ref: string) => ref.replace(/[^A-Za-z0-9-]/g, "");
    const orderReference = sanitize(rawOrderReference);

    const paymentRequest: PaymentRequest = {
      order: {
        orderReference,
        orderAmount: args.amount,
        orderCurrency: "KES",
        description: args.productDescription,
      },
      customer: {
        name: `${args.customerFirstName} ${args.customerLastName}`,
        email: args.customerEmail,
        phoneNumber: args.phoneNumber,
        firstAddress: args.customerAddress,
      },
      payment: {
        paymentReference: `PAY_${Date.now()}`,
        paymentCurrency: "KES",
        details: {
          msisdn: args.phoneNumber,
          paymentAmount: args.amount,
        },
      },
    };

    try {
      await ctx.runMutation(api.checkout.createPaymentRecord, {
        order: paymentRequest.order,
        customer: paymentRequest.customer,
        payment: paymentRequest.payment,
        status: "pending",
      });

      const stkResponse: STKPushResponse = await ctx.runAction(
        api.checkout.triggerSTKPush,
        {
          order: paymentRequest.order,
          customer: paymentRequest.customer,
          payment: paymentRequest.payment,
        },
      );

      await ctx.runMutation(api.checkout.updatePaymentStatus, {
        reference: orderReference,
        status: stkResponse.status,
        transactionId: stkResponse.transactionId,
      });

      return {
        ...stkResponse,
        orderReference,
      };
    } catch (error) {
      await ctx.runMutation(api.checkout.updatePaymentStatus, {
        reference: orderReference,
        status: "failed",
      });

      throw error;
    }
    */

    throw new Error(
      "Deprecated: convex/checkout.initiateCheckout is no longer supported.",
    );
  },
});

// Query to get payment status
export const getPaymentStatus = query({
  args: {
    reference: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("orderReference"), args.reference))
      .first();
  },
});

export const handlePaymentCallback = mutation({
  args: {
    transactionId: v.optional(v.string()),
    status: v.string(),
    orderReference: v.string(),
    amount: v.optional(v.string()),
    hash: v.optional(v.string()),
    desc: v.optional(v.string()),
    extraData: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.warn(
      "Deprecated: convex/checkout.handlePaymentCallback called — callback handling should be via Next.js webhook route. This Convex handler is deprecated.",
    );

    /*
    Original implementation (kept here as reference):

    await ctx.runMutation(api.checkout.updatePaymentStatus, {
      reference: args.orderReference,
      status: args.status,
      transactionId: args.transactionId,
    });

    return { success: true, reference: args.orderReference };
    */

    throw new Error(
      "Deprecated: convex/checkout.handlePaymentCallback is no longer supported. Use Next.js webhook route for handling Jenga callbacks.",
    );
  },
});

// Query to get all payments (for admin)
export const getAllPayments = query({
  handler: async (ctx) => {
    return await ctx.db.query("payments").collect();
  },
});
