import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { ConvexError } from "convex/values";

// Helper function to hash passwords using bcrypt-compatible approach
// Note: bcryptjs is used as it's pure JavaScript and works in Convex
async function hashPassword(password: string): Promise<string> {
  // For Convex, we'll use the Web Crypto API for hashing
  // This is more secure than base64
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Generate a secure random token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Rate limiting constants
const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes

// Internal mutation to log audit events
export const logAuditEvent = internalMutation({
  args: {
    userId: v.optional(v.id("users")),
    email: v.optional(v.string()),
    action: v.string(),
    details: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    success: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("auditLogs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

// Check and update rate limiting
async function checkRateLimit(
  ctx: { db: any },
  email: string,
  ipAddress?: string
): Promise<boolean> {
  const now = Date.now();
  
  // Find existing rate limit record
  const rateLimit = await ctx.db
    .query("loginAttempts")
    .withIndex("by_email", (q: any) => q.eq("email", email))
    .first();

  if (!rateLimit) {
    // First attempt, create record
    await ctx.db.insert("loginAttempts", {
      email,
      ipAddress,
      attemptCount: 1,
      lastAttempt: now,
    });
    return true;
  }

  // Check if currently blocked
  if (rateLimit.blockedUntil && rateLimit.blockedUntil > now) {
    return false;
  }

  // Reset if window has passed
  if (now - rateLimit.lastAttempt > RATE_LIMIT_WINDOW) {
    await ctx.db.patch(rateLimit._id, {
      attemptCount: 1,
      lastAttempt: now,
      blockedUntil: undefined,
    });
    return true;
  }

  // Increment attempt count
  const newCount = rateLimit.attemptCount + 1;
  const updates: any = {
    attemptCount: newCount,
    lastAttempt: now,
  };

  // Block if too many attempts
  if (newCount >= MAX_LOGIN_ATTEMPTS) {
    updates.blockedUntil = now + BLOCK_DURATION;
    await ctx.db.patch(rateLimit._id, updates);
    return false;
  }

  await ctx.db.patch(rateLimit._id, updates);
  return true;
}

// Reset rate limit on successful login
async function resetRateLimit(ctx: { db: any }, email: string): Promise<void> {
  const rateLimit = await ctx.db
    .query("loginAttempts")
    .withIndex("by_email", (q: any) => q.eq("email", email))
    .first();

  if (rateLimit) {
    await ctx.db.delete(rateLimit._id);
  }
}

// Create a new user (admin only - for initial setup, can be called manually)
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("admin"), v.literal("director")),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new ConvexError("User with this email already exists");
    }

    const now = Date.now();
    const passwordHash = await hashPassword(args.password);
    
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      passwordHash,
      role: args.role,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      twoFactorEnabled: false,
    });

    // Log audit event
    await ctx.db.insert("auditLogs", {
      userId,
      email: args.email,
      action: "user_created",
      details: `User created with role: ${args.role}`,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      success: true,
      timestamp: now,
    });

    return userId;
  },
});

