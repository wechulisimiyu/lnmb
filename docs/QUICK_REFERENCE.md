# Payment Security Quick Reference

## Webhook Endpoints

### Production Endpoint (Secure)
```
POST https://yourdomain.com/api/pgw-webhook-4365c21f
```

### Legacy Endpoint (Deprecated)
```
POST https://yourdomain.com/api/payment/callback
```
⚠️ Shows deprecation warnings - migrate to new endpoint

## Required Environment Variables

```bash
JENGA_MERCHANT_CODE=xxx        # Required for signature verification
JENGA_CONSUMER_SECRET=xxx      # Required for token generation
JENGA_API_KEY=xxx             # Required for API authentication
SITE_URL=https://yourdomain   # Must match production domain
```

## Webhook Signature Verification

### Formula
```
merchantCode + orderReference + currency + orderAmount + callbackUrl
```

### Example
```javascript
// Input
merchantCode = "TEST123"
orderReference = "ORD1234567890"
currency = "KES"
orderAmount = "1000"
callbackUrl = "https://yourdomain.com/api/pgw-webhook-4365c21f"

// Signature data
signatureData = "TEST123ORD1234567890KES1000https://yourdomain.com/api/pgw-webhook-4365c21f"

// Hash (SHA-256)
hash = sha256(signatureData)
```

## Expected Webhook Payload

```json
{
  "transactionId": "TXN123456789",
  "status": "paid",
  "date": "2024-01-01T12:00:00.000Z",
  "desc": "MPESA",
  "amount": "1000",
  "orderReference": "ORD1234567890",
  "hash": "computed_sha256_hash",
  "extraData": "optional_metadata"
}
```

## Webhook Responses

### Success (200)
```json
{
  "success": true,
  "message": "Payment status updated"
}
```

### Duplicate (200)
```json
{
  "success": true,
  "message": "Already processed",
  "duplicate": true
}
```

### Invalid Signature (401)
```json
{
  "error": "Webhook authentication failed",
  "reason": "Invalid signature"
}
```

### Missing Fields (400)
```json
{
  "error": "Invalid payload",
  "missing": ["orderReference", "status"]
}
```

### Server Error (500)
```json
{
  "error": "Failed to process payment callback"
}
```

## Security Features

| Feature | Status | Description |
|---------|--------|-------------|
| Signature Verification | ✅ Enabled | SHA-256 hash verification |
| Request Validation | ✅ Enabled | Required fields checked |
| Idempotency | ✅ Enabled | Prevents duplicate processing |
| Secure Logging | ✅ Enabled | PII automatically sanitized |
| Unpredictable Path | ✅ Enabled | Random 16-char hex path |

## Log Patterns

### Successful Webhook
```
[2024-01-01T12:00:00.000Z] [SECURITY] [CALLBACK_POST_RECEIVED] {"orderReference":"ORD1234567890","status":"paid","hasHash":true}
[2024-01-01T12:00:00.001Z] [SECURITY] [CALLBACK_PROCESSED] {"orderReference":"ORD1234567890","status":"paid","transactionId":"TXN123456789","channel":"MPESA"}
```

### Signature Failure
```
[2024-01-01T12:00:00.000Z] [SECURITY_ERROR] [CALLBACK_AUTH_FAILED] {"reason":"Invalid signature","orderReference":"ORD1234567890"}
```

### Duplicate Request
```
[2024-01-01T12:00:00.000Z] [SECURITY_WARNING] [CALLBACK_DUPLICATE] {"orderReference":"ORD1234567890","transactionId":"TXN123456789","idempotencyKey":"abc123..."}
```

### Missing Fields
```
[2024-01-01T12:00:00.000Z] [SECURITY_WARNING] [CALLBACK_INVALID_PAYLOAD] {"missing":["orderReference","status"]}
```

## Testing Commands

### Test Signature Generation (Bash)
```bash
MERCHANT_CODE="TEST123"
ORDER_REF="ORD1234567890"
CURRENCY="KES"
AMOUNT="1000"
CALLBACK_URL="https://yourdomain.com/api/pgw-webhook-4365c21f"

SIGNATURE_DATA="${MERCHANT_CODE}${ORDER_REF}${CURRENCY}${AMOUNT}${CALLBACK_URL}"
HASH=$(echo -n "$SIGNATURE_DATA" | openssl dgst -sha256 -hex | awk '{print $2}')

echo "Signature: $HASH"
```

### Test Webhook (cURL)
```bash
curl -X POST https://yourdomain.com/api/pgw-webhook-4365c21f \
  -H "Content-Type: application/json" \
  -d '{
    "orderReference": "ORD1234567890",
    "status": "paid",
    "amount": "1000",
    "transactionId": "TXN123456789",
    "desc": "MPESA",
    "hash": "computed_hash_here"
  }'
```

### Check Logs (Production)
```bash
# View security events
grep "SECURITY" logs.txt | tail -20

# View errors only
grep "SECURITY_ERROR" logs.txt

# View specific order
grep "ORD1234567890" logs.txt
```

## Common Tasks

### Add New Payment Method
1. No changes needed to webhook handler
2. Jenga handles payment method routing
3. Webhook receives payment regardless of method
4. Check `desc` field for payment channel

### Debug Failed Webhook
1. Check logs for `SECURITY_ERROR` entries
2. Verify `JENGA_MERCHANT_CODE` environment variable
3. Confirm callback URL in Jenga dashboard matches code
4. Test signature generation manually
5. Check database for order existence

### Rotate Credentials
1. Update `JENGA_MERCHANT_CODE` in environment
2. Update Jenga dashboard settings
3. Redeploy application
4. Test with new credentials
5. Monitor logs for signature errors

### Scale to Multiple Instances
1. Implement Redis for idempotency checks
2. Replace in-memory Set with Redis:
```javascript
// Replace processedTransactions Set with:
const redis = new Redis(process.env.REDIS_URL);
await redis.setex(`idem:${key}`, 3600, "1");
const isDuplicate = await redis.exists(`idem:${key}`);
```

## Monitoring Alerts

Set up alerts for:

| Condition | Threshold | Action |
|-----------|-----------|---------|
| Signature failures | > 5/min | Alert DevOps |
| Invalid payloads | > 10/min | Alert DevOps |
| Missing merchant code | Any | Critical alert |
| Duplicate rate | > 50% | Investigate Jenga |

## File Locations

- **Security utilities**: `src/lib/payment-security.ts`
- **Secure webhook**: `src/app/api/pgw-webhook-4365c21f/route.ts`
- **Tests**: `src/lib/__tests__/payment-security.test.ts`
- **Documentation**: `docs/PAYMENT_SECURITY.md`
- **Migration guide**: `docs/MIGRATION_GUIDE.md`

## Support Contacts

- **Jenga Support**: [Jenga API Documentation](https://developer.jengahq.io)
- **Internal Team**: Review docs/PAYMENT_SECURITY.md
- **Emergency**: Check runbooks for payment processing issues

---

**Quick Links**:
- [Full Security Documentation](./PAYMENT_SECURITY.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Security Hardening Summary](./SECURITY_HARDENING_SUMMARY.md)
