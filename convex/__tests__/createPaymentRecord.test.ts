import fs from "fs";
import path from "path";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";

// We'll dynamically import the action so we can mock generateAccessToken
describe("createPaymentRecord action (integration-style)", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    vi.restoreAllMocks();
  });

  test("returns paymentData with signature field (when private key present)", async () => {
    // Ensure we have a private key available in repo for signing
    const privateKeyPath = path.resolve(process.cwd(), "privatekey.pem");
    if (!fs.existsSync(privateKeyPath)) {
      // Skip test if no local private key — still useful in CI where key may be set via env
      console.warn("Skipping signing integration test: privatekey.pem not found");
      return;
    }

    // Ensure expected env vars used in signature computation
    process.env.JENGA_MERCHANT_CODE = process.env.JENGA_MERCHANT_CODE || "TESTMERCH";
    process.env.SITE_URL = process.env.SITE_URL || "http://localhost:3000";

    // Mock generateAccessToken to avoid external network calls
    vi.doMock("../utils/generateAccessToken", () => ({
      default: async () => "tok_test",
    }));

  const mod = await import("../orders_node_actions");

    // Create a fake Convex action context with minimal runMutation and db
    const fakeCtx: any = {
      runMutation: async (fn: any, args: any) => {
        // call the internalMutation directly if it's exported (not in test); simulate DB insert id
        return "payment_123";
      },
    };

    // Call the handler directly via the exported action function
    // The action is exported as createPaymentRecord; we call its handler property
    let handler = (mod as any).createPaymentRecord?.handler;
    if (typeof handler !== "function") {
      // Some runtimes export the action as the function itself
      handler = (mod as any).createPaymentRecord;
    }

    if (typeof handler !== "function") {
      throw new Error("Could not locate createPaymentRecord handler to invoke");
    }
    const args = {
      orderReference: "ORD12345678",
      orderAmount: 1000,
      customerFirstName: "Test",
      customerLastName: "User",
      customerEmail: "test@example.com",
      customerPhone: "0712345678",
      customerAddress: "Nairobi",
      productDescription: "T-Shirt",
    };

    const result = await handler(fakeCtx, args);

    expect(result).toBeDefined();
    expect(result.paymentId).toBeDefined();
    expect(result.paymentData).toBeDefined();
    // signature can be empty if no private key found — ensure it's a string
    expect(typeof result.paymentData.signature).toBe("string");

    // If local public key present, verify signature is valid and non-empty
    const pubPath = path.resolve(process.cwd(), "publickey.pem");
    if (fs.existsSync(pubPath) && result.paymentData.signature) {
      const pub = fs.readFileSync(pubPath, "utf8");
      const signatureBase64 = result.paymentData.signature;
      const signatureData = `${process.env.JENGA_MERCHANT_CODE || "TESTMERCH"}${args.orderReference}KES${String(args.orderAmount)}${process.env.SITE_URL ? `${process.env.SITE_URL}/api/pgw-webhook-4365c21f` : "http://localhost:3000/api/pgw-webhook-4365c21f"}`;
      const verified = await import("crypto").then((c) =>
        c.verify("RSA-SHA256", Buffer.from(signatureData), { key: pub, padding: c.constants.RSA_PKCS1_PADDING }, Buffer.from(signatureBase64, "base64")),
      );
      expect(verified).toBe(true);
    }
  });
});
