# Authentication and Authorization System

This document describes the role-based authentication system implemented for the LNMB management dashboard.

## Overview

The system implements a simple but secure role-based access control (RBAC) with two roles:
- **Admin**: Full access to all features
- **Director**: Limited access (can view orders and payments, but not manage team, highlights, or products)

## Architecture

### Database Schema

**users table**:
- `name`: User's full name
- `email`: Unique email address (used for login)
- `passwordHash`: Hashed password (using base64 encoding - should be upgraded to bcrypt in production)
- `role`: Either "admin" or "director"
- `isActive`: Boolean flag to enable/disable users
- `createdAt`, `updatedAt`: Timestamps

**sessions table**:
- `userId`: Reference to user
- `token`: Unique session token
- `expiresAt`: Expiration timestamp (7 days from creation)
- `createdAt`: Creation timestamp

### Backend (Convex)

#### Auth Functions (`convex/auth.ts`)

1. **createUser**: Create a new user with specified role
   - Validates email uniqueness
   - Hashes password
   - Sets user as active

2. **login**: Authenticate user and create session
   - Validates credentials
   - Creates session token (valid for 7 days)
   - Returns token and user info

3. **logout**: Invalidate session
   - Deletes session record

4. **getCurrentUser**: Get user from session token
   - Validates token
   - Checks expiration
   - Returns user info or null

5. **checkRole**: Check if user has required role
   - Admin role has access to everything
   - Other roles must match exactly

#### Protected Queries

The following queries in `convex/orders.ts` now require authentication:
- `getAllOrders`: Requires admin or director role
- `getAllPayments`: Requires admin or director role
- `getOrderStats`: Requires admin or director role

### Frontend

#### Login Page (`/manage/login`)

- Email/password form
- Stores auth token in localStorage
- Redirects to `/manage` on successful login

#### Management Dashboard (`/manage`)

- Checks for auth token on mount
- Redirects to login if not authenticated
- Displays user info and logout button
- Shows different tabs based on role:
  - Admin: All tabs (Dashboard, Orders, Payments, Team, Highlights, Products)
  - Director: Limited tabs (Dashboard, Orders, Payments)

## Setup Instructions

### 1. Create Initial Admin User

After deploying your Convex backend, create an admin user using the Convex CLI:

```bash
npx convex run auth:createUser \
  --name "Admin User" \
  --email "admin@lnmb.org" \
  --password "your-secure-password" \
  --role "admin"
```

### 2. Create Director Users (Optional)

```bash
npx convex run auth:createUser \
  --name "Director Name" \
  --email "director@lnmb.org" \
  --password "their-secure-password" \
  --role "director"
```

### 3. Access Management Dashboard

1. Navigate to `/manage/login`
2. Enter credentials
3. You'll be redirected to `/manage` upon successful login

## Security Considerations

### Current Implementation

- Passwords are hashed using base64 encoding
- Sessions expire after 7 days
- Tokens stored in localStorage
- Protected queries check authentication on every request

### Production Improvements Recommended

1. **Password Hashing**: Replace base64 with bcrypt or argon2
2. **Token Storage**: Consider using httpOnly cookies instead of localStorage
3. **HTTPS Only**: Ensure all communication is over HTTPS
4. **Rate Limiting**: Add rate limiting to login endpoint
5. **Password Requirements**: Enforce strong password policies
6. **2FA**: Consider adding two-factor authentication
7. **Audit Logging**: Log all authentication events
8. **Session Management**: Add ability to view and revoke active sessions

## Testing

Tests are located in `convex/__tests__/auth.test.ts` and cover:
- User creation (admin and director)
- Duplicate email prevention
- Login with valid/invalid credentials
- Session management
- Role-based access control

Run tests with:
```bash
npm run test
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
}): Promise<{
  _id: Id<"users">,
  name: string,
  email: string,
  role: "admin" | "director"
} | null>
```

#### checkRole
```typescript
checkRole({
  token: string,
  requiredRole: "admin" | "director"
}): Promise<boolean>
```

## Role Permissions Matrix

| Feature | Admin | Director |
|---------|-------|----------|
| View Dashboard | ✅ | ✅ |
| View Orders | ✅ | ✅ |
| View Payments | ✅ | ✅ |
| Manage Team | ✅ | ❌ |
| Manage Highlights | ✅ | ❌ |
| Manage Products | ✅ | ❌ |
| Create Users | ✅ | ❌ |

## Troubleshooting

### Cannot Login

1. Check console for error messages
2. Verify user exists in database
3. Ensure Convex deployment is running
4. Check NEXT_PUBLIC_CONVEX_URL is set correctly

### Session Expired

Sessions expire after 7 days. Users need to log in again.

### Permission Denied

Verify user has correct role assigned. Directors cannot access admin-only features.

## Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] User management UI for admins
- [ ] Activity logging
- [ ] Session timeout warnings
- [ ] Remember me functionality
- [ ] OAuth integration (Google, Microsoft, etc.)
