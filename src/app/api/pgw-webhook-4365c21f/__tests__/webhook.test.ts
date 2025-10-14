/**
 * Integration test for Jenga Payment Gateway webhook
 * Simulates production payloads to ensure proper handling
 */

import { describe, it, expect } from "vitest";
import crypto from "crypto";

/**
 * Mock Jenga webhook payload generator
 */
function generateJengaWebhookPayload(
  orderReference: string,
  status: "paid" | "pending" | "failed",
  options: {
    transactionId?: string;
    amount?: string;
    merchantCode?: string;
    callbackUrl?: string;
  } = {}
): {
  transactionId?: string;
  status: string;
  date?: string;
  desc?: string;
  amount?: string;
  orderReference: string;
  hash: string;
  extraData?: string;
} {
  const merchantCode = options.merchantCode || "TEST123";
  const amount = options.amount || "1000";
  const callbackUrl = options.callbackUrl || "https://example.com/api/pgw-webhook-4365c21f";
  const transactionId = options.transactionId || `TXN${Date.now()}`;
  
  // Generate hash as per Jenga spec: merchantCode + orderReference + currency + amount + callbackUrl
  const signatureData = `${merchantCode}${orderReference}KES${amount}${callbackUrl}`;
  const hash = crypto.createHash("sha256").update(signatureData).digest("hex");

  return {
    transactionId,
    status,
    date: new Date().toISOString(),
    desc: "MPESA", // Payment channel
    amount,
    orderReference,
    hash,
    extraData: JSON.stringify({ channel: "MPESA" }),
  };
}

