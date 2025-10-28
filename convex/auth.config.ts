// Resolve the Clerk issuer domain from envs that users commonly set.
// In production this value is usually configured on the Convex deployment
// (set `CLERK_JWT_ISSUER_DOMAIN` on the Convex Dashboard) so the Convex
// auth system can match incoming tokens to the correct provider.
const clerkIssuerDomain =
  process.env.CLERK_JWT_ISSUER_DOMAIN ??
  // fallback names sometimes used in projects / hosting platforms
  process.env.CLERK_ISSUER_DOMAIN ??
  process.env.CLERK_FRONTEND_API_URL ??
  "";

if (!clerkIssuerDomain) {
  // Runtime log to make misconfiguration obvious in Convex logs.
  // Convex will still run, but authentication attempts will fail with the
  // server-side message: "No auth provider found matching the given token".
  // If you see that, make sure to set `CLERK_JWT_ISSUER_DOMAIN` on the
  // Convex Dashboard to the issuer URL used by your Clerk JWT template.
  // Example value (from Clerk JWT template):
  //   https://issuer.clerk.dev/<your-project-id>
  // See: https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances
  // This warning is intentionally noisy so deploy logs make the problem clear.
  // eslint-disable-next-line no-console
  console.warn(
    "[convex/auth.config] No Clerk issuer configured. Set CLERK_JWT_ISSUER_DOMAIN on the Convex Dashboard or provide it as an env var.",
  );
}

export default {
  providers: [
    {
      domain: clerkIssuerDomain,
      applicationID: "convex",
    },
  ],
} as const;
