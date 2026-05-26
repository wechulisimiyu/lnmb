import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizeKenyaPhone = (raw: string | undefined): string => {
  if (!raw) return ""
  const digits = (raw || "").replace(/\D/g, "")
  // Already contains country code 254 or 257 (e.g. 2547xxxxxxxx)
  if (digits.startsWith("254") || digits.startsWith("257")) {
    // keep country + 9 digits if available
    if (digits.length >= 12) return digits.slice(0, 12)
    return digits
  }
  // Local numbers:
  // 0XXXXXXXXX (10 digits) -> drop leading 0 and prefix 254
  if (digits.length === 10 && digits.startsWith("0")) {
    return `254${digits.slice(1)}`
  }
  // 9-digit local like 7XXXXXXXX or 1XXXXXXXX -> prefix 254
  if (digits.length === 9) {
    return `254${digits}`
  }
  return digits
}

