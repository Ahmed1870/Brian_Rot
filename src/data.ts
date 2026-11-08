// Manzooma — Lesson 19: SEQUENCE, RANDARRAY, LET.

/* ------------------------------------------------------------------ products (Scene 1) */
// Products list drives SEQUENCE-generated IDs.
export const PRODUCTS = [
  'Wireless Mouse', 'USB-C Cable', 'Laptop Stand', 'Office Chair', 'Notebook A5',
  'Desk Lamp', 'Monitor 24"', 'Keyboard', 'Webcam HD', 'USB Hub',
  'Mouse Pad', 'Headset', 'Speaker', 'Dock Station', 'Power Bank',
];
export const PRODUCT_INITIAL_COUNT = 10;
export const PRODUCT_EXPANDED_COUNT = 15;

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};

/** Product table cell. opts.expanded adds 5 more products to show auto-expansion. */
export const productCell = (r: number, c: number, opts?: {expanded?: boolean}): CCell | undefined => {
  const count = opts?.expanded ? PRODUCT_EXPANDED_COUNT : PRODUCT_INITIAL_COUNT;
  if (r === 1) {
    if (c < 1 || c > 2) return undefined;
    return {t: c === 1 ? 'OrderID' : 'Product', b: true, bg: '#E2EFDA', al: 'l'};
  }
  if (r < 2 || r > count + 1) return undefined;
  if (c === 1) return {t: String(1000 + r - 1)}; // SEQUENCE-generated ID
  if (c === 2) return {t: PRODUCTS[r - 2]};
  return undefined;
};

/* ------------------------------------------------------------------ RANDARRAY deterministic samples (Scene 2) */
// Pre-computed "random" integers between 100-500 for a 10x4 grid (deterministic for stable render).
const rng = (n: number) => {
  const h = (n * 2654435761) >>> 0;
  return 100 + ((h >>> 5) % 401); // 100..500
};
export const RAND_GRID: number[][] = Array.from({length: 10}, (_, r) =>
  Array.from({length: 4}, (_, c) => rng(r * 4 + c + 1))
);

/* ------------------------------------------------------------------ LET synergy (Scene 4) */
// LET(Rows, 10, IDs, SEQUENCE(Rows,1,5001), Values, RANDARRAY(Rows,1,1000,5000,TRUE), HSTACK(IDs,Values))
export const SYNERGY_ROWS = 10;
export const SYNERGY_DATA: Array<{id: number; value: number}> = Array.from({length: SYNERGY_ROWS}, (_, i) => ({
  id: 5001 + i,
  value: 1000 + ((i * 2654435761 >>> 5) % 4001), // 1000..5000
}));

/* ------------------------------------------------------------------ big sales (Scene 5) */
const BIG_PRODUCTS = ['Wireless Mouse', 'USB-C Cable', 'Laptop Stand', 'Office Chair', 'Notebook A5', 'Desk Lamp', 'Monitor 24"', 'Keyboard'];
const BIG_BRANCHES = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];

export type BigSale = {id: string; product: string; branch: string; qty: number; total: number; commission: number};

export const bigSale = (n: number): BigSale => {
  const h = (n * 2654435761) >>> 0;
  const product = BIG_PRODUCTS[(h >>> 3) % BIG_PRODUCTS.length];
  const qty = 1 + ((h >>> 9) % 6);
  const price = [350, 120, 900, 3200, 45, 650, 4800, 750][(h >>> 3) % 8];
  const total = qty * price;
  // LET-based tiered commission: >5000 → 5%, >1000 → 3%, else 1%
  const commission = total > 5000 ? total * 0.05 : total > 1000 ? total * 0.03 : total * 0.01;
  return {id: `ORD-${5000 + n}`, product, branch: BIG_BRANCHES[(h >>> 13) % BIG_BRANCHES.length], qty, total, commission};
};

export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1;
export const fmtInt = (n: number) => n.toLocaleString('en-US');
