import type {CellD} from "./kit";
import {C} from "./theme";

export const int = (n: number) => Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const usd = (n: number) => "$" + int(n);
export type Row = [string, string, number];
// first 16 rows of tbl_Sales2026 (50,000 rows in the file). Product A / Cairo values stay inside [1,200 .. 145,000].
export const ROWS: Row[] = [
  ["Cairo", "Product A", 12500], ["Alexandria", "Product B", 8300], ["Cairo", "Product B", 64200], ["Giza", "Product A", 15400],
  ["Cairo", "Product A", 1200], ["Mansoura", "Product C", 9700], ["Cairo East", "Product A", 52000], ["Cairo", "Product C", 81000],
  ["Tanta", "Product B", 4300], ["Cairo", "Product A", 145000], ["Alexandria", "Product A", 23100], ["Cairo West", "Product B", 67500],
  ["Giza", "Product C", 38800], ["Cairo", "Product B", 5600], ["Cairo", "Product A", 33000], ["Alexandria", "Product C", 71200],
];
export const W = [100, 90, 92, 28, 150, 132, 120, 90];
export const tbl = (hl?: (i: number, r: Row) => string | undefined): CellD[] => {
  const o: CellD[] = ["Branch", "Product", "Revenue"].map((t, i) => ({r: 1, c: i + 1, t, bold: true, color: "#fff", bg: C.green, a: i === 2 ? ("r" as const) : ("l" as const)}));
  ROWS.forEach((r, i) => {
    const bg = hl?.(i, r) ?? (i % 2 ? "#EAF4EE" : undefined);
    o.push({r: i + 2, c: 1, t: r[0], bg}, {r: i + 2, c: 2, t: r[1], bg}, {r: i + 2, c: 3, t: usd(r[2]), a: "r", bg});
  });
  return o;
};
