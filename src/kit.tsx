// ===== Shared Excel-UI kit (2D SVG/HTML). Written once, reused by every lesson. =====
import React from "react";
import { Img, staticFile } from "remotion";
import { C, M, GRID_Y, LOGO } from "./theme";
import { FAR, FUI, FMONO } from "./fonts";

/* ---------- helpers ---------- */
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const prog = (f: number, a: number, b: number) => clamp((f - a) / Math.max(1, b - a));
export const eo = (t: number) => 1 - Math.pow(1 - t, 3);
export const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const typed = (s: string, f: number, a: number, cps = 16) =>
  s.slice(0, Math.max(0, Math.min(s.length, Math.floor(((f - a) / 30) * cps))));
export const colL = (i: number): string => {
  let s = ""; let n = i + 1;
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
};
export const addr = (c: number, r: number) => colL(c) + (r + 1);
export const parse = (a: string) => {
  const m = /^([A-Z]+)(\d+)$/.exec(a) as RegExpExecArray;
  let c = 0; for (const ch of m[1]) c = c * 26 + (ch.charCodeAt(0) - 64);
  return { c: c - 1, r: parseInt(m[2], 10) - 1 };
};
export const vis = (f: number, a: number, b: number, fade = 8) =>
  eo(prog(f, a, a + fade)) * (1 - eo(prog(f, b - fade, b)));

/* ---------- top badge, caption, logo ---------- */
export const Logo: React.FC<{ h?: number; invert?: boolean }> = ({ h = 44, invert = true }) => (
  <Img src={staticFile(LOGO)} style={{ height: h, width: h * (300 / 260), filter: invert ? "invert(1)" : "none" }} />
);

const Pill: React.FC<{ children: React.ReactNode; col?: string }> = ({ children, col = C.cyan }) => (
  <div style={{ background: C.panel, border: `1.5px solid ${col}`, color: C.text, borderRadius: 22, padding: "0 20px", height: 40, display: "flex", alignItems: "center", fontSize: 22, whiteSpace: "nowrap" }}>{children}</div>
);

export const TopBadge: React.FC<{ lesson: number; lessons: number; unit: number; units: number; title: string; f: number; a?: number; b?: number }> = ({ lesson, lessons, unit, units, title, f, a = 0, b = 99999 }) => {
  const o = vis(f, a, b, 12);
  return (
    <div style={{ position: "absolute", left: 24, top: 8, right: 24, height: 46, display: "flex", alignItems: "center", gap: 14, fontFamily: FAR, direction: "ltr" }}>
      <Logo h={52} />
      <div style={{ opacity: o, display: "flex", gap: 12, alignItems: "center", transform: `translateY(${(1 - o) * -8}px)` }}>
        <Pill><span dir="rtl">الدرس {lesson} من {lessons}</span></Pill>
        <Pill col={C.green}><span dir="rtl">الوحدة {unit} من {units}</span></Pill>
        <Pill col={C.cyan}><span style={{ fontFamily: FUI, fontWeight: 700, fontSize: 23 }}>{title}</span></Pill>
      </div>
    </div>
  );
};

export const Arrow: React.FC<{ c: string }> = ({ c }) => (
  <svg width="34" height="14" viewBox="0 0 34 14"><path d="M0 7H26M20 2l7 5-7 5" stroke={c} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export const Caption: React.FC<{ tag: string; col: string; lead: string; code?: string; f: number; a: number; b: number }> = ({ tag, col, lead, code, f, a, b }) => {
  const o = vis(f, a, b, 10);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 24, right: 24, top: M.capY, height: M.capH, display: "flex", alignItems: "center", gap: 18, background: "rgba(30,41,59,0.96)", border: `1.5px solid ${col}`, borderRadius: 14, padding: "0 22px", boxShadow: `0 0 22px ${col}55`, opacity: o, transform: `translateY(${(1 - o) * 14}px)`, direction: "ltr" }}>
      <div style={{ background: col, color: "#0F172A", fontFamily: FUI, fontWeight: 700, fontSize: 21, padding: "4px 14px", borderRadius: 8, whiteSpace: "nowrap" }}>{tag}</div>
      <div style={{ color: C.text, fontFamily: FUI, fontSize: 27, whiteSpace: "nowrap" }}>{lead}</div>
      {code ? <Arrow c={col} /> : null}
      {code ? <div style={{ color: col, fontFamily: FMONO, fontSize: 25, whiteSpace: "nowrap" }}>{code}</div> : null}
    </div>
  );
};

export const Callout: React.FC<{ x: number; y: number; w: number; h: number; col: string; f: number; a?: number; b?: number; r?: number }> = ({ x, y, w, h, col, f, a = 0, b = 99999, r = 6 }) => {
  const o = vis(f, a, b, 8);
  if (o <= 0.01) return null;
  const p = 0.7 + 0.3 * Math.sin(f / 9);
  return <div style={{ position: "absolute", left: x - 4, top: y - 4, width: w + 8, height: h + 8, border: `3px solid ${col}`, borderRadius: r, boxShadow: `0 0 ${14 + 10 * p}px ${col}, inset 0 0 10px ${col}55`, opacity: o, pointerEvents: "none" }} />;
};

export const Glass: React.FC<{ x: number; y: number; w: number; h: number; col?: string; children?: React.ReactNode; o?: number }> = ({ x, y, w, h, col = C.cyan, children, o = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: "rgba(30,41,59,0.88)", border: `1.5px solid ${col}88`, borderRadius: 18, boxShadow: `0 10px 40px rgba(0,0,0,.45), 0 0 24px ${col}33`, opacity: o, overflow: "hidden" }}>{children}</div>
);