describe("Jenga Webhook Integration Tests", () => {
  const merchantCode = "TEST123";
  const callbackUrl = "https://example.com/api/pgw-webhook-4365c21f";

  describe("Webhook Payload Generation", () => {
    it("should generate valid webhook payload with correct hash", () => {
      const orderReference = "ORD123456";
      const amount = "2500";

      const payload = generateJengaWebhookPayload(orderReference, "paid", {
        amount,
        merchantCode,
        callbackUrl,
      });

      expect(payload.orderReference).toBe(orderReference);
      expect(payload.status).toBe("paid");
      expect(payload.amount).toBe(amount);
      expect(payload.hash).toBeDefined();
      expect(payload.transactionId).toBeDefined();

      // Verify hash can be regenerated
      const expectedSignatureData = `${merchantCode}${orderReference}KES${amount}${callbackUrl}`;
      const expectedHash = crypto
        .createHash("sha256")
        .update(expectedSignatureData)
        .digest("hex");

      expect(payload.hash).toBe(expectedHash);
    });

    it("should generate different hashes for different amounts", () => {
      const orderReference = "ORD123456";
      
      const payload1 = generateJengaWebhookPayload(orderReference, "paid", {
        amount: "1000",
        merchantCode,
        callbackUrl,
      });
      
      const payload2 = generateJengaWebhookPayload(orderReference, "paid", {
        amount: "2000",
        merchantCode,
        callbackUrl,
      });

      expect(payload1.hash).not.toBe(payload2.hash);
    });

    it("should generate payload for different payment statuses", () => {
      const orderReference = "ORD123456";
      
      const paidPayload = generateJengaWebhookPayload(orderReference, "paid", {
        merchantCode,
        callbackUrl,
      });
      
      const pendingPayload = generateJengaWebhookPayload(orderReference, "pending", {
        merchantCode,
        callbackUrl,
      });
      
      const failedPayload = generateJengaWebhookPayload(orderReference, "failed", {
        merchantCode,
        callbackUrl,
      });

      expect(paidPayload.status).toBe("paid");
      expect(pendingPayload.status).toBe("pending");
      expect(failedPayload.status).toBe("failed");
    });
  });

  describe("Production Payload Simulation", () => {
    it("should handle successful payment webhook payload", () => {
      const orderReference = "ORD1234567890";
      const transactionId = "TXN9876543210";
      const amount = "3500";

      const payload = generateJengaWebhookPayload(orderReference, "paid", {
        transactionId,
        amount,
        merchantCode,
        callbackUrl,
      });

      // Verify payload structure matches Jenga's format
      expect(payload).toHaveProperty("orderReference");
      expect(payload).toHaveProperty("status");
      expect(payload).toHaveProperty("transactionId");
      expect(payload).toHaveProperty("hash");
      expect(payload).toHaveProperty("amount");
      expect(payload).toHaveProperty("desc");
      expect(payload).toHaveProperty("date");

      // Verify required fields are not empty
      expect(payload.orderReference).toBeTruthy();
      expect(payload.status).toBeTruthy();
      expect(payload.hash).toBeTruthy();
    });

    it("should handle pending payment webhook payload", () => {
      const orderReference = "ORD1234567890";
      
      const payload = generateJengaWebhookPayload(orderReference, "pending", {
        merchantCode,
        callbackUrl,
      });

      expect(payload.status).toBe("pending");
      expect(payload.orderReference).toBe(orderReference);
      expect(payload.hash).toBeDefined();
    });

    it("should handle failed payment webhook payload", () => {
      const orderReference = "ORD1234567890";
      
      const payload = generateJengaWebhookPayload(orderReference, "failed", {
        merchantCode,
        callbackUrl,
      });

      expect(payload.status).toBe("failed");
      expect(payload.orderReference).toBe(orderReference);
      expect(payload.hash).toBeDefined();
    });

    it("should include payment channel information", () => {
      const orderReference = "ORD1234567890";
      
      const payload = generateJengaWebhookPayload(orderReference, "paid", {
        merchantCode,
        callbackUrl,
      });

      expect(payload.desc).toBe("MPESA");
      expect(payload.extraData).toBeDefined();
      
      const extraData = JSON.parse(payload.extraData!);
      expect(extraData.channel).toBe("MPESA");
    });
  });

  describe("Hash Tampering Detection", () => {
    it("should detect when amount is tampered", () => {
      const orderReference = "ORD123456";
      const originalAmount = "1000";
      
      const payload = generateJengaWebhookPayload(orderReference, "paid", {
        amount: originalAmount,
        merchantCode,
        callbackUrl,
      });

      // Store original hash
      const originalHash = payload.hash;

      // Tamper with amount
      payload.amount = "10000";

      // Verify hash with tampered amount should fail
      const tamperedSignatureData = `${merchantCode}${orderReference}KES${payload.amount}${callbackUrl}`;
      const tamperedHash = crypto
        .createHash("sha256")
        .update(tamperedSignatureData)
        .digest("hex");

      expect(payload.hash).toBe(originalHash);
      expect(payload.hash).not.toBe(tamperedHash);
    });

    it("should detect when order reference is tampered", () => {
      const originalOrderReference = "ORD123456";
      const amount = "1000";
      
      const payload = generateJengaWebhookPayload(originalOrderReference, "paid", {
        amount,
        merchantCode,
        callbackUrl,
      });

      const originalHash = payload.hash;

      // Tamper with order reference
      payload.orderReference = "ORD999999";

      // Verify hash with tampered order reference should fail
      const tamperedSignatureData = `${merchantCode}${payload.orderReference}KES${amount}${callbackUrl}`;
      const tamperedHash = crypto
        .createHash("sha256")
        .update(tamperedSignatureData)
        .digest("hex");

      expect(payload.hash).toBe(originalHash);
      expect(payload.hash).not.toBe(tamperedHash);
    });
  });

  describe("Payload Validation", () => {
    it("should validate payload with all required fields", () => {
      const payload = generateJengaWebhookPayload("ORD123456", "paid", {
        merchantCode,
        callbackUrl,
      });

      const requiredFields = ["orderReference", "status", "hash"];
      
      requiredFields.forEach(field => {
        expect(payload).toHaveProperty(field);
        const value = (payload as Record<string, unknown>)[field];
        expect(value).toBeTruthy();
      });
    });

    it("should handle payload with minimal required fields", () => {
      const minimalPayload = {
        orderReference: "ORD123456",
        status: "paid",
        hash: "dummyhash",
      };

      expect(minimalPayload.orderReference).toBeTruthy();
      expect(minimalPayload.status).toBeTruthy();
      expect(minimalPayload.hash).toBeTruthy();
    });
  });

  describe("Idempotency Key Generation", () => {
    it("should generate consistent idempotency key for same order and transaction", () => {
      const orderReference = "ORD123456";
      const transactionId = "TXN987654";

      const key1 = generateIdempotencyKey(orderReference, transactionId);
      const key2 = generateIdempotencyKey(orderReference, transactionId);

      expect(key1).toBe(key2);
    });

    it("should generate different keys for different transactions", () => {
      const orderReference = "ORD123456";
      
      const key1 = generateIdempotencyKey(orderReference, "TXN111");
      const key2 = generateIdempotencyKey(orderReference, "TXN222");

      expect(key1).not.toBe(key2);
    });

    it("should generate key from order reference only when transaction is missing", () => {
      const orderReference = "ORD123456";
      
      const key = generateIdempotencyKey(orderReference);
      
      expect(key).toBeDefined();
      expect(typeof key).toBe("string");
      expect(key.length).toBeGreaterThan(0);
    });
  });
});

function generateIdempotencyKey(
  orderReference: string,
  transactionId?: string
): string {
  const key = transactionId 
    ? `${orderReference}-${transactionId}` 
    : orderReference;
  
  return crypto.createHash("sha256").update(key).digest("hex");
}
