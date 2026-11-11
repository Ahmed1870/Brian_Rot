import type {CellD} from "./kit";
import {C} from "./theme";

export const int = (n: number) => Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const block = (r0: number, c0: number, rows: (string | number)[][], o: {hdr?: boolean; bg?: string; color?: string} = {}): CellD[] => {
  const out: CellD[] = [];
  rows.forEach((row, i) => row.forEach((v, j) => {
    const isH = !!o.hdr && i === 0;
    out.push({r: r0 + i, c: c0 + j, t: typeof v === "number" ? int(v) : v, a: typeof v === "number" ? "r" : "l", bold: isH, color: isH ? "#fff" : o.color, bg: isH ? C.green : o.bg ?? (i % 2 ? "#EAF4EE" : undefined)});
  }));
  return out;
};
export const W = [112, 24, 130, 130, 130, 24, 92, 100, 100, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56];
/** result cell that may overflow into empty neighbours (like Excel) */
export const res = (r: number, c: number, t: CellD["t"], color: string, bg?: string): CellD => ({r, c, t, color, bold: true, bg, style: {overflow: "visible", zIndex: 3}});
export const ITEMS = ["Laptop", "Phone", "Tablet", "Mouse", "Cable", "Monitor", "Printer", "Router", "Scanner"];
export const BLANKS = ["Laptop", "", "Phone", "", "", "Tablet", "Mouse", "", "Cable"];
export const SALES: [string, string, number][] = [["Laptop", "Cairo", 12500], ["Phone", "Alex", 8300], ["Laptop", "Cairo", 64200], ["Tablet", "Cairo", 15400], ["Mouse", "Giza", 5600], ["Phone", "Cairo", 33000], ["Cable", "Alex", 9700], ["Tablet", "Cairo", 21300], ["Monitor", "Cairo", 18900], ["Mouse", "Alex", 7400], ["Phone", "Cairo", 27000], ["Router", "Alex", 11800]];
export const uniq = (br: string) => Array.from(new Set(SALES.filter((r) => r[1] === br).map((r) => r[0])));
export const CODES: [string, number][] = [["ELC-1001", 12500], ["FUR-1002", 8300], ["ELC-1003", 64200], ["TOY-1004", 5600], ["FUR-1005", 33000], ["TOY-1006", 9700], ["ELC-1007", 21300], ["FUR-1008", 18900]];