/* ---------- icons (generic drawings, no brand marks) ---------- */
const G = "#107C41", B = "#2B6CB0", K = "#555", O = "#D9822B";
export const Ico: React.FC<{ k: string; s?: number }> = ({ k, s = 32 }) => {
  const st = { fill: "none", stroke: K, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let g: React.ReactNode;
  switch (k) {
    case "paste": g = <g><rect x="6" y="6" width="17" height="21" rx="2" {...st} fill="#fff" /><rect x="11" y="3" width="8" height="6" rx="1.5" fill="#888" /><rect x="15" y="14" width="13" height="15" rx="1.5" fill="#fff" stroke={G} strokeWidth="1.6" /><path d="M18 19h7M18 23h7" stroke={G} strokeWidth="1.6" /></g>; break;
    case "copy": g = <g><rect x="5" y="4" width="15" height="19" rx="2" {...st} /><rect x="12" y="10" width="15" height="19" rx="2" {...st} fill="#fff" /></g>; break;
    case "cut": g = <g><path d="M10 4l12 17M22 4L10 21" {...st} /><circle cx="10" cy="24" r="3.5" {...st} /><circle cx="22" cy="24" r="3.5" {...st} /></g>; break;
    case "brush": g = <g><rect x="6" y="5" width="16" height="9" rx="2" {...st} fill="#FFE08A" /><path d="M14 14v6M11 20h6v8h-6z" {...st} /></g>; break;
    case "B": g = <text x="16" y="24" textAnchor="middle" fontSize="23" fontWeight="700" fill={K} fontFamily={FUI}>B</text>; break;
    case "I": g = <text x="16" y="24" textAnchor="middle" fontSize="23" fontStyle="italic" fill={K} fontFamily={FUI}>I</text>; break;
    case "U": g = <g><text x="16" y="22" textAnchor="middle" fontSize="21" fill={K} fontFamily={FUI}>U</text><path d="M8 27h16" {...st} /></g>; break;
    case "fill": g = <g><path d="M7 20l9-12 9 12z" fill="#FFD966" stroke={K} strokeWidth="1.4" /><rect x="6" y="25" width="20" height="4" fill="#FFE600" /></g>; break;
    case "font": g = <g><text x="16" y="21" textAnchor="middle" fontSize="20" fill={K} fontFamily={FUI}>A</text><rect x="7" y="25" width="18" height="4" fill="#E03C31" /></g>; break;
    case "alL": g = <path d="M6 8h20M6 14h13M6 20h20M6 26h13" {...st} />; break;
    case "alC": g = <path d="M6 8h20M10 14h12M6 20h20M10 26h12" {...st} />; break;
    case "alR": g = <path d="M6 8h20M13 14h13M6 20h20M13 26h13" {...st} />; break;
    case "wrap": g = <g><path d="M5 8h22M5 15h17a4 4 0 010 8h-6" {...st} /><path d="M19 20l-3 3 3 3M5 24h6" {...st} /></g>; break;
    case "merge": g = <g><rect x="4" y="8" width="24" height="16" rx="1.5" {...st} /><path d="M9 16h14M12 13l-3 3 3 3M20 13l3 3-3 3" {...st} stroke={B} /></g>; break;
    case "pct": g = <text x="16" y="24" textAnchor="middle" fontSize="23" fill={K} fontFamily={FUI}>%</text>; break;
    case "usd": g = <text x="16" y="24" textAnchor="middle" fontSize="23" fill={K} fontFamily={FUI}>$</text>; break;
    case "comma": g = <text x="16" y="25" textAnchor="middle" fontSize="26" fontWeight="700" fill={K} fontFamily={FUI}>,</text>; break;
    case "dec": g = <text x="16" y="23" textAnchor="middle" fontSize="15" fill={K} fontFamily={FUI}>.00</text>; break;
    case "cond": g = <g><rect x="4" y="5" width="24" height="22" rx="2" {...st} fill="#fff" /><rect x="7" y="9" width="10" height="4" fill="#E03C31" /><rect x="7" y="15" width="16" height="4" fill="#F2B84B" /><rect x="7" y="21" width="7" height="3" fill={G} /></g>; break;
    case "table": g = <g><rect x="4" y="5" width="24" height="22" rx="2" {...st} fill="#fff" /><rect x="4" y="5" width="24" height="6" fill={B} /><path d="M4 17h24M4 22h24M12 11v16M20 11v16" {...st} strokeWidth="1.1" /></g>; break;
    case "styles": g = <g><rect x="4" y="7" width="24" height="18" rx="3" {...st} fill="#fff" /><text x="16" y="21" textAnchor="middle" fontSize="13" fill={G} fontFamily={FUI} fontWeight="700">Aa</text></g>; break;
    case "ins": g = <g><rect x="5" y="8" width="20" height="18" {...st} fill="#fff" /><path d="M5 14h20M13 8v18" {...st} strokeWidth="1.1" /><circle cx="24" cy="9" r="5" fill={G} /><path d="M24 6v6M21 9h6" stroke="#fff" strokeWidth="1.6" /></g>; break;
    case "del": g = <g><rect x="5" y="8" width="20" height="18" {...st} fill="#fff" /><path d="M5 14h20M13 8v18" {...st} strokeWidth="1.1" /><circle cx="24" cy="9" r="5" fill="#C0392B" /><path d="M21 9h6" stroke="#fff" strokeWidth="1.8" /></g>; break;
    case "fmt": g = <g><rect x="5" y="8" width="20" height="18" {...st} fill="#fff" /><path d="M5 14h20M13 8v18" {...st} strokeWidth="1.1" /><circle cx="24" cy="24" r="4.5" fill="#888" /></g>; break;
    case "sum": g = <text x="16" y="25" textAnchor="middle" fontSize="27" fill={O} fontFamily={FUI} fontWeight="700">Σ</text>; break;
    case "clear": g = <g><path d="M6 20l10-12 10 8-8 10H12z" {...st} fill="#fff" /><path d="M10 26h16" {...st} /></g>; break;
    case "sort": g = <g><text x="3" y="13" fontSize="12" fill={K} fontFamily={FUI}>A</text><text x="3" y="27" fontSize="12" fill={K} fontFamily={FUI}>Z</text><path d="M22 6v18M17 19l5 6 5-6" {...st} stroke={B} /></g>; break;
    case "az": g = <g><text x="3" y="13" fontSize="12" fill={K} fontFamily={FUI}>A</text><text x="3" y="27" fontSize="12" fill={K} fontFamily={FUI}>Z</text><path d="M22 6v18M17 19l5 6 5-6" {...st} stroke={B} /></g>; break;
    case "filter": g = <path d="M4 6h24l-9 11v9l-6-3v-6z" {...st} fill="#E7EEF7" stroke={B} />; break;
    case "find": g = <g><circle cx="13" cy="13" r="7" {...st} /><path d="M18 18l9 9" {...st} strokeWidth="2.6" /></g>; break;
    case "col": g = <g><rect x="5" y="15" width="5" height="12" fill={B} /><rect x="13" y="7" width="5" height="20" fill={G} /><rect x="21" y="12" width="5" height="15" fill={O} /></g>; break;
    case "line": g = <g><path d="M4 24l7-9 6 5 10-14" {...st} stroke={B} strokeWidth="2.2" /><path d="M4 28h24" {...st} /></g>; break;
    case "pie": g = <g><circle cx="16" cy="16" r="11" fill={B} /><path d="M16 16V5a11 11 0 0110 7z" fill={O} /></g>; break;
    case "hier": g = <g><rect x="4" y="5" width="13" height="13" fill={B} /><rect x="18" y="5" width="10" height="7" fill={G} /><rect x="18" y="13" width="10" height="14" fill={O} /><rect x="4" y="19" width="13" height="8" fill="#9B59B6" /></g>; break;
    case "stat": g = <g><rect x="5" y="14" width="4" height="13" fill={B} /><rect x="11" y="8" width="4" height="19" fill={B} /><rect x="17" y="12" width="4" height="15" fill={B} /><rect x="23" y="18" width="4" height="9" fill={B} /></g>; break;
    case "scatter": g = <g><path d="M5 5v22h22" {...st} /><circle cx="11" cy="21" r="2.4" fill={B} /><circle cx="16" cy="15" r="2.4" fill={B} /><circle cx="21" cy="17" r="2.4" fill={B} /><circle cx="24" cy="9" r="2.4" fill={B} /></g>; break;
    case "combo": g = <g><rect x="5" y="16" width="5" height="11" fill={B} /><rect x="13" y="12" width="5" height="15" fill={B} /><rect x="21" y="18" width="5" height="9" fill={B} /><path d="M5 12l8-6 8 7 6-8" {...st} stroke={O} strokeWidth="2" /></g>; break;
    case "rec": g = <g><rect x="5" y="14" width="5" height="13" fill={B} /><rect x="13" y="8" width="5" height="19" fill={G} /><path d="M24 4l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill="#F2B84B" /></g>; break;
    case "pivot": g = <g><rect x="4" y="5" width="24" height="22" rx="2" {...st} fill="#fff" /><rect x="4" y="5" width="8" height="22" fill="#D6E4F5" /><path d="M4 12h24M12 5v22" {...st} strokeWidth="1.1" /></g>; break;
    case "fx": g = <text x="16" y="23" textAnchor="middle" fontSize="20" fontStyle="italic" fontWeight="700" fill={G} fontFamily={FUI}>fx</text>; break;
    case "book": g = <g><rect x="6" y="5" width="18" height="22" rx="2" {...st} fill="#fff" /><path d="M10 11h10M10 16h10M10 21h6" {...st} stroke={B} /></g>; break;
    case "names": g = <g><rect x="4" y="8" width="24" height="16" rx="2" {...st} fill="#fff" /><text x="16" y="21" textAnchor="middle" fontSize="12" fill={B} fontFamily={FUI}>name</text></g>; break;
    case "trace": g = <g><rect x="4" y="5" width="9" height="7" {...st} fill="#fff" /><rect x="19" y="20" width="9" height="7" {...st} fill="#fff" /><path d="M13 9h6v11" {...st} stroke={B} /><path d="M16 17l3 3 3-3" {...st} stroke={B} /></g>; break;
    case "eye": g = <g><path d="M3 16c5-8 21-8 26 0-5 8-21 8-26 0z" {...st} fill="#fff" /><circle cx="16" cy="16" r="4" fill={B} /></g>; break;
    case "calc": g = <g><rect x="7" y="4" width="18" height="24" rx="2" {...st} fill="#fff" /><rect x="10" y="7" width="12" height="5" fill="#CFE8D9" /><path d="M11 17h2M16 17h2M21 17h1M11 22h2M16 22h2M21 22h1" stroke={K} strokeWidth="2.2" /></g>; break;
    case "data": g = <g><ellipse cx="16" cy="8" rx="10" ry="4" {...st} fill="#fff" /><path d="M6 8v14c0 2.2 4.5 4 10 4s10-1.8 10-4V8" {...st} fill="#fff" /><path d="M6 15c0 2.2 4.5 4 10 4s10-1.8 10-4" {...st} /></g>; break;
    case "refresh": g = <g><path d="M25 14a9 9 0 10-2 8" {...st} stroke={G} strokeWidth="2.2" /><path d="M26 6v8h-8" {...st} stroke={G} strokeWidth="2.2" /></g>; break;
    case "conn": g = <g><rect x="4" y="6" width="10" height="8" rx="2" {...st} fill="#fff" /><rect x="18" y="18" width="10" height="8" rx="2" {...st} fill="#fff" /><path d="M14 10h6v8" {...st} stroke={B} /></g>; break;
    case "dtype": g = <g><rect x="5" y="5" width="22" height="22" rx="3" {...st} fill="#fff" /><path d="M10 20l4-5 3 3 5-8" {...st} stroke={G} strokeWidth="2" /></g>; break;
    case "ttc": g = <g><rect x="4" y="7" width="24" height="18" {...st} fill="#fff" /><path d="M16 7v18" {...st} stroke={B} strokeDasharray="2 2" /></g>; break;
    case "dedup": g = <g><rect x="5" y="5" width="16" height="16" {...st} fill="#fff" /><rect x="11" y="11" width="16" height="16" {...st} fill="#fff" /><path d="M15 19l8 0" {...st} stroke="#C0392B" strokeWidth="2.2" /></g>; break;
    case "valid": g = <g><rect x="4" y="6" width="24" height="12" {...st} fill="#fff" /><path d="M9 12l3 3 5-6" {...st} stroke={G} strokeWidth="2.2" /><path d="M10 22h12l-6 5z" fill="#888" /></g>; break;
    case "whatif": g = <g><rect x="4" y="6" width="17" height="15" {...st} fill="#fff" /><path d="M4 12h17M10 6v15" {...st} strokeWidth="1.1" /><text x="24" y="27" textAnchor="middle" fontSize="19" fill={O} fontWeight="700" fontFamily={FUI}>?</text></g>; break;
    case "forecast": g = <g><path d="M4 22l6-7 5 4 5-8" {...st} stroke={B} strokeWidth="2.2" /><path d="M20 11l8-5" stroke={O} strokeWidth="2.2" strokeDasharray="3 2.4" /><path d="M4 28h24" {...st} /></g>; break;
    case "group": g = <g><path d="M6 6h6v20H6M26 6h-6v20h6" {...st} stroke={B} /><path d="M12 16h8" {...st} /></g>; break;
    default: g = <rect x="6" y="6" width="20" height="20" rx="3" {...st} fill="#fff" />;
  }
  return <svg width={s} height={s} viewBox="0 0 32 32">{g}</svg>;
};

/* ---------- ribbon definitions (Microsoft 365 desktop layout, generic icons) ---------- */
type It = { id?: string; i?: string; l?: string; box?: string; w?: number };
type Item = { big: It } | { rows: It[][] };
type Grp = { n: string; items: Item[] };
const bg = (id: string, i: string, l: string): Item => ({ big: { id, i, l } });
const sm = (i: string, l?: string, id?: string): It => ({ i, l, id });
const bx = (t: string, w: number): It => ({ box: t, w });

export const TABS = ["File", "Home", "Insert", "Page Layout", "Formulas", "Data", "Review", "View", "Automate", "Help"];
const RIB: Record<string, Grp[]> = {
  Home: [
    { n: "Clipboard", items: [bg("paste", "paste", "Paste"), { rows: [[sm("cut", "Cut")], [sm("copy", "Copy")], [sm("brush", "Format Painter")]] }] },
    { n: "Font", items: [{ rows: [[bx("Calibri", 118), bx("11", 46), sm("font")], [sm("B"), sm("I"), sm("U"), sm("fill"), sm("font")]] }] },
    { n: "Alignment", items: [{ rows: [[sm("alL"), sm("alC"), sm("alR")], [sm("wrap", "Wrap Text")], [sm("merge", "Merge & Center")]] }] },
    { n: "Number", items: [{ rows: [[bx("General", 150)], [sm("usd"), sm("pct"), sm("comma"), sm("dec")]] }] },
    { n: "Styles", items: [bg("cond", "cond", "Conditional\nFormatting"), bg("fmtT", "table", "Format as\nTable"), bg("cs", "styles", "Cell\nStyles")] },
    { n: "Cells", items: [bg("insC", "ins", "Insert"), bg("delC", "del", "Delete"), bg("fmtC", "fmt", "Format")] },
    { n: "Editing", items: [{ rows: [[sm("sum", "AutoSum")], [sm("fill", "Fill")], [sm("clear", "Clear")]] }, bg("sortF", "sort", "Sort &\nFilter"), bg("findS", "find", "Find &\nSelect")] },
  ],
  Insert: [
    { n: "Tables", items: [bg("pvt", "pivot", "PivotTable"), bg("rpv", "pivot", "Recommended\nPivotTables"), bg("tbl", "table", "Table")] },
    { n: "Charts", items: [bg("recC", "rec", "Recommended\nCharts"), { rows: [[sm("col", undefined, "chCol"), sm("line", undefined, "chLine"), sm("pie", undefined, "chPie")], [sm("hier", undefined, "chHier"), sm("stat", undefined, "chStat"), sm("scatter", undefined, "chScatter")]] }, bg("pvc", "combo", "PivotChart")] },
    { n: "Sparklines", items: [{ rows: [[sm("line", "Line")], [sm("col", "Column")], [sm("stat", "Win/Loss")]] }] },
    { n: "Filters", items: [bg("slc", "filter", "Slicer"), bg("tml", "book", "Timeline")] },
    { n: "Links", items: [bg("lnk", "conn", "Link")] },
    { n: "Text", items: [bg("txb", "book", "Text\nBox"), bg("hf", "book", "Header &\nFooter")] },
    { n: "Symbols", items: [bg("eq", "fx", "Equation"), bg("symb", "names", "Symbol")] },
  ],
  Formulas: [
    { n: "Function Library", items: [bg("insF", "fx", "Insert\nFunction"), bg("asum", "sum", "AutoSum"), bg("rec", "book", "Recently\nUsed"), bg("fin", "book", "Financial"), bg("log", "book", "Logical"), bg("txt", "book", "Text"), bg("dt", "book", "Date &\nTime"), bg("lk", "book", "Lookup &\nReference"), bg("mt", "book", "Math &\nTrig"), bg("more", "book", "More\nFunctions")] },
    { n: "Defined Names", items: [{ rows: [[sm("names", "Name Manager")], [sm("names", "Define Name")], [sm("names", "Use in Formula")]] }] },
    { n: "Formula Auditing", items: [{ rows: [[sm("trace", "Trace Precedents")], [sm("trace", "Trace Dependents")], [sm("eye", "Show Formulas")]] }] },
    { n: "Calculation", items: [bg("calcO", "calc", "Calculation\nOptions"), { rows: [[sm("calc", "Calculate Now")], [sm("calc", "Calculate Sheet")]] }] },
  ],
  Data: [
    { n: "Get & Transform Data", items: [bg("getD", "data", "Get\nData"), { rows: [[sm("data", "From Text/CSV")], [sm("data", "From Web")], [sm("table", "From Table/Range")]] }] },
    { n: "Queries & Connections", items: [bg("refA", "refresh", "Refresh\nAll"), { rows: [[sm("conn", "Queries & Connections")], [sm("conn", "Properties")], [sm("conn", "Edit Links")]] }] },
    { n: "Data Types", items: [bg("stk", "dtype", "Stocks"), bg("cur", "dtype", "Currencies")] },
    { n: "Sort & Filter", items: [bg("sortD", "sort", "Sort"), bg("fltD", "filter", "Filter"), { rows: [[sm("clear", "Clear")], [sm("refresh", "Reapply")], [sm("filter", "Advanced")]] }] },
    { n: "Data Tools", items: [bg("ttc", "ttc", "Text to\nColumns"), { rows: [[sm("fill", "Flash Fill")], [sm("dedup", "Remove Duplicates")], [sm("valid", "Data Validation")]] }] },
    { n: "Forecast", items: [bg("whatif", "whatif", "What-If\nAnalysis"), bg("fsheet", "forecast", "Forecast\nSheet")] },
    { n: "Outline", items: [{ rows: [[sm("group", "Group")], [sm("group", "Ungroup")], [sm("group", "Subtotal")]] }] },
  ],
};
const tw = (s: string) => s.length * 8.6;

const Ribbon: React.FC<{ tab: string; hl?: string; hlCol?: string; f: number }> = ({ tab, hl, hlCol = C.cyan, f }) => {
  const groups = RIB[tab] ?? RIB.Home;
  const rects: Record<string, { x: number; y: number; w: number; h: number }> = {};
  const out: React.ReactNode[] = [];
  let x = 10;
  groups.forEach((g, gi) => {
    const x0 = x;
    g.items.forEach((it, ii) => {
      if ("big" in it) {
        const lines = (it.big.l ?? "").split("\n");
        const w = Math.max(60, Math.max(...lines.map((l) => tw(l))) + 14);
        if (it.big.id) rects[it.big.id] = { x, y: 6, w, h: 94 };
        out.push(
          <div key={`${gi}-${ii}`} style={{ position: "absolute", left: x, top: 6, width: w, height: 94, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FUI, fontSize: 17, color: C.ink, textAlign: "center", lineHeight: "18px" }}>
            <div style={{ marginTop: 6 }}><Ico k={it.big.i ?? ""} s={46} /></div>
            <div style={{ marginTop: 6, whiteSpace: "pre" }}>{lines.join("\n")}</div>
          </div>
        );
        x += w + 2;
      } else {
        let cw = 0;
        it.rows.forEach((row, ri) => {
          let rx = x;
          row.forEach((b, bi) => {
            const ww = b.box ? (b.w ?? 80) : 28 + (b.l ? tw(b.l) + 6 : 0);
            if (b.id) rects[b.id] = { x: rx, y: 8 + ri * 31, w: ww, h: 30 };
            out.push(
              <div key={`${gi}-${ii}-${ri}-${bi}`} style={{ position: "absolute", left: rx, top: 8 + ri * 31, width: ww, height: 30, display: "flex", alignItems: "center", fontFamily: FUI, fontSize: 16, color: C.ink, boxSizing: "border-box", border: b.box ? `1px solid ${C.line}` : "none", background: b.box ? "#fff" : "transparent", padding: b.box ? "0 6px" : 0, justifyContent: b.box ? "space-between" : "flex-start" }}>
                {b.box ? <><span>{b.box}</span><span style={{ fontSize: 11, color: C.ink2 }}>▼</span></> : <><Ico k={b.i ?? ""} s={24} />{b.l ? <span style={{ marginLeft: 6 }}>{b.l}</span> : null}</>}
              </div>
            );
            rx += ww + 2;
          });
          cw = Math.max(cw, rx - x);
        });
        x += cw + 4;
      }
    });
    out.push(<div key={`n${gi}`} style={{ position: "absolute", left: x0, width: x - x0 - 4, top: 102, textAlign: "center", fontFamily: FUI, fontSize: 15, color: C.ink2 }}>{g.n}</div>);
    out.push(<div key={`s${gi}`} style={{ position: "absolute", left: x + 2, top: 10, width: 1, height: 108, background: C.line }} />);
    x += 10;
  });
  const r = hl ? rects[hl] : undefined;
  const p = 0.7 + 0.3 * Math.sin(f / 9);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: M.winW, height: M.ribbon, background: C.ribbon, borderBottom: `1px solid ${C.line}` }}>
      {out}
      {r ? <div style={{ position: "absolute", left: r.x - 3, top: r.y - 3, width: r.w + 6, height: r.h + 6, border: `3px solid ${hlCol}`, borderRadius: 6, boxShadow: `0 0 ${12 + 10 * p}px ${hlCol}`, pointerEvents: "none" }} /> : null}
    </div>
  );
};

