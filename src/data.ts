import type {CellD} from "./kit";
import {C} from "./theme";
import {rgba} from "./kit";

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

/* ───────── PivotTable data (illustrative; totals are consistent: commission = 5% of sales, margin = profit / sales) ───────── */
export type PR = {n: string; s: number; p: number};
export const BRN: PR[] = [{n: "Cairo", s: 4820000, p: 964000}, {n: "Alexandria", s: 3640000, p: 618800}, {n: "Giza", s: 2980000, p: 506600}, {n: "Mansoura", s: 1860000, p: 297600}, {n: "Tanta", s: 1250000, p: 187500}];
export const REG: PR[] = [{n: "East", s: 5950000, p: 1190000}, {n: "West", s: 4210000, p: 715700}, {n: "North", s: 2860000, p: 457600}, {n: "South", s: 1530000, p: 211200}];
export const PW = [176, 170, 150, 160, 150, 20, 64, 64, 64, 64, 64, 64];
export const pct = (x: number) => (x * 100).toFixed(1) + "%";
export type PO = {rows: PR[]; fac?: [number, number]; comm?: number; marg?: number; vr?: {a: number; b: number; name: string; solve: "early" | "late"; k: number} | null; flash?: number; vrColor?: string};
const HB = "#DCE6F1";
/** Builds the PivotTable cells at A3. comm/marg are 0..1 reveal progress of the calculated-field columns. */
export const pvCells = (o: PO): {cells: CellD[]; total: number} => {
  const fc = o.fac ?? [1, 1];
  const rows = o.rows.map((r) => ({n: r.n, s: Math.round(r.s * fc[0]), p: Math.round(r.p * fc[1])}));
  const vr = o.vr && o.vr.k > 0.5 ? o.vr : null;
  const A = vr ? rows[vr.a] : null, B = vr ? rows[vr.b] : null;
  const vs = A && B ? A.s - B.s : 0, vp = A && B ? A.p - B.p : 0;
  const all = [...rows.map((r) => ({...r, v: false})), ...(vr ? [{n: vr.name, s: vs, p: vp, v: true}] : [])];
  const ts = all.reduce((x, r) => x + r.s, 0), tp = all.reduce((x, r) => x + r.p, 0);
  const cells: CellD[] = [];
  const hdr = ["Row Labels", "Sum of Sales_Amount", "Sum of Net_Profit", "Sum of Commission", "Sum of Margin %"];
  hdr.forEach((h, i) => { if (i === 3 && (o.comm ?? 0) <= 0.5) return; if (i === 4 && (o.marg ?? 0) <= 0.5) return; cells.push({r: 3, c: i + 1, t: h, bold: true, bg: HB, a: i ? "r" : "l"}); });
  const line = (r: number, n: string, s: number, p: number, bold: boolean, v: boolean, i: number) => {
    const bg = bold ? HB : v ? rgba(C.purple, 0.16 + 0.1 * Math.sin((o.flash ?? 0) * 6)) : undefined;
    cells.push({r, c: 1, t: n, bold: bold || v, bg, color: v ? "#6B21A8" : undefined}, {r, c: 2, t: int(s), a: "r", bold, bg}, {r, c: 3, t: int(p), a: "r", bold, bg});
    const ck = o.comm ?? 0, mk = o.marg ?? 0;
    const fl = (k: number, col: string) => (k > 0.5 && k < 1 ? rgba(col, 0.4 * Math.sin(Math.PI * k)) : bg);
    if (ck > 0.5) cells.push({r, c: 4, t: int(s * 0.05), a: "r", bold, bg: fl(ck, C.emerald)});
    if (mk > 0.5) {
      const m = v && vr!.solve === "early" ? (A!.p / A!.s) - (B!.p / B!.s) : p / s;
      cells.push({r, c: 5, t: pct(m), a: "r", bold, bg: fl(mk, C.blue), color: v && vr!.solve === "early" ? "#B91C1C" : undefined});
    }
    void i;
  };
  all.forEach((r, i) => line(4 + i, r.n, r.s, r.p, false, r.v, i));
  line(4 + all.length, "Grand Total", ts, tp, true, false, 0);
  return {cells, total: 4 + all.length};
};
export const FIELDS = ["Date", "Branch", "Product", "Units", "Sales_Amount", "Net_Profit"];
