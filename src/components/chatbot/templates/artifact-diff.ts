/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

export type Canonicalize = 'json' | 'none' | ((src: string) => string);

export type DiffRow =
  | { kind: 'equal'; oldLine: number; newLine: number; text: string }
  | { kind: 'del'; oldLine: number; text: string }
  | { kind: 'add'; newLine: number; text: string };

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      out[key] = sortKeysDeep((value as Record<string, unknown>)[key]);
    }
    return out;
  }
  return value;
}

/** Key-sort a JSON string so reordered-but-equivalent objects diff as identical. */
export function canonicalizeJson(src: string): string {
  try {
    return JSON.stringify(sortKeysDeep(JSON.parse(src)), null, 2);
  } catch {
    return src;
  }
}

export function applyCanonicalize(src: string, mode: Canonicalize = 'none'): string {
  if (mode === 'json') return canonicalizeJson(src);
  if (typeof mode === 'function') return mode(src);
  return src;
}

/**
 * Line-level diff via longest-common-subsequence. Adequate for chat artifacts
 * (config JSON, small documents); not tuned for multi-megabyte inputs.
 */
export function diffLines(before: string, after: string): DiffRow[] {
  const a = before.split('\n');
  const b = after.split('\n');
  const m = a.length;
  const n = b.length;

  const lcs: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const rows: DiffRow[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      rows.push({ kind: 'equal', oldLine: i + 1, newLine: j + 1, text: a[i] });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      rows.push({ kind: 'del', oldLine: i + 1, text: a[i] });
      i++;
    } else {
      rows.push({ kind: 'add', newLine: j + 1, text: b[j] });
      j++;
    }
  }
  while (i < m) rows.push({ kind: 'del', oldLine: i + 1, text: a[i++] });
  while (j < n) rows.push({ kind: 'add', newLine: j + 1, text: b[j++] });
  return rows;
}

/** True when, after canonicalization, the two sides actually differ. */
export function hasRealDiff(before: string, after: string, mode: Canonicalize = 'none'): boolean {
  return applyCanonicalize(before, mode) !== applyCanonicalize(after, mode);
}
