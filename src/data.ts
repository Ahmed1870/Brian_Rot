export const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const PRODUCTS: [string, number][] = [
  ["Laptop X1", 24500], ["Laptop X2", 18900], ["Phone S5", 12500], ["Tablet T3", 6800],
  ["Monitor 24", 3900], ["Printer P2", 2300], ["Router R7", 1450], ["Keyboard K1", 850],
];
export const PN = PRODUCTS.map((p) => p[0]);
export const BR = ["Alex", "Aswan", "Cairo", "Mansoura", "Tanta"];
export const num = (n: number): string => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const h = (a: number, b: number): number => {
  let x = Math.imul(a + 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x7f4a7c15, 0xc2b2ae35);
  x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d); x ^= x >>> 12; x = Math.imul(x, 0x297a2d39); x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
};
// ---- calendar: day 0 = 1-Jan-2025, two full years (730 days) ----
const MD = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const dateOf = (d: number): { yi: number; m: number; q: number; day: number } => {
  const yi = d < 365 ? 0 : 1; let r = d - 365 * yi; let m = 0;
  while (r >= MD[m]) { r -= MD[m]; m++; }
  return { yi, m, q: Math.floor(m / 3), day: r + 1 };
};
export const fmtDate = (d: number): string => { const o = dateOf(d); return `${o.m + 1}/${o.day}/${2025 + o.yi}`; };
export type Order = { n: number; id: string; day: number; b: number; p: number; amount: number };
export type Cube = number[][][][]; // [year][quarter][branch][product]
const mkCube = (orders: Order[]): Cube => {
  const c: Cube = [0, 1].map(() => [0, 1, 2, 3].map(() => BR.map(() => PN.map(() => 0))));
  orders.forEach((o) => { const d = dateOf(o.day); c[d.yi][d.q][o.b][o.p] += o.amount; });
  return c;
};
export const ORDERS: Order[] = [];
for (let d = 0; d < 730; d++) {
  const dd = dateOf(d); const k = 3 + Math.floor(h(d, 7) * 3) + (dd.yi === 1 ? 1 : 0) + (dd.q === 3 ? 1 : 0) + (dd.q === 1 ? -1 : 0) * (dd.day % 2);
  for (let j = 0; j < k; j++) {
    const n = ORDERS.length;
    ORDERS.push({ n, id: "S-" + (10001 + n), day: d, b: Math.floor(h(n, 1) * 5), p: Math.floor(h(n, 2) * 8), amount: (1 + Math.floor(h(n, 3) * 6)) * PRODUCTS[Math.floor(h(n, 2) * 8)][1] });
  }
}
export const CUBE = mkCube(ORDERS);
export const DAYSUMS: number[] = Array.from({ length: 730 }, () => 0);
export const MONTHSUMS: number[][] = [0, 1].map(() => Array.from({ length: 12 }, () => 0));
ORDERS.forEach((o) => { DAYSUMS[o.day] += o.amount; const d = dateOf(o.day); MONTHSUMS[d.yi][d.m] += o.amount; });
export const detailRows = (yi: number, q: number): Order[] => ORDERS.filter((o) => { const d = dateOf(o.day); return d.yi === yi && d.q === q; });
export const qTotal = (c: Cube, yi: number, q: number): number => c[yi][q].reduce((a, r) => a + r.reduce((x, y) => x + y, 0), 0);
// ---- filtered aggregates (Slicer = branches, Timeline = one quarter) ----
export type Flt = { br: number[]; qsel?: [number, number] | null };
const inQ = (f: Flt, yi: number, q: number): boolean => !f.qsel || (f.qsel[0] === yi && f.qsel[1] === q);
export const aggQ = (c: Cube, f: Flt): number[] => { const o: number[] = []; for (let yi = 0; yi < 2; yi++) for (let q = 0; q < 4; q++) o.push(inQ(f, yi, q) ? f.br.reduce((a, b) => a + c[yi][q][b].reduce((x, y) => x + y, 0), 0) : 0); return o; };
export const aggP = (c: Cube, f: Flt): number[] => PN.map((_, p) => { let s = 0; for (let yi = 0; yi < 2; yi++) for (let q = 0; q < 4; q++) if (inQ(f, yi, q)) f.br.forEach((b) => { s += c[yi][q][b][p]; }); return s; });
export const aggB = (c: Cube, f: Flt): number[] => f.br.map((b) => { let s = 0; for (let yi = 0; yi < 2; yi++) for (let q = 0; q < 4; q++) if (inQ(f, yi, q)) s += c[yi][q][b].reduce((x, y) => x + y, 0); return s; });
// ---- enterprise table (50,000 rows) ----
export const BIG_N = 50000;
export const bigOrder = (i: number): Order => ({ n: i, id: "INV-" + (1001 + i), day: Math.floor(h(i, 11) * 730), b: Math.floor(h(i, 12) * 5), p: Math.floor(h(i, 13) * 8), amount: (1 + Math.floor(h(i, 14) * 9)) * PRODUCTS[Math.floor(h(i, 13) * 8)][1] });
let _bc: Cube | null = null;
export const bigCube = (): Cube => {
  if (!_bc) { const c: Cube = [0, 1].map(() => [0, 1, 2, 3].map(() => BR.map(() => PN.map(() => 0)))); for (let i = 0; i < BIG_N; i++) { const o = bigOrder(i); const d = dateOf(o.day); c[d.yi][d.q][o.b][o.p] += o.amount; } _bc = c; }
  return _bc;
};
