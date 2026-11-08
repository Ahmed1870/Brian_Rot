import type { Cell } from "./kit";

export const BRANCHES = ["Cairo", "Cairo Maadi", "Cairo Nasr City", "Alex", "Giza", "Mansoura"];
export const PRODUCTS: [string, number][] = [
  ["Laptop X1", 24500], ["Laptop X2", 18900], ["Phone S5", 12500], ["Tablet T3", 6800],
  ["Monitor 24", 3900], ["Printer P2", 2300], ["Router R7", 1450], ["Keyboard K1", 850],
];
export const HEAD = ["Order ID", "Date", "Store Branch", "Product", "Units", "Unit Price", "Total Revenue", "MoM %"];
export const WIDTHS = [84, 80, 126, 96, 60, 92, 124, 88];
export const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type Row = {
  n: number; id: string; date: string; branch: string; product: string;
  units: number; price: number; rev: number; mom: number;
};

const h = (a: number, b: number): number => {
  let x = Math.imul(a + 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x7f4a7c15, 0xc2b2ae35);
  x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d); x ^= x >>> 12; x = Math.imul(x, 0x297a2d39); x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
};

export const rowOf = (i: number): Row => {
  const p = PRODUCTS[Math.floor(h(i, 2) * PRODUCTS.length)];
  const units = 1 + Math.floor(h(i, 3) * 9);
  return {
    n: i, id: "INV-" + (1001 + i),
    date: ((i * 7) % 28 + 1) + "-" + MON[(i * 5 + 1) % 12] + "-26",
    branch: BRANCHES[Math.floor(h(i, 1) * BRANCHES.length)],
    product: p[0], units, price: p[1], rev: units * p[1],
    mom: Math.round(h(i, 4) * 30) - 15,
  };
};

export const GREEN_MIN = 40000;
export const RED_MAX = 5000;
export const fillOf = (rev: number): "green" | "red" | null => (rev >= GREEN_MIN ? "green" : rev <= RED_MAX ? "red" : null);
export const trendOf = (mom: number): "up" | "side" | "down" => (mom >= 5 ? "up" : mom <= -5 ? "down" : "side");
export const num = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const pct = (m: number): string => (m > 0 ? "+" : "") + m + "%";

export const cellsOf = (r: Row, colored: boolean): Cell[] => {
  const f = colored ? fillOf(r.rev) : null;
  return [
    { v: r.id }, { v: r.date, al: "r" }, { v: r.branch }, { v: r.product },
    { v: r.units, al: "r" }, { v: num(r.price), al: "r" },
    { v: num(r.rev), al: "r", fill: f === "green" ? "#C6EFCE" : f === "red" ? "#FFC7CE" : undefined, fg: f === "green" ? "#006100" : f === "red" ? "#9C0006" : undefined },
    { v: pct(r.mom), al: "r", icon: trendOf(r.mom) },
  ];
};
export const headCells = (): Cell[] => HEAD.map((t, i) => ({ v: t, b: true, fill: "#E2EFDA", al: i >= 4 ? "r" : "l" }));

export const SMALL = Array.from({ length: 40 }, (_, i) => rowOf(i));

export const BIG_N = 50000;
let _big: Row[] | null = null;
export const bigRows = (): Row[] => (_big ??= Array.from({ length: BIG_N }, (_, i) => rowOf(i)));
let _bigSorted: Row[] | null = null;
export const bigSorted = (): Row[] =>
  (_bigSorted ??= [...bigRows()].sort((a, b) => (a.branch < b.branch ? -1 : a.branch > b.branch ? 1 : b.rev - a.rev || a.n - b.n)));
export const sortRows = (rows: Row[]): Row[] =>
  [...rows].sort((a, b) => (a.branch < b.branch ? -1 : a.branch > b.branch ? 1 : b.rev - a.rev || a.n - b.n));
