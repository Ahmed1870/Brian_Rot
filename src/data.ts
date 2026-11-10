// Manzooma — Lesson 44: TEXTSPLIT & Dynamic Text Engine.

/* ------------------------------------------------------------------ text data (Scenes 1-4) */
// Complex text with spaces — for horizontal split
export const TEXT_COMPOUND = 'Ahmed Ali Cairo Manager';
export const TEXT_SPLIT_WORDS = TEXT_COMPOUND.split(' '); // ['Ahmed', 'Ali', 'Cairo', 'Manager']

// Comma-separated text — for vertical split
export const TEXT_CSV = 'Mouse,Cable,Stand,Chair,Lamp,Monitor,Keyboard';
export const TEXT_CSV_ROWS = TEXT_CSV.split(',');

// Multi-delimiter text — for {" ", "-", ","}
export const TEXT_COMPLEX = 'ORD-001, Cairo - Branch 01';
export const TEXT_MULTI_SPLIT = TEXT_COMPLEX.split(/[\s,\-]+/).filter(Boolean);

// Text with consecutive spaces (for ignore_empty)
export const TEXT_SPACES = 'Ahmed  Ali   Cairo';
export const TEXT_SPACES_CLEAN = TEXT_SPACES.split(/\s+/).filter(Boolean);

// 2D text array (for pad_with)
export const TEXT_2D = ['Ahmed Cairo', 'Sara Alex', 'Omar'];
export const TEXT_2D_PARSED: string[][] = TEXT_2D.map((t) => t.split(' '));

// Master pipeline: TEXTJOIN(" | ", TRUE, TEXTBEFORE(TEXTSPLIT(A2#, ","), "-"))
export const PIPELINE_INPUT = 'ORD-001,ORD-002,ORD-003';
export const PIPELINE_RESULT = 'ORD | ORD | ORD';

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};

/* ------------------------------------------------------------------ big sales (Scene 5) */
const BIG_PRODUCTS = ['Wireless Mouse', 'USB-C Cable', 'Laptop Stand', 'Office Chair', 'Notebook A5', 'Desk Lamp', 'Monitor 24"', 'Keyboard'];
const BIG_BRANCHES = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];

export type BigSale = {id: string; product: string; branch: string; combinedText: string};

export const bigSale = (n: number): BigSale => {
  const h = (n * 2654435761) >>> 0;
  const product = BIG_PRODUCTS[(h >>> 3) % BIG_PRODUCTS.length];
  const branch = BIG_BRANCHES[(h >>> 13) % BIG_BRANCHES.length];
  return {id: `ORD-${5000 + n}`, product, branch, combinedText: `${product} - ${branch}`};
};

export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1;
export const fmtInt = (n: number) => n.toLocaleString('en-US');
