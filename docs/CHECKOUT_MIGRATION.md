# Checkout & Payment Migration

This document explains the migration from the old Convex-based checkout/STK flow
to the new client-driven Jenga Checkout flow used by this repo.

## Summary

- Old flow: Convex server code performed STK pushes and handled payment callbacks.
- New flow: Convex/Backend only prepares `paymentData` (token, merchantCode, callbackUrl,
  signature). The Next.js frontend posts a standard form to Jenga's `/processPayment`.
- The Convex checkout/STK functions are deprecated and will throw an error when
  invoked. Their implementations are retained as commented references in
  `convex/checkout.ts` for auditing.

## Why we changed

- Simpler deploy and ownership model: client redirects to the gateway UI for
  payment collection.
- Less server-side complexity: no need to maintain STK push orchestration in Convex.
- Security: signature generation and private-key handling are now explicit and
  controlled server-side before rendering the client form.

## What changed in code

- `convex/orders.ts` (active):
  - Prepares `paymentData` including `token`, `merchantCode`, `callbackUrl`, and
    `signature`.
  - Signature is now RSA-SHA256 (base64) signed using `JENGA_PRIVATE_KEY` or
    `JENGA_PRIVATE_KEY_PATH` (fallback to `privatekey.pem` in the repo for local dev).

- `src/app/checkout/page.tsx` (frontend):
  - Fetches `paymentData` via the Convex action and constructs a hidden form.
  - Posts the form to `NEXT_PUBLIC_JENGA_PROCESS_URL` (default: Jenga UAT endpoint).
  - Includes `signature` as a hidden field when present.

- `convex/checkout.ts` (deprecated):
  - Checkout, STK push and callback handlers are marked deprecated and now throw
    a descriptive error at runtime. The original implementations are preserved
    in commented blocks for reference.

## Environment variables

Add the following to `.env.local` for local development, or set them in your
hosting provider's secret store for production:

### Required (for token generation)

- `JENGA_MERCHANT_CODE`
- `JENGA_CONSUMER_SECRET`
- `JENGA_API_KEY`

### Optional / signing

- `JENGA_PRIVATE_KEY` (PEM string) — preferred for production secret store.
- `JENGA_PRIVATE_KEY_PATH` (file path) — can point to `./privatekey.pem` for local dev.
- `NEXT_PUBLIC_JENGA_PROCESS_URL` — default: `https://v3-uat.jengapgw.io/processPayment`

### Optional / signing (alternative storage)

- `JENGA_PRIVATE_KEY_BASE64` — base64-encoded PEM value. Useful for secret stores that prefer single-line values.

Example: create a base64-encoded PEM on macOS / Linux:

```bash
base64 -w 0 privatekey.pem > privatekey.pem.base64
# then copy the single-line contents into your secret store or into JENGA_PRIVATE_KEY_BASE64
```

In production, prefer storing the PEM in your secret manager as multiline (set `JENGA_PRIVATE_KEY`) or store the base64 single-line string in `JENGA_PRIVATE_KEY_BASE64` and let the runtime decode it.

## Security notes

- Do not commit private keys or real credentials to the repository.
- Ensure `SITE_URL` matches the callback URL used in the signature exactly
  (no trailing slash mismatch).
- Use environment secrets in production (Vercel/Azure/GCP secret manager).

## Testing locally

1. Add `JENGA_PRIVATE_KEY_PATH=./privatekey.pem` to `.env.local`.
2. Start the app: `pnpm dev`.
3. Create an order in the UI and click the payment button. Inspect the form POST
  to confirm `token`, `signature`, and other fields are present.
4. Use Jenga sandbox/UAT for end-to-end verification.

## Migration checklist

- [ ] Ensure `.env.local` contains Jenga credentials and private key info.
- [ ] Update any external integrations that relied on Convex checkout endpoints
  to point to the new Next.js flow where applicable.
- [ ] Remove references to deprecated Convex functions in your codebase.

## If you want help

I can:
 - Add a migration script to automatically update any code referencing the old
   `convex/checkout` exports to use the `orders` or Next.js endpoints.
 - Add `vitest.config.ts` so backend tests run without frontend PostCSS/Vite
   interfering.
 - Implement `JENGA_PRIVATE_KEY_BASE64` support for storing PEMs as single-line env vars.
