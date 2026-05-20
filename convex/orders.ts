import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// Create a new order
export const createOrder = mutation({
  args: {
    student: v.string(),
    university: v.optional(v.string()),
    universityUserEntered: v.optional(v.boolean()),
    graduationYear: v.optional(v.string()),
    regNumber: v.optional(v.string()),
    attending: v.string(),
    tshirtType: v.string(),
    tshirtSize: v.string(),
    quantity: v.number(),
    totalAmount: v.number(),
    salesAgentName: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    nameOfKin: v.string(),
    kinNumber: v.string(),
    medicalCondition: v.optional(v.string()),
    pickUp: v.optional(v.string()),
    confirm: v.string(),
    orderReference: v.string(),
    // school ID image fields are optional and may be null for simplified UX
    schoolIdUrl: v.optional(v.union(v.string(), v.null())),
    schoolIdPublicId: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    // Server-side normalization: attempt to map incoming university to canonical names
    const canonical = [
      "University of Nairobi",
      "Moi University",
      "Kenyatta University",
      "Egerton University",
      "Kenya Methodist University",
      "Maseno University",
      "Jomo Kenyatta University of Agriculture and Technology",
      "Mount Kenya University",
      "Uzima University",
      "Masinde Muliro University of Science and Technology",
      "Kisii University",
      "The Aga Khan University",
      "Pwani University",
      "Technical University of Mombasa",
      "Technical University of Kenya",
      "Kenya Medical Training College",
      "Kabarak University",
      "United States International University-Africa",
    ];

    function normalize(s?: string) {
      if (!s) return "";
      return s
        .toLowerCase()
        .trim()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()']/g, "")
        .replace(/\s+/g, " ");
    }

    let normalizedUniversity = args.university;
    if (args.university) {
      const n = normalize(args.university);
      const match = canonical.find(
        (c) =>
          normalize(c) === n ||
          normalize(c).includes(n) ||
          n.includes(normalize(c)),
      );
      if (match) {
        normalizedUniversity = match;
      } else if (args.universityUserEntered) {
        normalizedUniversity = `Other: ${args.university}`;
      }
    }

    // Server-side sanitization: ensure orderReference is alphanumeric and uppercase
    const sanitizeReference = (ref?: string) => {
      if (!ref) return "";
      return ref.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    };

    // Build an order record that matches the Convex schema exactly.
    // We intentionally map and coerce optional incoming args to the
    // required/optional shapes defined in `convex/schema.ts` so the
    // `ctx.db.insert` call type-checks correctly.
    const orderRecord = {
      // Student information
      student: args.student,
      university: normalizedUniversity,
      // Schema calls this `yearOfStudy` while the client may send `graduationYear`.
      yearOfStudy:
        (args as any).graduationYear ?? (args as any).yearOfStudy ?? undefined,
      regNumber: args.regNumber,

      // Attendance and product details
      attending: args.attending,
      tshirtType: args.tshirtType,
      tshirtSize: args.tshirtSize,
      quantity: args.quantity,
      totalAmount: args.totalAmount,
      salesAgentName: args.salesAgentName,

      // Contact information
      name: args.name,
      email: args.email,
      // `phone` is required in the schema, coerce undefined -> empty string to satisfy types
      phone: args.phone ?? "",

      // Emergency contact
      nameOfKin: args.nameOfKin,
      kinNumber: args.kinNumber,

      // Medical and logistics
      // schema expects a string for medicalCondition (non-optional), coerce to empty string
      medicalCondition: args.medicalCondition ?? "",
      pickUp: args.pickUp,

      // Confirmation and payment status
      confirm: args.confirm,
      paid: false,

      // Order reference and uploaded id fields
      orderReference: sanitizeReference(args.orderReference),
      schoolIdUrl: args.schoolIdUrl ?? null,
      schoolIdPublicId: args.schoolIdPublicId ?? null,

      // Timestamps
      createdAt: now,
      updatedAt: now,
    };

    const orderId = await ctx.db.insert("orders", orderRecord);

    return orderId;
  },
});

