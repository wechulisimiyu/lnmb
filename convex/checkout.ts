import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import authToken from "./utils/generateAccessToken";

interface PaymentRequest {
  phoneNumber: string;
  amount: number;
  orderReference: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerAddress?: string;
  productDescription?: string;
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

class PaymentService {
  private readonly baseUrl = "https://uat.finserve.africa";
  private readonly merchantAccountNumber = "0170280594893";

  private createSTKPayload(request: PaymentRequest): STKPayload {
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    
    return {
      merchant: {
        accountNumber: this.merchantAccountNumber,
        countryCode: "KE",
        name: process.env.JENGA_MERCHANT_NAME || "Merchant Name"
      },
      payment: {
        ref: request.orderReference,
        amount: request.amount.toString(),
        currency: "KES",
        telco: "Safaricom",
        mobileNumber: request.phoneNumber,
        date: new Date().toISOString().split('T')[0],
        callBackUrl: `${siteUrl}/api/payment/callback`,
        pushType: "STK"
      }
    };
  }

  private generateSignatureData(request: PaymentRequest): string {
    return `${this.merchantAccountNumber}${request.orderReference}${request.phoneNumber}Safaricom${request.amount}KES`;
  }

  private async makeSTKRequest(payload: STKPayload, signature: string): Promise<Response> {
    const token = await authToken();
    
    return fetch(`${this.baseUrl}/v3-apis/payment-api/v3.0/stkussdpush/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Signature": signature
      },
      body: JSON.stringify(payload),
    });
  }

  private createSuccessResponse(responseData: any, request: PaymentRequest): STKPushResponse {
    return {
      status: responseData.status ? "initiated" : "failed",
      message: responseData.message || "STK push initiated successfully",
      reference: responseData.reference || request.orderReference,
      transactionId: responseData.transactionId || `stk_${Date.now()}`,
    };
  }

  private createErrorResponse(error: unknown, request: PaymentRequest): STKPushResponse {
    const message = error instanceof Error ? error.message : "STK Push failed - please try again";
    
    return {
      status: "failed",
      message,
      reference: request.orderReference,
    };
  }

  private createSimulationResponse(request: PaymentRequest): STKPushResponse {
    return {
      status: "initiated",
      message: `STK push simulated for ${request.customerFirstName} ${request.customerLastName} (${request.phoneNumber})`,
      reference: request.orderReference,
      transactionId: `sim_${Date.now()}`,
    };
  }

  async initiateSTKPush(request: PaymentRequest): Promise<STKPushResponse> {
    try {
      const payload = this.createSTKPayload(request);
      const signature = this.generateSignatureData(request);
      const response = await this.makeSTKRequest(payload, signature);

      if (response.ok) {
        const responseData = await response.json();
        return this.createSuccessResponse(responseData, request);
      }

      const errorData = await response.json();
      throw new Error(`STK Push API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      
    } catch (error) {
      const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.JENGA_API_KEY;
      
      if (isDevelopment) {
        return this.createSimulationResponse(request);
      }
      
      return this.createErrorResponse(error, request);
    }
  }
}

export const createPaymentRecord = mutation({
  args: {
    phoneNumber: v.string(),
    amount: v.number(),
    orderReference: v.string(),
    customerFirstName: v.string(),
    customerLastName: v.string(),
    customerEmail: v.string(),
    customerAddress: v.optional(v.string()),
    productDescription: v.optional(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    const timestamp = Date.now();
    
    return await ctx.db.insert("payments", {
      ...args,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
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
    phoneNumber: v.string(),
    amount: v.number(),
    orderReference: v.string(),
    customerFirstName: v.string(),
    customerLastName: v.string(),
    customerEmail: v.string(),
    customerAddress: v.optional(v.string()),
    productDescription: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<STKPushResponse> => {
    const paymentService = new PaymentService();
    const stkResponse = await paymentService.initiateSTKPush(args);
    
    if (stkResponse.status === "initiated") {
      await ctx.runMutation(api.checkout.updatePaymentStatus, {
        reference: args.orderReference,
        status: "initiated",
        transactionId: stkResponse.transactionId,
      });
    }
    
    return stkResponse;
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
    const orderReference = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const paymentRequest = { ...args, orderReference };

    try {
      await ctx.runMutation(api.checkout.createPaymentRecord, {
        ...paymentRequest,
        status: "pending",
      });

      const stkResponse: STKPushResponse = await ctx.runAction(api.checkout.triggerSTKPush, paymentRequest);

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
    await ctx.runMutation(api.checkout.updatePaymentStatus, {
      reference: args.orderReference,
      status: args.status,
      transactionId: args.transactionId,
    });

    return { success: true, reference: args.orderReference };
  },
});

// Query to get all payments (for admin)
export const getAllPayments = query({
  handler: async (ctx) => {
    return await ctx.db.query("payments").collect();
  },
});
