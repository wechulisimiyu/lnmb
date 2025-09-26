import { matchUniversity, normalizeString } from "../normalizeUniversity";

const canonical = [
  "University of Nairobi",
  "Moi University",
  "Kenyatta University",
  "Egerton University",
  "Kenya Medical Training College",
];

function assert(cond: boolean, msg?: string) {
  if (!cond) {
    console.error("Assertion failed:", msg || "");
    process.exit(1);
  }
}

console.log("Running normalization runner...");
assert(
  normalizeString(" University of Nairobi ") === "university of nairobi",
  "normalizeString trim/lower failed",
);
assert(
  matchUniversity("University of Nairobi", canonical) ===
    "University of Nairobi",
  "exact match failed",
);
assert(
  matchUniversity(" university of nairobi ", canonical) ===
    "University of Nairobi",
  "trim match failed",
);
assert(
  matchUniversity("nairobi", canonical) === "University of Nairobi",
  "substring match failed",
);
assert(
  matchUniversity("Some Random College", canonical) === null,
  "non-match should be null",
);

console.log("All normalization tests passed.");
