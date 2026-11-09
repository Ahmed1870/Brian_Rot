// Manzooma — Lesson 35: FILTER Engine & Multi-Criteria Filtering.

/* ------------------------------------------------------------------ sales data (Scenes 1-4) */
export const SALES_RAW = [
  {id: 'ORD-001', branch: 'Cairo',  product: 'Mouse',   amount: 3200, customer: 'Ahmed'},
  {id: 'ORD-002', branch: 'Giza',   product: 'Cable',   amount: 850,  customer: 'Sara'},
  {id: 'ORD-003', branch: 'Cairo',  product: 'Monitor', amount: 6800, customer: 'Omar'},
  {id: 'ORD-004', branch: 'Alex',   product: 'Chair',   amount: 1200, customer: 'Mona'},
  {id: 'ORD-005', branch: 'Cairo',  product: 'Stand',   amount: 900,  customer: 'Khaled'},
  {id: 'ORD-006', branch: 'Giza',   product: 'Lamp',    amount: 650,  customer: 'Hana'},
  {id: 'ORD-007', branch: 'Cairo',  product: 'Keyboard', amount: 7500, customer: 'Yasser'},
  {id: 'ORD-008', branch: 'Alex',   product: 'Webcam',  amount: 1100, customer: 'Laila'},
  {id: 'ORD-009', branch: 'Cairo',  product: 'Monitor', amount: 4800, customer: 'Tarek'},
  {id: 'ORD-010', branch: 'Tanta',  product: 'Mouse',   amount: 350,  customer: 'Nour'},
];

export const FILTER_CAIRO = SALES_RAW.filter((r) => r.branch === 'Cairo');
export const FILTER_AND = SALES_RAW.filter((r) => r.branch === 'Cairo' && r.amount > 5000);
export const FILTER_OR = SALES_RAW.filter((r) => r.branch === 'Cairo' || r.branch === 'Alex');
export const SORT_FILTER_RESULT = [...FILTER_AND].sort((a, b) => b.amount - a.amount);

export const BOOLEAN_MASK_AND = SALES_RAW.map((r) => ({
  branch: r.branch, amount: r.amount,
  cond1: r.branch === 'Cairo' ? 1 : 0,
  cond2: r.amount > 5000 ? 1 : 0,
  result: (r.branch === 'Cairo' ? 1 : 0) * (r.amount > 5000 ? 1 : 0),
}));

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};

export const salesCell = (r: number, c: number): CCell | undefined => {
  if (r === 1) {
    if (c < 1 || c > 4) return undefined;
    const h = ['OrderID', 'Branch', 'Product', 'Amount'];
    const al: 'l' | 'r' = c === 4 ? 'r' : 'l';
    return {t: h[c - 1], b: true, bg: '#E2EFDA', al};
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

export type BigSale = {id: string; product: string; branch: string; customer: string; amount: number};

export const bigSale = (n: number): BigSale => {
  const h = (n * 2654435761) >>> 0;
  const product = BIG_PRODUCTS[(h >>> 3) % BIG_PRODUCTS.length];
  const branch = BIG_BRANCHES[(h >>> 13) % BIG_BRANCHES.length];
  const customer = `CUST-${100 + ((h >>> 5) % 500)}`;
  const amount = 100 + ((h >>> 9) % 14900);
  return {id: `ORD-${5000 + n}`, product, branch, customer, amount};
};

export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1;
export const fmtInt = (n: number) => n.toLocaleString('en-US');
