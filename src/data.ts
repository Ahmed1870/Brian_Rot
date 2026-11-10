// Manzooma — Lesson 43: REDUCE & SCAN Engine.

/* ------------------------------------------------------------------ sales data (Scenes 1-4) */
export const SALES_RAW = [
  {id: 'ORD-001', branch: 'Cairo', product: 'Mouse',   amount: 1200},
  {id: 'ORD-002', branch: 'Giza',  product: 'Cable',    amount: 850},
  {id: 'ORD-003', branch: 'Cairo', product: 'Monitor',  amount: 6800},
  {id: 'ORD-004', branch: 'Alex',  product: 'Chair',    amount: 1200},
  {id: 'ORD-005', branch: 'Cairo', product: 'Stand',    amount: 900},
  {id: 'ORD-006', branch: 'Giza',  product: 'Lamp',     amount: 650},
  {id: 'ORD-007', branch: 'Cairo', product: 'Keyboard', amount: 7500},
  {id: 'ORD-008', branch: 'Alex',  product: 'Webcam',   amount: 1100},
];

// SCAN result: running balance (accumulated)
export const SCAN_RESULT = SALES_RAW.reduce((acc: number[], row, i) => {
  acc.push((acc[i - 1] ?? 0) + row.amount);
  return acc;
}, []);

// REDUCE result: single total
export const REDUCE_RESULT = SALES_RAW.reduce((sum, r) => sum + r.amount, 0);

// Filtered SCAN: Cairo only running balance
export const CAIRO_SALES = SALES_RAW.filter((r) => r.branch === 'Cairo');
export const FILTERED_SCAN_RESULT = CAIRO_SALES.reduce((acc: number[], row, i) => {
  acc.push((acc[i - 1] ?? 0) + row.amount);
  return acc;
}, []);

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};

export const salesHeader = ['OrderID', 'Branch', 'Product', 'Amount'];
export const salesCell = (r: number, c: number): CCell | undefined => {
  if (r === 1) {
    if (c < 1 || c > 4) return undefined;
    const al: 'l' | 'r' = c === 4 ? 'r' : 'l';
    return {t: salesHeader[c - 1], b: true, bg: '#E2EFDA', al};
  }
  const row = SALES_RAW[r - 2];
  if (!row || c < 1 || c > 4) return undefined;
  switch (c) {
    case 1: return {t: row.id};
    case 2: return {t: row.branch};
    case 3: return {t: row.product};
    case 4: return {t: row.amount.toLocaleString('en-US'), al: 'r'};
  }
  return undefined;
};

/* ------------------------------------------------------------------ big sales (Scene 5) */
const BIG_PRODUCTS = ['Wireless Mouse', 'USB-C Cable', 'Laptop Stand', 'Office Chair', 'Notebook A5', 'Desk Lamp', 'Monitor 24"', 'Keyboard'];
const BIG_BRANCHES = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];

export type BigSale = {id: string; product: string; branch: string; amount: number};

export const bigSale = (n: number): BigSale => {
  const h = (n * 2654435761) >>> 0;
  const product = BIG_PRODUCTS[(h >>> 3) % BIG_PRODUCTS.length];
  const branch = BIG_BRANCHES[(h >>> 13) % BIG_BRANCHES.length];
  const amount = 100 + ((h >>> 9) % 4900);
  return {id: `ORD-${5000 + n}`, product, branch, amount};
};

export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1;
export const fmtInt = (n: number) => n.toLocaleString('en-US');
