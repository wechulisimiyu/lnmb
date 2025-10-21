import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

process.env.NEXT_PUBLIC_CONVEX_URL = "https://test.convex.cloud";

// Mock Convex client
vi.mock("convex/browser", () => ({
  ConvexHttpClient: vi.fn().mockImplementation(() => ({
    query: vi.fn().mockImplementation((fnName: string, args: unknown) => {
      // Simple behavior: if reference provided return fake payment; if transactionId return fake
      const a = args as Record<string, unknown> | null;
      if (a && typeof a.reference === "string" && a.reference === "FOUND_REF") {
        return Promise.resolve({
          _id: "p1",
          orderReference: "FOUND_REF",
          status: "paid",
          transactionId: "TX1",
        });
      }
      if (
        a &&
        typeof a.transactionId === "string" &&
        a.transactionId === "FOUND_TX"
      ) {
        return Promise.resolve({
          _id: "p2",
          orderReference: "REF_TX",
          status: "processing",
          transactionId: "FOUND_TX",
        });
      }
      return Promise.resolve(null);
    }),
  })),
}));

vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

import { GET } from "@/app/api/checkout/status/route";

describe("GET /api/checkout/status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns payment by reference", async () => {
    const req = new Request(
      "https://test.example.com/api/checkout/status?reference=FOUND_REF",
      { method: "GET" },
    );
    const res = await GET(req as unknown as NextRequest);
    expect(res).toBeDefined();
  expect(res.status).toBe(200);
  const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.payment).toBeTruthy();
    expect(body.payment.orderReference).toBe("FOUND_REF");
  });

  it("returns payment by transactionId", async () => {
    const req = new Request(
      "https://test.example.com/api/checkout/status?transactionId=FOUND_TX",
      { method: "GET" },
    );
    const res = await GET(req as unknown as NextRequest);
    expect(res).toBeDefined();
  expect(res.status).toBe(200);
  const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.payment).toBeTruthy();
    expect(body.payment.transactionId).toBe("FOUND_TX");
  });

  it("returns 400 when missing params", async () => {
    const req = new Request("https://test.example.com/api/checkout/status", {
      method: "GET",
    });
    const res = await GET(req as unknown as NextRequest);
    expect(res).toBeDefined();
  expect(res.status).toBe(400);
  const body = await res.json();
    expect(body.success).toBe(false);
  });
});
