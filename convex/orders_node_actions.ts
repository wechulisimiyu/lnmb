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
    customerPhone: v.optional(v.string()),
    customerAddress: v.string(),
    productDescription: v.string(),
  },
  handler: async (
    ctx: any,
    args: any,
  ): Promise<{ paymentId: string; paymentData: any }> => {
    const now = Date.now();

    // Validate environment variables at runtime to avoid throwing during
    // Convex module analysis.
    validateSigningEnvs();

    // SITE_URL feeds both the callbackUrl Jenga is told to POST to and the
    // signature data. If it's missing or malformed, Jenga can never reach
    // our webhook and the resulting payment will be stuck "pending"
    // forever with no error anywhere. Fail loudly instead.
    const siteUrl = process.env.SITE_URL;
    if (!siteUrl || !/^https?:\/\/[^/]+/.test(siteUrl) || siteUrl.endsWith("/")) {
      const message =
        `[createPaymentRecord] Invalid or missing SITE_URL Convex env var: "${siteUrl ?? "undefined"}". ` +
        `Set it to the production site origin (e.g. https://example.com, no trailing slash) via ` +
        `\`npx convex env set SITE_URL https://your-domain --prod\`. Aborting to avoid an orphaned payment with a broken callbackUrl.`;
      console.error(message);
      throw new Error(message);
    }

    const callbackUrl = `${siteUrl}/api/pgw-webhook-4365c21f`;

    // Generate payment token (external API call - this is why we need an action)
    const token = await generateAccessToken();

    const sanitizeReference = (ref?: string) => {
      if (!ref) return "";
      return ref.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    };

    const cleanRef = sanitizeReference(args.orderReference);

    const signatureData = `${process.env.JENGA_MERCHANT_CODE || ""}${cleanRef}KES${String(args.orderAmount)}${callbackUrl}`;

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
      callbackUrl,
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
