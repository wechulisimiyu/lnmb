# Management Dashboard Setup Guide

This guide will help you set up and configure the management dashboard at `/manage` with role-based authentication.

## Overview

The management dashboard provides:

- **Orders Management**: View and track all orders
- **Payments Management**: Monitor payment status and transactions
- **Dashboard**: View key metrics and statistics
- **Role-Based Access**: Two roles (Admin and Director) with different permissions

## Prerequisites

1. A deployed Convex backend
2. Node.js and pnpm installed
3. Environment variables configured (see `.env.sample`)

## Quick Setup

### 1. Deploy Convex Backend

Make sure your Convex backend is deployed and the schema is updated:

```bash
# Deploy to Convex
npx convex dev
```

This will:

- Create the new `users` and `sessions` tables
- Update the schema with authentication support
- Deploy all authentication functions

### 2. Create Initial Admin User

Once your backend is deployed, create the first admin user:

```bash
npx convex run auth:createUser \
  --name "Admin User" \
  --email "admin@lnmb.org" \
  --password "SecurePassword123!" \
  --role "admin"
```

**⚠️ Important Security Notes:**

- Use a strong password
- Change the password after first login
- Store credentials securely
- Never commit passwords to version control

### 3. Create Additional Users (Optional)

Create director accounts if needed:

```bash
npx convex run auth:createUser \
  --name "Director Name" \
  --email "director@lnmb.org" \
  --password "SecurePassword123!" \
  --role "director"
```

### 4. Access the Management Dashboard

1. Navigate to: `http://localhost:3000/manage/login` (or your deployed URL)
2. Enter the credentials you created
3. You'll be redirected to `/manage` upon successful login

## User Roles

### Admin Role

Full access to all features:

- ✅ View Dashboard
- ✅ View and Manage Orders
- ✅ View and Manage Payments
- ✅ Manage Team Members (coming soon)
- ✅ Manage Highlights (coming soon)
- ✅ Manage Products (coming soon)
- ✅ Create new users

### Director Role

Limited access for oversight:

- ✅ View Dashboard
- ✅ View Orders
- ✅ View Payments
- ❌ Cannot manage team, highlights, or products
- ❌ Cannot create users

## Authentication Flow

```
┌─────────────────────┐
│  User visits        │
│  /manage            │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Check for auth     │
│  token in           │
│  localStorage       │
└──────┬──────────────┘
       │
       ├─── Token exists ───►┌─────────────────────┐
       │                     │  Verify token with  │
       │                     │  Convex backend     │
       │                     └──────┬──────────────┘
       │                            │
       │                            ├─ Valid ────►┌─────────────────────┐
       │                            │             │  Show Dashboard     │
       │                            │             └─────────────────────┘
       │                            │
       │                            └─ Invalid ──►┌─────────────────────┐
       │                                          │  Redirect to login  │
       ├─── No token ────────────────────────────►└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│  Show login page    │
│  /manage/login      │
└─────────────────────┘
```

## Security Features

### Current Implementation

1. **Password Hashing**: Passwords are hashed before storage (currently base64)
2. **Session Tokens**: Unique tokens for each login session
3. **Token Expiration**: Sessions expire after 7 days
4. **Role-Based Access**: Protected queries check user role
5. **Protected Endpoints**: All admin queries require authentication

### Recommended Production Enhancements

For production deployment, consider these security improvements:

1. **Upgrade Password Hashing**

   ```typescript
   // Replace base64 with bcrypt
   import bcrypt from "bcrypt";
   const hash = await bcrypt.hash(password, 10);
   ```

2. **Use HTTP-Only Cookies**

   ```typescript
   // Instead of localStorage, use secure cookies
   res.setHeader(
     "Set-Cookie",
     `token=${token}; HttpOnly; Secure; SameSite=Strict`,
   );
   ```

3. **Add Rate Limiting**

   ```typescript
   // Limit login attempts to prevent brute force
   // Use a rate limiting library or service
   ```

4. **Implement 2FA**
   - Consider adding two-factor authentication
   - Use libraries like `otpauth` or services like Auth0

5. **Enable HTTPS**
   - Always use HTTPS in production
   - Vercel automatically provides SSL certificates

6. **Add Audit Logging**
   - Log all authentication events
   - Track failed login attempts
   - Monitor suspicious activity

## Environment Variables

Ensure these variables are set in your `.env.local`:

```bash
# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=https://your-app.convex.cloud

# Site URL (for production)
SITE_URL=https://your-domain.com
```

## Testing

### Run Auth Tests

```bash
pnpm run test
```

The auth tests verify:

