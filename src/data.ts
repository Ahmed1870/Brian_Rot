// Manzooma — Lesson 34: UNIQUE & SORT Engine.
// Dynamic extraction, sorting, and data validation dropdowns.

/* ------------------------------------------------------------------ sales data with duplicates (Scene 1 & 4) */
export const SALES_RAW = [
  {category: 'Electronics', branch: 'Cairo', customer: 'Ahmed',  amount: 3200},
  {category: 'Accessories', branch: 'Giza',   customer: 'Sara',   amount: 850},
  {category: 'Electronics', branch: 'Cairo', customer: 'Omar',   amount: 4800},
  {category: 'Furniture',   branch: 'Alex',  customer: 'Mona',   amount: 1200},
  {category: 'Accessories', branch: 'Cairo', customer: 'Khaled', amount: 350},
  {category: 'Electronics', branch: 'Giza',  customer: 'Hana',   amount: 2100},
  {category: 'Furniture',   branch: 'Tanta', customer: 'Yasser', amount: 900},
  {category: 'Stationery',  branch: 'Cairo', customer: 'Laila',  amount: 45},
  {category: 'Accessories', branch: 'Giza',  customer: 'Ahmed',  amount: 600},
  {category: 'Electronics', branch: 'Alex',  customer: 'Tarek',  amount: 5500},
];

// UNIQUE categories: Electronics, Accessories, Furniture, Stationery
export const UNIQUE_CATEGORIES = ['Electronics', 'Accessories', 'Furniture', 'Stationery'];

// SORT(tbl_Sales, 3, -1) — sorted by amount descending
export const SORTED_BY_AMOUNT_DESC = [...SALES_RAW].sort((a, b) => b.amount - a.amount);

// SORTBY(tbl_Products[Name], tbl_Sales[Quantity], -1) — products sorted by external quantity
export const PRODUCTS_SORTED_BY_QTY = [
  {name: 'Monitor 24"', qty: 12},
  {name: 'Office Chair', qty: 8},
  {name: 'Laptop Stand', qty: 6},
  {name: 'Desk Lamp', qty: 5},
  {name: 'Wireless Mouse', qty: 3},
];

// SORT(UNIQUE(tbl_Sales[Branch])) — sorted unique branches
export const UNIQUE_BRANCHES_SORTED = ['Alex', 'Cairo', 'Giza', 'Tanta'];

// exactly_once customers (appeared exactly 1 time): Omar, Mona, Khaled, Hana, Yasser, Laila, Tarek
export const EXACTLY_ONCE_CUSTOMERS = ['Omar', 'Mona', 'Khaled', 'Hana', 'Yasser', 'Laila', 'Tarek'];

// SORTBY multi-level: Region ASC, Amount DESC
export const MULTI_SORT_RESULT = [...SALES_RAW].sort((a, b) => {
  if (a.branch !== b.branch) return a.branch.localeCompare(b.branch);
  return b.amount - a.amount;
});

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};

/** Raw sales cell. */
export const salesCell = (r: number, c: number): CCell | undefined => {
  if (r === 1) {
    if (c < 1 || c > 4) return undefined;
    const h = ['Category', 'Branch', 'Customer', 'Amount'];
    const al: 'l' | 'r' = c === 4 ? 'r' : 'l';
    return {t: h[c - 1], b: true, bg: '#E2EFDA', al};
  }
  const row = SALES_RAW[r - 2];
  if (!row || c < 1 || c > 4) return undefined;
  switch (c) {
    case 1: return {t: row.category};
    case 2: return {t: row.branch};
    case 3: return {t: row.customer};
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
  const amount = 100 + ((h >>> 9) % 4900);
  return {id: `ORD-${5000 + n}`, product, branch, customer, amount};
};

export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1;
export const fmtInt = (n: number) => n.toLocaleString('en-US');
