import {XL} from './theme';
import {Cell, Cur, Geo, Rect, Sel, colName, ease, lerp, pg} from './kit';

export const PRODUCTS = ['Laptop', 'Mobile', 'Tablet', 'Printer', 'Monitor', 'Keyboard', 'Router', 'Camera'];
export const REGIONS = ['Cairo', 'Giza', 'Alex', 'Tanta', 'Aswan', 'Luxor', 'Mansoura', 'Suez'];
const S8 = [12500, 8400, 15200, 6900, 9800, 11300, 7600, 13400];
export const sales = (r: number) => (r <= 9 ? S8[r - 2] : 50 * (100 + ((r * 37) % 200)));
export const tax = (r: number) => Math.round((sales(r) * 14) / 100);
export const comm = (r: number) => Math.round((sales(r) * 4) / 100);
export const prod = (r: number) => PRODUCTS[(r - 2) % 8];
export const reg = (r: number) => REGIONS[(r * 3 + 1) % 8];
export const IN = '#FFF2CC';
export const INC = '#7F6000';
export const hdrC = (t: string): Cell => ({t, b: true, bg: XL.green, col: '#fff', al: 'l'});
export const band = (r: number) => (r % 2 === 1 ? '#E2EFDA' : undefined);
export const one = (r: number, c: number): Sel => ({r1: r, c1: c, r2: r, c2: c, ar: r, ac: c});
export const rng = (r1: number, c1: number, r2: number, c2: number, ar = r1, ac = c1): Sel => ({r1, c1, r2, c2, ar, ac});
const R0: Rect = {x: 0, y: 0, w: XL.colW, h: XL.rowH};
export const rr = (g: Geo, r: number, c: number): Rect => g.cell(r, c) ?? R0;
export const ctr = (g: Geo, r: number, c: number) => {
  const q = rr(g, r, c);
  return {x: q.x + q.w * 0.45, y: q.y + q.h * 0.5};
};
export const hp = (g: Geo, r: number, c: number) => {
  const q = rr(g, r, c);
  return {x: q.x + q.w - 1, y: q.y + q.h - 1};
};
/** cursor keyframes: [t, x, y, kind?]; moves eased between keys, holds when two keys share a position */
export type K = [number, number, number, ('arrow' | 'cross')?];
export const path = (t: number, ks: K[]): Cur => {
  if (t <= ks[0][0]) return {x: ks[0][1], y: ks[0][2], k: ks[0][3]};
  for (let i = 1; i < ks.length; i++) {
    if (t <= ks[i][0]) {
      const a = ks[i - 1], b = ks[i];
      const p = ease(pg(t, a[0], b[0]));
      return {x: lerp(a[1], b[1], p), y: lerp(a[2], b[2], p), k: p > 0.5 ? b[3] : a[3]};
    }
  }
  const l = ks[ks.length - 1];
  return {x: l[1], y: l[2], k: l[3]};
};
export const fmtN = (x: number) => x.toLocaleString('en-US', {maximumFractionDigits: 2});
const sumRange = (f: (r: number) => number, a: number, b: number) => {
  let s = 0;
  for (let r = a; r <= b; r++) s += f(r);
  return s;
};
export const SUM_TAX_1001 = sumRange(tax, 2, 1001);
export const SUM_COMM_50K = sumRange(comm, 2, 50001);
export const hwFor = (lastRow: number) => (lastRow >= 10000 ? 42 : lastRow >= 1000 ? 36 : XL.rowHdrW);

// matrix lesson data
export const CATS = ['Laptop', 'Mobile', 'Tablet', 'Printer', 'Monitor', 'Router', 'Camera', 'Speaker', 'Headset', 'Scanner'];
export const PRICE = [120, 180, 240, 300, 360, 420, 480, 540, 600, 660];
export const RATE = [5, 10, 15, 20, 25];
export const TIER = ['Bronze', 'Silver', 'Gold', 'Platinum', 'VIP'];
export const mv = (r: number, c: number) => (PRICE[c - 2] * RATE[r - 5]) / 100;
export const MAT_SUM = (() => { let s = 0; for (let r = 5; r <= 9; r++) for (let c = 2; c <= 11; c++) s += mv(r, c); return s; })();
export const fx2 = (c: number, r: number) => `${colName(c)}${r}`;
