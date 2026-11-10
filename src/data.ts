import type {CellD} from "./kit";
import {C} from "./theme";

export const int = (n: number) => Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const usd = (n: number) => "$" + int(n);
export const block = (r0: number, c0: number, rows: (string | number)[][], o: {hdr?: boolean; bg?: string; color?: string} = {}): CellD[] => {
  const out: CellD[] = [];
  rows.forEach((row, i) => row.forEach((v, j) => {
    const isH = !!o.hdr && i === 0;
    out.push({r: r0 + i, c: c0 + j, t: typeof v === "number" ? int(v) : v, a: typeof v === "number" ? "r" : "l", bold: isH, color: isH ? "#fff" : o.color, bg: isH ? C.green : o.bg ?? (i % 2 ? "#EAF4EE" : undefined)});
  }));
  return out;
};
/** tbl_Sales sample (12 of 50,000 rows), placed at G1. */
export const HEAD = ["Product ID", "Branch", "Category", "Sales Amount", "Units", "Region"];
export const TB: (string | number)[][] = [
  ["P-101", "Cairo", "Home Goods", 12500, 40, "East"], ["P-102", "Alexandria", "Home Goods", 8300, 25, "North"], ["P-103", "Cairo", "Tech Hardware", 64200, 18, "East"],
  ["P-101", "Giza", "Tech Accessories", 15400, 22, "West"], ["P-104", "Cairo", "Home Goods", 5600, 60, "East"], ["P-103", "Alexandria", "Tools", 33000, 12, "North"],
  ["P-105", "Tanta", "Tech Hardware", 9700, 30, "North"], ["P-102", "Cairo", "Home Goods", 21300, 33, "East"], ["P-103", "Giza", "Tools", 18900, 14, "West"],
  ["P-104", "Cairo", "Tools", 7400, 41, "East"], ["P-101", "Alexandria", "Tech Accessories", 27000, 19, "North"], ["P-105", "Alexandria", "Home Goods", 11800, 28, "North"],
];
export const W = [92, 92, 92, 92, 110, 20, 80, 96, 124, 112, 56, 70, 56, 56, 56, 56, 56, 56, 56];
export const tblCells = (o: {order?: number[]; hl?: Record<number, string>; rows?: number} = {}): CellD[] => {
  const ord = o.order ?? [0, 1, 2, 3, 4, 5];
  const rows = [HEAD, ...TB.slice(0, o.rows ?? 12)].map((r) => ord.map((i) => r[i]));
  return block(1, 7, rows, {hdr: true}).map((c) => (c.r > 1 && o.hl?.[c.r - 1] ? {...c, bg: o.hl[c.r - 1]} : c));
};
