// Illustrative data + exact statistics (computed, never typed by hand).
export const AD = [22, 28, 25, 34, 38, 36, 45, 52, 49, 58, 63, 60]; // Ad_Spend (K EGP)
export const SALES = [225, 231, 207, 272, 293, 279, 273, 317, 334, 385, 364, 386]; // Sales (K EGP)
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
export function slope(y: number[], x: number[]) {
  const mx = mean(x), my = mean(y);
  let n = 0, d = 0;
  for (let i = 0; i < x.length; i++) { n += (x[i] - mx) * (y[i] - my); d += (x[i] - mx) ** 2; }
  return n / d;
}
export const intercept = (y: number[], x: number[]) => mean(y) - slope(y, x) * mean(x);
export function rsq(y: number[], x: number[]) {
  const mx = mean(x), my = mean(y);
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < x.length; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
  return (sxy * sxy) / (sxx * syy);
}
export const forecastLinear = (x: number, y: number[], xs: number[]) => intercept(y, xs) + slope(y, xs) * x;
export const trend = (y: number[], xs: number[], nx: number[]) => nx.map((v) => forecastLinear(v, y, xs));
export const f1 = (v: number) => v.toFixed(1);
export const f2 = (v: number) => v.toFixed(2);
export const f4 = (v: number) => v.toFixed(4);

// ---- Seasonal demo series (24 months) + illustrative seasonal model (NOT Excel's AAA algorithm) ----
const SEAS = [-10, -25, 10, 25, -5, -20, -15, -10, 5, 15, 55, 45];
export const SEAS_Y: number[] = Array.from({ length: 24 }, (_, t) =>
  Math.round(180 + 5 * t + SEAS[t % 12] + 4 * Math.sin(t * 2.3)));
export function seasonalModel(horizon = 12, Y: number[] = SEAS_Y) {
  const t = Y.map((_, i) => i + 1);
  const m = slope(Y, t), b = intercept(Y, t);
  const res = Y.map((v, i) => v - (b + m * t[i]));
  const si = Array.from({ length: 12 }, (_, k) => (res[k] + res[k + 12]) / 2);
  const fit = Y.map((_, i) => b + m * t[i] + si[i % 12]);
  const sd = Math.sqrt(mean(Y.map((v, i) => (v - fit[i]) ** 2)));
  const fc = Array.from({ length: horizon }, (_, h) => {
    const tt = 25 + h;
    const v = b + m * tt + si[(tt - 1) % 12];
    const ci = 1.96 * sd * Math.sqrt(1 + 0.1 * (h + 1));
    return { t: tt, v, lo: v - ci, hi: v + ci, ci };
  });
  return { m, b, fc, lin: (tt: number) => b + m * tt };
}

// ---- Enterprise aggregate (24 months, transactions sum to exactly 50,000) ----
export function enterprise() {
  const sp = Array.from({ length: 24 }, (_, i) => Math.round(40 + 1.1 * i + SEAS[(i + 6) % 12] * 0.25));
  const sa = sp.map((v, i) => Math.round(150 + 4.0 * v + SEAS[(i + 6) % 12] * 1.2 + 6 * Math.sin(i * 1.7)));
  const k = 50000 / sa.reduce((s, v) => s + v, 0);
  const tx = sa.map((v) => Math.round(v * k));
  tx[23] += 50000 - tx.reduce((s, v) => s + v, 0);
  const lab = Array.from({ length: 24 }, (_, i) => {
    const mi = (6 + i) % 12, yr = 2024 + Math.floor((6 + i) / 12);
    return `${MONTHS[mi]} ${yr}`;
  });
  const plan = [66, 68, 70, 72, 76, 80];
  return { sp, sa, tx, lab, plan };
}