/* ---------- Excel window shell ---------- */
export const ExcelWindow: React.FC<{
  tab?: string; hl?: string; hlCol?: string; nameBox: string; formula: string; editing?: boolean;
  sheets: string[]; activeSheet: number; mode?: string; stats?: string; file?: string; f: number; children?: React.ReactNode;
}> = ({ tab = "Home", hl, hlCol, nameBox, formula, editing = false, sheets, activeSheet, mode = "Ready", stats = "", file = "manzooma_sales_2026.xlsx", f, children }) => {
  const yT = 0, yTab = M.title, yR = M.title + M.tabs, yF = yR + M.ribbon, yS = M.winH - M.status - M.sheetBar;
  return (
    <div style={{ position: "absolute", left: M.winX, top: M.winY, width: M.winW, height: M.winH, background: C.white, border: `1px solid ${C.line}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 18px 60px rgba(0,0,0,.55)", fontFamily: FUI, direction: "ltr", zIndex: 0 }}>
      {/* title bar */}
      <div style={{ position: "absolute", left: 0, top: yT, width: M.winW, height: M.title, background: C.chrome, display: "flex", alignItems: "center", fontSize: 18, color: C.ink }}>
        <svg width="26" height="26" viewBox="0 0 26 26" style={{ marginLeft: 14 }}>{[0, 1, 2].flatMap((a) => [0, 1, 2].map((b) => <circle key={`${a}${b}`} cx={5 + a * 8} cy={5 + b * 8} r="2.2" fill="#555" />))}</svg>
        <div style={{ marginLeft: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <span>AutoSave</span>
          <div style={{ width: 40, height: 20, borderRadius: 10, border: "1.5px solid #666", position: "relative" }}><div style={{ position: "absolute", left: 3, top: 3, width: 12, height: 12, borderRadius: 6, background: "#666" }} /></div>
          <span style={{ fontSize: 15, color: C.ink2 }}>Off</span>
        </div>
        <div style={{ marginLeft: 18, display: "flex", gap: 14 }}><Ico k="copy" s={22} /><Ico k="refresh" s={22} /><Ico k="sort" s={22} /></div>
        <div style={{ marginLeft: 22 }}>{file} <span style={{ color: C.ink2, fontSize: 15 }}>• Saved</span></div>
        <div style={{ position: "absolute", left: 640, top: 6, width: 540, height: 32, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 6, display: "flex", alignItems: "center", color: C.ink2, fontSize: 17 }}><span style={{ marginLeft: 12, marginRight: 8 }}><Ico k="find" s={20} /></span>Search</div>
        <div style={{ position: "absolute", right: 0, top: 0, height: M.title, display: "flex", alignItems: "center", gap: 26, paddingRight: 22, fontSize: 18 }}>
          <span style={{ background: C.xlGreen, color: "#fff", padding: "4px 16px", borderRadius: 6, fontSize: 16 }}>Share</span>
          <span style={{ fontSize: 22 }}>—</span><span style={{ fontSize: 20 }}>☐</span><span style={{ fontSize: 22 }}>✕</span>
        </div>
      </div>
      {/* tab strip */}
      <div style={{ position: "absolute", left: 0, top: yTab, width: M.winW, height: M.tabs, background: C.chrome, display: "flex", alignItems: "flex-end", paddingLeft: 10, fontSize: 19, color: C.ink }}>
        {TABS.map((t) => (
          <div key={t} style={{ padding: "0 17px", height: M.tabs, display: "flex", alignItems: "center", position: "relative", color: t === tab ? C.xlGreen : C.ink, fontWeight: t === tab ? 700 : 400 }}>
            {t}{t === tab ? <div style={{ position: "absolute", left: 12, right: 12, bottom: 2, height: 3, background: C.xlGreen, borderRadius: 2 }} /> : null}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, top: yR }}><Ribbon tab={tab} hl={hl} hlCol={hlCol} f={f} /></div>
      {/* formula bar */}
      <div style={{ position: "absolute", left: 0, top: yF, width: M.winW, height: M.fbar, background: C.white, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", fontSize: 20 }}>
        <div style={{ marginLeft: 8, width: 150, height: 30, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", boxSizing: "border-box", color: C.ink }}><span>{nameBox}</span><span style={{ fontSize: 11, color: C.ink2 }}>▼</span></div>
        <div style={{ width: 130, display: "flex", justifyContent: "space-around", color: editing ? C.ink : "#B5B5B5", fontSize: 22, marginLeft: 6 }}><span>⋮</span><span>✕</span><span style={{ color: editing ? C.xlGreen : "#B5B5B5" }}>✓</span><span style={{ fontStyle: "italic", fontWeight: 700, color: C.ink2 }}>fx</span></div>
        <div style={{ flex: 1, height: 30, border: `1px solid ${C.line}`, marginRight: 8, display: "flex", alignItems: "center", padding: "0 10px", fontFamily: FUI, color: C.ink, whiteSpace: "pre" }}>{formula}{editing ? <span style={{ display: "inline-block", width: 2, height: 22, background: C.ink, marginLeft: 1 }} /> : null}</div>
        <div style={{ marginRight: 14, color: C.ink2, fontSize: 14 }}>⌄</div>
      </div>
      {children}
      {/* sheet tabs */}
      <div style={{ position: "absolute", left: 0, top: yS, width: M.winW, height: M.sheetBar, background: C.chrome, borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "center", fontSize: 19 }}>
        <span style={{ margin: "0 10px 0 14px", color: C.ink2 }}>◀</span><span style={{ marginRight: 14, color: C.ink2 }}>▶</span>
        {sheets.map((s, i) => (
          <div key={s} style={{ height: M.sheetBar - 1, padding: "0 20px", display: "flex", alignItems: "center", background: i === activeSheet ? "#fff" : "transparent", color: i === activeSheet ? C.xlGreen : C.ink, fontWeight: i === activeSheet ? 700 : 400, borderBottom: i === activeSheet ? `3px solid ${C.xlGreen}` : "none", boxSizing: "border-box", borderRight: `1px solid ${C.line}` }}>{s}</div>
        ))}
        <div style={{ marginLeft: 14, width: 26, height: 26, borderRadius: 13, border: `1px solid #888`, display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: 22 }}>+</div>
      </div>
      {/* status bar */}
      <div style={{ position: "absolute", left: 0, top: M.winH - M.status, width: M.winW, height: M.status, background: C.chrome, borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "center", fontSize: 17, color: C.ink }}>
        <span style={{ marginLeft: 16 }}>{mode}</span>
        <span style={{ marginLeft: 40, color: C.ink2 }}>Accessibility: Good to go</span>
        <span style={{ position: "absolute", right: 330 }}>{stats}</span>
        <div style={{ position: "absolute", right: 16, display: "flex", alignItems: "center", gap: 14, color: C.ink2 }}>
          <svg width="22" height="18"><rect x="1" y="1" width="20" height="16" fill="none" stroke="#555" /><path d="M1 7h20M8 1v16" stroke="#555" /></svg>
          <svg width="22" height="18"><rect x="1" y="1" width="20" height="16" fill="none" stroke="#555" /></svg>
          <svg width="22" height="18"><rect x="1" y="1" width="20" height="16" fill="none" stroke="#555" strokeDasharray="3 2" /></svg>
          <span>−</span><div style={{ width: 120, height: 3, background: "#999", position: "relative" }}><div style={{ position: "absolute", left: 57, top: -6, width: 6, height: 15, background: "#555" }} /></div><span>+</span><span>100%</span>
        </div>
      </div>
    </div>
  );
};

/* ---------- grid ---------- */
export type Cell = { v: string; al?: "l" | "r" | "c"; b?: boolean; col?: string; bg?: string; i?: boolean; tri?: boolean };
const wOf = (wd: number[] | undefined, c: number) => (wd && wd[c] != null ? wd[c] : M.colW);
export const colX = (c: number, wd?: number[]) => { let x = 0; for (let i = 0; i < c; i++) x += wOf(wd, i); return x; };
export const cellRect = (a: string, b?: string, wd?: number[], scroll = 0) => {
  const p = parse(a), q = parse(b ?? a);
  const c0 = Math.min(p.c, q.c), c1 = Math.max(p.c, q.c), r0 = Math.min(p.r, q.r), r1 = Math.max(p.r, q.r);
  return {
    x: M.winX + M.rowHdrW + colX(c0, wd), y: GRID_Y + M.colH + (r0 - scroll) * M.rowH,
    w: colX(c1 + 1, wd) - colX(c0, wd), h: (r1 - r0 + 1) * M.rowH,
  };
};
const isNum = (s: string) => /^-?[\d,]*\.?\d+%?$/.test(s.trim());

export const Grid: React.FC<{
  cells: Record<string, Cell>; wd?: number[]; scroll?: number; sel?: { a: string; b?: string }; selO?: number;
  ants?: { a: string; b: string }; handle?: boolean; f: number; children?: React.ReactNode; top?: number;
}> = ({ cells, wd, scroll = 0, sel, selO = 1, ants, handle = true, f, children }) => {
  const top = M.title + M.tabs + M.ribbon + M.fbar;
  const areaW = M.winW - M.rowHdrW, areaH = M.gridRows * M.rowH;
  const nC = 22, r0 = Math.max(0, Math.floor(scroll)), r1 = r0 + M.gridRows + 2;
  const rr = (r: number) => (r - scroll) * M.rowH;
  const sr = sel ? cellRect(sel.a, sel.b, wd, scroll) : null;
  const sp = sel ? parse(sel.a) : null, sq = sel ? parse(sel.b ?? sel.a) : null;
  const inC = (c: number) => !!sp && !!sq && c >= Math.min(sp.c, sq.c) && c <= Math.max(sp.c, sq.c);
  const inR = (r: number) => !!sp && !!sq && r >= Math.min(sp.r, sq.r) && r <= Math.max(sp.r, sq.r);
  const rel = (o: { x: number; y: number; w: number; h: number }) => ({ x: o.x - M.winX - M.rowHdrW, y: o.y - GRID_Y - M.colH, w: o.w, h: o.h });
  const keys = Object.keys(cells);
  const lines: React.ReactNode[] = [];
  for (let r = r0; r <= r1; r++) lines.push(<line key={`h${r}`} x1={0} x2={areaW} y1={rr(r)} y2={rr(r)} stroke={C.grid} strokeWidth={1} />);
  for (let c = 0; c <= nC; c++) lines.push(<line key={`v${c}`} y1={0} y2={areaH} x1={colX(c, wd)} x2={colX(c, wd)} stroke={C.grid} strokeWidth={1} />);
  const ar = ants ? rel(cellRect(ants.a, ants.b, wd, scroll)) : null;
  return (
    <div style={{ position: "absolute", left: 0, top, width: M.winW, height: M.colH + areaH, background: C.white, overflow: "hidden", fontFamily: FUI, zIndex: 0 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: M.rowHdrW, height: M.colH, background: C.hdr, borderRight: `1px solid ${C.grid}`, borderBottom: `1px solid ${C.grid}` }}>
        <svg width={M.rowHdrW} height={M.colH}><path d={`M${M.rowHdrW - 6} ${M.colH - 5}H${M.rowHdrW - 6}V${M.colH - 17}L${M.rowHdrW - 18} ${M.colH - 5}Z`} fill="#B0B0B0" /></svg>
      </div>
      {Array.from({ length: nC }, (_, c) => (
        <div key={`c${c}`} style={{ position: "absolute", left: M.rowHdrW + colX(c, wd), top: 0, width: wOf(wd, c), height: M.colH, boxSizing: "border-box", background: inC(c) ? C.hdrSel : C.hdr, borderRight: `1px solid ${C.grid}`, borderBottom: inC(c) ? `3px solid ${C.xlGreen}` : `1px solid ${C.grid}`, color: inC(c) ? C.xlGreen : C.ink2, fontWeight: inC(c) ? 700 : 400, fontSize: 19, display: "flex", alignItems: "center", justifyContent: "center" }}>{colL(c)}</div>
      ))}
      <div style={{ position: "absolute", left: 0, top: M.colH, width: M.rowHdrW, height: areaH, overflow: "hidden" }}>
        {Array.from({ length: r1 - r0 + 1 }, (_, k) => r0 + k).map((r) => (
          <div key={`r${r}`} style={{ position: "absolute", left: 0, top: rr(r), width: M.rowHdrW, height: M.rowH, boxSizing: "border-box", background: inR(r) ? C.hdrSel : C.hdr, borderBottom: `1px solid ${C.grid}`, borderRight: inR(r) ? `3px solid ${C.xlGreen}` : `1px solid ${C.grid}`, color: inR(r) ? C.xlGreen : C.ink2, fontWeight: inR(r) ? 700 : 400, fontSize: 19, display: "flex", alignItems: "center", justifyContent: "center" }}>{r + 1}</div>
        ))}
      </div>
      <div style={{ position: "absolute", left: M.rowHdrW, top: M.colH, width: areaW, height: areaH, overflow: "hidden" }}>
        <svg width={areaW} height={areaH} style={{ position: "absolute", left: 0, top: 0 }}>{lines}</svg>
        {keys.map((k) => {
          const p = parse(k); const cl = cells[k];
          if (p.r < r0 - 1 || p.r > r1) return null;
          const w = wOf(wd, p.c); const x = colX(p.c, wd); const y = rr(p.r);
          const al = cl.al ?? (isNum(cl.v) ? "r" : "l");
          const nextEmpty = !cells[addr(p.c + 1, p.r)];
          return (
            <div key={k} style={{ position: "absolute", left: x, top: y, width: w, height: M.rowH, boxSizing: "border-box", background: cl.bg ?? "transparent", borderRight: cl.bg ? `1px solid ${C.grid}` : "none", borderBottom: cl.bg ? `1px solid ${C.grid}` : "none", padding: "0 5px", display: "flex", alignItems: "center", justifyContent: al === "r" ? "flex-end" : al === "c" ? "center" : "flex-start", fontSize: 21, color: cl.col ?? C.ink, fontWeight: cl.b ? 700 : 400, fontStyle: cl.i ? "italic" : "normal", whiteSpace: "nowrap", overflow: nextEmpty && al === "l" ? "visible" : "hidden", zIndex: nextEmpty && al === "l" ? 2 : 1 }}>
              {cl.tri ? <svg width="9" height="9" style={{ position: "absolute", left: 0, top: 0 }}><path d="M0 0H9L0 9Z" fill="#1E8449" /></svg> : null}
              {cl.v}
            </div>
          );
        })}
        {sr && sel ? (() => {
          const s = rel(sr), a = rel(cellRect(sel.a, sel.a, wd, scroll)); const multi = !!sel.b && sel.b !== sel.a;
          return (
            <div style={{ position: "absolute", left: 0, top: 0, width: areaW, height: areaH, opacity: selO, pointerEvents: "none" }}>
              {multi ? <div style={{ position: "absolute", left: s.x, top: s.y, width: s.w, height: s.h, background: C.xlSelFill }} /> : null}
              {multi ? <div style={{ position: "absolute", left: a.x, top: a.y, width: a.w, height: a.h, background: "#fff" }} /> : null}
              <div style={{ position: "absolute", left: s.x - 1, top: s.y - 1, width: s.w + 1, height: s.h + 1, border: `3px solid ${C.xlGreen}`, boxSizing: "border-box" }} />
              {handle ? <div style={{ position: "absolute", left: s.x + s.w - 7, top: s.y + s.h - 7, width: 11, height: 11, background: C.xlGreen, border: "2px solid #fff", boxSizing: "border-box" }} /> : null}
            </div>
          );
        })() : null}
        {ar ? <svg width={areaW} height={areaH} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}><rect x={ar.x} y={ar.y} width={ar.w} height={ar.h} fill="none" stroke={C.xlGreen} strokeWidth="2.5" strokeDasharray="7 5" strokeDashoffset={-(f * 0.7) % 12} /></svg> : null}
        {children}
      </div>
    </div>
  );
};

/* ---------- dialog (Windows style) ---------- */
export const Dialog: React.FC<{ x: number; y: number; w: number; h: number; title: string; ok?: string; cancel?: string; o?: number; children?: React.ReactNode }> = ({ x, y, w, h, title, ok = "OK", cancel = "Cancel", o = 1, children }) => (
  <div style={{ position: "absolute", left: x, top: y + (1 - o) * 16, width: w, height: h, background: "#F0F0F0", border: "1px solid #6E6E6E", boxShadow: "0 16px 50px rgba(0,0,0,.5)", fontFamily: FUI, color: C.ink, opacity: o, direction: "ltr" }}>
    <div style={{ height: 40, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0 0 14px", fontSize: 19 }}>
      <span>{title}</span><span style={{ width: 52, textAlign: "center", fontSize: 20 }}>✕</span>
    </div>
    <div style={{ position: "absolute", left: 0, top: 40, right: 0, bottom: 62, padding: 18, fontSize: 18 }}>{children}</div>
    <div style={{ position: "absolute", right: 16, bottom: 14, display: "flex", gap: 12 }}>
      <div style={{ minWidth: 100, height: 34, background: "#E1E1E1", border: "2px solid #0078D4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxSizing: "border-box" }}>{ok}</div>
      <div style={{ minWidth: 100, height: 34, background: "#E1E1E1", border: "1px solid #ADADAD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxSizing: "border-box" }}>{cancel}</div>
    </div>
  </div>
);

/* ---------- embedded chart + plot helpers ---------- */
export const ChartBox: React.FC<{ x: number; y: number; w: number; h: number; title?: string; selected?: boolean; o?: number; children?: React.ReactNode }> = ({ x, y, w, h, title, selected, o = 1, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: "#fff", border: selected ? `1.5px solid #8A8A8A` : "1px solid #D9D9D9", boxShadow: "0 2px 8px rgba(0,0,0,.18)", opacity: o, fontFamily: FUI }}>
    {title ? <div style={{ textAlign: "center", fontSize: 24, color: "#595959", marginTop: 10 }}>{title}</div> : null}
    {children}
    {selected ? [[0, 0], [w, 0], [0, h], [w, h], [w / 2, 0], [w / 2, h], [0, h / 2], [w, h / 2]].map(([px, py], i) => <div key={i} style={{ position: "absolute", left: px - 5, top: py - 5, width: 10, height: 10, borderRadius: 5, background: "#fff", border: "1.5px solid #666" }} />) : null}
    {selected ? <div style={{ position: "absolute", left: w + 10, top: 0, display: "flex", flexDirection: "column", gap: 8 }}>{["+", "✎", "▽"].map((t) => <div key={t} style={{ width: 34, height: 34, border: "1px solid #BBB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#555" }}>{t}</div>)}</div> : null}
  </div>
);

export type Sc = (v: number) => number;
export const Plot: React.FC<{ w: number; h: number; xd: [number, number]; yd: [number, number]; tx: number[]; ty: number[]; xt?: string; yt?: string; fmtX?: (v: number) => string; fmtY?: (v: number) => string; pad?: { l: number; r: number; t: number; b: number }; children: (sx: Sc, sy: Sc) => React.ReactNode }> = ({ w, h, xd, yd, tx, ty, xt, yt, fmtX = (v) => String(v), fmtY = (v) => String(v), pad = { l: 70, r: 20, t: 52, b: 62 }, children }) => {
  const sx: Sc = (v) => pad.l + ((v - xd[0]) / (xd[1] - xd[0])) * (w - pad.l - pad.r);
  const sy: Sc = (v) => h - pad.b - ((v - yd[0]) / (yd[1] - yd[0])) * (h - pad.t - pad.b);
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {ty.map((v) => <g key={`y${v}`}><line x1={pad.l} x2={w - pad.r} y1={sy(v)} y2={sy(v)} stroke="#D9D9D9" /><text x={pad.l - 10} y={sy(v) + 6} textAnchor="end" fontSize="17" fill="#595959" fontFamily={FUI}>{fmtY(v)}</text></g>)}
      {tx.map((v) => <text key={`x${v}`} x={sx(v)} y={h - pad.b + 26} textAnchor="middle" fontSize="17" fill="#595959" fontFamily={FUI}>{fmtX(v)}</text>)}
      <line x1={pad.l} x2={w - pad.r} y1={h - pad.b} y2={h - pad.b} stroke="#BFBFBF" />
      {xt ? <text x={(pad.l + w - pad.r) / 2} y={h - 10} textAnchor="middle" fontSize="18" fill="#595959" fontFamily={FUI}>{xt}</text> : null}
      {yt ? <text transform={`translate(18 ${(pad.t + h - pad.b) / 2}) rotate(-90)`} textAnchor="middle" fontSize="18" fill="#595959" fontFamily={FUI}>{yt}</text> : null}
      {children(sx, sy)}
    </svg>
  );
};

export const statsText = (v: number[]) => {
  const s = v.reduce((a, b) => a + b, 0);
  const g = (n: number) => (Math.round(n * 1000) / 1000).toLocaleString("en-US");
  return `Average: ${g(s / v.length)}     Count: ${v.length}     Sum: ${g(s)}`;
};
