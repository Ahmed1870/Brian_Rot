// Manzooma — Lesson 15: Dynamic Arrays Engine, Spill Range, # Operator, #SPILL! Error, @ Operator.

/* ------------------------------------------------------------------ pricing table (Scenes 1, 2, 4) */
export const PRICING_HEAD = ['Product', 'Qty', 'Price', 'Total'];
export type PriceRow = {product: string; qty: number; price: number};
export const PRICING: PriceRow[] = [
  {product: 'Wireless Mouse',  qty: 3, price: 350},
  {product: 'USB-C Cable',     qty: 5, price: 120},
  {product: 'Laptop Stand',    qty: 2, price: 900},
  {product: 'Office Chair',    qty: 1, price: 3200},
  {product: 'Notebook A5',     qty: 8, price: 45},
  {product: 'Desk Lamp',       qty: 2, price: 650},
  {product: 'Monitor 24"',     qty: 1, price: 4800},
  {product: 'Keyboard',        qty: 4, price: 750},
  {product: 'Webcam HD',       qty: 2, price: 1100},
];
// Extra rows used when Scene 2 demonstrates dynamic expansion
export const PRICING_EXTRA: PriceRow[] = [
  {product: 'USB Hub',     qty: 3, price: 420},
  {product: 'Mouse Pad',   qty: 5, price: 80},
];

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};

/** Pricing table cell. opts.expanded adds 2 extra rows (Scene 2 dynamic expansion). */
export const pricingCell = (r: number, c: number, opts?: {expanded?: boolean}): CCell | undefined => {
  const rows = opts?.expanded ? [...PRICING, ...PRICING_EXTRA] : PRICING;
  if (r === 1) {
    if (c < 1 || c > 4) return undefined;
    const al: 'l' | 'r' = (c >= 2 && c <= 4) ? 'r' : 'l';
    return {t: PRICING_HEAD[c - 1], b: true, bg: '#E2EFDA', al};
  }
  const row = rows[r - 2];
  if (!row || c < 1 || c > 4) return undefined;
  switch (c) {
    case 1: return {t: row.product};
    case 2: return {t: String(row.qty), al: 'r'};
    case 3: return {t: 'EGP ' + row.price.toLocaleString('en-US'), al: 'r'};
    case 4: return {t: 'EGP ' + (row.qty * row.price).toLocaleString('en-US'), al: 'r'};
  }
};

/** How many data rows the pricing table has (for spill range height calculations). */
export const pricingRowCount = (expanded?: boolean) => expanded ? PRICING.length + PRICING_EXTRA.length : PRICING.length;

/* ------------------------------------------------------------------ big sales (Scene 5) */
const SALE_PRODUCTS = [
  ['Wireless Mouse', 'Accessories', 350],
  ['USB-C Cable', 'Accessories', 120],
  ['Laptop Stand', 'Office', 900],
  ['Office Chair', 'Furniture', 3200],
  ['Notebook A5', 'Stationery', 45],
  ['Desk Lamp', 'Office', 650],
  ['Monitor 24"', 'Electronics', 4800],
  ['Keyboard', 'Accessories', 750],
] as const;
const SALE_BRANCHES = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];

export type SaleRow = {id: string; branch: string; product: string; qty: number; price: number; total: number};

export const sale = (n: number): SaleRow => {
  const h = (n * 2654435761) >>> 0;
  const p = SALE_PRODUCTS[(h >>> 3) % SALE_PRODUCTS.length];
  const qty = 1 + ((h >>> 9) % 6);
  return {
    id: `ORD-${1000 + n}`,
    branch: SALE_BRANCHES[(h >>> 13) % SALE_BRANCHES.length],
    product: p[0],
    qty,
    price: p[2],
    total: qty * p[2],
  };
};

export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1;
export const fmtInt = (n: number) => n.toLocaleString('en-US');
