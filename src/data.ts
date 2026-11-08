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

// ---- Lesson 16 sheet: A2:E100 = 99 records (no "Giza" branch on purpose) ----
export type Sale = { n: number; id: string; date: string; branch: string; product: string; amount: number };
const COUNTS: [string, number][] = [["Cairo", 15], ["Alex", 8], ["Mansoura", 30], ["Aswan", 26], ["Tanta", 20]];
const SEED = 7;
const branches: string[] = [];
COUNTS.forEach(([b, k]) => { for (let i = 0; i < k; i++) branches.push(b); });
const order = branches.map((b, i) => ({ b, k: h(i + SEED * 1000, 11) })).sort((a, b) => a.k - b.k).map((o) => o.b);
export const SALES: Sale[] = order.map((branch, i) => {
  const p = PRODUCTS[Math.floor(h(i, 21 + SEED) * PRODUCTS.length)];
  const units = 1 + Math.floor(h(i, 31 + SEED) * 6);
  return { n: i, id: "S-" + (1001 + i), date: ((i * 5) % 28 + 1) + "-" + MON[(i * 3 + 1) % 12] + "-26", branch, product: p[0], amount: units * p[1] };
});
export const isCairo = (s: Sale): boolean => s.branch === "Cairo";
export const isAlex = (s: Sale): boolean => s.branch === "Alex";
export const andRows = SALES.filter((s) => isCairo(s) && s.amount > 5000);
export const orRows = SALES.filter((s) => isCairo(s) || isAlex(s));
export const sumAmt = (xs: Sale[]): number => xs.reduce((a, s) => a + s.amount, 0);

// ---- Lesson 16 enterprise table (50,000 rows) ----
export const REGIONS = ["Cairo", "Cairo Maadi", "Cairo Nasr City", "Alex", "Mansoura", "Aswan"];
export type Big = { n: number; id: string; date: string; region: string; product: string; units: number; total: number };
export const BIG_N = 50000;
export const bigOf = (i: number): Big => {
  const p = PRODUCTS[Math.floor(h(i, 2) * PRODUCTS.length)];
  const units = 1 + Math.floor(h(i, 3) * 9);
  return { n: i, id: "INV-" + (1001 + i), date: ((i * 7) % 28 + 1) + "-" + MON[(i * 5 + 1) % 12] + "-26", region: REGIONS[Math.floor(h(i, 1) * REGIONS.length)], product: p[0], units, total: units * p[1] };
};
let _big: Big[] | null = null;
export const bigRows = (): Big[] => (_big ??= Array.from({ length: BIG_N }, (_, i) => bigOf(i)));
let _vip: Big[] | null = null;
export const vipRows = (): Big[] => (_vip ??= bigRows().filter((r) => r.region === "Cairo" && r.total > 10000));