- User creation
- Login/logout functionality
- Session management
- Role-based access control

### Manual Testing Checklist

- [ ] Create admin user via CLI
- [ ] Login at `/manage/login` with admin credentials
- [ ] Verify all tabs are visible (Dashboard, Orders, Payments, Team, Highlights, Products)
- [ ] Check that orders and payments data loads correctly
- [ ] Logout and verify redirect to login page
- [ ] Create director user via CLI
- [ ] Login with director credentials
- [ ] Verify only Dashboard, Orders, and Payments tabs are visible
- [ ] Verify director cannot access admin functions
- [ ] Test with invalid credentials (should show error)
- [ ] Test with expired token (should redirect to login)

## Troubleshooting

### "Unauthorized: Invalid or expired session"

**Cause**: The session token is invalid or has expired.

**Solution**:

1. Clear browser localStorage
2. Log in again
3. If persists, check Convex deployment status

### "Cannot connect to Convex"

**Cause**: Convex backend is not running or URL is incorrect.

**Solution**:

1. Verify `NEXT_PUBLIC_CONVEX_URL` in `.env.local`
2. Run `npx convex dev` to start the backend
3. Check Convex dashboard for deployment status

### "User with this email already exists"

**Cause**: Trying to create a user with an email that's already registered.

**Solution**:

1. Use a different email address
2. Or manually delete the existing user from Convex dashboard

### Login page shows but cannot login

**Cause**: Auth functions may not be deployed to Convex.

**Solution**:

1. Ensure `convex/auth.ts` is present
2. Run `npx convex dev` to deploy
3. Check Convex dashboard for function deployment

### Dashboard shows empty data

**Cause**: No orders/payments in database or token not being passed correctly.

**Solution**:

1. Verify orders and payments exist in Convex dashboard
2. Check browser console for errors
3. Verify token is being passed to queries

## File Structure

```
lnmb/
├── convex/
│   ├── auth.ts                    # Authentication functions
│   ├── orders.ts                  # Protected order queries
│   ├── schema.ts                  # Database schema with users/sessions
│   └── __tests__/
│       └── auth.test.ts          # Auth tests
├── src/
│   └── app/
│       ├── admin/
│       │   └── page.tsx          # Redirect to /manage
│       └── manage/
│           ├── page.tsx          # Main management dashboard
│           └── login/
│               └── page.tsx      # Login page
├── docs/
│   ├── AUTH.md                   # Detailed auth documentation
│   └── MANAGE_SETUP.md          # This file
└── scripts/
    └── create-admin-user.js      # Helper script info
```

## API Reference

### Mutations

#### createUser

```typescript
createUser({
  name: string,
  email: string,
  password: string,
  role: "admin" | "director"
}): Promise<Id<"users">>
```

#### login

```typescript
login({
  email: string,
  password: string
}): Promise<{
  token: string,
  user: {
    _id: Id<"users">,
    name: string,
    email: string,
    role: "admin" | "director"
  }
}>
```

#### logout

```typescript
logout({
  token: string
}): Promise<{ success: boolean }>
```

### Queries

#### getCurrentUser

```typescript
getCurrentUser({
  token: string
}): Promise<User | null>
```

#### getAllOrders (Protected)

```typescript
getAllOrders({
  token: string
}): Promise<Order[]>
```

#### getAllPayments (Protected)

```typescript
getAllPayments({
  token: string
}): Promise<Payment[]>
```

#### getOrderStats (Protected)

```typescript
getOrderStats({
  token: string
}): Promise<OrderStats>
```

## Migration from /admin to /manage

The old `/admin` page has been replaced with `/manage`. If you visit `/admin`, you'll be automatically redirected to `/manage`.

**Changes:**

- `/admin` → Redirects to `/manage`
- `/manage/login` → New login page
- `/manage` → Protected dashboard with authentication

## Next Steps

After setup, consider:

1. **Customize Branding**: Update colors, logos, and text
2. **Add User Management UI**: Create interface for admins to manage users
3. **Implement Password Reset**: Add forgot password functionality
4. **Add Email Notifications**: Send alerts for important events
5. **Create Reports**: Generate CSV/PDF reports from dashboard data
6. **Mobile Optimization**: Test and optimize for mobile devices

## Support

For issues or questions:

1. Check the [AUTH.md](./AUTH.md) documentation
2. Review Convex logs in the dashboard
3. Check browser console for errors
4. Create an issue in the repository

## Related Documentation

- [AUTH.md](./AUTH.md) - Detailed authentication documentation
- [SETUP.md](./SETUP.md) - General project setup
- [Convex Documentation](https://docs.convex.dev/) - Convex backend docs
