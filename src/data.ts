// Manzooma Store sales sample used across the lesson (illustrative data, EGP).
export const HEAD = ['Order ID', 'Branch', 'Product', 'Category', 'Qty', 'Unit Price', 'Total', 'Tier'];

const PRODUCTS: Array<[string, string, number]> = [
  ['Wireless Mouse', 'Accessories', 350],
  ['USB-C Cable', 'Accessories', 120],
  ['Laptop Stand', 'Office', 900],
  ['Office Chair', 'Furniture', 3200],
  ['Notebook A5', 'Stationery', 45],
  ['Desk Lamp', 'Office', 650],
  ['Monitor 24"', 'Electronics', 4800],
  ['Keyboard', 'Accessories', 750],
];
const BRANCHES = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];

export type SaleRow = {id: string; branch: string; product: string; category: string; qty: number; price: number; total: number};

/** Deterministic pseudo-random sale for an order index (1-based). */
export const sale = (n: number, branch?: string): SaleRow => {
  const h = (n * 2654435761) >>> 0;
  const p = PRODUCTS[(h >>> 3) % PRODUCTS.length];
  const qty = 1 + ((h >>> 9) % 6);
  return {id: `ORD-${1000 + n}`, branch: branch ?? BRANCHES[(h >>> 5) % BRANCHES.length], product: p[0], category: p[1], qty, price: p[2], total: qty * p[2]};
};

export const tierOf = (total: number) => (total >= 5000 ? 'Premium' : total >= 1000 ? 'Standard' : 'Basic');

export const SMALL_N = 18;
export const SMALL: SaleRow[] = Array.from({length: SMALL_N}, (_, i) => sale(i + 1));

export const fmtInt = (n: number) => n.toLocaleString('en-US');
/** Excel-like status bar number: up to 3 decimals, thousands separators. */
export const fmtStat = (n: number) => {
  const r = Math.round(n * 1000) / 1000;
  return r.toLocaleString('en-US', {maximumFractionDigits: 3});
};

export type Cell = {t: string; num?: number; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};

/** Cell lookup for the small practice sheet (rows 1..SMALL_N+1, columns A..H). */
export const smallCell = (r: number, c: number): Cell | undefined => {
  if (r === 1 && c >= 1 && c <= 8) return {t: HEAD[c - 1], b: true, bg: '#E2EFDA', al: c >= 5 && c <= 7 ? 'r' : 'l'};
  const row = SMALL[r - 2];
  if (!row || c < 1 || c > 8) return undefined;
  switch (c) {
    case 1: return {t: row.id};
    case 2: return {t: row.branch};
    case 3: return {t: row.product};
    case 4: return {t: row.category};
    case 5: return {t: String(row.qty), num: row.qty};
    case 6: return {t: fmtInt(row.price), num: row.price};
    case 7: return {t: fmtInt(row.total), num: row.total};
    default: return {t: tierOf(row.total)};
  }
};

export type Stats = {count: number; numCount: number; sum: number; avg: number; min: number; max: number};
/** Real status-bar statistics of a rectangular selection over the small sheet. */
export const statsOf = (r1: number, c1: number, r2: number, c2: number): Stats => {
  let count = 0, numCount = 0, sum = 0, min = Infinity, max = -Infinity;
  for (let r = r1; r <= Math.min(r2, SMALL_N + 1); r++) {
    for (let c = c1; c <= Math.min(c2, 8); c++) {
      const cell = smallCell(r, c);
      if (!cell) continue;
      count++;
      if (cell.num !== undefined) {
        numCount++; sum += cell.num; min = Math.min(min, cell.num); max = Math.max(max, cell.num);
      }
    }
  }
  return {count, numCount, sum, avg: numCount ? sum / numCount : 0, min: numCount ? min : 0, max: numCount ? max : 0};
};

// ---- the big enterprise file (manzooma_sales_2026.xlsx, 50,000 rows) ----
export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1; // header + data
export const BIG_STATS = {count: 50000, numCount: 50000, sum: 62478350, min: 45, max: 28800}; // avg = 1,249.567
export const CAIRO_STATS = {count: 10000, numCount: 10000, sum: 12742530, min: 45, max: 28800}; // avg = 1,274.253
