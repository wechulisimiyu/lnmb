import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getMerchInventory = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("merchInventory").collect();
  },
});

export const setMerchInventory = mutation({
  args: {
    item: v.string(),
    available: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("merchInventory")
      .withIndex("by_item", (q) => q.eq("item", args.item))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        available: args.available,
        updatedAt: now,
      });
      return existing._id;
    }

    return ctx.db.insert("merchInventory", {
      item: args.item,
      available: args.available,
      createdAt: now,
      updatedAt: now,
    });
  },
});