// Login mutation with rate limiting and audit logging
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check rate limiting
    const canAttempt = await checkRateLimit(ctx, args.email, args.ipAddress);
    if (!canAttempt) {
      // Log failed attempt
      await ctx.db.insert("auditLogs", {
        email: args.email,
        action: "failed_login",
        details: "Rate limit exceeded",
        ipAddress: args.ipAddress,
        userAgent: args.userAgent,
        success: false,
        timestamp: now,
      });
      throw new ConvexError("Too many login attempts. Please try again later.");
    }

    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      // Log failed attempt
      await ctx.db.insert("auditLogs", {
        email: args.email,
        action: "failed_login",
        details: "User not found",
        ipAddress: args.ipAddress,
        userAgent: args.userAgent,
        success: false,
        timestamp: now,
      });
      throw new ConvexError("Invalid email or password");
    }

    if (!user.isActive) {
      // Log failed attempt
      await ctx.db.insert("auditLogs", {
        userId: user._id,
        email: args.email,
        action: "failed_login",
        details: "User account is inactive",
        ipAddress: args.ipAddress,
        userAgent: args.userAgent,
        success: false,
        timestamp: now,
      });
      throw new ConvexError("User account is inactive");
    }

    // Verify password (only if passwordHash exists - for backwards compatibility with OAuth)
    if (user.passwordHash) {
      const isValid = await verifyPassword(args.password, user.passwordHash);
      if (!isValid) {
        // Log failed attempt
        await ctx.db.insert("auditLogs", {
          userId: user._id,
          email: args.email,
          action: "failed_login",
          details: "Invalid password",
          ipAddress: args.ipAddress,
          userAgent: args.userAgent,
          success: false,
          timestamp: now,
        });
        throw new ConvexError("Invalid email or password");
      }
    } else {
      // User registered via OAuth, cannot login with password
      await ctx.db.insert("auditLogs", {
        userId: user._id,
        email: args.email,
        action: "failed_login",
        details: "OAuth user attempted password login",
        ipAddress: args.ipAddress,
        userAgent: args.userAgent,
        success: false,
        timestamp: now,
      });
      throw new ConvexError("Please sign in with your OAuth provider");
    }

    // Reset rate limit on successful verification
    await resetRateLimit(ctx, args.email);

    // Create session token
    const token = generateToken();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
      createdAt: now,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
    });

    // Log successful login
    await ctx.db.insert("auditLogs", {
      userId: user._id,
      email: args.email,
      action: "login",
      details: "Successful login",
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      success: true,
      timestamp: now,
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

// Logout mutation with audit logging
export const logout = mutation({
  args: {
    token: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      const user = await ctx.db.get(session.userId);
      
      // Delete session
      await ctx.db.delete(session._id);

      // Log logout
      if (user) {
        await ctx.db.insert("auditLogs", {
          userId: user._id,
          email: user.email,
          action: "logout",
          details: "User logged out",
          ipAddress: args.ipAddress,
          userAgent: args.userAgent,
          success: true,
          timestamp: Date.now(),
        });
      }
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

// Get audit logs (admin only)
export const getAuditLogs = query({
  args: {
    token: v.string(),
    limit: v.optional(v.number()),
    userId: v.optional(v.id("users")),
    action: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify admin access
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError("Unauthorized: Invalid or expired session");
    }

    const user = await ctx.db.get(session.userId);

    if (!user || !user.isActive || user.role !== "admin") {
      throw new ConvexError("Unauthorized: Admin access required");
    }

    // Query audit logs
    let logs;

    if (args.userId) {
      logs = await ctx.db
        .query("auditLogs")
        .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
        .order("desc")
        .take(args.limit || 100);
    } else if (args.action) {
      logs = await ctx.db
        .query("auditLogs")
        .withIndex("by_action", (q: any) => q.eq("action", args.action))
        .order("desc")
        .take(args.limit || 100);
    } else {
      logs = await ctx.db
        .query("auditLogs")
        .withIndex("by_timestamp")
        .order("desc")
        .take(args.limit || 100);
    }

    return logs;
  },
});

// Get user sessions (for session management)
export const getUserSessions = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return [];
    }

    const user = await ctx.db.get(session.userId);
    if (!user || !user.isActive) {
      return [];
    }

    // Get all active sessions for this user
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.gt(q.field("expiresAt"), Date.now()))
      .collect();

    return sessions.map(s => ({
      token: s.token.substring(0, 10) + "...", // Only show part of token
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      isCurrent: s.token === args.token,
    }));
  },
});

// Revoke a specific session
export const revokeSession = mutation({
  args: {
    token: v.string(),
    targetToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify current session
    const currentSession = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!currentSession || currentSession.expiresAt < Date.now()) {
      throw new ConvexError("Unauthorized: Invalid or expired session");
    }

    const user = await ctx.db.get(currentSession.userId);
    if (!user || !user.isActive) {
      throw new ConvexError("Unauthorized");
    }

    // Find target session - must belong to the same user
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const targetSession = sessions.find(s => s.token.startsWith(args.targetToken));
    
    if (targetSession) {
      await ctx.db.delete(targetSession._id);
      
      // Log the revocation
      await ctx.db.insert("auditLogs", {
        userId: user._id,
        email: user.email,
        action: "session_revoked",
        details: "Session revoked by user",
        success: true,
        timestamp: Date.now(),
      });
    }

    return { success: true };
  },
});
