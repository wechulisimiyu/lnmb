import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  orders: defineTable({
    // Student information
    student: v.string(), // "yes" or "no"
    university: v.optional(v.string()), // "uon", "partner", "other"
    yearOfStudy: v.optional(v.string()), // "I", "II", "III", "IV", "IVs", "V", "VI"
    regNumber: v.optional(v.string()),

    // Attendance and product details
    attending: v.string(), // "attending" or "notattending"
    tshirtType: v.string(), // "polo" or "round"
    tshirtSize: v.string(), // "small", "medium", "large", "extra-large", or cart format "M:2,L:3,XL:1"
    quantity: v.number(),
    totalAmount: v.number(),
    salesAgentName: v.optional(v.string()), // Optional sales agent who assisted

    // Contact information
    name: v.string(),
    email: v.string(),
    phone: v.string(),

    // Emergency contact
    nameOfKin: v.string(),
    kinNumber: v.string(),

    // Medical and logistics
    medicalCondition: v.string(),
    pickUp: v.optional(v.string()), // "kenyatta-national-hospital" or "chiromo-campus"

    // Confirmation and payment status
    confirm: v.string(),
    paid: v.boolean(),

    // Order reference for payment tracking
    orderReference: v.string(),
    // Uploaded school ID image URL (Cloudinary)
    schoolIdUrl: v.optional(v.string()),
    // Cloudinary public id for the uploaded school ID (for later management)
    schoolIdPublicId: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_reference", ["orderReference"])
    .index("by_email", ["email"])
    .index("by_phone", ["phone"])
    .index("by_created_at", ["createdAt"]),

  payments: defineTable({
    // Jenga PGW fields for /processPayment (made optional for backward compatibility)
    token: v.optional(v.string()),
    merchantCode: v.optional(v.string()),
    currency: v.optional(v.string()),
    orderAmount: v.optional(v.number()),
    orderReference: v.string(),
    productType: v.optional(v.string()),
    productDescription: v.optional(v.string()),
    paymentTimeLimit: v.optional(v.string()),
    customerFirstName: v.optional(v.string()),
    customerLastName: v.optional(v.string()),
    customerPostalCodeZip: v.optional(v.string()),
    customerAddress: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    callbackUrl: v.optional(v.string()),
    countryCode: v.optional(v.string()),
    secondaryReference: v.optional(v.string()),
    signature: v.optional(v.string()),
    extraData: v.optional(v.string()),

    // Legacy fields (for backward compatibility)
    amount: v.optional(v.number()),
    phoneNumber: v.optional(v.string()),

    // Payment status tracking
    status: v.string(), // "pending", "processing", "paid", "failed"
    transactionId: v.optional(v.string()),
    paymentChannel: v.optional(v.string()), // "MPESA", "CARD", "EQUITEL", etc.

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_reference", ["orderReference"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),
});
