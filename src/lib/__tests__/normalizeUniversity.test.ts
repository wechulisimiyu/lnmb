import { describe, it, expect } from "vitest";
import { matchUniversity, normalizeString } from "../normalizeUniversity";

const canonical = [
  "University of Nairobi",
  "Moi University",
  "Kenyatta University",
  "Egerton University",
  "Kenya Medical Training College",
];

describe("normalizeUniversity", () => {
  it("normalizes strings", () => {
    expect(normalizeString(" University of Nairobi ")).toBe(
      "university of nairobi",
    );
    expect(normalizeString("UoN.")).toBe("uon");
  });

  it("matches exact canonical names", () => {
    expect(matchUniversity("University of Nairobi", canonical)).toBe(
      "University of Nairobi",
    );
  });

  it("matches case-insensitive and trimmed input", () => {
    expect(matchUniversity(" university of nairobi ", canonical)).toBe(
      "University of Nairobi",
    );
  });

  it("matches substrings", () => {
    expect(matchUniversity("nairobi", canonical)).toBe("University of Nairobi");
  });

  it("returns null when no match", () => {
    expect(matchUniversity("Some Random College", canonical)).toBeNull();
  });
});
