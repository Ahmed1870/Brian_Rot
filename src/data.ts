// Manzooma — Lesson 68: Advanced Charts & Custom Visualizations.

/* ------------------------------------------------------------------ Combo Chart data (Scene 2) */
export const COMBO_DATA = [
  {branch: 'Cairo',      sales: 2850000, margin: 32.5},
  {branch: 'Alex',       sales: 1950000, margin: 28.1},
  {branch: 'Giza',       sales: 1650000, margin: 35.2},
  {branch: 'Mansoura',   sales: 1200000, margin: 22.8},
  {branch: 'Tanta',     sales:  950000, margin: 26.4},
  {branch: 'Aswan',      sales:  680000, margin: 19.5},
];

/* ------------------------------------------------------------------ Waterfall data (Scene 2) */
export const WATERFALL = [
  {label: 'Gross Sales',   value: 9280000, type: 'total'},
  {label: 'Discounts',     value: -420000, type: 'decrease'},
  {label: 'Net Revenue',   value: 8860000, type: 'total'},
  {label: 'COGS',          value: -3100000, type: 'decrease'},
  {label: 'Operating Exp', value: -1800000, type: 'decrease'},
  {label: 'Net Profit',    value: 3960000, type: 'total'},
];

/* ------------------------------------------------------------------ Pareto data (Scene 3) */
export const PARETO = [
  {product: 'Monitor 24"',  sales: 3200000, cumPct: 0},
  {product: 'Office Chair', sales: 2100000, cumPct: 0},
  {product: 'Keyboard',     sales: 1500000, cumPct: 0},
  {product: 'Laptop Stand', sales: 1100000, cumPct: 0},
  {product: 'Desk Lamp',    sales:  800000, cumPct: 0},
  {product: 'Mouse',        sales:  500000, cumPct: 0},
  {product: 'Cable',        sales:  280000, cumPct: 0},
  {product: 'Notebook',     sales:  120000, cumPct: 0},
];
const totalPareto = PARETO.reduce((s, r) => s + r.sales, 0);
let runningPct = 0;
PARETO.forEach((r) => { runningPct += (r.sales / totalPareto) * 100; r.cumPct = +(runningPct).toFixed(1); });

/* ------------------------------------------------------------------ Bullet data (Scene 3) */
export const BULLET = [
  {branch: 'Cairo',    actual: 285, target: 300},
  {branch: 'Alex',     actual: 195, target: 220},
  {branch: 'Giza',     actual: 165, target: 150},
  {branch: 'Mansoura', actual: 120, target: 140},
  {branch: 'Tanta',    actual:  95, target: 100},
  {branch: 'Aswan',    actual:  68, target:  80},
];

/* ------------------------------------------------------------------ Sparkline data (Scene 4) */
export const SPARKLINE_DATA = [
  {product: 'Monitor 24"',  trend: [3, 5, 4, 7, 6, 9, 8, 12, 10, 15]},
  {product: 'Office Chair', trend: [5, 4, 6, 3, 5, 2, 4, 3, 2, 4]},
  {product: 'Keyboard',     trend: [2, 3, 5, 4, 6, 8, 7, 9, 11, 14]},
  {product: 'Laptop Stand', trend: [4, 3, 2, 4, 3, 2, 3, 2, 1, 2]},
  {product: 'Desk Lamp',    trend: [1, 2, 3, 2, 4, 3, 5, 4, 6, 5]},
];

/* ------------------------------------------------------------------ big sales (Scene 5) */
const BIG_BRANCHES = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];
const BIG_PRODUCTS = ['Wireless Mouse', 'USB-C Cable', 'Laptop Stand', 'Office Chair', 'Notebook A5', 'Desk Lamp', 'Monitor 24"', 'Keyboard'];

export type BigSale = {id: string; branch: string; product: string; amount: number};

export const bigSale = (n: number): BigSale => {
  const h = (n * 2654435761) >>> 0;
  const branch = BIG_BRANCHES[(h >>> 13) % BIG_BRANCHES.length];
  const product = BIG_PRODUCTS[(h >>> 3) % BIG_PRODUCTS.length];
  const amount = 100 + ((h >>> 9) % 4900);
  return {id: `ORD-${5000 + n}`, branch, product, amount};
};

export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1;
export const fmtInt = (n: number) => n.toLocaleString('en-US');

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};
