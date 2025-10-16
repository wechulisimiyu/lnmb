import { describe, it, expect, beforeEach } from "vitest";
import { ConvexTestingHelper } from "convex-helpers/testing";
import schema from "../schema";
import { api } from "../_generated/api";

describe("Auth System", () => {
  let t: ConvexTestingHelper<typeof schema>;

  beforeEach(async () => {
    t = new ConvexTestingHelper(schema);
    await t.run(async (ctx) => {
      // Clear all data before each test
      const users = await ctx.db.query("users").collect();
      for (const user of users) {
        await ctx.db.delete(user._id);
      }
      const sessions = await ctx.db.query("sessions").collect();
      for (const session of sessions) {
        await ctx.db.delete(session._id);
      }
    });
  });

  describe("User Creation", () => {
    it("should create a new admin user", async () => {
      const userId = await t.mutation(api.auth.createUser, {
        name: "Test Admin",
        email: "admin@test.com",
        password: "password123",
        role: "admin",
      });

      expect(userId).toBeDefined();

      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });

      expect(user).toBeDefined();
      expect(user?.name).toBe("Test Admin");
      expect(user?.email).toBe("admin@test.com");
      expect(user?.role).toBe("admin");
      expect(user?.isActive).toBe(true);
    });

    it("should create a new director user", async () => {
      const userId = await t.mutation(api.auth.createUser, {
        name: "Test Director",
        email: "director@test.com",
        password: "password123",
        role: "director",
      });

      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });

      expect(user?.role).toBe("director");
    });

    it("should not create duplicate users", async () => {
      await t.mutation(api.auth.createUser, {
        name: "Test User",
        email: "test@test.com",
        password: "password123",
        role: "admin",
      });

      await expect(
        t.mutation(api.auth.createUser, {
          name: "Another User",
          email: "test@test.com",
          password: "password456",
          role: "admin",
        })
      ).rejects.toThrow("User with this email already exists");
    });
  });

  describe("Login", () => {
    beforeEach(async () => {
      // Create a test user
      await t.mutation(api.auth.createUser, {
        name: "Test User",
        email: "user@test.com",
        password: "password123",
        role: "admin",
      });
    });

    it("should login with valid credentials", async () => {
      const result = await t.mutation(api.auth.login, {
        email: "user@test.com",
        password: "password123",
      });

      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe("user@test.com");
      expect(result.user.role).toBe("admin");
    });

    it("should not login with invalid email", async () => {
      await expect(
        t.mutation(api.auth.login, {
          email: "wrong@test.com",
          password: "password123",
        })
      ).rejects.toThrow("Invalid email or password");
    });

    it("should not login with invalid password", async () => {
      await expect(
        t.mutation(api.auth.login, {
          email: "user@test.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow("Invalid email or password");
    });
  });

  describe("Session Management", () => {
    let token: string;
    let userId: string;

    beforeEach(async () => {
      // Create a test user and login
      const userIdResult = await t.mutation(api.auth.createUser, {
        name: "Test User",
        email: "user@test.com",
        password: "password123",
        role: "admin",
      });
      userId = userIdResult as string;

      const loginResult = await t.mutation(api.auth.login, {
        email: "user@test.com",
        password: "password123",
      });
      token = loginResult.token;
    });

    it("should get current user with valid token", async () => {
      const user = await t.query(api.auth.getCurrentUser, {
        token,
      });

      expect(user).toBeDefined();
      expect(user?.email).toBe("user@test.com");
      expect(user?.role).toBe("admin");
    });

    it("should return null for invalid token", async () => {
      const user = await t.query(api.auth.getCurrentUser, {
        token: "invalid-token",
      });

      expect(user).toBeNull();
    });

    it("should logout and invalidate session", async () => {
      const logoutResult = await t.mutation(api.auth.logout, {
        token,
      });

      expect(logoutResult.success).toBe(true);

      // Token should no longer work
      const user = await t.query(api.auth.getCurrentUser, {
        token,
      });

      expect(user).toBeNull();
    });
  });

  describe("Role-Based Access", () => {
    let adminToken: string;
    let directorToken: string;

    beforeEach(async () => {
      // Create admin user
      await t.mutation(api.auth.createUser, {
        name: "Admin User",
        email: "admin@test.com",
        password: "password123",
        role: "admin",
      });

      const adminLogin = await t.mutation(api.auth.login, {
        email: "admin@test.com",
        password: "password123",
      });
      adminToken = adminLogin.token;

      // Create director user
      await t.mutation(api.auth.createUser, {
        name: "Director User",
        email: "director@test.com",
        password: "password123",
        role: "director",
      });

      const directorLogin = await t.mutation(api.auth.login, {
        email: "director@test.com",
        password: "password123",
      });
      directorToken = directorLogin.token;
    });

    it("admin should have access to admin role", async () => {
      const hasAccess = await t.query(api.auth.checkRole, {
        token: adminToken,
        requiredRole: "admin",
      });

      expect(hasAccess).toBe(true);
    });

    it("admin should have access to director role", async () => {
      const hasAccess = await t.query(api.auth.checkRole, {
        token: adminToken,
        requiredRole: "director",
      });

      expect(hasAccess).toBe(true);
    });

    it("director should have access to director role", async () => {
      const hasAccess = await t.query(api.auth.checkRole, {
        token: directorToken,
        requiredRole: "director",
      });

      expect(hasAccess).toBe(true);
    });

    it("director should not have access to admin role", async () => {
      const hasAccess = await t.query(api.auth.checkRole, {
        token: directorToken,
        requiredRole: "admin",
      });

      expect(hasAccess).toBe(false);
    });
  });
});
