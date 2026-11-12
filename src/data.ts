// Manzooma — Lesson 61: ALL, ALLEXCEPT & Remove Filters Engine (DAX).

/* ------------------------------------------------------------------ PivotTable data (Scenes 1-4) */
export const PIVOT_ROWS = [
  {branch: 'Cairo',       sales: 285000, pct: 0},
  {branch: 'Alexandria',  sales: 195000, pct: 0},
  {branch: 'Giza',         sales: 165000, pct: 0},
  {branch: 'Mansoura',    sales: 120000, pct: 0},
  {branch: 'Tanta',       sales:  95000, pct: 0},
];
export const GRAND_TOTAL = PIVOT_ROWS.reduce((s, r) => s + r.sales, 0); // 860000
// % of Total = sales / GRAND_TOTAL
export const PIVOT_WITH_PCT = PIVOT_ROWS.map((r) => ({...r, pct: +(r.sales / GRAND_TOTAL * 100).toFixed(1)}));

// DAX measures
export const MEASURE_ALL = 'All Sales = CALCULATE([Total Sales], ALL(Fact_Sales))';
export const MEASURE_PCT = '% Total = DIVIDE([Total Sales], [All Sales])';
export const MEASURE_ALLEXCEPT = 'Cat Total = CALCULATE([Total Sales], ALLEXCEPT(Dim_Product, Dim_Product[Category]))';
export const MEASURE_REMOVEFILTERS = 'CALCULATE([Total Sales], REMOVEFILTERS(Dim_Product[SubCategory]))';
export const MEASURE_DIVIDE_SAFE = 'DIVIDE([Total Sales], [All Sales], 0)';
export const MEASURE_UNSAFE = '[Total Sales] / [All Sales]';

// Error display
export const DIV_ERROR = '#DIV/0!';

/* ------------------------------------------------------------------ big sales (Scene 5) */
const BIG_BRANCHES = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];
const BIG_PRODUCTS = ['Wireless Mouse', 'USB-C Cable', 'Laptop Stand', 'Office Chair', 'Notebook A5', 'Desk Lamp', 'Monitor 24"', 'Keyboard'];

export type BigSale = {id: string; branch: string; product: string; amount: number; pct: number};

export const bigSale = (n: number): BigSale => {
  const h = (n * 2654435761) >>> 0;
  const branch = BIG_BRANCHES[(h >>> 13) % BIG_BRANCHES.length];
  const product = BIG_PRODUCTS[(h >>> 3) % BIG_PRODUCTS.length];
  const amount = 100 + ((h >>> 9) % 4900);
  const pct = +((amount / 5000) * 100).toFixed(2);
  return {id: `ORD-${5000 + n}`, branch, product, amount, pct};
};

export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1;
export const fmtInt = (n: number) => n.toLocaleString('en-US');
export const fmtPct = (n: number) => n.toFixed(1) + '%';
