// Manzooma — Lesson 17: UNIQUE, SORT, SORTBY.
// Three datasets drive the lesson:
//   1. Sales with duplicate customers (Scene 1, 2, 4)
//   2. Sales reps with totals + tenure (Scene 3)
//   3. Big 50,000-row file (Scene 5)

/* ------------------------------------------------------------------ sales (Scenes 1, 2, 4) */
export const SALES_HEAD = ['OrderID', 'Customer', 'Product', 'Amount'];
export type SaleRow = {id: string; customer: string; product: string; amount: number};
// Customers deliberately repeat so UNIQUE has work to do.
export const SALES: SaleRow[] = [
  {id: 'ORD-001', customer: 'Ahmed',   product: 'Mouse',    amount: 350},
  {id: 'ORD-002', customer: 'Sara',    product: 'Cable',    amount: 120},
  {id: 'ORD-003', customer: 'Ahmed',   product: 'Stand',    amount: 900},
  {id: 'ORD-004', customer: 'Omar',    product: 'Chair',    amount: 3200},
  {id: 'ORD-005', customer: 'Sara',    product: 'Notebook', amount: 45},
  {id: 'ORD-006', customer: 'Mona',    product: 'Lamp',     amount: 650},
  {id: 'ORD-007', customer: 'Ahmed',   product: 'Monitor',  amount: 4800},
  {id: 'ORD-008', customer: 'Khaled',  product: 'Keyboard', amount: 750},
  {id: 'ORD-009', customer: 'Sara',    product: 'Webcam',   amount: 1100},
];
// Customer "Omar", "Mona", "Khaled" each appear exactly once → exactly_once=TRUE isolates them.
export const UNIQUE_CUSTOMERS = ['Ahmed', 'Sara', 'Omar', 'Mona', 'Khaled'];
export const EXACTLY_ONCE_CUSTOMERS = ['Omar', 'Mona', 'Khaled'];
// SORT(UNIQUE(B2:B10)) — alphabetically sorted unique customer list.
export const SORTED_UNIQUE_CUSTOMERS = [...UNIQUE_CUSTOMERS].sort();
// SORT(A2:D10, 4, -1) — sales sorted by Amount descending.
export const SORTED_BY_AMOUNT_DESC = [...SALES].sort((a, b) => b.amount - a.amount);

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};

/** Sales table cell. opts.mode controls what's shown:
 *  'raw' = original | 'sortedDesc' = sorted by Amount desc | 'sortedUnique' = spilled sorted unique list */
export const salesCell = (r: number, c: number, mode: 'raw' | 'sortedDesc' = 'raw'): CCell | undefined => {
  if (r === 1) {
    if (c < 1 || c > 4) return undefined;
    const al: 'l' | 'r' = (c === 4) ? 'r' : 'l';
    return {t: SALES_HEAD[c - 1], b: true, bg: '#E2EFDA', al};
  }
  const rows = mode === 'sortedDesc' ? SORTED_BY_AMOUNT_DESC : SALES;
  const row = rows[r - 2];
  if (!row || c < 1 || c > 4) return undefined;
  switch (c) {
    case 1: return {t: row.id};
    case 2: return {t: row.customer};
    case 3: return {t: row.product};
    case 4: return {t: 'EGP ' + row.amount.toLocaleString('en-US'), al: 'r'};
  }
};

/* ------------------------------------------------------------------ sales reps (Scene 3) */
export const REPS_HEAD = ['RepName', 'Region'];
export type Rep = {name: string; region: string; total: number; tenure: number};
export const REPS: Rep[] = [
  {name: 'Yasser',  region: 'Cairo',       total: 45000, tenure: 5},
  {name: 'Laila',   region: 'Alexandria', total: 52000, tenure: 3},
  {name: 'Tarek',   region: 'Giza',        total: 52000, tenure: 7},
  {name: 'Nour',    region: 'Tanta',       total: 38000, tenure: 2},
];
// SORTBY(RepName, TotalSales DESC, Tenure ASC):
// Laila(52000,3) and Tarek(52000,7) tie on sales → tenure ASC → Laila first.
export const SORTBY_RESULT = ['Laila', 'Tarek', 'Yasser', 'Nour'];

export const repCell = (r: number, c: number): CCell | undefined => {
  if (r === 1) {
    if (c < 1 || c > 2) return undefined;
    return {t: REPS_HEAD[c - 1], b: true, bg: '#E2EFDA', al: 'l'};
  }
  const rep = REPS[r - 2];
  if (!rep || c < 1 || c > 2) return undefined;
  switch (c) {
    case 1: return {t: rep.name};
    case 2: return {t: rep.region};
  }
};

/* ------------------------------------------------------------------ big sales (Scene 5) */
const BIG_PRODUCTS = ['Wireless Mouse', 'USB-C Cable', 'Laptop Stand', 'Office Chair', 'Notebook A5', 'Desk Lamp', 'Monitor 24"', 'Keyboard'];
const BIG_BRANCHES = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];

export type BigSale = {id: string; product: string; branch: string; qty: number; total: number};

export const bigSale = (n: number): BigSale => {
  const h = (n * 2654435761) >>> 0;
  const product = BIG_PRODUCTS[(h >>> 3) % BIG_PRODUCTS.length];
  const qty = 1 + ((h >>> 9) % 6);
  return {
    id: `ORD-${1000 + n}`,
    product,
    branch: BIG_BRANCHES[(h >>> 13) % BIG_BRANCHES.length],
    qty,
    total: qty * [350, 120, 900, 3200, 45, 650, 4800, 750][(h >>> 3) % 8],
  };
};

export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1;
export const fmtInt = (n: number) => n.toLocaleString('en-US');

// Pre-computed unique products sorted by total revenue (descending) — for Scene 5 executive ranking.
export const PRODUCT_RANKING = [
  {product: 'Monitor 24"',  total: 9600000},
  {product: 'Office Chair', total: 6400000},
  {product: 'Laptop Stand', total: 1800000},
  {product: 'Keyboard',     total: 1500000},
  {product: 'Desk Lamp',    total: 1300000},
  {product: 'Wireless Mouse', total: 700000},
  {product: 'USB-C Cable',   total: 240000},
  {product: 'Notebook A5',   total: 90000},
];
