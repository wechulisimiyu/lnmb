# Google OAuth Integration Guide

This guide explains how to add Google OAuth authentication to the management dashboard using Convex Auth.

## Overview

The authentication system now supports both email/password and Google OAuth (when configured). This allows users to sign in using their Google accounts for easier access.

## Prerequisites

1. Google Cloud Platform account
2. Convex Auth package installed (`@convex-dev/auth`)
3. Auth Core package installed (`@auth/core`)

## Setup Instructions

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to **APIs & Services** > **Credentials**
5. Click **Create Credentials** > **OAuth client ID**
6. Select **Web application**
7. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
8. Copy the **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Add to your `.env.local`:

```bash
AUTH_GOOGLE_ID=your_google_client_id_here
AUTH_GOOGLE_SECRET=your_google_client_secret_here
```

### 3. Update Convex Schema

The schema already includes OAuth-compatible fields in the `users` table:
- `emailVerified`: Boolean indicating if email is verified
- `image`: Profile picture URL from OAuth provider
- `passwordHash`: Optional (not needed for OAuth users)

### 4. Implement Convex Auth

Create `convex/convexAuth.ts`:

```typescript
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.profile.email!))
        .first();

      const now = Date.now();

      if (existingUser) {
        // Update existing user
        await ctx.db.patch(existingUser._id, {
          name: args.profile.name || existingUser.name,
          image: args.profile.picture,
          emailVerified: true,
          updatedAt: now,
        });

        return existingUser._id;
      }

      // Create new user (default role: director)
      const userId = await ctx.db.insert("users", {
        name: args.profile.name || "Unknown",
        email: args.profile.email!,
        image: args.profile.picture,
        emailVerified: true,
        role: "director",
        isActive: true,
        createdAt: now,
        updatedAt: now,
        twoFactorEnabled: false,
      });

      return userId;
    },
  },
});
```

### 5. Update Frontend Components

#### Wrap App with Auth Provider

In `src/components/convex-client-provider.tsx`:

```typescript
import { ConvexAuthProvider } from "@convex-dev/auth/react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <ConvexAuthProvider>{children}</ConvexAuthProvider>
    </ConvexProvider>
  );
}
```

#### Add Google Sign-In Button

In `src/app/manage/login/page.tsx`:

```typescript
import { useAuthActions } from "@convex-dev/auth/react";

export default function LoginPage() {
  const { signIn } = useAuthActions();

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google");
      router.push("/manage");
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    // ... existing form
    <Button onClick={handleGoogleSignIn}>
      Sign in with Google
    </Button>
  );
}
```

### 6. Deploy and Test

1. Deploy your updated code to Convex:
   ```bash
   npx convex dev
   ```

2. Test the OAuth flow:
   - Click "Sign in with Google"
   - Authenticate with your Google account
   - You'll be redirected back to `/manage`

## Security Considerations

### OAuth User Roles

- OAuth users are created with the **director** role by default
- To create admin users, use the CLI:
  ```bash
  npx convex run auth:createUser \
    --name "Admin Name" \
    --email "admin@example.com" \
    --password "password" \
    --role "admin"
  ```

### Mixed Authentication

The system supports both:
- Email/password authentication (for admins)
- OAuth authentication (for convenient access)

Users can have either:
- `passwordHash` set (email/password login)
- OAuth profile (Google login)
- Both (can use either method)

### Audit Logging

OAuth logins are logged in the `auditLogs` table with:
- Action: `oauth_login` or `oauth_user_created`
- Provider details
- Timestamp and IP address

## Troubleshooting

### "OAuth provider not configured"

**Solution**: Verify `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are set in `.env.local`

### Redirect URI mismatch

**Solution**: 
1. Check the redirect URI in Google Cloud Console
2. Ensure it matches your deployment URL
3. Format: `https://your-domain.com/api/auth/callback/google`

### User created as director instead of admin

**Expected behavior**: OAuth users default to director role for security. Admins must be created via CLI.

## Advanced Configuration

### Multiple OAuth Providers

Add more providers to the `convexAuth` configuration:

```typescript
providers: [
  Google({ ... }),
  GitHub({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
  }),
]
```

### Custom OAuth Callbacks

Modify the `createOrUpdateUser` callback to:
- Set custom user roles
- Sync additional profile data
- Trigger welcome emails
- Custom business logic

## Related Documentation

- [Convex Auth Documentation](https://docs.convex.dev/auth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [AUTH.md](./AUTH.md) - Main authentication documentation
- [MANAGE_SETUP.md](./MANAGE_SETUP.md) - Setup guide

## Support

For issues:
1. Check Convex logs in the dashboard
2. Verify OAuth credentials are correct
3. Test redirect URIs match exactly
4. Review audit logs for failed attempts
