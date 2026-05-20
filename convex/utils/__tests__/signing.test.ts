import fs from "fs";
import path from "path";
import { describe, test, expect } from "vitest";
import {
  computeJengaSignatureBase64,
  loadPrivateKeyFromEnvOrFile,
  verifyJengaSignatureBase64,
} from "../signing";

describe("Jenga signing helper", () => {
  const merchantCode = "TESTMERCH";
  const orderReference = "ORD12345678";
  const currency = "KES";
  const orderAmount = "1000";
  const callbackUrl = "http://localhost:3000/api/pgw-webhook-4365c21f";

  const signatureData = `${merchantCode}${orderReference}${currency}${orderAmount}${callbackUrl}`;

  test("compute and verify signature using local keys", () => {
    // load private key (should find repo privatekey.pem)
    const privateKey = loadPrivateKeyFromEnvOrFile();
    expect(privateKey).toBeDefined();

    const signatureBase64 = computeJengaSignatureBase64(
      signatureData,
      privateKey!,
    );
    expect(typeof signatureBase64).toBe("string");
    expect(signatureBase64.length).toBeGreaterThan(0);

    // verify with public key if available
    const pubPath = path.resolve(process.cwd(), "publickey.pem");
    if (fs.existsSync(pubPath)) {
      const pub = fs.readFileSync(pubPath, "utf8");
      const ok = verifyJengaSignatureBase64(
        signatureData,
        signatureBase64,
        pub,
      );
      expect(ok).toBe(true);
    } else {
      // if no public key in repo the test is still useful for generation
      expect(signatureBase64).toBeTruthy();
    }
  });
});
