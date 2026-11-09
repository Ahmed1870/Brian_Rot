export const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const PRODUCTS: [string, number][] = [
  ["Laptop X1", 24500], ["Laptop X2", 18900], ["Phone S5", 12500], ["Tablet T3", 6800],
  ["Monitor 24", 3900], ["Printer P2", 2300], ["Router R7", 1450], ["Keyboard K1", 850],
];
export const num = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const h = (a: number, b: number): number => {
  let x = Math.imul(a + 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x7f4a7c15, 0xc2b2ae35);
  x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d); x ^= x >>> 12; x = Math.imul(x, 0x297a2d39); x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
};

// ---- Lesson 23 sheet: A2:E100 = 99 records (ID, Date, Branch, Amount, Status) ----
export type Row = { n: number; id: string; date: string; branch: string; amount: number; status: string };
const BR = ["Cairo", "Alex", "Mansoura", "Aswan", "Tanta"];
const SEED = 37;
const DUP: [number, number][] = [[2, 15], [6, 21], [9, 24], [40, 70], [55, 90]]; // row j repeats the Order ID of row i
export const ROWS: Row[] = Array.from({ length: 99 }, (_, i) => {
  const p = PRODUCTS[Math.floor(h(i, 21 + SEED) * PRODUCTS.length)];
  const units = 1 + Math.floor(h(i, 31 + SEED) * 6);
  const r = h(i, 41 + SEED);
  return {
    n: i, id: "S-" + (1001 + i), date: ((i * 5) % 28 + 1) + "-" + MON[(i * 3 + 1) % 12] + "-26",
    branch: BR[Math.floor(h(i, 11 + SEED) * BR.length)], amount: units * p[1] + i,
    status: r < 0.28 ? "Pending" : r < 0.8 ? "Paid" : r < 0.92 ? "Shipped" : "Cancelled",
  };
});
DUP.forEach(([i, j]) => { ROWS[j].id = ROWS[i].id; });
export type Ov = { idAt?: [number, string]; amtAt?: [number, number] };
export const withOv = (ov: Ov): Row[] => ROWS.map((r) => ({ ...r, id: ov.idAt && ov.idAt[0] === r.n ? ov.idAt[1] : r.id, amount: ov.amtAt && ov.amtAt[0] === r.n ? ov.amtAt[1] : r.amount }));
export const dupSet = (rows: Row[]): Set<number> => { const c = new Map<string, number>(); rows.forEach((r) => c.set(r.id, (c.get(r.id) ?? 0) + 1)); return new Set(rows.filter((r) => (c.get(r.id) ?? 0) > 1).map((r) => r.n)); };
export const top10Set = (rows: Row[]): Set<number> => { const v = rows.map((r) => r.amount).sort((a, b) => b - a)[9]; return new Set(rows.filter((r) => r.amount >= v).map((r) => r.n)); };
export const isAnd = (r: Row): boolean => r.status === "Pending" && r.amount >= 5000;
export const isOr = (r: Row): boolean => r.branch === "Cairo" || r.branch === "Alex";
export const isCairo = (r: Row): boolean => r.branch === "Cairo";
export const EDIT_DUP_ROW = 12; // typing the ID of row 4 into row 13 makes a live duplicate
export const EDIT_AMT_ROW = ROWS.findIndex((r, i) => i > 3 && i < 26 && r.amount < 5000 && !DUP.some(([a, b]) => a === i || b === i) && i !== EDIT_DUP_ROW);

// ---- Enterprise table (50,000 rows) ----
export const BIG_N = 50000;
export type Big = Row;
export const bigOf = (i: number): Big => {
  const p = PRODUCTS[Math.floor(h(i, 2) * PRODUCTS.length)];
  const r = h(i, 5);
  return { n: i, id: "INV-" + (1001 + i), date: ((i * 7) % 28 + 1) + "-" + MON[(i * 5 + 1) % 12] + "-26", branch: BR[Math.floor(h(i, 1) * BR.length)], amount: (1 + Math.floor(h(i, 3) * 9)) * p[1], status: r < 0.28 ? "Pending" : r < 0.8 ? "Paid" : r < 0.92 ? "Shipped" : "Cancelled" };
};
let _big: Big[] | null = null;
export const bigRows = (): Big[] => (_big ??= Array.from({ length: BIG_N }, (_, i) => bigOf(i)));
export const bigDeal = (r: Big): boolean => r.amount >= 10000;
export const bigPend = (r: Big): boolean => r.status === "Pending" && r.amount >= 5000;
