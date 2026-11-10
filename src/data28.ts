// Deterministic sales data for the pivot lesson (same generator for 2,400 / 2,500 / 50,000 rows).
export const BR = ['Cairo', 'Giza', 'Alex', 'Tanta', 'Aswan'];
export const REGION: Record<string, string> = {Cairo: 'Greater Cairo', Giza: 'Greater Cairo', Alex: 'Alexandria', Tanta: 'Delta', Aswan: 'Upper Egypt'};
export const CAT = ['Electronics', 'Furniture', 'Appliances'];
export const PROD: Record<string, string[]> = {Electronics: ['Laptop', 'Mobile', 'Tablet'], Furniture: ['Desk', 'Chair', 'Shelf'], Appliances: ['Fridge', 'Washer', 'Oven']};
export type Row = {day: number; m: number; br: string; cat: string; prod: string; sales: number; profit: number};
export const row = (i: number): Row => {
  const br = BR[(i * 3 + (i % 7)) % 5];
  const cat = CAT[(i * 5 + (i >> 3)) % 3];
  const prod = PROD[cat][(i * 7) % 3];
  const sales = 10 * (60 + ((i * 7919) % 940));
  const profit = Math.round((sales * (12 + ((i * 13) % 11))) / 100);
  const day = (i * 11) % 365;
  return {day, m: new Date(Date.UTC(2026, 0, 1 + day)).getUTCMonth(), br, cat, prod, sales, profit};
};
export const dateStr = (day: number) => { const d = new Date(Date.UTC(2026, 0, 1 + day)); return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/2026`; };
export const rows = (n: number): Row[] => Array.from({length: n}, (_, i) => row(i));
export const N1 = 2400, N2 = 2500;
const D1 = rows(N2);
export type Flt = {br?: string[] | null; m?: number | null; region?: string | null};
const ok = (r: Row, f: Flt) => (!f.br || f.br.includes(r.br)) && (f.m == null || r.m === f.m) && (!f.region || REGION[r.br] === f.region);
export const sum = (n: number, key: 'sales' | 'profit', by: {cat?: string; br?: string; prod?: string}, f: Flt = {}) => {
  let s = 0;
  for (let i = 0; i < n; i++) { const r = D1[i]; if ((!by.cat || r.cat === by.cat) && (!by.br || r.br === by.br) && (!by.prod || r.prod === by.prod) && ok(r, f)) s += r[key]; }
  return s;
};
export const avg = (n: number, by: {cat?: string; br?: string}, f: Flt = {}) => {
  let s = 0, c = 0;
  for (let i = 0; i < n; i++) { const r = D1[i]; if ((!by.cat || r.cat === by.cat) && (!by.br || r.br === by.br) && ok(r, f)) { s += r.sales; c++; } }
  return c ? s / c : 0;
};
export const fmt = (x: number) => Math.round(x).toLocaleString('en-US');
export const fmt2 = (x: number) => x.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
export const pct = (x: number) => `${(x * 100).toFixed(2)}%`;
// 50,000-row workbook
export const BIG = (() => {
  const s: Record<string, number> = {}, p: Record<string, number> = {};
  for (const b of BR) { s[b] = 0; p[b] = 0; }
  for (let i = 0; i < 50000; i++) { const r = row(i); s[r.br] += r.sales; p[r.br] += r.profit; }
  return {s, p, ts: Object.values(s).reduce((a, b) => a + b, 0), tp: Object.values(p).reduce((a, b) => a + b, 0)};
})();
