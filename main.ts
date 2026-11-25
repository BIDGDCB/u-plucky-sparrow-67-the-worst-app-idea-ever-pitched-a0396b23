// The Worst App Idea Ever Pitched (Node 22, standard library only).
// The program writes a single one-line entry to /output/entry.txt (or
// MAKEFUN_OUTPUT_DIR outside the grader's container). It validates the line
// first: UTF-8 text, 1 to 240 characters, a single line, not only white
// space, with no control characters and no leading or trailing white space.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ENTRY =
  'Uber for borrowed chargers: strangers deliver a cable to your dying phone, then stay to watch you panic about the 2% battery.';

const MAX_CHARS = 240;

// Count Unicode code points, not UTF-16 code units, so characters outside
// the Basic Multilingual Plane (e.g. emoji) count as one character each.
function entryLength(entry: string): number {
  return [...entry].length;
}

// Every rule the entry must satisfy, as one small check each, so a failure
// names every rule it broke instead of stopping at the first problem.
function validateEntry(entry: string): string[] {
  const problems: string[] = [];
  const length = entryLength(entry);
  if (length === 0 || length > MAX_CHARS) {
    problems.push(`entry is ${length} characters, expected 1..${MAX_CHARS}`);
  }
  if (entry.trim().length === 0) {
    problems.push('entry is only white space');
  }
  if (entry.includes('\n') || entry.includes('\r')) {
    problems.push('entry must be a single line');
  }
  if (/[\u0000-\u001F\u007F]/.test(entry)) {
    problems.push('entry contains a control character');
  }
  if (entry !== entry.trim()) {
    problems.push('entry has leading or trailing white space');
  }
  return problems;
}

// An empty MAKEFUN_OUTPUT_DIR is the same as an unset one: falling back
// only on null/undefined would try to create a directory named '' and fail.
function writeEntry(entry: string): string {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 'entry.txt');
  writeFileSync(outPath, entry, 'utf8');
  return outPath;
}

const problems = validateEntry(ENTRY);
if (problems.length > 0) {
  for (const problem of problems) console.error(problem);
  process.exit(1);
}
const outPath = writeEntry(ENTRY);
console.log(`wrote entry.txt (${entryLength(ENTRY)} characters) to ${outPath}`);
