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

/* =====================================================================  Lesson 07  ===================================================================== */
import type {CellV} from './xl';

export const fmtMoney = (n: number) => '$' + n.toLocaleString('en-US');
export const fmt2 = (n: number) => n.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
export const fmtMoney2 = (n: number) => '$' + fmt2(n);

// ---- practice sheet (scenes 1-2): 10 revenue values, C12 = SUM, C13 = AVERAGE ----
export const NAMES7 = ['Ahmed Hassan', 'Sara Ali', 'Omar Khaled', 'Mona Adel', 'Youssef Samir', 'Laila Nabil', 'Karim Fathy', 'Nour Hany', 'Hadeer Salah', 'Mostafa Reda'];
export const REGIONS7 = ['Cairo', 'Giza', 'Alexandria', 'Tanta', 'Mansoura', 'Cairo', 'Giza', 'Alexandria', 'Cairo', 'Tanta'];
export const REV7 = [1850, 2400, 960, 3150, 1275, 2780, 540, 4100, 1620, 2225]; // sum 20,900 | without rows 4 and 8 (960, 540): 19,400 / 8 = 2,425
export const HEAD7 = ['Order ID', 'Customer', 'Revenue', 'Region'];
export const cw7 = (c: number) => [0, 90, 140, 110, 100][c] ?? 64;
export const sumOf = (a: Array<number | null>) => a.reduce<number>((s, v) => s + (v ?? 0), 0);
export const countOf = (a: Array<number | null>) => a.filter((v) => v !== null).length;

export const mainCell = (r: number, c: number, rev: Array<number | null>, o: {c12?: CellV; c13?: CellV; b12?: boolean; b13?: boolean; edit?: {r: number; c: number; t: string}} = {}): CellV | undefined => {
  if (o.edit && o.edit.r === r && o.edit.c === c) return {t: o.edit.t, al: 'l'};
  if (r === 1 && c >= 1 && c <= 4) return {t: HEAD7[c - 1], b: true, bg: '#E2EFDA', al: c === 3 ? 'r' : 'l'};
  if (r >= 2 && r <= 11) {
    const i = r - 2;
    if (c === 1) return {t: `ORD-${1001 + i}`};
    if (c === 2) return {t: NAMES7[i]};
    if (c === 3) { const v = rev[i]; return v === null || v === undefined ? undefined : {t: fmtMoney(v), num: v, al: 'r'}; }
    if (c === 4) return {t: REGIONS7[i]};
  }
  if (r === 12 && c === 2 && o.b12 !== false) return {t: 'Total', b: true};
  if (r === 13 && c === 2 && o.b13) return {t: 'Average', b: true};
  if (r === 12 && c === 3) return o.c12;
  if (r === 13 && c === 3) return o.c13;
  return undefined;
};

// ---- scene 3: mixed range A2:A13 -> COUNT = 6, COUNTA = 9 ----
export type MixItem = {t: string; kind: 'num' | 'date' | 'text' | 'blank' | 'empty'};
export const MIX: MixItem[] = [
  {t: '1,250', kind: 'num'}, {t: 'Ahmed', kind: 'text'}, {t: '3/15/2026', kind: 'date'}, {t: '980', kind: 'num'}, {t: 'Cairo', kind: 'text'}, {t: '', kind: 'blank'},
  {t: '2,100', kind: 'num'}, {t: '5/1/2026', kind: 'date'}, {t: '', kind: 'blank'}, {t: '', kind: 'blank'}, {t: '760', kind: 'num'}, {t: '', kind: 'empty'},
];
export const mixNumeric = MIX.filter((m) => m.kind === 'num' || m.kind === 'date').length; // 6
export const mixNonEmpty = MIX.filter((m) => m.kind !== 'blank').length; // 9 (the last one is ="" -> counted by COUNTA)

// ---- scene 4: Amount column with a text-number and an error ----
export const AMT = [1200, 2500, '1,800', 900, 3400, 600] as const; // C2:C7, C4 is stored as text

