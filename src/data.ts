export const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const num = (n: number): string => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const fmt2 = (n: number): string => { const r = Math.round(n * 100) / 100; const [a, b = ""] = r.toFixed(2).split("."); return a.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + b; };
export const pct = (t: number): string => Math.round(t * 100) + "%";
const h = (a: number, b: number): number => {
  let x = Math.imul(a + 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x7f4a7c15, 0xc2b2ae35);
  x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d); x ^= x >>> 12; x = Math.imul(x, 0x297a2d39); x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
};
export const calcNet = (p: number, t: number): number => p * (1 + t); // CalculateNet = LAMBDA(price, tax, price*(1+tax))
// ---- price / tax table: A2:B11 (10 rows) ----
export const PRICES = [1200, 850, 2300, 450, 3900, 1500, 780, 2950, 640, 1800];
export const TAXES = [0.14, 0.14, 0.05, 0.14, 0.14, 0.05, 0.14, 0.05, 0.14, 0.14];
export const PRICES2 = [5200, 740, 1990, 3300, 410, 8800, 1250, 960, 2700, 150];
export const TAXES2 = [0.14, 0.05, 0.14, 0.14, 0.05, 0.14, 0.14, 0.14, 0.05, 0.14];
// ---- 2-D matrix C2:F10 (9 regions x 4 quarters) ----
export const REGIONS = ["Cairo", "Alex", "Giza", "Mansoura", "Aswan", "Tanta", "Luxor", "Suez", "Fayoum"];
export const MATRIX: number[][] = REGIONS.map((_, r) => [0, 1, 2, 3].map((q) => 100 + Math.floor(h(r * 4 + q, 77) * 880)));
export const rowSum = (r: number): number => MATRIX[r].reduce((a, b) => a + b, 0);
export const colMax = (q: number): number => Math.max(...MATRIX.map((r) => r[q]));
export const colMaxRow = (q: number): number => MATRIX.findIndex((r) => r[q] === colMax(q));
// ---- enterprise table (50,000 rows) ----
export const BIG_N = 50000;
const BP = [24500, 18900, 12500, 6800, 3900, 2300, 1450, 850];
const BT = [0.14, 0.05, 0.14, 0.0, 0.14, 0.05, 0.14, 0.14];
export const bigRow = (i: number): { id: string; price: number; tax: number; net: number } => {
  const k = Math.floor(h(i, 2) * 8);
  const price = BP[k] * (1 + Math.floor(h(i, 3) * 4) / 4);
  const tax = BT[Math.floor(h(i, 5) * 8)];
  return { id: "INV-" + (1001 + i), price, tax, net: calcNet(price, tax) };
};
let _tot = -1;
export const bigNetTotal = (): number => { if (_tot < 0) { _tot = 0; for (let i = 0; i < BIG_N; i++) _tot += bigRow(i).net; } return _tot; };