// Get order by reference
export const getOrderByReference = query({
  args: { orderReference: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_reference", (q) =>
        q.eq("orderReference", args.orderReference),
      )
      .first();

    return order;
  },
});

// Update order payment status
export const updateOrderPaymentStatus = mutation({
  args: {
    orderReference: v.string(),
    paid: v.boolean(),
    transactionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_reference", (q) =>
        q.eq("orderReference", args.orderReference),
      )
      .first();

    if (!order) {
      throw new Error("Order not found");
    }

    await ctx.db.patch(order._id, {
      paid: args.paid,
      updatedAt: Date.now(),
    });

    return order._id;
  },
});

// createPaymentRecord action moved to `convex/orders_node_actions.ts` to keep
// Node runtime APIs isolated. See that file for the action implementation.

// Get payment status
export const getPaymentStatus = query({
  args: { reference: v.string() },
  handler: async (ctx, args) => {
    try {
      const payment = await ctx.db
        .query("payments")
        .withIndex("by_reference", (q) =>
          q.eq("orderReference", args.reference),
        )
        .first();

      return payment;
    } catch (error) {
      // Defensive logging to aid debugging on the server
      try {
        // Prefer console for server logs in Convex
        console.error(
          `[getPaymentStatus] error for reference=${args.reference}:`,
          error,
        );
      } catch (e) {
        // swallow
      }

      // If Sentry server SDK is available in the environment, capture the exception
      try {
        const Sentry = require("@sentry/node");
        if (Sentry && Sentry.captureException) {
          Sentry.captureException(error, {
            tags: { function: "getPaymentStatus" },
            extra: { reference: args.reference },
          });
        }
      } catch (e) {
        // ignore if Sentry isn't available
      }

      // Return null so callers can handle missing payment records gracefully
      return null;
    }
  },
});

// Get payment by transactionId
export const getPaymentByTransactionId = query({
  args: { transactionId: v.string() },
  handler: async (ctx, args) => {
    try {
      const payment = await ctx.db
        .query("payments")
        .withIndex("by_transactionId", (q) =>
          q.eq("transactionId", args.transactionId),
        )
        .first();

      return payment;
    } catch (error) {
      try {
        console.error(
          `[getPaymentByTransactionId] error for transactionId=${args.transactionId}:`,
          error,
        );
      } catch (e) {
        // swallow
      }
      return null;
    }
  },
});

// Update payment status
export const updatePaymentStatus = mutation({
  args: {
    orderReference: v.string(),
    status: v.string(),
    transactionId: v.optional(v.string()),
    paymentChannel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_reference", (q) =>
        q.eq("orderReference", args.orderReference),
      )
      .first();

    if (!payment) {
      // Log the missing payment record but don't throw - this can happen if webhook
      // arrives before order/payment creation completes (race condition)
      console.warn(
        `[updatePaymentStatus] Payment record not found for orderReference: ${args.orderReference}`,
        {
          orderReference: args.orderReference,
          status: args.status,
          transactionId: args.transactionId,
          paymentChannel: args.paymentChannel,
        },
      );
      // Return null to indicate no update occurred
      return null;
    }

    await ctx.db.patch(payment._id, {
      status: args.status,
      transactionId: args.transactionId,
      paymentChannel: args.paymentChannel,
      updatedAt: Date.now(),
    });

    // If payment is successful, update the order
    if (args.status === "paid") {
      const order = await ctx.db
        .query("orders")
        .withIndex("by_reference", (q) =>
          q.eq("orderReference", args.orderReference),
        )
        .first();

      if (order) {
        await ctx.db.patch(order._id, {
          paid: true,
          updatedAt: Date.now(),
        });
      }
    }

    return payment._id;
  },
});

// Get all orders (for admin/director)
export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const orders = await ctx.db.query("orders").order("desc").collect();
    return orders;
  },
});

// Get all payments (for admin/director)
export const getAllPayments = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const payments = await ctx.db.query("payments").order("desc").collect();
    return payments;
  },
});

