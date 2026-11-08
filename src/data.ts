// Manzooma — Lesson 27: Data Merge & Linking (VSTACK, HSTACK, Power Query, Data Model).

/* ------------------------------------------------------------------ branch tables (Scene 1) */
export const CAIRO_SALES = [
  {product: 'Mouse',  qty: 3, amount: 1050},
  {product: 'Cable',  qty: 5, amount: 600},
  {product: 'Stand',  qty: 2, amount: 1800},
  {product: 'Chair',  qty: 1, amount: 3200},
];
export const ALEX_SALES = [
  {product: 'Lamp',   qty: 2, amount: 1300},
  {product: 'Monitor',qty: 1, amount: 4800},
  {product: 'Keyboard',qty: 4, amount: 3000},
  {product: 'Webcam', qty: 2, amount: 2200},
];
// VSTACK result: Cairo + Alex (8 rows total)
export const VSTACK_RESULT = [...CAIRO_SALES, ...ALEX_SALES];

// HSTACK: Products table + Sales table side by side
export const PRODUCTS_TABLE = [
  {sku: 'PRD-001', name: 'Mouse'},
  {sku: 'PRD-002', name: 'Cable'},
  {sku: 'PRD-003', name: 'Stand'},
  {sku: 'PRD-004', name: 'Chair'},
];
export const SALES_TABLE = [
  {sku: 'PRD-001', price: 350},
  {sku: 'PRD-002', price: 120},
  {sku: 'PRD-003', price: 900},
  {sku: 'PRD-004', price: 3200},
];
// HSTACK result: Products + Sales (4 rows, 4 cols)
export const HSTACK_RESULT = PRODUCTS_TABLE.map((p, i) => ({sku: p.sku, name: p.name, price: SALES_TABLE[i].price}));

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};

/* ------------------------------------------------------------------ branch sheets (Scene 2) */
export const BRANCH_SHEETS = [
  {name: 'Cairo_Sales.xlsx', rows: 12500},
  {name: 'Alex_Sales.xlsx', rows: 11200},
  {name: 'Giza_Sales.xlsx', rows: 13800},
  {name: 'Tanta_Sales.xlsx', rows: 12500},
];
export const APPEND_TOTAL = BRANCH_SHEETS.reduce((a, s) => a + s.rows, 0);

/* ------------------------------------------------------------------ Data Model (Scene 3) */
export const DATA_MODEL_TABLES = [
  {name: 'Customers', color: '#38BDF8', x: 200, y: 200, rows: 500, key: 'CustomerID'},
  {name: 'Products', color: '#10B981', x: 200, y: 400, rows: 1000, key: 'ProductID'},
  {name: 'Sales (Fact)', color: '#A855F7', x: 700, y: 300, rows: 50000, key: 'SaleID'},
];

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
