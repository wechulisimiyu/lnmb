/**
 * Script to create an initial admin user
 * Run this script using: node scripts/create-admin-user.js
 *
 * Usage:
 * 1. Make sure you have CONVEX_DEPLOYMENT set in your environment
 * 2. Run: npx convex run auth:createUser --name "Admin User" --email "admin@lnmb.org" --password "your-secure-password" --role "admin"
 *
 * Or for a director:
 * npx convex run auth:createUser --name "Director Name" --email "director@lnmb.org" --password "your-secure-password" --role "director"
 */

console.log(`
To create an admin user, use the Convex CLI:

For Admin:
npx convex run auth:createUser --name "Admin User" --email "admin@lnmb.org" --password "changeme123" --role "admin"

For Director:
npx convex run auth:createUser --name "Director Name" --email "director@lnmb.org" --password "changeme123" --role "director"

Make sure to change the password after first login!
`);
