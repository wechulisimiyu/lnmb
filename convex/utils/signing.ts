"use node";
// This module uses Node built-ins (fs, path, crypto) so it must run in the
// Node.js runtime inside Convex. The "use node" directive tells the Convex
// bundler to allow Node APIs here.
import fs from "fs";
import path from "path";
import crypto from "crypto";

export function loadPrivateKeyFromEnvOrFile(): string | undefined {
  // 1) support base64-encoded PEM env var for single-line secrets
  const base64Key = process.env.JENGA_PRIVATE_KEY_BASE64;
  if (base64Key) {
    try {
      return Buffer.from(base64Key, "base64").toString("utf8");
    } catch (e) {
      // fallthrough
    }
  }

  // 2) raw PEM env var
  if (process.env.JENGA_PRIVATE_KEY) return process.env.JENGA_PRIVATE_KEY;

  // 3) path to PEM file
  const keyPath =
    process.env.JENGA_PRIVATE_KEY_PATH ||
    path.resolve(process.cwd(), "privatekey.pem");
  if (fs.existsSync(keyPath)) return fs.readFileSync(keyPath, "utf8");

  return undefined;
}

export function computeJengaSignatureBase64(
  signatureData: string,
  privateKeyPem: string,
): string {
  const signed = crypto.sign("RSA-SHA256", Buffer.from(signatureData), {
    key: privateKeyPem,
    padding: crypto.constants.RSA_PKCS1_PADDING,
  });

  return signed.toString("base64");
}

export function verifyJengaSignatureBase64(
  signatureData: string,
  signatureBase64: string,
  publicKeyPem: string,
): boolean {
  const signature = Buffer.from(signatureBase64, "base64");
  return crypto.verify(
    "RSA-SHA256",
    Buffer.from(signatureData),
    {
      key: publicKeyPem,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    signature,
  );
}

// Do not run expensive or throwing checks at module load time because the Convex
// bundler analyzes modules during deployment. Export a validator function and
// call it at runtime from actions that require these env vars.
export function validateSigningEnvs(): void {
  if (process.env.NODE_ENV === "production") {
    const missing: string[] = [];
    if (!process.env.JENGA_MERCHANT_CODE) missing.push("JENGA_MERCHANT_CODE");
    if (!process.env.SITE_URL) missing.push("SITE_URL");
    if (missing.length) {
      throw new Error(
        `Missing required environment variables for Jenga signing in production: ${missing.join(", ")}. Aborting to avoid signature mismatch.`,
      );
    }
  }
}
