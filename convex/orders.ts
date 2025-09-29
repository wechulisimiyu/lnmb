import { v } from "convex/values";
import { mutation, query, action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import generateAccessToken from "./utils/generateAccessToken";

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
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    nameOfKin: v.string(),
    kinNumber: v.string(),
    medicalCondition: v.string(),
    pickUp: v.optional(v.string()),
    confirm: v.string(),
    orderReference: v.string(),
    schoolIdUrl: v.optional(v.string()),
    schoolIdPublicId: v.optional(v.string()),
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

    const orderRecord = {
      ...args,
      university: normalizedUniversity,
      paid: false,
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

// Create payment record for Jenga PGW (Action because it calls external API)
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
    ctx,
    args,
  ): Promise<{ paymentId: string; paymentData: any }> => {
    const now = Date.now();

    // Generate payment token (external API call - this is why we need an action)
    const token = await generateAccessToken();

    const paymentData = {
      token,
      merchantCode: process.env.JENGA_MERCHANT_CODE!,
      currency: "KES",
      orderAmount: args.orderAmount,
      orderReference: args.orderReference,
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
      callbackUrl: `${process.env.SITE_URL}/api/payment/callback`,
      secondaryReference: args.orderReference,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    // Use runMutation to insert into database from action
    const paymentId = await ctx.runMutation(
      internal.orders.insertPaymentRecord,
      {
        paymentData,
      },
    );

    return { paymentId, paymentData };
  },
});

// Get payment status
export const getPaymentStatus = query({
  args: { reference: v.string() },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_reference", (q) => q.eq("orderReference", args.reference))
      .first();

    return payment;
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
      throw new Error("Payment record not found");
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

// Get all orders (for admin)
export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").order("desc").collect();

    return orders;
  },
});

// Get all payments (for admin)
export const getAllPayments = query({
  args: {},
  handler: async (ctx) => {
    const payments = await ctx.db.query("payments").order("desc").collect();

    return payments;
  },
});

// Get order statistics (for admin dashboard)
export const getOrderStats = query({
  args: {},
  handler: async (ctx) => {
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
      customerPhone: v.string(),
      countryCode: v.string(),
      callbackUrl: v.string(),
      secondaryReference: v.string(),
      status: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
  },
  handler: async (ctx, args): Promise<string> => {
    return await ctx.db.insert("payments", args.paymentData);
  },
});
