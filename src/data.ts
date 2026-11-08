// Manzooma — Lesson 25: Formula Auditing, Trace Precedents/Dependents, Evaluate Formula, Error Diagnostics.

/* ------------------------------------------------------------------ sales grid (Scene 1) */
// A simple sales grid: A=Product, B=Qty, C=Price, D=Total (=B*C), E20=SUM(D2:D19)
export const SALES_AUDIT = [
  {product: 'Wireless Mouse', qty: 3, price: 350},
  {product: 'USB-C Cable',    qty: 5, price: 120},
  {product: 'Laptop Stand',   qty: 2, price: 900},
  {product: 'Office Chair',   qty: 1, price: 3200},
  {product: 'Notebook A5',    qty: 8, price: 45},
  {product: 'Desk Lamp',      qty: 2, price: 650},
  {product: 'Monitor 24"',    qty: 1, price: 4800},
  {product: 'Keyboard',       qty: 4, price: 750},
];
// E20 = SUM(D2:D9) — the audited cell
export const AUDIT_TOTAL = SALES_AUDIT.reduce((a, r) => a + r.qty * r.price, 0);

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};

export const auditCell = (r: number, c: number): CCell | undefined => {
  if (r === 1) {
    if (c < 1 || c > 4) return undefined;
    const h = ['Product', 'Qty', 'Price', 'Total'];
    const al: 'l' | 'r' = c >= 2 ? 'r' : 'l';
    return {t: h[c - 1], b: true, bg: '#E2EFDA', al};
  }
  const row = SALES_AUDIT[r - 2];
  if (!row || c < 1 || c > 4) return undefined;
  switch (c) {
    case 1: return {t: row.product};
    case 2: return {t: String(row.qty), al: 'r'};
    case 3: return {t: 'EGP ' + row.price.toLocaleString('en-US'), al: 'r'};
    case 4: return {t: 'EGP ' + (row.qty * row.price).toLocaleString('en-US'), al: 'r'};
  }
  return undefined;
};

/* ------------------------------------------------------------------ nested formula (Scene 2 — Evaluate Formula) */
// =IF(SUM(D2:D9)>10000, SUM(D2:D9)*0.1, SUM(D2:D9)*0.05)
// Evaluation steps (each replaces the underlined expression with its value):
export const EVAL_FORMULA = '=IF(SUM(D2:D9)>10000, SUM(D2:D9)*0.1, SUM(D2:D9)*0.05)';
export const EVAL_STEPS = [
  {expr: '=IF(SUM(D2:D9)>10000, SUM(D2:D9)*0.1, SUM(D2:D9)*0.05)', underline: 'SUM(D2:D9)', value: 13290},
  {expr: '=IF(13290>10000, SUM(D2:D9)*0.1, SUM(D2:D9)*0.05)', underline: '13290>10000', value: true},
  {expr: '=IF(TRUE, SUM(D2:D9)*0.1, SUM(D2:D9)*0.05)', underline: 'SUM(D2:D9)', value: 13290},
  {expr: '=IF(TRUE, 13290*0.1, SUM(D2:D9)*0.05)', underline: '13290*0.1', value: 1329},
  {expr: '=IF(TRUE, 1329, SUM(D2:D9)*0.05)', underline: '', value: 1329},
  {expr: '=1329', underline: '', value: 1329},
];

/* ------------------------------------------------------------------ watch window (Scene 2) */
export const WATCH_ITEMS = [
  {cell: 'E20', sheet: 'Sales', value: 'EGP 13,290', label: 'Total Revenue'},
  {cell: 'D12', sheet: 'Sales', value: 'EGP 4,800', label: 'Top Product'},
  {cell: 'B11', sheet: 'Sales', value: '8', label: 'Max Qty'},
];

/* ------------------------------------------------------------------ errors (Scene 3) */
export const ERROR_CARDS = [
  {code: '#SPILL!', color: '#EF4444', title: 'Spill Range Blocked', desc: 'Data in path of dynamic array', fix: 'Clear blocking cells → array spills', fixColor: '#10B981'},
  {code: '#CALC!',  color: '#F59E0B', title: 'Empty Array Result',  desc: 'FILTER returned no matches',  fix: 'Add 3rd argument: IF_EMPTY',  fixColor: '#38BDF8'},
  {code: '#REF!',   color: '#EF4444', title: 'Deleted Reference',    desc: 'Cell reference no longer exists', fix: 'Restore source or rewrite formula', fixColor: '#A855F7'},
];

/* ------------------------------------------------------------------ circular reference (Scene 4) */
// A1 = A1 + B1 (circular)
export const CIRCULAR_FORMULA = '=A1+B1';

/* ------------------------------------------------------------------ big sales (Scene 5) */
const BIG_PRODUCTS = ['Wireless Mouse', 'USB-C Cable', 'Laptop Stand', 'Office Chair', 'Notebook A5', 'Desk Lamp', 'Monitor 24"', 'Keyboard'];
const BIG_BRANCHES = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];

export type BigSale = {id: string; product: string; branch: string; qty: number; price: number; total: number; error?: boolean};

export const bigSale = (n: number): BigSale => {
  const h = (n * 2654435761) >>> 0;
  const product = BIG_PRODUCTS[(h >>> 3) % BIG_PRODUCTS.length];
  const qty = 1 + ((h >>> 9) % 6);
  const price = [350, 120, 900, 3200, 45, 650, 4800, 750][(h >>> 3) % 8];
  const total = qty * price;
  // Inject a few errors for the audit scanner to find
  const error = (n % 7 === 0);
  return {id: `ORD-${5000 + n}`, product, branch: BIG_BRANCHES[(h >>> 13) % BIG_BRANCHES.length], qty, price, total, error};
};

export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1;
export const fmtInt = (n: number) => n.toLocaleString('en-US');
