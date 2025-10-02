# Payment Integration Security Documentation

## Overview

This document outlines the security measures implemented for the Jenga Payment Gateway integration, following industry best practices and the provider's documentation.

## Security Features Implemented

### 1. Webhook Signature Verification ✅

**Implementation:**
- All POST webhook requests verify the `hash` field sent by Jenga PGW
- Signature formula: `merchantCode + orderReference + currency + orderAmount + callbackUrl`
- Uses SHA-256 hashing as per Jenga documentation
- Timing-safe comparison to prevent timing attacks
- Requests with missing or invalid signatures are rejected with 401 status

**Location:** `src/lib/payment-security.ts` - `verifyJengaSignature()`

**Configuration Required:**
- `JENGA_MERCHANT_CODE` environment variable must be set

### 2. Endpoint Security ✅

**Implementation:**
- Webhook endpoint uses unpredictable path: `/api/pgw-webhook-4365c21f`
- Old endpoint `/api/payment/callback` is deprecated and logs warnings
- HTTPS enforced through deployment platform (Vercel/production environment)

**Locations:**
- New secure endpoint: `src/app/api/pgw-webhook-4365c21f/route.ts`
- Deprecated endpoint: `src/app/api/payment/callback/route.ts` (maintained for backward compatibility)

### 3. Request Validation ✅

**Implementation:**
- Validates required fields: `orderReference`, `status`
- Rejects malformed or incomplete requests with 400 status
- Structured payload validation before processing

**Location:** `src/lib/payment-security.ts` - `validateCallbackPayload()`

### 4. Idempotency Checks ✅

**Implementation:**
- Prevents duplicate processing of the same transaction
- Uses SHA-256 hash of `orderReference + transactionId` as idempotency key
- In-memory storage with 1-hour TTL (recommend Redis for production scale)
- Duplicate requests return success but don't re-process

**Location:** `src/app/api/pgw-webhook-4365c21f/route.ts` - `checkIdempotency()`

**Production Note:** For production environments with multiple server instances, implement idempotency using:
- Redis with TTL
- Database table with unique constraint on idempotency key
- Distributed cache service

### 5. Secure Logging ✅

**Implementation:**
- Structured security event logging
- Automatic sanitization of sensitive data (PII, tokens, hashes)
- Logs rejection reasons for debugging
- Security events categorized: INFO, WARNING, ERROR

**Location:** `src/lib/payment-security.ts` - `PaymentSecurityLogger` class

**What's Logged:**
- Signature verification failures
- Missing required fields
- Duplicate transaction attempts
- Successful webhook processing

**What's NOT Logged:**
- Full tokens or API keys
- Customer email addresses (masked)
- Phone numbers (masked)
- Payment hashes (masked)

### 6. Key Management ✅

**Implementation:**
- All secrets stored in environment variables
- No hardcoded credentials in source code
- Environment sample file with security notes
- Validation for missing critical environment variables

**Required Environment Variables:**
```bash
JENGA_MERCHANT_CODE=xxx        # Required for signature verification
JENGA_CONSUMER_SECRET=xxx      # Required for token generation
JENGA_API_KEY=xxx             # Required for API calls
SITE_URL=https://your-domain  # Must match production domain
```

**Location:** `env.sample` with security documentation

### 7. Comprehensive Testing ✅

**Implementation:**
- Unit tests for signature verification (valid, invalid, tampered)
- Tests for payload validation
- Tests for data sanitization
- Tests for idempotency key generation
- Integration scenarios testing

**Location:** `src/lib/__tests__/payment-security.test.ts`

**Test Coverage:**
- ✅ Valid signature verification
- ✅ Invalid signature rejection
- ✅ Missing required fields detection
- ✅ Data tampering detection
- ✅ Sensitive data sanitization
- ✅ Idempotency key consistency
- ✅ Complete webhook flow scenarios

## Security Features NOT Implemented

### IP Validation ❌

**Status:** Not implemented
**Reason:** Jenga PGW documentation does not publish official IP ranges
**Recommendation:** Contact Jenga support to obtain IP whitelist. Once available, implement:

