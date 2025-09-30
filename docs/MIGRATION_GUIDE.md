# Migration Guide: Payment Security Update

## Overview

This guide helps you migrate to the new secure payment webhook endpoint.

## What Changed?

### Webhook URL
- **Old**: `https://yourdomain.com/api/payment/callback`
- **New**: `https://yourdomain.com/api/pgw-webhook-4365c21f`

### Security Features Added
1. Signature verification using SHA-256
2. Request validation and sanitization
3. Idempotency checks
4. Secure logging (PII removed)

## Migration Steps

### Step 1: Environment Variables
Ensure the following environment variables are set:

```bash
# Required for signature verification
JENGA_MERCHANT_CODE=your_merchant_code

# Existing variables (no change needed)
JENGA_CONSUMER_SECRET=your_consumer_secret
JENGA_API_KEY=your_api_key
SITE_URL=https://your-production-domain.com
```

**Action**: Add `JENGA_MERCHANT_CODE` to your `.env.local` and production environment.

### Step 2: Update Jenga Dashboard
1. Log in to your Jenga PGW merchant dashboard
2. Navigate to Settings → Webhooks
3. Update the callback URL to: `https://your-production-domain.com/api/pgw-webhook-4365c21f`
4. Save changes

**Note**: Keep the old URL active temporarily for testing (see Step 4).

### Step 3: Deploy Code Changes
Deploy the updated code to your staging/production environment:

```bash
git pull origin main
npm install  # if any dependencies changed
npm run build
# Deploy using your deployment method (Vercel, etc.)
```

**Verification**: Check deployment logs for the message about webhook endpoint being ready.

### Step 4: Test the New Webhook
Before fully switching over, test the new endpoint:

#### Option A: Jenga Sandbox
If you have access to Jenga sandbox:
1. Update sandbox webhook URL to new endpoint
2. Make a test payment
3. Verify webhook is received and processed
4. Check logs for signature verification success

#### Option B: Manual Test
Use curl to simulate a webhook:

```bash
# Generate a test signature
MERCHANT_CODE="your_merchant_code"
ORDER_REF="TEST123"
CURRENCY="KES"
AMOUNT="100"
CALLBACK_URL="https://yourdomain.com/api/pgw-webhook-4365c21f"

# Compute signature (use actual values)
SIGNATURE_DATA="${MERCHANT_CODE}${ORDER_REF}${CURRENCY}${AMOUNT}${CALLBACK_URL}"
HASH=$(echo -n "$SIGNATURE_DATA" | openssl dgst -sha256 -hex | awk '{print $2}')

# Send test webhook
curl -X POST https://yourdomain.com/api/pgw-webhook-4365c21f \
  -H "Content-Type: application/json" \
  -d "{
    \"orderReference\": \"${ORDER_REF}\",
    \"status\": \"paid\",
    \"amount\": \"${AMOUNT}\",
    \"transactionId\": \"TEST_TXN_123\",
    \"desc\": \"MPESA\",
    \"hash\": \"${HASH}\"
  }"
```

Expected response: `{"success":true,"message":"Payment status updated"}`

### Step 5: Monitor Production
After deployment, monitor for:

1. **Security Events**: Check logs for `[SECURITY]` entries
2. **Signature Failures**: Should be zero (check `[SECURITY_ERROR]` logs)
3. **Old Endpoint Usage**: Check for deprecation warnings from `/api/payment/callback`

```bash
# Example log search queries
grep "SECURITY_ERROR" logs.txt
grep "DEPRECATED" logs.txt
grep "CALLBACK_PROCESSED" logs.txt
```

### Step 6: Verify Payment Flow
1. Make a real test purchase (small amount)
2. Complete payment via MPESA/Card
3. Verify:
   - Payment status updates correctly
   - Order marked as paid
   - User receives confirmation
   - Logs show successful webhook processing

### Step 7: Decommission Old Endpoint (Optional)
After confirming the new endpoint works (recommend 1-2 weeks):

1. Verify no traffic to old endpoint: `grep "api/payment/callback" logs.txt`
2. If needed, update old endpoint to return 410 Gone status
3. Remove old endpoint code in a future release

**Note**: Keep the old endpoint for at least 2 weeks to ensure no delayed webhooks are lost.

## Rollback Plan

If issues occur with the new endpoint:

### Quick Rollback
1. Update Jenga dashboard to use old URL: `https://yourdomain.com/api/payment/callback`
2. Old endpoint still works (shows deprecation warnings but processes payments)
3. Investigate issues in logs
4. Fix and redeploy
5. Switch back to new URL

### Code Rollback
If you need to rollback the code entirely:

```bash
git revert <commit-hash>
git push origin main
# Redeploy
```

**Important**: The old callback endpoint was NOT removed, only marked as deprecated.

## Common Issues

### Issue 1: Signature Verification Fails
**Symptoms**: All webhooks rejected with 401 status
**Causes**:
- Wrong `JENGA_MERCHANT_CODE` in environment
- Callback URL mismatch between code and Jenga dashboard
- Currency not "KES"

**Fix**:
1. Verify `JENGA_MERCHANT_CODE` matches Jenga dashboard
2. Ensure `SITE_URL` in environment matches production domain
3. Check webhook URL in Jenga dashboard is exactly: `https://yourdomain.com/api/pgw-webhook-4365c21f`

### Issue 2: Duplicate Processing Warnings
**Symptoms**: Logs show `CALLBACK_DUPLICATE` warnings
**Causes**:
- Jenga retrying webhooks (normal behavior)
- Network issues causing retries

**Fix**: No action needed - this is expected behavior. The system prevents duplicate processing automatically.

### Issue 3: Missing Environment Variable
**Symptoms**: Error log `CRITICAL: JENGA_MERCHANT_CODE environment variable is not set`
**Fix**: Add `JENGA_MERCHANT_CODE` to environment variables and redeploy.

### Issue 4: Payments Not Updating
**Symptoms**: Webhooks received but payment status not changing
**Causes**:
- Database connection issues
- Order reference mismatch
- Signature verification failing silently

**Fix**:
1. Check logs for `CALLBACK_PROCESSED` entries
2. If missing, check for `SECURITY_ERROR` entries
3. Verify `orderReference` format matches between checkout and webhook

## Testing Checklist

Before marking migration complete:

- [ ] `JENGA_MERCHANT_CODE` environment variable set in production
- [ ] Webhook URL updated in Jenga dashboard
- [ ] Code deployed successfully
- [ ] Test payment completed successfully
- [ ] Payment status updated in database
- [ ] User received confirmation
- [ ] No signature verification errors in logs
- [ ] Security events logged correctly
- [ ] Old endpoint deprecation warnings visible (if still receiving webhooks there)

## Support

If you encounter issues:

1. Check logs for `[SECURITY_ERROR]` entries
2. Verify environment variables are set correctly
3. Review `docs/PAYMENT_SECURITY.md` for detailed documentation
4. Contact Jenga support if signature verification consistently fails

## Success Criteria

Migration is successful when:

✅ All payments process correctly through new endpoint
✅ Zero signature verification failures
✅ Payment status updates reflect in database
✅ No errors in production logs
✅ Old endpoint receives no traffic (after transition period)

## Timeline

Recommended migration timeline:

- **Day 0**: Deploy code to staging, test thoroughly
- **Day 1**: Deploy to production, update Jenga dashboard
- **Days 2-7**: Monitor closely, verify all webhooks successful
- **Day 14+**: Consider decommissioning old endpoint

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Contact**: Development Team
