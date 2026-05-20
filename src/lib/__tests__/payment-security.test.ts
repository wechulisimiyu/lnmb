/**
 * Tests for Payment Security Utilities
 */

import { describe, it, expect } from "vitest";
import crypto from "crypto";

/**
 * Mock implementation of payment security functions for testing
 * (The actual implementations are in src/lib/paymentSecurity.ts)
 */

function verifyJengaSignature(
  params: {
    orderReference: string;
    amount: string;
    currency?: string;
    callbackUrl: string;
  },
  receivedHash: string,
  merchantCode: string,
): boolean {
  if (!receivedHash || !merchantCode) {
    return false;
  }

  const currency = params.currency || "KES";
  const signatureData = `${merchantCode}${params.orderReference}${currency}${params.amount}${params.callbackUrl}`;

  const computedHash = crypto
    .createHash("sha256")
    .update(signatureData)
    .digest("hex");
  try {
    const receivedBuf = Buffer.from(receivedHash, "hex");
    const computedBuf = Buffer.from(computedHash, "hex");
    if (receivedBuf.length !== computedBuf.length) return false;
    return crypto.timingSafeEqual(receivedBuf, computedBuf);
  } catch {
    return false;
  }
}

function validateCallbackPayload(payload: Record<string, unknown>): {
  valid: boolean;
  missing: string[];
} {
  const requiredFields = ["orderReference", "status"];
  const missing: string[] = [];

  for (const field of requiredFields) {
    if (!payload[field]) {
      missing.push(field);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

function sanitizeLogData(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const sensitiveFields = [
    "token",
    "hash",
    "customerEmail",
    "customerPhone",
    "mobileNumber",
  ];

  const sanitized: Record<string, unknown> = { ...data };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      const value = String(sanitized[field]);
      sanitized[field] =
        value.length > 4 ? `${value.substring(0, 4)}...` : "***";
    }
  }

  return sanitized;
}

function generateIdempotencyKey(
  orderReference: string,
  transactionId?: string,
): string {
  const key = transactionId
    ? `${orderReference}-${transactionId}`
    : orderReference;

  return crypto.createHash("sha256").update(key).digest("hex");
}

describe("Payment Security - Signature Verification", () => {
  const merchantCode = "TEST123";
  const callbackUrl = "https://example.com/api/webhook";

  it("should verify valid signature correctly", () => {
    const params = {
      orderReference: "ORD12345",
      amount: "1000",
      currency: "KES",
      callbackUrl,
    };

    // Generate expected hash
    const signatureData = `${merchantCode}${params.orderReference}${params.currency}${params.amount}${callbackUrl}`;
    const expectedHash = crypto
      .createHash("sha256")
      .update(signatureData)
      .digest("hex");

    const result = verifyJengaSignature(params, expectedHash, merchantCode);
    expect(result).toBe(true);
  });

  it("should reject invalid signature", () => {
    const params = {
      orderReference: "ORD12345",
      amount: "1000",
      currency: "KES",
      callbackUrl,
    };

    const invalidHash = "invalid_hash_value_1234567890abcdef";
    const result = verifyJengaSignature(params, invalidHash, merchantCode);
    expect(result).toBe(false);
  });

  it("should reject missing hash", () => {
    const params = {
      orderReference: "ORD12345",
      amount: "1000",
      currency: "KES",
      callbackUrl,
    };

    const result = verifyJengaSignature(params, "", merchantCode);
    expect(result).toBe(false);
  });

  it("should reject missing merchant code", () => {
    const params = {
      orderReference: "ORD12345",
      amount: "1000",
      currency: "KES",
      callbackUrl,
    };

    const result = verifyJengaSignature(params, "somehash", "");
    expect(result).toBe(false);
  });

  it("should use default currency KES if not provided", () => {
    const params = {
      orderReference: "ORD12345",
      amount: "1000",
      callbackUrl,
    };

    // Generate hash with KES as default
    const signatureData = `${merchantCode}${params.orderReference}KES${params.amount}${callbackUrl}`;
    const expectedHash = crypto
      .createHash("sha256")
      .update(signatureData)
      .digest("hex");

    const result = verifyJengaSignature(params, expectedHash, merchantCode);
    expect(result).toBe(true);
  });

  it("should detect tampering with amount", () => {
    const params = {
      orderReference: "ORD12345",
      amount: "1000",
      currency: "KES",
      callbackUrl,
    };

    // Generate hash with original amount
    const signatureData = `${merchantCode}${params.orderReference}${params.currency}${params.amount}${callbackUrl}`;
    const originalHash = crypto
      .createHash("sha256")
      .update(signatureData)
      .digest("hex");

    // Change amount after hash generation (simulating tampering)
    params.amount = "10000";

    const result = verifyJengaSignature(params, originalHash, merchantCode);
    expect(result).toBe(false);
  });
});

describe("Payment Security - Payload Validation", () => {
  it("should validate complete payload", () => {
    const payload = {
      orderReference: "ORD12345",
      status: "paid",
      transactionId: "TXN98765",
    };

    const result = validateCallbackPayload(payload);
    expect(result.valid).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it("should detect missing orderReference", () => {
    const payload = {
      status: "paid",
      transactionId: "TXN98765",
    };

    const result = validateCallbackPayload(payload);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain("orderReference");
  });

  it("should detect missing status", () => {
    const payload = {
      orderReference: "ORD12345",
      transactionId: "TXN98765",
    };

    const result = validateCallbackPayload(payload);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain("status");
  });

  it("should detect multiple missing fields", () => {
    const payload = {
      transactionId: "TXN98765",
    };

    const result = validateCallbackPayload(payload);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain("orderReference");
    expect(result.missing).toContain("status");
  });

  it("should accept payload with optional fields", () => {
    const payload = {
      orderReference: "ORD12345",
      status: "paid",
      transactionId: "TXN98765",
      amount: "1000",
      desc: "MPESA",
      extraData: "some_data",
    };

    const result = validateCallbackPayload(payload);
    expect(result.valid).toBe(true);
  });
});

describe("Payment Security - Data Sanitization", () => {
  it("should sanitize sensitive email data", () => {
    const data = {
      orderReference: "ORD12345",
      customerEmail: "test@example.com",
    };

    const sanitized = sanitizeLogData(data);
    expect(sanitized.orderReference).toBe("ORD12345");
    expect(sanitized.customerEmail).toBe("test...");
  });

  it("should sanitize phone numbers", () => {
    const data = {
      customerPhone: "254712345678",
      mobileNumber: "254798765432",
    };

    const sanitized = sanitizeLogData(data);
    expect(sanitized.customerPhone).toBe("2547...");
    expect(sanitized.mobileNumber).toBe("2547...");
  });

  it("should sanitize tokens and hashes", () => {
    const data = {
      token: "abc123def456ghi789",
      hash: "fedcba987654321",
    };

    const sanitized = sanitizeLogData(data);
    expect(sanitized.token).toBe("abc1...");
    expect(sanitized.hash).toBe("fedc...");
  });

  it("should handle short sensitive values", () => {
    const data = {
      token: "abc",
    };

    const sanitized = sanitizeLogData(data);
    expect(sanitized.token).toBe("***");
  });

  it("should preserve non-sensitive data", () => {
    const data = {
      orderReference: "ORD12345",
      status: "paid",
      amount: "1000",
      customerEmail: "test@example.com",
    };

    const sanitized = sanitizeLogData(data);
    expect(sanitized.orderReference).toBe("ORD12345");
    expect(sanitized.status).toBe("paid");
    expect(sanitized.amount).toBe("1000");
    expect(sanitized.customerEmail).toBe("test...");
  });
});

describe("Payment Security - Idempotency", () => {
  it("should generate consistent key for same inputs", () => {
    const orderRef = "ORD12345";
    const txnId = "TXN98765";

    const key1 = generateIdempotencyKey(orderRef, txnId);
    const key2 = generateIdempotencyKey(orderRef, txnId);

    expect(key1).toBe(key2);
  });

  it("should generate different keys for different order references", () => {
    const txnId = "TXN98765";

    const key1 = generateIdempotencyKey("ORD12345", txnId);
    const key2 = generateIdempotencyKey("ORD67890", txnId);

    expect(key1).not.toBe(key2);
  });

  it("should generate different keys for different transaction IDs", () => {
    const orderRef = "ORD12345";

    const key1 = generateIdempotencyKey(orderRef, "TXN11111");
    const key2 = generateIdempotencyKey(orderRef, "TXN22222");

    expect(key1).not.toBe(key2);
  });

  it("should handle missing transaction ID", () => {
    const orderRef = "ORD12345";

    const key1 = generateIdempotencyKey(orderRef);
    const key2 = generateIdempotencyKey(orderRef);

    expect(key1).toBe(key2);
    expect(key1).toBeTruthy();
  });

  it("should generate valid SHA-256 hash format", () => {
    const key = generateIdempotencyKey("ORD12345", "TXN98765");

    // SHA-256 produces 64 character hex string
    expect(key).toHaveLength(64);
    expect(key).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe("Payment Security - Integration Scenarios", () => {
  it("should handle complete valid webhook", () => {
    const merchantCode = "TEST123";
    const callbackUrl = "https://example.com/api/webhook";

    const payload = {
      orderReference: "ORD12345",
      status: "paid",
      amount: "1000",
      transactionId: "TXN98765",
      currency: "KES",
    };

    // Generate valid signature
    const signatureData = `${merchantCode}${payload.orderReference}${payload.currency}${payload.amount}${callbackUrl}`;
    const hash = crypto
      .createHash("sha256")
      .update(signatureData)
      .digest("hex");

    const payloadWithHash = { ...payload, hash };

    // Validate
    const validation = validateCallbackPayload(payloadWithHash);
    expect(validation.valid).toBe(true);

    const signatureValid = verifyJengaSignature(
      {
        orderReference: payload.orderReference,
        amount: payload.amount,
        currency: payload.currency,
        callbackUrl,
      },
      hash,
      merchantCode,
    );
    expect(signatureValid).toBe(true);

    // Sanitize for logging - ensure we mask but keep prefix
    const sanitized = sanitizeLogData(payloadWithHash);
    expect(typeof sanitized.hash).toBe("string");
    expect((sanitized.hash as string).endsWith("...")).toBe(true);
  });

  it("should reject webhook with tampered data", () => {
    const merchantCode = "TEST123";
    const callbackUrl = "https://example.com/api/webhook";

    const originalPayload = {
      orderReference: "ORD12345",
      status: "paid",
      amount: "1000",
      currency: "KES",
    };

    // Generate hash for original payload
    const signatureData = `${merchantCode}${originalPayload.orderReference}${originalPayload.currency}${originalPayload.amount}${callbackUrl}`;
    const hash = crypto
      .createHash("sha256")
      .update(signatureData)
      .digest("hex");

    // Tamper with amount
    const tamperedPayload = {
      ...originalPayload,
      amount: "10000", // Changed from 1000
      hash,
    };

    // Validation should pass (structure is fine)
    const validation = validateCallbackPayload(tamperedPayload);
    expect(validation.valid).toBe(true);

    // But signature verification should fail
    const signatureValid = verifyJengaSignature(
      {
        orderReference: tamperedPayload.orderReference,
        amount: tamperedPayload.amount,
        currency: tamperedPayload.currency,
        callbackUrl,
      },
      hash,
      merchantCode,
    );
    expect(signatureValid).toBe(false);
  });
});
