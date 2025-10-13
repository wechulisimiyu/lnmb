import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Quick local signing test — run with: node scripts/test-signing.js
(async function main() {
  const merchantCode = process.env.JENGA_MERCHANT_CODE || 'TESTMERCH';
  const orderReference = 'ORD12345678';
  const currency = 'KES';
  const orderAmount = '1000';
  const callbackUrl = process.env.SITE_URL ? `${process.env.SITE_URL}/api/pgw-webhook-4365c21f` : 'http://localhost:3000/api/pgw-webhook-4365c21f';

  const signatureData = `${merchantCode}${orderReference}${currency}${orderAmount}${callbackUrl}`;

  // Load key (same logic as Convex orders)
  let privateKey: string | undefined;
  if (process.env.JENGA_PRIVATE_KEY_BASE64) {
    try {
      privateKey = Buffer.from(process.env.JENGA_PRIVATE_KEY_BASE64, 'base64').toString('utf8');
    } catch {}
  }
  if (!privateKey && process.env.JENGA_PRIVATE_KEY) privateKey = process.env.JENGA_PRIVATE_KEY;
  if (!privateKey) {
    const keyPath = process.env.JENGA_PRIVATE_KEY_PATH || path.resolve(process.cwd(), 'privatekey.pem');
    if (fs.existsSync(keyPath)) privateKey = fs.readFileSync(keyPath, 'utf8');
  }

  if (!privateKey) {
    console.error('No private key found. Set JENGA_PRIVATE_KEY_BASE64 or JENGA_PRIVATE_KEY_PATH to test.');
    process.exit(2);
  }

  const signature = crypto.sign('RSA-SHA256', Buffer.from(signatureData), { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING });
  const signatureBase64 = signature.toString('base64');

  console.log('signatureData:', signatureData);
  console.log('signature (base64):', signatureBase64);

  // Verify quickly using publickey.pem if present
  const pubPath = path.resolve(process.cwd(), 'publickey.pem');
  if (fs.existsSync(pubPath)) {
    const pub = fs.readFileSync(pubPath, 'utf8');
    const ok = crypto.verify('RSA-SHA256', Buffer.from(signatureData), { key: pub, padding: crypto.constants.RSA_PKCS1_PADDING }, signature);
    console.log('verification with publickey.pem:', ok);
  } else {
    console.log('publickey.pem not found; skip verification.');
  }
})();
