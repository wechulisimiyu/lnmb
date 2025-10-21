"use node";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import generateAccessToken from "./utils/generateAccessToken";
import {
  loadPrivateKeyFromEnvOrFile,
  computeJengaSignatureBase64,
  validateSigningEnvs,
} from "./utils/signing";

export const createPaymentRecord = action({
  args: {
    orderReference: v.string(),
    orderAmount: v.number(),
    customerFirstName: v.string(),
    customerLastName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    customerAddress: v.string(),
    productDescription: v.string(),
  },
  handler: async (
    ctx: any,
    args: any,
  ): Promise<{ paymentId: string; paymentData: any }> => {
    const now = Date.now();

    // Generate payment token (external API call - this is why we need an action)
    const token = await generateAccessToken();

    const sanitizeReference = (ref?: string) => {
      if (!ref) return "";
      return ref.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    };

    const cleanRef = sanitizeReference(args.orderReference);

    // Validate environment variables in production only at runtime to avoid
    // throwing during Convex module analysis.
    validateSigningEnvs();

    const signatureData = `${process.env.JENGA_MERCHANT_CODE || ""}${cleanRef}KES${String(args.orderAmount)}${process.env.SITE_URL ? `${process.env.SITE_URL}/api/pgw-webhook-4365c21f` : "http://localhost:3000/api/pgw-webhook-4365c21f"}`;

    const privateKey = loadPrivateKeyFromEnvOrFile();
    const signature = privateKey
      ? computeJengaSignatureBase64(signatureData, privateKey)
      : "";

    const paymentData = {
      token,
      merchantCode: process.env.JENGA_MERCHANT_CODE || "",
      currency: "KES",
      orderAmount: args.orderAmount,
      orderReference: cleanRef,
      productType: "Product",
      productDescription: args.productDescription,
      paymentTimeLimit: "15mins",
      customerFirstName: args.customerFirstName,
      customerLastName: args.customerLastName,
      customerPostalCodeZip: "00100",
      customerAddress: args.customerAddress,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      countryCode: "KE",
      callbackUrl: `${process.env.SITE_URL}/api/pgw-webhook-4365c21f`,
      secondaryReference: cleanRef,
      signature,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    const paymentId: string = await ctx.runMutation(
      internal.orders.insertPaymentRecord,
      { paymentData },
    );

    return { paymentId, paymentData };
  },
});