```typescript
// Example implementation when IP ranges are available
const JENGA_IP_RANGES = process.env.JENGA_IP_RANGES?.split(',') || [];

function validateSourceIP(request: NextRequest): boolean {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0] || request.ip;
  
  return JENGA_IP_RANGES.some(range => ipInRange(ip, range));
}
```

## Deployment Checklist

Before deploying to production:

- [ ] Set all required environment variables
- [ ] Verify `SITE_URL` matches production domain (must be HTTPS)
- [ ] Update Jenga PGW dashboard with new webhook URL: `https://yourdomain.com/api/pgw-webhook-4365c21f`
- [ ] Test webhook with Jenga sandbox environment
- [ ] Implement Redis-based idempotency for multi-instance deployments
- [ ] Set up monitoring for security events (signature failures, validation errors)
- [ ] Configure rate limiting at infrastructure level (Vercel/CloudFlare)
- [ ] Review and rotate credentials regularly (quarterly recommended)

## Webhook URL Configuration

**Development:**
```
http://localhost:3000/api/pgw-webhook-4365c21f
```

**Production:**
```
https://your-domain.com/api/pgw-webhook-4365c21f
```

**Important:** Update this URL in your Jenga PGW merchant dashboard settings.

## Monitoring and Alerts

Recommended monitoring setup:

1. **Security Events to Monitor:**
   - Signature verification failures (potential attack)
   - High rate of invalid payloads (potential probing)
   - Duplicate transaction attempts
   - Missing merchant code errors

2. **Alert Thresholds:**
   - > 5 signature failures per minute → Alert
   - > 10 invalid payloads per minute → Alert
   - Missing environment variables → Critical alert

3. **Log Analysis:**
   - Search for `[SECURITY_ERROR]` entries
   - Track duplicate transaction patterns
   - Monitor callback processing latency

## Testing Webhooks

### Test Valid Webhook

```bash
curl -X POST https://your-domain.com/api/pgw-webhook-4365c21f \
  -H "Content-Type: application/json" \
  -d '{
    "orderReference": "ORD1234567890",
    "status": "paid",
    "amount": "1000",
    "transactionId": "TXN987654321",
    "desc": "MPESA",
    "hash": "<computed_hash>"
  }'
```

### Test Invalid Signature

```bash
curl -X POST https://your-domain.com/api/pgw-webhook-4365c21f \
  -H "Content-Type: application/json" \
  -d '{
    "orderReference": "ORD1234567890",
    "status": "paid",
    "amount": "1000",
    "hash": "invalid_hash"
  }'
```

Expected: 401 Unauthorized

### Test Missing Fields

```bash
curl -X POST https://your-domain.com/api/pgw-webhook-4365c21f \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paid"
  }'
```

Expected: 400 Bad Request

## Security Incident Response

If you detect suspicious activity:

1. **Immediate Actions:**
   - Review security logs for the timeframe
   - Check for unauthorized payment status changes
   - Verify no fraudulent transactions were processed

2. **Investigation:**
   - Identify source IP addresses
   - Review all webhook calls during the incident
   - Check idempotency key patterns

3. **Remediation:**
   - Rotate API credentials if compromised
   - Update webhook URL if exposed
   - Implement additional monitoring

4. **Contact Jenga Support:**
   - Report suspicious webhook attempts
   - Request IP whitelist if not already implemented
   - Verify webhook security configuration

## Code Review Checklist

For future changes to payment integration:

- [ ] Signature verification remains enabled and tested
- [ ] No sensitive data logged in plain text
- [ ] Environment variables used for all secrets
- [ ] Idempotency checks in place
- [ ] Error messages don't leak system information
- [ ] Tests updated for new changes
- [ ] Security documentation updated

## References

- Jenga Payment Gateway Documentation: https://developer.jengahq.io/guides/jenga-pgw/checkout-reference
- OWASP Webhook Security: https://cheatsheetseries.owasp.org/cheatsheets/Webhook_Security_Cheat_Sheet.html
- Payment Security Best Practices: PCI DSS Compliance Guidelines

## Version History

- **v1.0.0** (Initial Implementation)
  - Signature verification
  - Unpredictable webhook endpoint
  - Request validation
  - Idempotency checks
  - Secure logging
  - Comprehensive tests

## Support

For security concerns or questions, contact the development team or refer to the Jenga PGW support documentation.
