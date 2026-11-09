// Manzooma — Lesson 39: FILTER & SORTBY Synergy Engine.

export const SALES_RAW = [
  {id: 'ORD-001', branch: 'Cairo',  product: 'Mouse',   category: 'Tech',  region: 'North', amount: 3200},
  {id: 'ORD-002', branch: 'Giza',   product: 'Cable',   category: 'Tech',  region: 'South', amount: 850},
  {id: 'ORD-003', branch: 'Cairo',  product: 'Monitor', category: 'Tech',  region: 'North', amount: 6800},
  {id: 'ORD-004', branch: 'Alex',   product: 'Chair',   category: 'Furn', region: 'West',  amount: 1200},
  {id: 'ORD-005', branch: 'Cairo',  product: 'Stand',   category: 'Office',region: 'North', amount: 900},
  {id: 'ORD-006', branch: 'Giza',   product: 'Lamp',    category: 'Office',region: 'South', amount: 650},
  {id: 'ORD-007', branch: 'Cairo',  product: 'Keyboard',category: 'Tech',  region: 'North', amount: 7500},
  {id: 'ORD-008', branch: 'Alex',   product: 'Webcam',  category: 'Tech',  region: 'West',  amount: 1100},
  {id: 'ORD-009', branch: 'Cairo',  product: 'Monitor', category: 'Tech',  region: 'North', amount: 4800},
  {id: 'ORD-010', branch: 'Tanta',  product: 'Mouse',   category: 'Tech',  region: 'East',  amount: 350},
];

// SC01: SORTBY(FILTER(tbl_Sales, Branch="Cairo"), Amount, -1)
export const SC01_RESULT = SALES_RAW.filter((r) => r.branch === 'Cairo').sort((a, b) => b.amount - a.amount);

// SC02: SORTBY(FILTER(Product, Branch="Cairo"), Amount, -1) → product names only, sorted by hidden amount
export const SC02_RESULT = SALES_RAW.filter((r) => r.branch === 'Cairo').sort((a, b) => b.amount - a.amount).map((r) => r.product);

// SC03: SORTBY(FILTER(tbl_Sales, (Amount>5000) * (Category="Tech")), Region, 1, Amount, -1)
export const SC03_RESULT = SALES_RAW
  .filter((r) => r.amount > 5000 && r.category === 'Tech')
  .sort((a, b) => a.region.localeCompare(b.region) || b.amount - a.amount);

// SC04: CHOOSECOLS(SORTBY(FILTER(tbl_Sales, Amount>10000, "No Data"), Date, -1), 1, 3, 5)
// No sales > 10000 in our small dataset, so let's lower threshold to >1000
export const SC04_RESULT = SALES_RAW
  .filter((r) => r.amount > 1000)
  .sort((a, b) => b.id.localeCompare(a.id)) // simulate date desc
  .map((r) => ({col1: r.id, col3: r.product, col5: r.region}));

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};

export const salesHeader = ['OrderID', 'Branch', 'Product', 'Category', 'Region', 'Amount'];
export const salesCell = (r: number, c: number): CCell | undefined => {
  if (r === 1) {
    if (c < 1 || c > 6) return undefined;
    const al: 'l' | 'r' = c === 6 ? 'r' : 'l';
    return {t: salesHeader[c - 1], b: true, bg: '#E2EFDA', al};
  }
  const row = SALES_RAW[r - 2];
  if (!row || c < 1 || c > 6) return undefined;
  switch (c) {
    case 1: return {t: row.id};
    case 2: return {t: row.branch};
    case 3: return {t: row.product};
    case 4: return {t: row.category};
    case 5: return {t: row.region};
    case 6: return {t: row.amount.toLocaleString('en-US'), al: 'r'};
  }
  return undefined;
};

// Big sales (Scene 5)
const BIG_PRODUCTS = ['Wireless Mouse', 'USB-C Cable', 'Laptop Stand', 'Office Chair', 'Notebook A5', 'Desk Lamp', 'Monitor 24"', 'Keyboard'];
const BIG_BRANCHES = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];

export type BigSale = {id: string; product: string; branch: string; amount: number};

export const bigSale = (n: number): BigSale => {
  const h = (n * 2654435761) >>> 0;
  const product = BIG_PRODUCTS[(h >>> 3) % BIG_PRODUCTS.length];
  const branch = BIG_BRANCHES[(h >>> 13) % BIG_BRANCHES.length];
  const amount = 100 + ((h >>> 9) % 14900);
  return {id: `ORD-${5000 + n}`, product, branch, amount};
};

export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1;
export const fmtInt = (n: number) => n.toLocaleString('en-US');
