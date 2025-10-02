// Generates a safe order reference string: prefix + timestamp + short random suffix
// Result contains only alphanumeric characters (uppercase) to satisfy payment providers
export default function generateOrderReference(prefix = "ORD") {
  const ts = Date.now();
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  // Build reference and strip any non-alphanumeric characters (defensive)
  const raw = `${prefix}${ts}${suffix}`;
  return raw.replace(/[^A-Z0-9]/gi, "").toUpperCase();
}
