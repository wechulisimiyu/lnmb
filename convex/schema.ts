import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  payments: defineTable({
    phoneNumber: v.string(),
    amount: v.number(),
    orderReference: v.string(),
    customerFirstName: v.string(),
    customerLastName: v.string(),
    customerEmail: v.string(),
    customerAddress: v.optional(v.string()),
    productDescription: v.optional(v.string()),
    status: v.string(), // pending, initiated, paid, failed
    transactionId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_reference", ["orderReference"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),
});
