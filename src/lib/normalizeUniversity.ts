// Simple university normalization and matching helper
export function normalizeString(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()']/g, "")
    .replace(/\s+/g, " ");
}

// Try to match input to a canonical list using exact or substring match
export function matchUniversity(
  input: string,
  canonicalList: string[],
): string | null {
  if (!input) return null;
  const n = normalizeString(input);
  // exact match
  for (const c of canonicalList) {
    if (normalizeString(c) === n) return c;
  }
  // substring match
  for (const c of canonicalList) {
    if (normalizeString(c).includes(n) || n.includes(normalizeString(c)))
      return c;
  }
  // no match
  return null;
}

const Normalizer = { normalizeString, matchUniversity };

export default Normalizer;