// Handle payment gateway callback (webhook)
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
    // Defensive logging for incoming callback
    try {
      console.info("[handlePaymentCallback] received callback", {
        orderReference: args.orderReference,
        status: args.status,
        transactionId: args.transactionId,
      });
    } catch (e) {
      // ignore
    }
    // Try to find matching payment record using index by_reference if available
    let payment = null;
    try {
      payment = await ctx.db
        .query("payments")
        .withIndex("by_reference", (q) =>
          q.eq("orderReference", args.orderReference),
        )
        .first();

      // Log lookup details to help diagnose reference mismatches
      try {
        console.info("[handlePaymentCallback] payment lookup result", {
          orderReference: args.orderReference,
          found: !!payment,
          paymentId: payment?._id,
          paymentStatusStored: payment?.status,
        });
      } catch (e) {
        // ignore
      }
    } catch (error) {
      // Log the database/query error but continue to return a structured response
      try {
        console.error(
          `[handlePaymentCallback] error querying payments for reference=${args.orderReference}:`,
          error,
        );
      } catch (e) {
        // swallow
      }

      return {
        success: false,
        message: "error querying payment record",
        error: String(error),
        reference: args.orderReference,
      };
    }

    if (!payment) {
      // If payment not found, log and return an explicit result so caller can retry or investigate
      console.warn(
        `[handlePaymentCallback] payment record not found for reference: ${args.orderReference}`,
      );
      return {
        success: false,
        message: "payment record not found",
        reference: args.orderReference,
      };
    }

    // Patch the payment record with new status and transactionId
    try {
      await ctx.db.patch(payment._id, {
        status: args.status,
        transactionId: args.transactionId,
        updatedAt: Date.now(),
      });

      try {
        console.info("[handlePaymentCallback] patched payment record", {
          paymentId: payment._id,
          newStatus: args.status,
          transactionId: args.transactionId,
        });
      } catch (e) {
        // ignore
      }
    } catch (error) {
      try {
        console.error(
          `[handlePaymentCallback] failed to patch payment ${payment._id}:`,
          error,
        );
      } catch (e) {
        // swallow
      }

      return {
        success: false,
        message: "failed to patch payment record",
        error: String(error),
        reference: args.orderReference,
      };
    }

    // If payment is marked as paid, mark the linked order as paid too
    if (args.status === "paid") {
      const order = await ctx.db
        .query("orders")
        .withIndex("by_reference", (q) =>
          q.eq("orderReference", args.orderReference),
        )
        .first();

      if (order) {
        try {
          await ctx.db.patch(order._id, {
            paid: true,
            updatedAt: Date.now(),
          });

          try {
            console.info("[handlePaymentCallback] patched order as paid", {
              orderId: order._id,
              orderReference: args.orderReference,
            });
          } catch (e) {
            // ignore
          }
        } catch (error) {
          try {
            console.error(
              `[handlePaymentCallback] failed to patch order ${order._id}:`,
              error,
            );
          } catch (e) {
            // swallow
          }
        }
      } else {
        // Log but continue - order may be inserted later due to race condition
        console.warn(
          `[handlePaymentCallback] order not found for reference: ${args.orderReference}`,
        );
      }
    }

    return { success: true, reference: args.orderReference };
  },
});

// Get order statistics (for admin/director dashboard)
export const getOrderStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const orders = await ctx.db.query("orders").collect();
    const payments = await ctx.db.query("payments").collect();

    const totalOrders = orders.length;
    const paidOrders = orders.filter((order) => order.paid).length;
    const totalRevenue = orders
      .filter((order) => order.paid)
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const successfulPayments = payments.filter(
      (payment) => payment.status === "paid",
    ).length;
    const pendingPayments = payments.filter(
      (payment) => payment.status === "pending",
    ).length;

    // Calculate monthly orders (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    }).length;

    return {
      totalOrders,
      paidOrders,
      totalRevenue,
      successfulPayments,
      pendingPayments,
      monthlyOrders,
    };
  },
});

