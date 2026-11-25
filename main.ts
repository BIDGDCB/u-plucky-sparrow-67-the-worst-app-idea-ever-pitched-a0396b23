// The Worst App Idea Ever Pitched (Node 22, standard library only).
// The program writes a single one-line entry to /output/entry.txt
// (or MAKEFUN_OUTPUT_DIR outside the grader's container). It validates the
// line first: UTF-8 text, 1 to 240 characters, a single line, not only
// white space.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ENTRY =
  'Uber for borrowed chargers: strangers deliver a cable to your dying phone, then stay to watch you panic about the 2% battery.';

const MAX_CHARS = 240;

const entryLength = ENTRY.length;

if (entryLength === 0 || entryLength > MAX_CHARS) {
  console.error(`entry is ${entryLength} characters, expected 1..${MAX_CHARS}`);
  process.exit(1);
}
if (ENTRY.trim().length === 0) {
  console.error('entry is only white space');
  process.exit(1);
}
if (ENTRY.includes('\n') || ENTRY.includes('\r')) {
  console.error('entry must be a single line');
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'entry.txt');
writeFileSync(outPath, ENTRY, 'utf8');
console.log(`wrote entry.txt (${entryLength} characters) to ${outPath}`);
