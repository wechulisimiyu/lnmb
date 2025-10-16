# Admin Management Dashboard - Quick Start Guide

## 🎯 Overview

This implementation provides a secure, role-based management dashboard for the LNMB project at `/manage`. The old `/admin` route now redirects to `/manage`.

## 🚀 Quick Setup (3 Steps)

### Step 1: Deploy Convex Backend

```bash
npx convex dev
```

This deploys the authentication system and database schema to Convex.

### Step 2: Create Your First Admin User

```bash
npx convex run auth:createUser \
  --name "Your Name" \
  --email "admin@lnmb.org" \
  --password "YourSecurePassword123!" \
  --role "admin"
```

**Important**: 
- Use a strong password
- Remember your credentials
- Change password after first login

### Step 3: Login and Use

1. Navigate to: `http://localhost:3000/manage/login` (or your domain)
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to the dashboard at `/manage`

## 👥 User Roles

### Admin
- ✅ Full access to all features
- ✅ View Dashboard, Orders, Payments
- ✅ Manage Team, Highlights, Products
- ✅ Create new users

### Director
- ✅ View Dashboard, Orders, Payments
- ❌ Cannot manage Team, Highlights, or Products
- ❌ Cannot create users

## 🔐 Creating Additional Users

### Create a Director

```bash
npx convex run auth:createUser \
  --name "Director Name" \
  --email "director@lnmb.org" \
  --password "SecurePassword123!" \
  --role "director"
```

### Create Another Admin

```bash
npx convex run auth:createUser \
  --name "Admin Name" \
  --email "admin2@lnmb.org" \
  --password "SecurePassword123!" \
  --role "admin"
```

## 📱 Features

### Dashboard
- View key metrics (orders, payments, revenue)
- Recent activity feed
- Statistics overview

### Orders Management
- View all orders in real-time
- Filter and search orders
- See payment status
- Customer details

### Payments Management
- Track all payments
- Payment status (paid, pending, failed)
- Transaction IDs
- Amount and currency

### Role-Based Tabs
- Admin sees all tabs
- Director sees limited tabs
- Automatic UI adaptation

## 🛡️ Security Features

- ✅ Password hashing
- ✅ Session tokens (7-day expiration)
- ✅ Role-based access control
- ✅ Protected API endpoints
- ✅ Auto-logout on expired sessions

## 📚 Documentation

Detailed documentation available:

- **[docs/MANAGE_SETUP.md](docs/MANAGE_SETUP.md)** - Complete setup guide with troubleshooting
- **[docs/AUTH.md](docs/AUTH.md)** - Technical authentication documentation
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Full implementation details

## 🔧 Troubleshooting

### Cannot Login?
1. Check Convex deployment is running: `npx convex dev`
2. Verify user exists in Convex dashboard
3. Check console for error messages
4. Ensure `NEXT_PUBLIC_CONVEX_URL` is set

### Session Expired?
- Sessions expire after 7 days
- Simply log in again with your credentials

### Forgot Password?
Currently, contact an admin to create a new user or reset password manually in Convex dashboard.

## 🧪 Testing

Run the test suite:

```bash
pnpm run test
```

All 20 authentication tests should pass:
- ✅ User creation
- ✅ Login/logout
- ✅ Session management
- ✅ Role-based access

## 📊 What Changed

### New Routes
- `/manage` - Management dashboard (requires login)
- `/manage/login` - Login page
- `/admin` - Redirects to `/manage`

### New Database Tables
- `users` - User accounts with roles
- `sessions` - Active login sessions

### Protected Endpoints
These now require authentication:
- `api.orders.getAllOrders`
- `api.orders.getAllPayments`
- `api.orders.getOrderStats`

## 🚨 Production Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Set strong password requirements
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Review security recommendations in `docs/AUTH.md`
- [ ] Consider upgrading to bcrypt for password hashing
- [ ] Set up monitoring and alerts
- [ ] Test all roles thoroughly
- [ ] Create backup admin account

## 💡 Tips

1. **Use Strong Passwords**: Minimum 12 characters, mix of letters, numbers, symbols
2. **Regular Backups**: Export user list from Convex dashboard
3. **Monitor Activity**: Check login patterns regularly
4. **Update Regularly**: Keep dependencies up to date
5. **Test Before Production**: Thoroughly test in development

## 🆘 Getting Help

1. Check the troubleshooting section above
2. Review documentation in `docs/` folder
3. Check Convex logs in dashboard
4. Look at browser console for errors
5. Review test files for usage examples

## 🎉 You're Ready!

Your management dashboard is now set up and secured with role-based authentication. Users can access it at `/manage` after logging in.

**Next Steps:**
1. Create user accounts for your team
2. Test different roles (admin vs director)
3. Customize the dashboard as needed
4. Review security recommendations

## 📝 Quick Commands Reference

```bash
# Deploy backend
npx convex dev

# Create admin user
npx convex run auth:createUser --name "Name" --email "email@domain.com" --password "pass" --role "admin"

# Create director user
npx convex run auth:createUser --name "Name" --email "email@domain.com" --password "pass" --role "director"

# Run tests
pnpm run test

# Check types
npx tsc --noEmit

# Lint code
pnpm run lint
```

---

**Note**: This implementation follows the Convex Labs documentation for authentication and provides a solid foundation for secure admin access. For production use, review the security recommendations in `docs/AUTH.md`.