// Internal mutation for inserting payment records (called from action)
export const insertPaymentRecord = internalMutation({
  args: {
    paymentData: v.object({
      token: v.string(),
      merchantCode: v.string(),
      currency: v.string(),
      orderAmount: v.number(),
      orderReference: v.string(),
      productType: v.string(),
      productDescription: v.string(),
      paymentTimeLimit: v.string(),
      customerFirstName: v.string(),
      customerLastName: v.string(),
      customerPostalCodeZip: v.string(),
      customerAddress: v.string(),
      customerEmail: v.string(),
      customerPhone: v.optional(v.string()),
      countryCode: v.string(),
      callbackUrl: v.string(),
      secondaryReference: v.string(),
      signature: v.string(),
      status: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
  },
  handler: async (ctx, args): Promise<string> => {
    return await ctx.db.insert("payments", args.paymentData);
  },
});

// Public mutation to reconcile orders (update orders where payment status is paid)
// Requires authentication via Clerk
export const reconcileOrders = mutation({
  args: {},
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Unauthorized: No user identity found");
      }

      console.log("[reconcileOrders] Starting reconciliation for user:", {
        id: identity.userId,
      });

      // Query all paid payments using the index
      let paidPayments: any[] = [];
      try {
        paidPayments = await ctx.db
          .query("payments")
          .withIndex("by_status", (q) => q.eq("status", "paid"))
          .collect();
      } catch (indexError) {
        console.error("[reconcileOrders] Error querying payments by index:", indexError);
        // Fallback: query all payments and filter
        const allPayments = await ctx.db.query("payments").collect();
        paidPayments = allPayments.filter((p: any) => p.status === "paid");
      }

      console.log(
        `[reconcileOrders] Found ${paidPayments.length} paid payments`,
      );

      let reconciled = 0;
      let skipped = 0;
      const errors: string[] = [];

      if (!paidPayments || paidPayments.length === 0) {
        console.log("[reconcileOrders] No paid payments found");
        return {
          reconciled: 0,
          skipped: 0,
          errors: ["No paid payments found"],
        };
      }

      // Process each paid payment
      for (const payment of paidPayments) {
        const orderReference = payment.orderReference as string | undefined;

        if (!orderReference) {
          skipped++;
          errors.push("Payment has no orderReference");
          console.warn("[reconcileOrders] Payment missing orderReference:", {
            paymentId: (payment as any)._id,
          });
          continue;
        }

        try {
          // Find the corresponding order
          const order = await ctx.db
            .query("orders")
            .withIndex("by_reference", (q) =>
              q.eq("orderReference", orderReference),
            )
            .first();

          if (!order) {
            skipped++;
            errors.push(`Order not found for reference ${orderReference}`);
            console.warn(
              `[reconcileOrders] Order not found for reference ${orderReference}`,
            );
            continue;
          }

          // Update order if not already paid
          if (!(order as any).paid) {
            await ctx.db.patch(order._id, {
              paid: true,
              updatedAt: Date.now(),
            });
            reconciled++;
            console.log(
              `[reconcileOrders] Updated order ${orderReference} to paid`,
            );
          } else {
            skipped++;
            console.log(
              `[reconcileOrders] Order ${orderReference} already paid, skipping`,
            );
          }
        } catch (orderError) {
          skipped++;
          const errorMsg =
            orderError instanceof Error ? orderError.message : "Unknown error";
          errors.push(
            `Failed to update order ${orderReference}: ${errorMsg}`,
          );
          console.error(
            `[reconcileOrders] Error processing payment ${orderReference}:`,
            orderError,
          );
        }
      }

      console.log(
        `[reconcileOrders] Completed: reconciled=${reconciled}, skipped=${skipped}, errors=${errors.length}`,
      );

      return {
        reconciled,
        skipped,
        errors,
      };
    } catch (error) {
      console.error("[reconcileOrders] Fatal error:", error);
      throw error;
    }
  },
});
