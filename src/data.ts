// Manzooma — Lesson 37: Array Reshaping (TOCOL, TOROW, CHOOSECOLS, CHOOSEROWS).

/* ------------------------------------------------------------------ 2D matrix with blanks (Scene 1) */
// 5x4 matrix with some blank cells
export const MATRIX_2D: (string | null)[][] = [
  ['Mouse',  '350',  null,   'Cairo'],
  ['Cable',  null,   '120',  'Giza'],
  ['Stand',  '900',  '1800', null],
  [null,     'Chair','3200', 'Alex'],
  ['Lamp',   '650',  null,   'Tanta'],
];
// TOCOL result (row-by-row, ignoring blanks): 9 non-blank values
export const TOCOL_RESULT = MATRIX_2D.flat().filter((v) => v !== null);

/* ------------------------------------------------------------------ sales table (Scene 2 & 3) */
export const SALES_TABLE = [
  {id: 'ORD-001', name: 'Ahmed',  product: 'Mouse',   amount: 3200},
  {id: 'ORD-002', name: 'Sara',   product: 'Cable',   amount: 850},
  {id: 'ORD-003', name: 'Omar',   product: 'Monitor', amount: 6800},
  {id: 'ORD-004', name: 'Mona',   product: 'Chair',   amount: 1200},
  {id: 'ORD-005', name: 'Khaled', product: 'Stand',   amount: 900},
  {id: 'ORD-006', name: 'Hana',   product: 'Lamp',    amount: 650},
];
// CHOOSECOLS(tbl_Sales, 1, 4, 2) → ID, Amount, Name
export const CHOOSECOLS_RESULT = SALES_TABLE.map((r) => ({col1: r.id, col2: String(r.amount), col3: r.name}));
// CHOOSEROWS(tbl_Sales, 1, 2, 3) → first 3 rows
export const CHOOSEROWS_POS = SALES_TABLE.slice(0, 3);
// CHOOSEROWS(tbl_Sales, -1) → last row
export const CHOOSEROWS_NEG1 = [SALES_TABLE[SALES_TABLE.length - 1]];
// CHOOSEROWS(tbl_Sales, 1, -1) → first and last
export const CHOOSEROWS_1_NEG1 = [SALES_TABLE[0], SALES_TABLE[SALES_TABLE.length - 1]];

/* ------------------------------------------------------------------ master pipeline (Scene 4) */
// CHOOSECOLS(SORT(FILTER(tbl_Sales, Amount>1000), 3, -1), 1, 4, 3)
// Filter Amount > 1000 → sort by amount DESC → choose cols 1 (ID), 4 (Amount), 3 (Product) → wait, col 2 is name
// Actually: cols are 1=ID, 2=Name, 3=Product, 4=Amount → CHOOSECOLS(..., 1, 4, 3) = ID, Amount, Product
export const PIPELINE_RESULT = SALES_TABLE
  .filter((r) => r.amount > 1000)
  .sort((a, b) => b.amount - a.amount)
  .map((r) => ({id: r.id, amount: String(r.amount), product: r.product}));

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};

/* ------------------------------------------------------------------ sales cell helpers */
export const salesHeader = ['OrderID', 'Name', 'Product', 'Amount'];
export const salesCell = (r: number, c: number): CCell | undefined => {
  if (r === 1) {
    if (c < 1 || c > 4) return undefined;
    const al: 'l' | 'r' = c === 4 ? 'r' : 'l';
    return {t: salesHeader[c - 1], b: true, bg: '#E2EFDA', al};
  }
  const row = SALES_TABLE[r - 2];
  if (!row || c < 1 || c > 4) return undefined;
  switch (c) {
    case 1: return {t: row.id};
    case 2: return {t: row.name};
    case 3: return {t: row.product};
    case 4: return {t: row.amount.toLocaleString('en-US'), al: 'r'};
  }
  return undefined;
};

/* ------------------------------------------------------------------ matrix cell (Scene 1) */
export const matrixCell = (r: number, c: number): CCell | undefined => {
  if (r === 1) {
    if (c < 2 || c > 5) return undefined;
    return {t: `Col ${c - 1}`, b: true, bg: '#E2EFDA', al: 'c'};
  }
  if (r < 2 || r > 6 || c < 2 || c > 5) return undefined;
  const val = MATRIX_2D[r - 2][c - 2];
  return val ? {t: val, al: 'c'} : {t: '', bg: '#F9FAFB'};
};

/* ------------------------------------------------------------------ big sales (Scene 5) */
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
