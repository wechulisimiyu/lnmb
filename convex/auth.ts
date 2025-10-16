import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Helper function to hash passwords (simple implementation)
// In production, use bcrypt or similar
function hashPassword(password: string): string {
  // This is a simple hash for demonstration
  // In production, use proper password hashing like bcrypt
  return Buffer.from(password).toString("base64");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Generate a random token
function generateToken(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Create a new user (admin only - for initial setup, can be called manually)
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("admin"), v.literal("director")),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      passwordHash: hashPassword(args.password),
      role: args.role,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return userId;
  },
});

// Login mutation
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("User account is inactive");
    }

    // Verify password
    if (!verifyPassword(args.password, user.passwordHash)) {
      throw new Error("Invalid email or password");
    }

    // Create session token
    const token = generateToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
      createdAt: Date.now(),
    });

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },
});

// Logout mutation
export const logout = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

// Verify session and get user
export const getCurrentUser = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) {
      return null;
    }

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      // Don't delete here, just return null
      // Cleanup can happen during logout or via a scheduled function
      return null;
    }

    // Get user
    const user = await ctx.db.get(session.userId);

    if (!user || !user.isActive) {
      return null;
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
});

// Helper to check if user has required role
export const checkRole = query({
  args: {
    token: v.string(),
    requiredRole: v.union(v.literal("admin"), v.literal("director")),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return false;
    }

    const user = await ctx.db.get(session.userId);

    if (!user || !user.isActive) {
      return false;
    }

    // Admin has access to everything
    if (user.role === "admin") {
      return true;
    }

    // Otherwise check if role matches
    return user.role === args.requiredRole;
  },
});
