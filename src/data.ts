// Manzooma — Lesson 24: Flash Fill, Text to Columns, Remove Duplicates.

/* ------------------------------------------------------------------ merged names (Scene 1 — Flash Fill) */
export const MERGED_NAMES = [
  'Ahmed Ali - Cairo',
  'Sara Mohamed - Giza',
  'Omar Ibrahim - Cairo',
  'Mona Saleh - Dokki',
  'Khaled Adel - Cairo',
  'Hana Youssef - Giza',
  'Yasser Nabil - Alex',
  'Laila Fawzi - Tanta',
];
export const FIRST_NAMES = MERGED_NAMES.map((s) => s.split(' ')[0]);

/* ------------------------------------------------------------------ comma-separated SKUs (Scene 2 — Text to Columns) */
export const SKU_RAW = [
  'CAIRO,STORE,2026',
  'GIZA,WHSE,2025',
  'ALEX,STORE,2026',
  'TANTA,WHSE,2025',
  'Cairo,Store,2026',
];
// After split: 3 columns each
export const SKU_SPLIT = SKU_RAW.map((s) => s.split(','));

/* ------------------------------------------------------------------ text-formatted dates (Scene 2 — Date conversion) */
export const TEXT_DATES_RAW = ['2026.12.31', '2026.01.15', '2025.07.04', '2026.03.22'];
// After Date: YMD conversion → real Excel dates (display strings)
export const TEXT_DATES_FIXED = ['12/31/2026', '01/15/2026', '07/04/2025', '03/22/2026'];

/* ------------------------------------------------------------------ customer data with duplicates (Scene 3 — Remove Duplicates) */
export const DUP_CUSTOMERS = [
  {id: 'CUST-001', name: 'Ahmed',  branch: 'Cairo'},
  {id: 'CUST-002', name: 'Sara',   branch: 'Giza'},
  {id: 'CUST-001', name: 'Ahmed',  branch: 'Cairo'},   // dup
  {id: 'CUST-003', name: 'Omar',   branch: 'Cairo'},
  {id: 'CUST-002', name: 'Sara',   branch: 'Giza'},   // dup
  {id: 'CUST-004', name: 'Mona',   branch: 'Dokki'},
  {id: 'CUST-001', name: 'Ahmed',  branch: 'Cairo'},   // dup
  {id: 'CUST-005', name: 'Khaled', branch: 'Cairo'},
  {id: 'CUST-003', name: 'Omar',   branch: 'Cairo'},   // dup
  {id: 'CUST-006', name: 'Hana',   branch: 'Giza'},
];
export const DUP_COUNT = 4; // 4 duplicates removed → 6 unique remain
export const UNIQUE_CUSTOMERS_AFTER_DEDUP = DUP_CUSTOMERS.filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i);

/* ------------------------------------------------------------------ big sales (Scene 5) */
const BIG_PRODUCTS = ['Wireless Mouse', 'USB-C Cable', 'Laptop Stand', 'Office Chair', 'Notebook A5', 'Desk Lamp', 'Monitor 24"', 'Keyboard'];
const BIG_BRANCHES = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];

export type BigSale = {id: string; mergedSKU: string; product: string; branch: string; dateText: string; dateFixed: string; total: number};

export const bigSale = (n: number): BigSale => {
  const h = (n * 2654435761) >>> 0;
  const product = BIG_PRODUCTS[(h >>> 3) % BIG_PRODUCTS.length];
  const branch = BIG_BRANCHES[(h >>> 13) % BIG_BRANCHES.length];
  const qty = 1 + ((h >>> 9) % 6);
  const price = [350, 120, 900, 3200, 45, 650, 4800, 750][(h >>> 3) % 8];
  const day = 1 + ((h >>> 5) % 28);
  const month = 1 + ((h >>> 11) % 12);
  const year = 2025 + ((h >>> 17) % 2);
  return {
    id: `ORD-${5000 + n}`,
    mergedSKU: `${branch.toUpperCase().slice(0, 4)},${product.slice(0, 4).toUpperCase()},${year}`,
    product,
    branch,
    dateText: `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`,
    dateFixed: `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`,
    total: qty * price,
  };
};

export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1;
export const fmtInt = (n: number) => n.toLocaleString('en-US');

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};
