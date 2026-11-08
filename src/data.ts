import type {CellD} from "./kit";
import {C} from "./theme";

export const int = (n: number) => Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const usd = (n: number) => "$" + int(n);
/** table block at (r0,c0). header=true draws a green table header row. numbers are right-aligned + comma formatted. */
export const block = (r0: number, c0: number, rows: (string | number)[][], o: {hdr?: boolean; bg?: string; color?: string; show?: number} = {}): CellD[] => {
  const out: CellD[] = [];
  rows.forEach((row, i) => {
    if (o.show !== undefined && i >= o.show) return;
    row.forEach((v, j) => {
      const isH = !!o.hdr && i === 0;
      out.push({r: r0 + i, c: c0 + j, t: typeof v === "number" ? int(v) : v, a: typeof v === "number" ? "r" : "l", bold: isH, color: isH ? "#fff" : o.color, bg: isH ? C.green : o.bg ?? (i % 2 ? "#EAF4EE" : undefined)});
    });
  });
  return out;
};
export const HDR = ["Product", "Units", "Revenue"];
export const CAIRO = [["Laptop", 120, 54000], ["Phone", 300, 42000], ["Tablet", 80, 16000]];
export const ALEX = [["Laptop", 95, 42750], ["Phone", 210, 29400], ["Mouse", 400, 8000]];
export const GIZA = [["Tablet", 60, 12000], ["Phone", 150, 21000], ["Cable", 900, 13500]];
