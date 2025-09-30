# Payment Security Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Payment Flow                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Customer  │────────▶│  LNMB Site   │────────▶│  Jenga PGW   │
│             │         │  (Next.js)   │         │   Payment    │
└─────────────┘         └──────────────┘         └──────────────┘
      │                        ▲                         │
      │ 1. Initiates           │ 4. Redirected          │ 2. Pays
      │    Checkout            │    back                 │
      │                        │                         │
      └────────────────────────┴─────────────────────────┘
                               │
                        3. Webhook POST
                     (with signature)


┌─────────────────────────────────────────────────────────────────┐
│                      Security Layers                             │
└─────────────────────────────────────────────────────────────────┘

                    Jenga PGW Webhook
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  Unpredictable Endpoint          │
        │  /api/pgw-webhook-4365c21f       │
        │  (Random 16-char hex)            │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  Request Validation              │
        │  • Check required fields         │
        │  • Validate JSON structure       │
        │  ✅ Pass / ❌ 400 Bad Request    │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  Signature Verification          │
        │  • Extract hash from payload     │
        │  • Compute expected hash         │
        │  • Timing-safe comparison        │
        │  ✅ Pass / ❌ 401 Unauthorized   │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  Idempotency Check               │
        │  • Generate idempotency key      │
        │  • Check if already processed    │
        │  • Store key with TTL            │
        │  ✅ New / ⚠️ Duplicate (skip)   │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  Process Payment Update          │
        │  • Update payment status         │
        │  • Update order status           │
        │  • Log security event            │
        │  ✅ 200 Success                  │
        └──────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                   Signature Verification                         │
└─────────────────────────────────────────────────────────────────┘

Input Components:
  • merchantCode:     "MERCHANT123"
  • orderReference:   "ORD1234567890"
  • currency:         "KES"
  • orderAmount:      "1000"
  • callbackUrl:      "https://domain.com/api/pgw-webhook-4365c21f"

Concatenation (no separators):
  signatureData = merchantCode + orderReference + 
                  currency + orderAmount + callbackUrl
  
  = "MERCHANT123ORD1234567890KES1000https://domain.com/api/pgw-webhook-4365c21f"

SHA-256 Hash:
  expectedHash = sha256(signatureData)
  = "a3c5e8d9f1b2c4a6e8f0d2b4c6a8e0f2d4b6c8a0e2f4d6b8c0a2e4f6d8b0c2a4"

Verification:
  if (timingSafeEqual(receivedHash, expectedHash)) {
    ✅ Valid signature - Process webhook
  } else {
    ❌ Invalid signature - Reject with 401
  }


┌─────────────────────────────────────────────────────────────────┐
│                     Idempotency System                           │
└─────────────────────────────────────────────────────────────────┘

Request 1 (orderRef: ORD123, txnId: TXN456):
  ┌─────────────────────────────────┐
  │ 1. Generate key:                │
  │    sha256("ORD123-TXN456")      │
  │    = "abc123..."                │
  │                                 │
  │ 2. Check if exists: NO          │
  │                                 │
  │ 3. Store key with 1hr TTL       │
  │                                 │
  │ 4. Process payment update       │
  │    ✅ Status updated            │
  └─────────────────────────────────┘

Request 2 (same orderRef + txnId) - Retry/Duplicate:
  ┌─────────────────────────────────┐
  │ 1. Generate key:                │
  │    sha256("ORD123-TXN456")      │
  │    = "abc123..." (same)         │
  │                                 │
  │ 2. Check if exists: YES         │
  │                                 │
  │ 3. Return success without       │
  │    processing again             │
  │    ⚠️ Already processed         │
  └─────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                      Secure Logging                              │
└─────────────────────────────────────────────────────────────────┘

Before Sanitization:
{
  "orderReference": "ORD1234567890",
  "customerEmail": "customer@example.com",
  "customerPhone": "254712345678",
  "token": "abc123def456ghi789",
  "hash": "a3c5e8d9f1b2c4a6..."
}

After Sanitization:
{
  "orderReference": "ORD1234567890",      ← Kept
  "customerEmail": "cust...",             ← Masked (first 4 chars)
  "customerPhone": "2547...",             ← Masked
  "token": "abc1...",                     ← Masked
  "hash": "a3c5..."                       ← Masked
}

Logged as:
[2024-01-01T12:00:00.000Z] [SECURITY] [CALLBACK_PROCESSED] 
{"orderReference":"ORD1234567890","customerEmail":"cust..."}


┌─────────────────────────────────────────────────────────────────┐
│                    Error Handling Matrix                         │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────┬────────┬──────────────────────────────┐
│ Error Type            │ Status │ Response                     │
├───────────────────────┼────────┼──────────────────────────────┤
│ Missing signature     │  401   │ Authentication failed        │
│ Invalid signature     │  401   │ Invalid signature            │
│ Missing required field│  400   │ Invalid payload + fields     │
│ Malformed JSON        │  400   │ Invalid request              │
│ Duplicate request     │  200   │ Already processed (skip)     │
│ Database error        │  500   │ Processing failed            │
│ Valid request         │  200   │ Success                      │
└───────────────────────┴────────┴──────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                   Production Deployment                          │
└─────────────────────────────────────────────────────────────────┘

Development Environment:
  SITE_URL=http://localhost:3000
  Webhook: http://localhost:3000/api/pgw-webhook-4365c21f

Production Environment:
  SITE_URL=https://yourdomain.com
  Webhook: https://yourdomain.com/api/pgw-webhook-4365c21f
           ↑
           HTTPS enforced by Vercel/deployment platform

Jenga PGW Dashboard Configuration:
  1. Login to merchant dashboard
  2. Navigate to Settings → Webhooks
  3. Set callback URL: https://yourdomain.com/api/pgw-webhook-4365c21f
  4. Save and test


┌─────────────────────────────────────────────────────────────────┐
│                    Monitoring Dashboard                          │
└─────────────────────────────────────────────────────────────────┘

Key Metrics:
  ┌─────────────────────────┬─────────────────────────┐
  │ Webhook Requests        │ ████████████ 1,245      │
  │ Successful Processing   │ ████████████ 1,240      │
  │ Signature Failures      │ █            2          │
  │ Validation Failures     │ █            1          │
  │ Duplicate Requests      │ ██           15         │
  └─────────────────────────┴─────────────────────────┘

Alerts:
  • Signature failures > 5/min    → DevOps Alert
  • Validation failures > 10/min  → DevOps Alert
  • Missing merchant code         → Critical Alert

Search Patterns:
  grep "SECURITY_ERROR" logs.txt     # Find security issues
  grep "CALLBACK_PROCESSED" logs.txt # Successful webhooks
  grep "ORD123" logs.txt             # Specific order


┌─────────────────────────────────────────────────────────────────┐
│                    Files & Responsibilities                      │
└─────────────────────────────────────────────────────────────────┘

src/lib/payment-security.ts
  • verifyJengaSignature()      - Signature verification
  • validateCallbackPayload()   - Request validation
  • sanitizeLogData()            - PII removal
  • PaymentSecurityLogger        - Secure logging
  • generateIdempotencyKey()    - Duplicate detection

src/app/api/pgw-webhook-4365c21f/route.ts
  • GET handler                  - User redirects
  • POST handler                 - Webhook processing
  • verifyWebhookAuthenticity()  - Security checks
  • checkIdempotency()           - Duplicate prevention

src/lib/__tests__/payment-security.test.ts
  • Signature verification tests
  • Validation tests
  • Sanitization tests
  • Idempotency tests
  • Integration scenarios
