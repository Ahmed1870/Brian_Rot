// Manzooma — Lesson 26: Unpivoting & Advanced Data Normalization.
// Power Query Unpivot + TOCOL + WRAPCOLS + HSTACK pipeline.

/* ------------------------------------------------------------------ crosstab matrix (Scene 1 & 2) */
// Wide table: Product | Jan | Feb | Mar | Apr
export const CROSSTAB = [
  {product: 'Mouse',  Jan: 1200, Feb: 1500, Mar: 1800, Apr: 2100},
  {product: 'Cable',  Jan: 800,  Feb: 950,  Mar: 1100, Apr: 1300},
  {product: 'Stand',  Jan: 500,  Feb: 600,  Mar: 700,  Apr: 800},
  {product: 'Chair',  Jan: 2000, Feb: 2200, Mar: 2500, Apr: 2800},
];
export const CROSSTAB_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr'];

/* ------------------------------------------------------------------ flat normalized (Scene 1 result & Scene 2) */
// After unpivot: Product | Attribute (month) | Value (sales) — 16 rows
export type FlatRow = {product: string; attribute: string; value: number};
export const FLAT_TABLE: FlatRow[] = CROSSTAB.flatMap((row) =>
  CROSSTAB_MONTHS.map((month) => ({product: row.product, attribute: month, value: (row as any)[month] as number}))
);

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};

/** Crosstab cell (wide matrix). */
export const crosstabCell = (r: number, c: number): CCell | undefined => {
  if (r === 1) {
    if (c < 1 || c > 5) return undefined;
    const h = ['Product', ...CROSSTAB_MONTHS];
    return {t: h[c - 1], b: true, bg: '#FEE2E2', al: c === 1 ? 'l' : 'r', color: '#991B1B'};
  }
  const row = CROSSTAB[r - 2];
  if (!row || c < 1 || c > 5) return undefined;
  if (c === 1) return {t: row.product};
  return {t: ((row as any)[CROSSTAB_MONTHS[c - 2]] as number).toLocaleString('en-US'), al: 'r'};
};

/** Flat table cell (normalized). */
export const flatCell = (r: number, c: number, filledRows?: number): CCell | undefined => {
  if (r === 1) {
    if (c < 1 || c > 3) return undefined;
    const h = ['Product', 'Attribute', 'Value'];
    return {t: h[c - 1], b: true, bg: '#D1FAE5', al: c === 3 ? 'r' : 'l', color: '#107C41'};
  }
  const idx = r - 2;
  if (idx < 0 || idx >= FLAT_TABLE.length) return undefined;
  if (filledRows !== undefined && idx >= filledRows) return undefined;
  const row = FLAT_TABLE[idx];
  switch (c) {
    case 1: return {t: row.product, color: '#107C41'};
    case 2: return {t: row.attribute, color: '#107C41'};
    case 3: return {t: row.value.toLocaleString('en-US'), al: 'r', color: '#107C41'};
  }
  return undefined;
};

/* ------------------------------------------------------------------ TOCOL sample (Scene 3) */
// A small 3x3 matrix to flatten
export const MATRIX_3x3 = [
  [10, 20, 30],
  [40, 50, 60],
  [70, 80, 90],
];
// TOCOL result (column-major): 10,40,70,20,50,80,30,60,90
export const TOCOL_RESULT = [10, 40, 70, 20, 50, 80, 30, 60, 90];
// WRAPCOLS(TOCOL_RESULT, 3) → back to 3x3
export const WRAPCOLS_RESULT = [
  [10, 20, 30],
  [40, 50, 60],
  [70, 80, 90],
];

/* ------------------------------------------------------------------ big sales (Scene 5) */
const BIG_PRODUCTS = ['Wireless Mouse', 'USB-C Cable', 'Laptop Stand', 'Office Chair', 'Notebook A5', 'Desk Lamp', 'Monitor 24"', 'Keyboard'];
const BIG_BRANCHES = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];

export type BigSale = {id: string; product: string; branch: string; month: string; sales: number};

export const bigSale = (n: number): BigSale => {
  const h = (n * 2654435761) >>> 0;
  const product = BIG_PRODUCTS[(h >>> 3) % BIG_PRODUCTS.length];
  const branch = BIG_BRANCHES[(h >>> 13) % BIG_BRANCHES.length];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const month = months[(h >>> 7) % months.length];
  const sales = 100 + ((h >>> 5) % 4900);
  return {id: `ORD-${5000 + n}`, product, branch, month, sales};
};

export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1;
export const fmtInt = (n: number) => n.toLocaleString('en-US');
