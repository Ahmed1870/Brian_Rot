// Illustrative star-schema data for lesson 55 (Fact_Sales + Dim_Product/Customer/Date).
export const num = (n: number): string => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const h = (a: number, b: number): number => {
  let x = Math.imul(a + 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x7f4a7c15, 0xc2b2ae35);
  x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d); x ^= x >>> 12; x = Math.imul(x, 0x297a2d39); x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
};
export const FACT_COLS = ["SalesKey", "OrderDateKey", "ShipDateKey", "ProductKey", "CustomerKey", "Qty", "Amount"];
const PRICE = [18500, 450, 1200, 4200, 650, 900, 5200, 2100, 1500, 1800];
export const factRow = (i: number): string[] => {
  const mo = 1 + Math.floor(h(i, 1) * 6), d = 1 + Math.floor(h(i, 2) * 22), sd = d + 1 + Math.floor(h(i, 3) * 5);
  const p = 1 + Math.floor(h(i, 4) * 480), q = 1 + Math.floor(h(i, 5) * 5);
  const key = (m: number, dd: number): string => "2026" + String(m).padStart(2, "0") + String(dd).padStart(2, "0");
  return [String(100001 + i), key(mo, d), key(mo, sd), String(p), String(1 + Math.floor(h(i, 6) * 3000)), String(q), num(q * PRICE[(p - 1) % 10])];
};
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
export const ORDER_TOT = [412350, 438900, 455200, 470100, 502800, 531400];
const PREV = 380200;
export const SHIP_TOT = ORDER_TOT.map((o, i) => Math.round(o * 0.35 + (i === 0 ? PREV : ORDER_TOT[i - 1]) * 0.65));
export const N_ROWS = 50000;

// ---- Lesson 62: illustrative time-intelligence data (2025 full year + 2026 Jan-Jun) ----
export const MONTHS12 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const PY12 = [352400, 371800, 389600, 402300, 431700, 455900, 468200, 481500, 497300, 512800, 534600, 566100];
export const YTD6 = ORDER_TOT.map((_, i) => ORDER_TOT.slice(0, i + 1).reduce((a, b) => a + b, 0));
export const QTD6 = ORDER_TOT.map((v, i) => (i % 3 === 0 ? v : ORDER_TOT.slice(i - (i % 3), i + 1).reduce((a, b) => a + b, 0)));
export const YOY6 = ORDER_TOT.map((v, i) => (v / PY12[i] - 1) * 100);
export const pct = (v: number): string => (v < 0 ? "-" : "") + Math.abs(v).toFixed(1) + "%";
const DN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const dateRow = (i: number): string[] => {
  const d = new Date(Date.UTC(2025, 0, 1 + i));
  const y = d.getUTCFullYear(), m = d.getUTCMonth() + 1, dd = d.getUTCDate();
  return [String(y) + String(m).padStart(2, "0") + String(dd).padStart(2, "0"), `${m}/${dd}/${y} 12:00:00 AM`, String(y), "Q" + (Math.floor((m - 1) / 3) + 1), MONTHS12[m - 1], DN[d.getUTCDay()]];
};
