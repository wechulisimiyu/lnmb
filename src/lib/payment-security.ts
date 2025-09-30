/**
 * Payment Security Utilities
 * Implements security measures for Jenga Payment Gateway webhooks
 */

import crypto from "crypto";

/**
 * Verify Jenga PGW callback signature
 * Formula: merchantCode + orderReference + currency + orderAmount + callbackUrl
 * 
 * @param params - Callback parameters
 * @param receivedHash - Hash received from Jenga PGW
 * @param merchantCode - Merchant code from environment
 * @returns true if signature is valid
 */
export function verifyJengaSignature(
  params: {
    orderReference: string;
    amount: string;
    currency?: string;
    callbackUrl: string;
  },
  receivedHash: string,
  merchantCode: string
): boolean {
  if (!receivedHash || !merchantCode) {
    return false;
  }

  // Construct signature data as per Jenga documentation
  const currency = params.currency || "KES";
  const signatureData = `${merchantCode}${params.orderReference}${currency}${params.amount}${params.callbackUrl}`;
  
  // Jenga PGW uses SHA-256 hash
  const computedHash = crypto
    .createHash("sha256")
    .update(signatureData)
    .digest("hex");

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(receivedHash),
    Buffer.from(computedHash)
  );
}

/**
 * Validate required fields in callback payload
 */
export function validateCallbackPayload(payload: any): {
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

/**
 * Sanitize log data by removing sensitive information
 */
export function sanitizeLogData(data: any): any {
  const sensitiveFields = [
    "token",
    "hash",
    "customerEmail",
    "customerPhone",
    "mobileNumber",
  ];

  const sanitized = { ...data };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      // Keep first 4 chars for debugging, mask the rest
      const value = String(sanitized[field]);
      sanitized[field] = value.length > 4 
        ? `${value.substring(0, 4)}...` 
        : "***";
    }
  }

  return sanitized;
}

/**
 * Security logger for payment events
 */
export class PaymentSecurityLogger {
  private static formatMessage(
    level: string,
    event: string,
    data: any
  ): string {
    const timestamp = new Date().toISOString();
    const sanitized = sanitizeLogData(data);
    return `[${timestamp}] [${level}] [${event}] ${JSON.stringify(sanitized)}`;
  }

  static logSecurityEvent(event: string, data: any) {
    console.log(this.formatMessage("SECURITY", event, data));
  }

  static logSecurityError(event: string, data: any) {
    console.error(this.formatMessage("SECURITY_ERROR", event, data));
  }

  static logSecurityWarning(event: string, data: any) {
    console.warn(this.formatMessage("SECURITY_WARNING", event, data));
  }
}

/**
 * Generate idempotency key from order reference and transaction ID
 */
export function generateIdempotencyKey(
  orderReference: string,
  transactionId?: string
): string {
  const key = transactionId 
    ? `${orderReference}-${transactionId}` 
    : orderReference;
  
  return crypto.createHash("sha256").update(key).digest("hex");
}
