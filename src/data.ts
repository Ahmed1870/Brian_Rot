// Manzooma — Lesson 36: SEQUENCE & RANDARRAY Engine.

/* ------------------------------------------------------------------ employee names (Scene 1) */
export const EMPLOYEES = ['Ahmed Ali', 'Sara Mohamed', 'Omar Ibrahim', 'Mona Saleh', 'Khaled Adel', 'Hana Youssef', 'Yasser Nabil', 'Laila Fawzi', 'Tarek Mostafa', 'Nour Hisham'];

/* ------------------------------------------------------------------ 2D matrix (Scene 2) */
// =SEQUENCE(5, 5, 100, 10) → 5×5 grid starting at 100, step 10
export const GRID_2D: number[][] = Array.from({length: 5}, (_, r) =>
  Array.from({length: 5}, (_, c) => 100 + (r * 5 + c) * 10)
);

// =SEQUENCE(12, 1, DATE(2026,1,1), 31) → 12 dates starting Jan 1, 2026, +31 days each
export const DATE_SEQUENCE: string[] = Array.from({length: 12}, (_, i) => {
  const d = new Date(2026, 0, 1 + i * 31);
  return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
});

/* ------------------------------------------------------------------ RANDARRAY (Scene 3) */
// Deterministic "random" integers 1000-5000 for 10×3 grid
const rng = (n: number) => {
  const h = (n * 2654435761) >>> 0;
  return 1000 + ((h >>> 5) % 4001);
};
export const RAND_INT_GRID: number[][] = Array.from({length: 10}, (_, r) =>
  Array.from({length: 3}, (_, c) => rng(r * 3 + c + 1))
);
// Decimal version (same values / 1000 + offset)
export const RAND_DEC_GRID: number[][] = RAND_INT_GRID.map((row) =>
  row.map((v) => Math.round((v / 1000 + 0.5) * 100) / 100)
);

/* ------------------------------------------------------------------ Random sampling (Scene 4) */
export const PRODUCTS_LIST = ['Wireless Mouse', 'USB-C Cable', 'Laptop Stand', 'Office Chair', 'Notebook A5', 'Desk Lamp', 'Monitor 24"', 'Keyboard', 'Webcam HD', 'USB Hub'];
// First sample (F9 #1)
export const SAMPLE_1 = [2, 5, 0, 8, 3]; // indices into PRODUCTS_LIST
// Second sample (F9 #2 — different random)
export const SAMPLE_2 = [6, 1, 9, 4, 7];

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};

/* ------------------------------------------------------------------ employee cell helper (Scene 1) */
export const employeeCell = (r: number, c: number): CCell | undefined => {
  if (r === 1) {
    if (c < 1 || c > 2) return undefined;
    return {t: c === 1 ? 'ID' : 'Employee Name', b: true, bg: '#E2EFDA', al: 'l'};
  }
  if (r < 2 || r > EMPLOYEES.length + 1) return undefined;
  if (c === 2) return {t: EMPLOYEES[r - 2]};
  return undefined;
};

/* ------------------------------------------------------------------ big sales (Scene 5) */
const BIG_PRODUCTS = ['Wireless Mouse', 'USB-C Cable', 'Laptop Stand', 'Office Chair', 'Notebook A5', 'Desk Lamp', 'Monitor 24"', 'Keyboard'];
const BIG_BRANCHES = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];

export type BigSale = {id: number; product: string; branch: string; amount: number};

export const bigSale = (n: number): BigSale => {
  const h = (n * 2654435761) >>> 0;
  const product = BIG_PRODUCTS[(h >>> 3) % BIG_PRODUCTS.length];
  const branch = BIG_BRANCHES[(h >>> 13) % BIG_BRANCHES.length];
  const amount = 100 + ((h >>> 9) % 4900);
  return {id: n, product, branch, amount};
};

export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1;
export const fmtInt = (n: number) => n.toLocaleString('en-US');