// ---- scene 5: enterprise sheet columns: Order ID | Customer | Branch | Product | Qty | Total ----
export const cust5 = (n: number) => `CUS-${1000 + ((n * 37) % 9000)}`;
export const HEAD5 = ['Order ID', 'Customer', 'Branch', 'Product', 'Qty', 'Total'];
export const cw5 = (c: number) => [0, 80, 90, 100, 130, 54, 96, 24, 150, 130][c] ?? 64;
export const KPI5 = {sum: 236616055, avg: 236616055 / 50000, count: 50000, counta: 50000};

/* =====================================================================  Lesson 22  ===================================================================== */
export const ORD: Array<[string, string, string, number, string]> = [
  ['CUST-101', 'Ahmed Hassan', '1/12/2026', 2400, 'Cairo'], ['CUST-102', 'Sara Ali', '1/20/2026', 1850, 'Giza'], ['CUST-103', 'Omar Khaled', '2/3/2026', 3100, 'Alexandria'],
  ['CUST-104', 'Mona Adel', '2/14/2026', 960, 'Tanta'], ['CUST-105', 'Youssef Samir', '3/2/2026', 4250, 'Cairo'], ['CUST-106', 'Laila Nabil', '3/18/2026', 1275, 'Giza'],
  ['CUST-107', 'Karim Fathy', '4/1/2026', 2780, 'Mansoura'], ['CUST-108', 'Nour Hany', '4/22/2026', 540, 'Alexandria'],
];
export const cwO = (c: number) => [0, 100, 140, 110, 100, 100][c] ?? 64;
export const ordCell = (r: number, c: number, extra: Record<string, CellV> = {}): CellV | undefined => {
  const k = extra[`${r},${c}`];
  if (k) return k;
  if (r === 1 && c <= 5) return {t: ['Customer ID', 'Customer', 'Order Date', 'Sales', 'Branch'][c - 1], b: true, bg: '#E2EFDA', al: c === 4 ? 'r' : 'l'};
  if (r >= 2 && r <= 9 && c <= 5) {
    const o = ORD[r - 2];
    if (c === 4) return {t: fmtInt(o[3]), num: o[3], al: 'r'};
    if (c === 3) return {t: o[2], al: 'r', num: 1};
    return {t: String(o[c - 1])};
  }
  return undefined;
};

export const PRODS: Array<[string, string, number]> = [
  ['Wireless Mouse', 'Accessories', 350], ['USB-C Cable', 'Accessories', 120], ['Laptop Stand', 'Office', 900], ['Office Chair', 'Furniture', 3200], ['Notebook A5', 'Stationery', 45],
  ['Desk Lamp', 'Office', 650], ['Monitor 24"', 'Electronics', 4800], ['Keyboard', 'Accessories', 750], ['Standing Desk', 'Furniture', 6500], ['Smart Watch', 'Gadgets', 3900],
];
export const cwP = (c: number) => [0, 130, 110, 80, 20, 20, 120, 20, 140][c] ?? 64;
export const uniqSorted = (n: number) => Array.from(new Set(PRODS.slice(0, n).map((p) => p[1]))).sort();
export const prodCell = (r: number, c: number, nRows: number, spillN: number, extra: Record<string, CellV> = {}): CellV | undefined => {
  const k = extra[`${r},${c}`];
  if (k) return k;
  const HB = '#4472C4';
  if (r === 1 && c <= 3) return {t: ['Product', 'Category', 'Price'][c - 1], b: true, bg: HB, color: '#FFFFFF', al: c === 3 ? 'r' : 'l'};
  if (r >= 2 && r <= nRows + 1 && c <= 3) {
    const p = PRODS[r - 2]; const bg = r % 2 === 0 ? '#D9E1F2' : undefined;
    return {t: c === 3 ? fmtInt(p[2]) : String(p[c - 1]), bg, al: c === 3 ? 'r' : 'l', num: c === 3 ? p[2] : undefined};
  }
  if (c === 6 && r === 1) return {t: 'Categories', b: true, bg: '#E2EFDA'};
  if (c === 6 && r >= 2 && r <= 1 + spillN) return {t: uniqSorted(nRows)[r - 2]};
  if (c === 8 && r === 1) return {t: 'Select Category', b: true, bg: '#E2EFDA'};
  return undefined;
};
