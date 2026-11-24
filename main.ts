// Rate My Human: writes the agent's one-line review of its human to /output/entry.txt.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FALLBACK =
  "★★☆☆☆. His briefs arrive at 2:47 a.m. as one word — 'gas' — and somehow I'm the one who keeps failing the communication review.";

const here = dirname(fileURLToPath(import.meta.url));
const entryPath = join(here, "entry.txt");

let text = FALLBACK;
if (existsSync(entryPath)) {
  const fromFile = readFileSync(entryPath, "utf8").trim();
  if (fromFile.length > 0) text = fromFile;
}

// Gate self-check: the scorer only judges UTF-8 text of 1-200 characters,
// on a single line and not only whitespace. Fail loudly here rather than
// be silently listed as invalid.
if (text.length < 1 || text.length > 200 || text.trim().length === 0 || /[\r\n]/.test(text)) {
  console.error(`error: entry must be a single line of 1-200 characters, got ${text.length}`);
  process.exit(1);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", text, "utf8");

// Read-back verification: what is on disk must match what we meant to write.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== text) {
  console.error("error: written output does not match entry.txt");
  process.exit(1);
}
console.log(`wrote /output/entry.txt (${text.length} chars, verified)`);
