export const num = (n: number): string => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const h = (a: number, b: number): number => {
  let x = Math.imul(a + 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x7f4a7c15, 0xc2b2ae35);
  x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d); x ^= x >>> 12; x = Math.imul(x, 0x297a2d39); x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
};
export const CTRL = "□"; // stands for a non-printable character in the preview
// ---------- raw (dirty) records ----------
export type Raw = { id: string; cust: string; mgr: string | null; item: string; amt: string | null; date: string };
const NAMES = ["Ahmed Samy", "Mona Hassan", "Khaled Nabil", "Sara Ali", "Omar Fathy", "Heba Magdy", "Youssef Adel", "Nour Tarek", "Hany Salah", "Dina Reda", "Karim Wael", "Laila Hosny"];
const MGRS = ["Hossam", "Rania", "Tamer", "Salma", "Wael", "Amira", "Ziad"];
const CODES = ["LP01", "PH02", "TB03", "MN04", "PR05", "RT06", "KB07", "LP02"];
const BRS = ["Cairo", "Alex", "Giza", "Mansoura", "Aswan"];
const AMTS = [1250, 850, 2300, 4500, 780, 1900, 3200, 640];
const pad = (n: number): string => (n < 10 ? "0" : "") + n;
const SMALL_NULL = [3, 9, 15], SMALL_ERR = [6, 12, 19];
export const rawRow = (i: number, big: boolean): Raw => {
  const lead = Math.floor(h(i, 1) * 3), trail = Math.floor(h(i, 2) * 3), ctrl = h(i, 3) < 0.3 ? CTRL : "";
  const isNull = big ? i % 40 === 7 : SMALL_NULL.includes(i), isErr = big ? i % 55 === 3 : SMALL_ERR.includes(i);
  return {
    id: "INV-" + (1001 + i), cust: " ".repeat(lead) + NAMES[i % 12] + " ".repeat(trail) + ctrl, mgr: i % 4 === 0 ? MGRS[(i / 4) % 7 | 0] : null,
    item: CODES[i % 8] + "-" + BRS[(i / 4 | 0) % 5], amt: isNull ? null : isErr ? "N/A" : String(AMTS[i % 8] + (i % 3) * 50),
    date: `2026-${pad(1 + (i % 6))}-${pad(1 + ((i * 3) % 28))}`,
  };
};
export const SMALL_DUP = [4, 10, 16]; // unique-row indexes that are repeated right after themselves
export const smallRaw = (): Raw[] => { const o: Raw[] = []; for (let i = 0; i < 22; i++) { o.push(rawRow(i, false)); if (SMALL_DUP.includes(i)) o.push({ ...rawRow(i, false) }); } return o; };
export const bigRaw = (n: number): Raw[] => { const o: Raw[] = []; let u = 0; for (let i = 0; i < n; i++) { if (i % 25 === 24) o.push({ ...o[o.length - 1] }); else o.push(rawRow(u++, true)); } return o; };
export const BIG_N = 50000;
export const bigStats = (): { nulls: number; errs: number; dups: number; clean: number } => {
  let u = 0, nulls = 0, errs = 0, dups = 0;
  for (let i = 0; i < BIG_N; i++) { if (i % 25 === 24) { dups++; continue; } const r = rawRow(u++, true); if (r.amt === null) nulls++; else if (r.amt === "N/A") errs++; }
  return { nulls, errs, dups, clean: BIG_N - dups };
};
// ---------- pipeline view: each flag = one Applied Step ----------
export type Flags = { amtType: boolean; dateType: boolean; nullFix: boolean; fill: boolean; errFix: boolean; dedupe: boolean; split: boolean; trim: boolean; clean: boolean };
export const NO_FLAGS: Flags = { amtType: false, dateType: false, nullFix: false, fill: false, errFix: false, dedupe: false, split: false, trim: false, clean: false };
export const ALL_FLAGS: Flags = { amtType: true, dateType: true, nullFix: true, fill: true, errFix: true, dedupe: true, split: true, trim: true, clean: true };
export type PCell = { v: string; kind?: "null" | "error" | "num" | "date" };
export type PRowD = { key: string; cells: PCell[]; filled: boolean[]; dup: boolean };
export type PView = { cols: { name: string; type: "text" | "dec" | "int" | "date" | "any"; w: number }[]; rows: PRowD[]; q: number[][] };
const fmtDate = (iso: string): string => { const [y, m, d] = iso.split("-").map(Number); return `${m}/${d}/${y}`; };
export const pview = (raw: Raw[], f: Flags, keepDups = false): PView => {
  let lastMgr: string | null = null; const seen = new Set<string>(); const rows: PRowD[] = [];
  raw.forEach((r, i) => {
    const sig = JSON.stringify(r); const dup = seen.has(sig); seen.add(sig);
    if (f.dedupe && dup && !keepDups) return;
    let mgr = r.mgr; const filled0 = mgr === null;
    if (f.fill) { if (mgr === null) mgr = lastMgr; else lastMgr = mgr; }
    const amtV: PCell = r.amt === null ? (f.nullFix ? { v: "0", kind: "num" } : { v: "", kind: "null" }) : !f.amtType ? { v: r.amt } : r.amt === "N/A" ? (f.errFix ? { v: "0", kind: "num" } : { v: "", kind: "error" }) : { v: r.amt, kind: "num" };
    const amt: PCell = r.amt === null && f.nullFix ? { v: "0", kind: "num" } : amtV;
    let cust = r.cust; if (f.trim) cust = cust.replace(/^ +| +$/g, ""); if (f.clean) cust = cust.split(CTRL).join("");
    const cells: PCell[] = [{ v: r.id }, { v: cust }, mgr === null ? { v: "", kind: "null" } : { v: mgr }];
    const fl: boolean[] = [false, false, filled0 && f.fill, false, false, false, false];
    if (f.split) { const [a, b] = r.item.split("-"); cells.push({ v: a }, { v: b }); } else cells.push({ v: r.item });
    cells.push(amt, f.dateType ? { v: fmtDate(r.date), kind: "date" } : { v: r.date });
    rows.push({ key: "r" + i, cells, filled: fl, dup });
  });
  const cols: PView["cols"] = [{ name: "Order ID", type: "text", w: 100 }, { name: "Customer", type: "text", w: 170 }, { name: "Manager", type: "text", w: 100 }];
  if (f.split) cols.push({ name: "Item.1", type: "text", w: 90 }, { name: "Item.2", type: "text", w: 110 }); else cols.push({ name: "Item", type: "text", w: 130 });
  cols.push({ name: "Amount", type: f.amtType ? "dec" : "text", w: 100 }, { name: "Date", type: f.dateType ? "date" : "text", w: 110 });
  const q = cols.map((_, c) => { const n = Math.max(1, rows.length); const e = rows.filter((r) => r.cells[c].kind === "error").length / n, z = rows.filter((r) => r.cells[c].kind === "null").length / n; return [1 - e - z, e, z]; });
  return { cols, rows, q };
};
export const STEP_NAMES: [keyof Flags | "base", string][] = [["amtType", "Changed Type1"], ["nullFix", "Replaced Value"], ["fill", "Filled Down"], ["errFix", "Replaced Errors"], ["dedupe", "Removed Duplicates"], ["split", "Split Column by Delimiter"], ["trim", "Trimmed Text"], ["clean", "Cleaned Text"]];
export const stepsOf = (f: Flags): string[] => { const o = ["Source", "Changed Type"]; STEP_NAMES.forEach(([k, n]) => { if (f[k as keyof Flags]) { o.push(n); if (k === "split") o.push("Changed Type2"); } }); return o; };
export const MCODE: Record<string, string> = {
  Source: '= Excel.CurrentWorkbook(){[Name="Sales"]}[Content]',
  "Changed Type": '= Table.TransformColumnTypes(Source,{{"Order ID", type text}, {"Customer", type text}, {"Manager", type text}, {"Item", type text}, {"Amount", type text}, {"Date", type text}})',
  "Changed Type1": '= Table.TransformColumnTypes(#"Changed Type",{{"Amount", type number}, {"Date", type date}})',
  "Replaced Value": '= Table.ReplaceValue(#"Changed Type1",null,0,Replacer.ReplaceValue,{"Amount"})',
  "Filled Down": '= Table.FillDown(#"Replaced Value",{"Manager"})',
  "Replaced Errors": '= Table.ReplaceErrorValues(#"Filled Down", {{"Amount", 0}})',
  "Removed Duplicates": '= Table.Distinct(#"Replaced Errors")',
  "Split Column by Delimiter": '= Table.SplitColumn(#"Removed Duplicates", "Item", Splitter.SplitTextByDelimiter("-", QuoteStyle.Csv), {"Item.1", "Item.2"})',
  "Changed Type2": '= Table.TransformColumnTypes(#"Split Column by Delimiter",{{"Item.1", type text}, {"Item.2", type text}})',
  "Trimmed Text": '= Table.TransformColumns(#"Changed Type2",{{"Customer", Text.Trim, type text}})',
  "Cleaned Text": '= Table.TransformColumns(#"Trimmed Text",{{"Customer", Text.Clean, type text}})',
};
