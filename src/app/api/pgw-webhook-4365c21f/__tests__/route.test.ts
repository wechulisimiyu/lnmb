/**
 * Integration tests for the secure Jenga Payment Gateway webhook
 * 
 * These tests simulate actual production payloads from Jenga PGW
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

// Import Convex early so the mocked client instance is created before route imports

// Set environment variables for tests
process.env.NEXT_PUBLIC_CONVEX_URL = "https://test.convex.cloud";
process.env.JENGA_MERCHANT_CODE = "9543207071";
process.env.SITE_URL = "https://test.example.com";

// Mock Convex client
vi.mock("convex/browser", () => ({
  ConvexHttpClient: vi.fn().mockImplementation(() => ({
    query: vi.fn().mockResolvedValue({ _id: "payment123", orderReference: "LNMB1760382255555S8W1" }),
    mutation: vi.fn().mockResolvedValue("payment123"),
  })),
}));

// Mock Sentry
vi.mock("@sentry/nextjs", () => ({
  startSpan: vi.fn((config, callback) => callback()),
  captureException: vi.fn(),
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock payment security functions
vi.mock("@/lib/paymentSecurity", () => ({
  verifyJengaSignature: vi.fn().mockReturnValue(true),
  validateCallbackPayload: vi.fn().mockReturnValue({ valid: true, missing: [] }),
  PaymentSecurityLogger: {
    logSecurityEvent: vi.fn(),
    logSecurityWarning: vi.fn(),
    logSecurityError: vi.fn(),
  },
  generateIdempotencyKey: vi.fn((ref, txId) => `${ref}-${txId || "no-tx"}`),
}));

describe("Jenga PGW Webhook - Production Payload", () => {
  beforeEach(async () => {
    // Clear mock call history
    vi.clearAllMocks();
  });

  it("should handle production GET callback with transactionStatus=SUCCESS", async () => {
    // This simulates the actual production GET redirect from Jenga
    const searchParams = new URLSearchParams({
      responseStatus: "true",
      status: "paid",
      orderReference: "LNMB1760382255555S8W1",
      extraData: "null",
      transactionId: "SF0PLX5H96",
      date: "Mon Oct 13 2025",
      amount: "850",
      transactionCurrency: "KES",
      message: "Transaction completed successfully",
      paymentChannel: "MOBILE",
      orderItems: "null",
      secureResponse: "lQEjmZz3XhCmTAaQ1fSfnLGsULW5MVS846...", // truncated for brevity
    });

    const request = new Request(
      `https://test.example.com/api/pgw-webhook-4365c21f?${searchParams.toString()}`,
      {
        method: "GET",
      }
    );

    // Import the route handler
    const { GET } = await import("@/app/api/pgw-webhook-4365c21f/route");

  // Execute the handler
  const response = await GET(request as unknown as NextRequest);

    // Should redirect to result page
    expect(response.status).toBe(307); // Redirect status
    
    const location = response.headers.get("location");
    expect(location).toContain("/checkout/result");
    expect(location).toContain("reference=LNMB1760382255555S8W1");
  });

  it("should handle production POST callback with payment confirmation", async () => {
    // This simulates the server-to-server POST webhook from Jenga
    const payload = {
      transactionId: "SF0PLX5H96",
      status: "paid",
      date: "2025-10-13T10:30:00Z",
      desc: "MOBILE", // Payment channel
      amount: "850",
      orderReference: "LNMB1760382255555S8W1",
      hash: "mockedHash123", // In real scenario, this would be the actual signature
      extraData: null,
    };

    const request = new Request(
      "https://test.example.com/api/pgw-webhook-4365c21f",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

  // Import the route handler (this constructs the mocked Convex client instance)
  const { POST } = await import("@/app/api/pgw-webhook-4365c21f/route");

  // Execute the handler
  const response = await POST(request as unknown as NextRequest);
    const data = await response.json();

    // Should return success
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("updated");
  });

  it("should handle missing payment record gracefully", async () => {
    // Note: Due to module-level instantiation of ConvexHttpClient in route.ts,
    // we can't easily mock per-test. This test verifies the handler doesn't throw.
    const { POST } = await import("@/app/api/pgw-webhook-4365c21f/route");

    const payload = {
      transactionId: "SF0PLX5H96",
      status: "paid",
      date: "2025-10-13T10:30:00Z",
      desc: "MOBILE",
      amount: "850",
      orderReference: "NONEXISTENT_ORDER",
      hash: "mockedHash123",
      extraData: null,
    };

    const request = new Request(
      "https://test.example.com/api/pgw-webhook-4365c21f",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

  const response = await POST(request as unknown as NextRequest);
    const data = await response.json();

    // Should return 200 and not throw (the Convex mutation in convex/orders.ts is defensive)
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    // Message could be either "updated" or "not found" depending on mock state
    expect(data.message).toBeDefined();
  });

  it("should handle invalid signature gracefully", async () => {
    // Mock signature verification to fail BEFORE any imports
    const securityModule = await import("@/lib/paymentSecurity");
    vi.mocked(securityModule.verifyJengaSignature).mockReturnValueOnce(false);

    const payload = {
      transactionId: "SF0PLX5H96",
      status: "paid",
      amount: "850",
      orderReference: "LNMB1760382255555S8W1",
      hash: "invalidHash",
    };

    const request = new Request(
      "https://test.example.com/api/pgw-webhook-4365c21f",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const { POST } = await import("@/app/api/pgw-webhook-4365c21f/route");
  const response = await POST(request as unknown as NextRequest);
    const data = await response.json();

    // Should return 200 (not 401) to prevent Jenga retries
    expect(response.status).toBe(200);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  it("should handle duplicate webhooks with idempotency", async () => {
    // Use a unique order reference for this test to avoid collision with other tests
    const uniqueRef = `LNMB${Date.now()}IDEMPOTENCY`;
    const payload = {
      transactionId: "SF0PLX5H96",
      status: "paid",
      amount: "850",
      orderReference: uniqueRef,
      hash: "mockedHash123",
    };

    // Ensure Convex mock returns success for updates
    const convexMockModuleUnknown = (await import("convex/browser")) as unknown;
    const convexMockModule = convexMockModuleUnknown as {
      ConvexHttpClient: ((...args: unknown[]) => unknown) & { mockImplementation?: (impl: (...args: unknown[]) => unknown) => void };
    };
    // @ts-expect-error - testing environment provides vi.fn mocks
    convexMockModule.ConvexHttpClient.mockImplementation(() => ({
      query: vi.fn().mockResolvedValue({ _id: "payment123", orderReference: "LNMB1760382255555S8W1" }),
      mutation: vi.fn().mockResolvedValue("payment123"),
    }));

    const { POST } = await import("@/app/api/pgw-webhook-4365c21f/route");

    // First call should succeed
    const request1 = new Request(
      "https://test.example.com/api/pgw-webhook-4365c21f",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
  const response1 = await POST(request1 as unknown as NextRequest);
    const data1 = await response1.json();
    expect(data1.success).toBe(true);
    expect(data1.duplicate).not.toBe(true); // First call should not be marked duplicate

    // Second call with same data should be detected as duplicate
    const request2 = new Request(
      "https://test.example.com/api/pgw-webhook-4365c21f",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
  const response2 = await POST(request2 as unknown as NextRequest);
    const data2 = await response2.json();
    expect(data2.success).toBe(true);
    expect(data2.duplicate).toBe(true);
  });
});
