// Shared Excel-UI kit (2D SVG only). Written once, reused by every Excel lesson.
import React from "react";
import { staticFile } from "remotion";
import { loadFont as loadAr } from "@remotion/google-fonts/IBMPlexSansArabic";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadCell } from "@remotion/google-fonts/Lato";
import { C, M, Y, W, H, LOGO_FILE } from "./theme";

export const AR = loadAr("normal", { weights: ["400", "500", "600", "700"], ignoreTooManyRequestsWarning: true }).fontFamily;
export const MONO = loadMono("normal", { weights: ["400", "600"], ignoreTooManyRequestsWarning: true }).fontFamily;
// Calibri is licensed: Lato is the open, visually close substitute (Carlito is its metric-compatible Calibri clone).
export const CELLF = loadCell("normal", { weights: ["400", "700"], ignoreTooManyRequestsWarning: true }).fontFamily;

// ---------- helpers ----------
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeIO = (t: number) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const prog = (f: number, a: number, d: number) => clamp((f - a) / d);
export const typed = (s: string, f: number, start: number, cps = 14) => s.slice(0, Math.max(0, Math.floor(((f - start) * cps) / 30)));
export const colL = (i: number) => String.fromCharCode(65 + i);
export const ref = (c: number, r: number) => colL(c) + r;

const DarkCtx = React.createContext(false);
type TP = { x: number; y: number; children?: React.ReactNode; size?: number; w?: number; fill?: string; anchor?: "start" | "middle" | "end"; font?: string; rtl?: boolean; op?: number; ls?: number };
export const T = ({ x, y, children, size = 20, w = 400, fill, anchor = "start", font = AR, rtl = false, op = 1, ls }: TP) => {
  const dark = React.useContext(DarkCtx); fill = fill ?? (dark ? C.xlTxt : C.text);
  return (<text x={x} y={y} fontSize={size} fontWeight={w} fill={fill} textAnchor={rtl ? (anchor === "start" ? "end" : anchor === "end" ? "start" : anchor) : anchor} fontFamily={font} opacity={op} letterSpacing={ls}
    direction={rtl ? "rtl" : "ltr"} style={{ unicodeBidi: "embed" }}>{children}</text>);
};

// ---------- generic glyph icons (no Microsoft artwork) ----------
export const Glyph = ({ k, x, y, s = 36, c = C.xlGreen }: { k: string; x: number; y: number; s?: number; c?: string }) => {
  const u = s / 24;
  const st = { fill: "none", stroke: c, strokeWidth: 1.6 / 1, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let body: React.ReactNode;
  switch (k) {
    case "grid": body = <g {...st}><rect x="3" y="4" width="18" height="16" rx="1.5" /><path d="M3 10h18M3 15h18M9 4v16M15 4v16" /></g>; break;
    case "clip": body = <g {...st}><rect x="5" y="5" width="14" height="16" rx="1.5" /><rect x="9" y="3" width="6" height="4" rx="1" /></g>; break;
    case "funnel": body = <path {...st} d="M3 5h18l-7 8v6l-4-2v-4z" />; break;
    case "az": body = <g><text x="2" y="11" fontSize="9" fontWeight="700" fill={c} fontFamily={AR}>A</text><text x="2" y="21" fontSize="9" fontWeight="700" fill={c} fontFamily={AR}>Z</text><path {...st} d="M16 4v16M12.5 16.5L16 20l3.5-3.5" /></g>; break;
    case "refresh": body = <g {...st}><path d="M19 12a7 7 0 1 1-2.2-5.1" /><path d="M19 4v4h-4" /></g>; break;
    case "whatif": body = <g {...st}><rect x="3" y="4" width="14" height="12" rx="1.5" /><path d="M3 9h14M8 4v12" /><circle cx="17" cy="17" r="5" fill="#fff" /><text x="14.6" y="20.2" fontSize="8" fontWeight="700" fill={c} stroke="none" fontFamily={AR}>?</text></g>; break;
    case "forecast": body = <g {...st}><path d="M3 20V4M3 20h18" /><path d="M6 15l4-4 3 3 6-7" /></g>; break;
    case "calc": body = <g {...st}><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M8 7h8M8 11h2M12 11h2M8 15h2M12 15h2M8 18h2M12 18h2" /></g>; break;
    case "fx": body = <text x="3" y="17" fontSize="14" fontStyle="italic" fontWeight="700" fill={c} fontFamily={CELLF}>fx</text>; break;
    case "sum": body = <text x="5" y="19" fontSize="19" fontWeight="700" fill={c} fontFamily={CELLF}>Σ</text>; break;
    case "cf": body = <g><rect x="3" y="4" width="18" height="16" rx="1.5" fill="none" stroke={c} strokeWidth="1.6" /><rect x="5" y="6" width="6" height="5" fill="#F87171" /><rect x="13" y="6" width="6" height="5" fill="#FBBF24" /><rect x="5" y="13" width="6" height="5" fill="#34D399" /><rect x="13" y="13" width="6" height="5" fill="#F87171" /></g>; break;
    case "plus": body = <path {...st} d="M12 5v14M5 12h14" />; break;
    case "minus": body = <path {...st} d="M5 12h14" />; break;
    case "bold": body = <text x="6" y="18" fontSize="17" fontWeight="700" fill={c} fontFamily={CELLF}>B</text>; break;
    case "ital": body = <text x="8" y="18" fontSize="17" fontStyle="italic" fill={c} fontFamily={CELLF}>I</text>; break;
    case "under": body = <g><text x="6" y="17" fontSize="15" fill={c} fontFamily={CELLF}>U</text><path {...st} d="M5 21h14" /></g>; break;
    case "lines": body = <path {...st} d="M4 6h16M4 11h16M4 16h10M4 21h16" />; break;
    case "pct": body = <text x="3" y="18" fontSize="16" fontWeight="700" fill={c} fontFamily={CELLF}>%</text>; break;
    case "cur": body = <text x="6" y="18" fontSize="16" fontWeight="700" fill={c} fontFamily={CELLF}>$</text>; break;
    case "cut": body = <g {...st}><circle cx="7" cy="17" r="2.5" /><circle cx="17" cy="17" r="2.5" /><path d="M8.5 15L17 4M15.5 15L7 4" /></g>; break;
    case "copy": body = <g {...st}><rect x="8" y="8" width="12" height="13" rx="1.5" /><path d="M16 8V4H4v13h4" /></g>; break;
    case "brush": body = <g {...st}><rect x="4" y="3" width="14" height="6" rx="1" /><path d="M11 9v4M9 13h4v8H9z" /></g>; break;
    case "group": body = <g {...st}><path d="M4 5h16M4 19h16M8 9h8M8 15h8" /></g>; break;
    case "table": body = <g {...st}><rect x="3" y="4" width="18" height="16" rx="1.5" /><path d="M3 9h18M9 9v11" /></g>; break;
    case "db": body = <g {...st}><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v12c0 1.7 3 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3 3 7 3s7-1.3 7-3" /></g>; break;
    case "link": body = <g {...st}><path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1" /></g>; break;
    case "txt": body = <g {...st}><path d="M5 4h9l5 5v11H5z M14 4v5h5M8 13h8M8 17h8" /></g>; break;
    case "star": body = <path {...st} d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />; break;
    default: body = <rect {...st} x="4" y="4" width="16" height="16" rx="2" />;
  }
  return <g transform={`translate(${x} ${y}) scale(${u})`}>{body}</g>;
};

// ---------- Ribbon ----------
type It = { l: string; g: string; dd?: boolean };
type Grp = { n: string; cols?: (It | It[])[]; rows?: (It | { box: string; w: number })[][] };
const L = (l: string, g: string, dd = false): It => ({ l, g, dd });
export const RIBBON: Record<string, Grp[]> = {
  Home: [
    { n: "Clipboard", cols: [L("Paste", "clip", true), [L("Cut", "cut"), L("Copy", "copy"), L("Format Painter", "brush")]] },
    { n: "Font", rows: [[{ box: "Calibri", w: 128 }, { box: "11", w: 46 }, L("", "plus"), L("", "minus")], [L("", "bold"), L("", "ital"), L("", "under"), L("", "grid"), L("", "cf"), L("", "star")]] },
    { n: "Alignment", rows: [[L("", "lines"), L("", "lines"), L("", "lines"), L("Wrap Text", "txt")], [L("", "lines"), L("", "lines"), L("", "lines"), L("Merge & Center", "grid", true)]] },
    { n: "Number", rows: [[{ box: "General", w: 150 }], [L("", "cur"), L("", "pct"), L("", "txt"), L("", "plus"), L("", "minus")]] },
    { n: "Styles", cols: [L("Conditional\nFormatting", "cf", true), L("Format as\nTable", "table", true), L("Cell\nStyles", "star", true)] },
    { n: "Cells", cols: [L("Insert", "plus", true), L("Delete", "minus", true), L("Format", "grid", true)] },
    { n: "Editing", cols: [[L("AutoSum", "sum", true), L("Fill", "az", true), L("Clear", "cut", true)], L("Sort &\nFilter", "az", true), L("Find &\nSelect", "funnel", true)] },
  ],
  Formulas: [
    { n: "Function Library", cols: [L("Insert\nFunction", "fx"), L("AutoSum", "sum", true), L("Recently\nUsed", "star", true), L("Financial", "cur", true), L("Logical", "funnel", true), L("Text", "txt", true), L("Date &\nTime", "grid", true), L("Lookup &\nReference", "link", true), L("Math &\nTrig", "calc", true), L("More\nFunctions", "plus", true)] },
    { n: "Defined Names", cols: [L("Name\nManager", "table"), [L("Define Name", "star", true), L("Use in Formula", "fx", true), L("Create from Selection", "grid")]] },
    { n: "Formula Auditing", cols: [[L("Trace Precedents", "link"), L("Trace Dependents", "link"), L("Remove Arrows", "cut", true)], [L("Show Formulas", "fx"), L("Error Checking", "funnel", true), L("Evaluate Formula", "calc")], L("Watch\nWindow", "table")] },
    { n: "Calculation", cols: [L("Calculation\nOptions", "calc", true), [L("Calculate Now", "calc"), L("Calculate Sheet", "calc")]] },
  ],
  Data: [
    { n: "Get & Transform Data", cols: [L("Get\nData", "db", true), [L("From Text/CSV", "txt"), L("From Web", "link"), L("From Table/Range", "table")], [L("Recent Sources", "db"), L("Existing Connections", "link")]] },
    { n: "Queries & Connections", cols: [L("Refresh\nAll", "refresh", true), [L("Queries & Connections", "link"), L("Properties", "txt"), L("Edit Links", "link")]] },
    { n: "Data Types", cols: [L("Stocks", "forecast"), L("Currencies", "cur")] },
    { n: "Sort & Filter", cols: [[L("", "az"), L("", "az")], L("Sort", "az"), L("Filter", "funnel"), [L("Clear", "cut"), L("Reapply", "refresh"), L("Advanced", "funnel")]] },
    { n: "Data Tools", cols: [[L("Text to Columns", "txt"), L("Flash Fill", "star"), L("Remove Duplicates", "cut")], [L("Data Validation", "funnel", true), L("Consolidate", "table"), L("Relationships", "link")], L("Manage\nData Model", "db")] },
    { n: "Forecast", cols: [L("What-If\nAnalysis", "whatif", true), L("Forecast\nSheet", "forecast")] },
    { n: "Outline", cols: [[L("Group", "group", true), L("Ungroup", "group", true), L("Subtotal", "sum")]] },
  ],
};
const RS = 1.2; // ribbon scale
const lw = (l: string) => Math.max(...l.split("\n").map((s) => s.length)) * 6.9 + 14;
export const TABS = ["File", "Home", "Insert", "Page Layout", "Formulas", "Data", "Review", "View", "Automate", "Help"];
export const tabX = (name: string) => {
  let x = M.winX + 24;
  for (const t of TABS) { const w = t.length * 9.2 + 30; if (t === name) return { x, w }; x += w; }
  return { x, w: 60 };
};
const buildRibbon = (tab: string) => {
  const out: React.ReactNode[] = [];
  const rects: Record<string, { x: number; y: number; w: number; h: number }> = {};
  let x = M.winX + 10;
  const top = Y.ribbon + 8;
  RIBBON[tab].forEach((g, gi) => {
    let gx = x + 6;
    (g.cols || []).forEach((col, ci) => {
      if (Array.isArray(col)) {
        const w = Math.max(...col.map((i) => i.l.length)) * 6.6 + 38;
        col.forEach((it, i) => {
          rects[it.l.replace("\n", " ")] = { x: gx, y: top + i * 30, w: w, h: 28 };
          out.push(<g key={`${gi}-${ci}-${i}`}>
            <Glyph k={it.g} x={gx} y={top + i * 30 + 2} s={22} />
            <T x={gx + 28} y={top + i * 30 + 19} size={13.5} fill={C.xlTxt}>{it.l}{it.dd ? " ▾" : ""}</T></g>);
        });
        gx += w + 4;
      } else {
        const w = Math.max(64, lw(col.l));
        const ls = col.l.split("\n");
        rects[col.l.replace("\n", " ")] = { x: gx, y: top - 2, w, h: 92 };
        out.push(<g key={`${gi}-${ci}`}>
          <Glyph k={col.g} x={gx + w / 2 - 19} y={top} s={38} />
          {ls.map((s, i) => <T key={i} x={gx + w / 2} y={top + 58 + i * 16} size={13.5} anchor="middle" fill={C.xlTxt}>{s}{col.dd && i === ls.length - 1 ? " ▾" : ""}</T>)}
          {col.dd && ls.length === 1 && null}</g>);
        gx += w + 4;
      }
    });
    const gx0 = gx;
    (g.rows || []).forEach((row, ri) => {
      let rx = gx0;
      row.forEach((it, ii) => {
        if ("box" in it) {
          out.push(<g key={`${gi}-r${ri}-${ii}`}><rect x={rx} y={top + ri * 34 + 4} width={it.w} height={26} fill="#fff" stroke={C.xlLine} /><T x={rx + 8} y={top + ri * 34 + 22} size={14} fill={C.xlTxt} font={CELLF}>{it.box}</T><T x={rx + it.w - 16} y={top + ri * 34 + 22} size={10} fill={C.xlTxt2}>▾</T></g>);
          rx += it.w + 6;
        } else {
          const w = it.l ? it.l.length * 7.1 + 40 : 32;
          out.push(<g key={`${gi}-r${ri}-${ii}`}><Glyph k={it.g} x={rx + 4} y={top + ri * 34 + 3} s={26} />{it.l ? <T x={rx + 34} y={top + ri * 34 + 22} size={13.5} fill={C.xlTxt}>{it.l}</T> : null}</g>);
          rx += w;
        }
      });
      gx = Math.max(gx, rx);
    });
    const gw = gx - (x + 6);
    out.push(<g key={`gl-${gi}`}><T x={x + 6 + gw / 2} y={Y.ribbon + M.ribbonH - 8} size={12.5} anchor="middle" fill={C.xlTxt2}>{g.n}</T>
      <line x1={gx + 4} y1={Y.ribbon + 10} x2={gx + 4} y2={Y.ribbon + M.ribbonH - 10} stroke={C.xlLine} /></g>);
    x = gx + 10;
  });
  return { node: <g>{out}</g>, rects };
};
const RB: Record<string, ReturnType<typeof buildRibbon>> = {};
const getRibbon = (tab: string) => (RB[tab] = RB[tab] || buildRibbon(tab));
export const ribbonItemRect = (tab: string, label: string) => getRibbon(tab).rects[label] || { x: 0, y: 0, w: 0, h: 0 };
const RibbonBody = ({ tab }: { tab: string }) => getRibbon(tab).node;

// ---------- Excel chrome (static; memoized) ----------
type ChromeP = { tab: string; file: string; sheets: string; active: number };
export const Chrome = React.memo(({ tab, file, sheets, active }: ChromeP) => {
  const X = M.winX, WW = M.winW;
  const names = sheets.split("|");
  const tx = tabX(tab);
  let sx = X + 92;
  return (
    <g>
      <rect x={X} y={M.winY} width={WW} height={Y.end - M.winY} fill="#fff" stroke="#9CA3AF" />
      {/* title bar */}
      <rect x={X} y={Y.title} width={WW} height={M.titleH} fill={C.xlHdr} />
      <T x={X + 16} y={Y.title + 26} size={14} fill={C.xlTxt}>AutoSave</T>
      <rect x={X + 90} y={Y.title + 11} width={34} height={18} rx={9} fill="none" stroke={C.xlTxt2} strokeWidth={1.4} />
      <circle cx={X + 99} cy={Y.title + 20} r={5} fill={C.xlTxt2} /><T x={X + 130} y={Y.title + 26} size={13} fill={C.xlTxt2}>Off</T>
      <Glyph k="table" x={X + 180} y={Y.title + 9} s={22} c={C.xlTxt2} /><Glyph k="refresh" x={X + 214} y={Y.title + 9} s={22} c={C.xlTxt2} /><T x={X + 244} y={Y.title + 26} size={11} fill={C.xlTxt2}>▾</T>
      <T x={X + 330} y={Y.title + 26} size={15} fill={C.xlTxt} font={CELLF}>{file} – Saved</T>
      <rect x={X + WW / 2 + 60} y={Y.title + 6} width={420} height={28} rx={14} fill="#fff" stroke={C.xlLine} />
      <T x={X + WW / 2 + 98} y={Y.title + 26} size={14} fill={C.xlTxt2}>Search</T>
      <circle cx={X + WW / 2 + 82} cy={Y.title + 19} r={5} fill="none" stroke={C.xlTxt2} strokeWidth={1.4} />
      <T x={X + WW - 140} y={Y.title + 27} size={20} fill={C.xlTxt} anchor="middle">–</T>
      <rect x={X + WW - 96} y={Y.title + 14} width={12} height={12} fill="none" stroke={C.xlTxt} strokeWidth={1.3} />
      <T x={X + WW - 32} y={Y.title + 28} size={20} fill={C.xlTxt} anchor="middle">✕</T>
      {/* tab strip */}
      <rect x={X} y={Y.tabs} width={WW} height={M.tabH} fill={C.xlHdr} />
      {TABS.map((t) => { const p = tabX(t); return <T key={t} x={p.x + p.w / 2} y={Y.tabs + 26} size={16} anchor="middle" fill={t === tab ? C.xlGreenDk : C.xlTxt} w={t === tab ? 600 : 400}>{t}</T>; })}
      <rect x={tx.x + 4} y={Y.tabs + M.tabH - 4} width={tx.w - 8} height={3} rx={1.5} fill={C.xlSel} />
      <T x={X + WW - 220} y={Y.tabs + 26} size={15} fill={C.xlTxt2}>Comments</T><rect x={X + WW - 120} y={Y.tabs + 6} width={96} height={28} rx={4} fill={C.xlSel} /><T x={X + WW - 72} y={Y.tabs + 26} size={15} anchor="middle" fill="#fff" w={600}>Share</T>
      {/* ribbon */}
      <rect x={X} y={Y.ribbon} width={WW} height={M.ribbonH} fill="#FAFAFA" />
      <line x1={X} y1={Y.ribbon} x2={X + WW} y2={Y.ribbon} stroke={C.xlLine} /><line x1={X} y1={Y.ribbon + M.ribbonH} x2={X + WW} y2={Y.ribbon + M.ribbonH} stroke={C.xlLine} />
      <RibbonBody tab={tab} />
      {/* sheet tabs */}
      <rect x={X} y={Y.sheet} width={WW} height={M.sheetH} fill={C.xlHdr} />
      <T x={X + 18} y={Y.sheet + 24} size={14} fill={C.xlTxt2}>◂  ▸</T>
      {names.map((n, i) => { const w = n.length * 9.5 + 34; const el = (
        <g key={n}>{i === active ? <rect x={sx} y={Y.sheet} width={w} height={M.sheetH - 2} fill="#fff" /> : null}
          {i === active ? <rect x={sx} y={Y.sheet + M.sheetH - 5} width={w} height={3} fill={C.xlSel} /> : null}
          <T x={sx + w / 2} y={Y.sheet + 23} size={15} anchor="middle" fill={i === active ? C.xlGreenDk : C.xlTxt} w={i === active ? 700 : 400}>{n}</T></g>); sx += w; return el; })}
      <circle cx={sx + 22} cy={Y.sheet + 17} r={11} fill="none" stroke={C.xlTxt2} /><T x={sx + 22} y={Y.sheet + 23} size={17} anchor="middle" fill={C.xlTxt2}>+</T>
      {/* status bar */}
      <rect x={X} y={Y.status} width={WW} height={M.statusH} fill={C.xlHdr} />
      <line x1={X} y1={Y.status} x2={X + WW} y2={Y.status} stroke={C.xlLine} />
      <T x={X + 16} y={Y.status + 19} size={13.5} fill={C.xlTxt}>Ready</T>
      <T x={X + 100} y={Y.status + 19} size={13.5} fill={C.xlTxt2}>Accessibility: Good to go</T>
      {[0, 1, 2].map((i) => <rect key={i} x={X + WW - 330 + i * 30} y={Y.status + 6} width={22} height={16} fill={i === 0 ? "#D0D0D0" : "none"} stroke={C.xlTxt2} />)}
      <T x={X + WW - 220} y={Y.status + 19} size={13} fill={C.xlTxt2}>–</T><line x1={X + WW - 205} y1={Y.status + 14} x2={X + WW - 105} y2={Y.status + 14} stroke={C.xlTxt2} /><rect x={X + WW - 158} y={Y.status + 8} width={5} height={12} fill={C.xlTxt2} />
      <T x={X + WW - 96} y={Y.status + 19} size={13} fill={C.xlTxt2}>+</T><T x={X + WW - 40} y={Y.status + 19} size={13.5} anchor="middle" fill={C.xlTxt}>100%</T>
    </g>
  );
});

export const StatusStats = ({ s }: { s: string }) => <T x={M.winX + M.winW - 400} y={Y.status + 19} size={13.5} fill={C.xlTxt} anchor="end">{s}</T>;

// ---------- Formula bar ----------
export const FormulaBar = ({ name, text, caret = false, f = 0 }: { name: string; text: string; caret?: boolean; f?: number }) => {
  const X = M.winX, y = Y.fb;
  return (
    <g>
      <rect x={X} y={y} width={M.winW} height={M.fbH} fill="#fff" />
      <rect x={X + 8} y={y + 6} width={150} height={28} fill="#fff" stroke={C.xlLine} />
      <T x={X + 18} y={y + 26} size={16} fill={C.xlTxt} font={CELLF}>{name}</T><T x={X + 143} y={y + 25} size={11} fill={C.xlTxt2} anchor="middle">▾</T>
      <T x={X + 178} y={y + 27} size={17} fill={C.xlTxt2}>✕</T><T x={X + 208} y={y + 27} size={17} fill={C.xlTxt2}>✓</T>
      <T x={X + 238} y={y + 27} size={17} fill={C.xlTxt2} font={CELLF} w={700}>ƒx</T>
      <rect x={X + 276} y={y + 6} width={M.winW - 320} height={28} fill="#fff" stroke={C.xlLine} />
      <T x={X + 286} y={y + 27} size={19} fill={C.xlTxt} font={CELLF}>{text}</T>
      {caret && Math.floor(f / 15) % 2 === 0 ? <rect x={X + 286 + text.length * 9.6} y={y + 10} width={1.6} height={20} fill={C.xlTxt} /> : null}
      <T x={X + M.winW - 24} y={y + 26} size={12} fill={C.xlTxt2} anchor="middle">⌄</T>
    </g>
  );
};

// ---------- Grid ----------
export type Cell = { v: string; a?: "l" | "r" | "c"; b?: boolean; fill?: string; col?: string; i?: boolean; warn?: boolean; err?: boolean; fs?: number };
export type Rng = { c1: number; r1: number; c2: number; r2: number };
type GP = { colW: number[]; cells: Record<string, Cell>; sel?: { c: number; r: number } | null; range?: Rng | null; ants?: Rng | null; handle?: boolean; f?: number; row0?: number; bands?: boolean };
export const gridGeom = (colW: number[]) => { const xs = [M.winX + M.rowHdrW]; colW.forEach((w) => xs.push(xs[xs.length - 1] + w)); return xs; };
export const cellRect = (colW: number[], c: number, r: number) => { const xs = gridGeom(colW); return { x: xs[c], y: Y.grid + (r - 1) * M.rowH, w: colW[c], h: M.rowH }; };
export const Grid = ({ colW, cells, sel, range, ants, handle, f = 0, row0 = 1 }: GP) => {
  const xs = gridGeom(colW);
  const gx0 = M.winX + M.rowHdrW, gx1 = xs[xs.length - 1], gy1 = Y.grid + M.rows * M.rowH;
  const R = range || (sel ? { c1: sel.c, r1: sel.r, c2: sel.c, r2: sel.r } : null);
  const inC = (c: number) => !!R && c >= R.c1 && c <= R.c2;
  const inR = (r: number) => !!R && r >= R.r1 && r <= R.r2;
  const els: React.ReactNode[] = [];
  // background + grid lines
  els.push(<rect key="bg" x={gx0} y={Y.grid} width={gx1 - gx0} height={M.rows * M.rowH} fill="#fff" />);
  for (let r = 0; r <= M.rows; r++) els.push(<line key={`h${r}`} x1={M.winX} y1={Y.grid + r * M.rowH} x2={gx1} y2={Y.grid + r * M.rowH} stroke={C.xlGrid} />);
  xs.forEach((x, i) => els.push(<line key={`v${i}`} x1={x} y1={Y.colHdr} x2={x} y2={gy1} stroke={C.xlGrid} />));
  // cell fills first
  Object.entries(cells).forEach(([k, cl]) => {
    if (!cl.fill) return;
    const m = /^([A-Z])(\d+)$/.exec(k)!; const c = m[1].charCodeAt(0) - 65, r = +m[2] - row0 + 1;
    if (r < 1 || r > M.rows || c >= colW.length) return;
    els.push(<rect key={`f${k}`} x={xs[c] + 0.5} y={Y.grid + (r - 1) * M.rowH + 0.5} width={colW[c] - 1} height={M.rowH - 1} fill={cl.fill} />);
  });
  // headers
  els.push(<rect key="hc" x={M.winX} y={Y.colHdr} width={gx1 - M.winX} height={M.colHdrH} fill={C.xlHdr} />);
  els.push(<rect key="hr" x={M.winX} y={Y.grid} width={M.rowHdrW} height={M.rows * M.rowH} fill={C.xlHdr} />);
  colW.forEach((w, c) => { const s = inC(c); els.push(<g key={`ch${c}`}>{s ? <rect x={xs[c]} y={Y.colHdr} width={w} height={M.colHdrH} fill={C.xlHdrSel} /> : null}
    {s ? <rect x={xs[c]} y={Y.colHdr + M.colHdrH - 3} width={w} height={3} fill={C.xlSel} /> : null}
    <T x={xs[c] + w / 2} y={Y.colHdr + 21} size={17} anchor="middle" fill={s ? C.xlHdrSelTx : C.xlTxt2} font={CELLF} w={s ? 700 : 400}>{colL(c)}</T></g>); });
  for (let r = 0; r < M.rows; r++) { const n = r + row0, s = inR(n); els.push(<g key={`rh${r}`}>{s ? <rect x={M.winX} y={Y.grid + r * M.rowH} width={M.rowHdrW} height={M.rowH} fill={C.xlHdrSel} /> : null}
    {s ? <rect x={M.winX + M.rowHdrW - 3} y={Y.grid + r * M.rowH} width={3} height={M.rowH} fill={C.xlSel} /> : null}
    <T x={M.winX + M.rowHdrW / 2} y={Y.grid + r * M.rowH + 21} size={17} anchor="middle" fill={s ? C.xlHdrSelTx : C.xlTxt2} font={CELLF} w={s ? 700 : 400}>{n}</T></g>); }
  els.push(<path key="corner" d={`M${M.winX + M.rowHdrW - 8} ${Y.colHdr + M.colHdrH - 4}l0 -14l-14 14z`} fill="#B8B8B8" />);
  els.push(<line key="hl1" x1={M.winX} y1={Y.colHdr} x2={gx1} y2={Y.colHdr} stroke={C.xlLine} />, <line key="hl2" x1={M.winX} y1={Y.grid} x2={gx1} y2={Y.grid} stroke={C.xlLine} />);
  const lastRow = row0 + M.rows - 1;
  // range tint
  if (range) {
    const a = cellRect(colW, range.c1, range.r1 - row0 + 1), b = cellRect(colW, range.c2, Math.min(range.r2, lastRow) - row0 + 1);
    els.push(<rect key="rt" x={a.x} y={a.y} width={b.x + b.w - a.x} height={b.y + b.h - a.y} fill={C.xlSelFill} />);
    if (sel) { const s = cellRect(colW, sel.c, sel.r - row0 + 1); els.push(<rect key="rtw" x={s.x + 1} y={s.y + 1} width={s.w - 2} height={s.h - 2} fill="#fff" />); }
  }
  // text
  Object.entries(cells).forEach(([k, cl]) => {
    const m = /^([A-Z])(\d+)$/.exec(k)!; const c = m[1].charCodeAt(0) - 65, r = +m[2] - row0 + 1;
    if (r < 1 || r > M.rows || c >= colW.length || !cl.v) return;
    const num = /^[-+]?[\d,.]+%?$/.test(cl.v) || /^-?\d/.test(cl.v) && /\d$/.test(cl.v);
    const al = cl.a || (cl.err ? "c" : num ? "r" : "l");
    const x = al === "r" ? xs[c] + colW[c] - 7 : al === "c" ? xs[c] + colW[c] / 2 : xs[c] + 7;
    const rg = range && c >= range.c1 && c <= range.c2 && r + row0 - 1 >= range.r1 && r + row0 - 1 <= range.r2;
    void rg;
    els.push(<T key={`t${k}`} x={x} y={Y.grid + (r - 1) * M.rowH + 21} size={cl.fs || 21} anchor={al === "r" ? "end" : al === "c" ? "middle" : "start"} fill={cl.col || C.xlTxt} font={CELLF} w={cl.b ? 700 : 400}>{cl.v}</T>);
    if (cl.warn) els.push(<path key={`w${k}`} d={`M${xs[c] + 1} ${Y.grid + (r - 1) * M.rowH + 1}l9 0l-9 9z`} fill="#1E9E4B" />);
  });
  // ants
  if (ants) {
    const a = cellRect(colW, ants.c1, ants.r1 - row0 + 1), b = cellRect(colW, ants.c2, Math.min(ants.r2, lastRow) - row0 + 1);
    els.push(<rect key="ants" x={a.x} y={a.y} width={b.x + b.w - a.x} height={b.y + b.h - a.y} fill="none" stroke={C.xlTxt} strokeWidth={2} strokeDasharray="6 4" strokeDashoffset={-(f * 0.8) % 10} />);
  }
  // selection border + handle
  if (R) {
    const a = cellRect(colW, R.c1, R.r1 - row0 + 1), b = cellRect(colW, R.c2, Math.min(R.r2, lastRow) - row0 + 1);
    const bx = a.x, by = a.y, bw = b.x + b.w - a.x, bh = b.y + b.h - a.y;
    els.push(<rect key="sb" x={bx} y={by} width={bw} height={bh} fill="none" stroke={C.xlSel} strokeWidth={2.4} />);
    if (handle !== false) els.push(<rect key="fh" x={bx + bw - 5} y={by + bh - 5} width={9} height={9} fill={C.xlSel} stroke="#fff" strokeWidth={1.5} />);
  }
  return <g>{els}</g>;
};

// ---------- Windows-style dialogs ----------
export const Dialog = ({ x, y, w, h, title, children, op = 1 }: { x: number; y: number; w: number; h: number; title: string; children?: React.ReactNode; op?: number }) => (
  <g opacity={op}>
    <rect x={x + 6} y={y + 8} width={w} height={h} fill="#000" opacity={0.28} />
    <rect x={x} y={y} width={w} height={h} fill={C.dlg} stroke="#7A7A7A" />
    <rect x={x} y={y} width={w} height={38} fill="#fff" />
    <T x={x + 14} y={y + 26} size={17} fill={C.xlTxt}>{title}</T>
    <T x={x + w - 22} y={y + 27} size={19} fill={C.xlTxt} anchor="middle">✕</T>
    <DarkCtx.Provider value={true}>{children}</DarkCtx.Provider>
  </g>
);
export const Btn = ({ x, y, w, h = 34, label, def, down }: { x: number; y: number; w: number; h?: number; label: string; def?: boolean; down?: boolean }) => (
  <g><rect x={x} y={y} width={w} height={h} rx={3} fill={down ? "#D6D6D6" : "#FDFDFD"} stroke={def ? "#0F6CBD" : "#8A8A8A"} strokeWidth={def ? 2 : 1} />
    <T x={x + w / 2} y={y + h / 2 + 6} size={16} anchor="middle" fill={C.xlTxt}>{label}</T></g>
);
export const Field = ({ x, y, w, label, text, focus, f = 0, pick = true }: { x: number; y: number; w: number; label: string; text: string; focus?: boolean; f?: number; pick?: boolean }) => (
  <g><T x={x} y={y} size={16} fill={C.xlTxt}>{label}</T>
    <rect x={x} y={y + 8} width={w} height={32} fill="#fff" stroke={focus ? "#0F6CBD" : "#7A7A7A"} strokeWidth={focus ? 2 : 1} />
    <T x={x + 8} y={y + 31} size={18} fill={C.xlTxt} font={CELLF}>{text}</T>
    {focus && Math.floor(f / 15) % 2 === 0 ? <rect x={x + 10 + text.length * 9.4} y={y + 14} width={1.6} height={20} fill={C.xlTxt} /> : null}
    {pick ? <rect x={x + w - 28} y={y + 12} width={20} height={24} fill="#F3F3F3" stroke="#B0B0B0" /> : null}</g>
);
export const ListBox = ({ x, y, w, h, items, sel }: { x: number; y: number; w: number; h: number; items: string[]; sel?: number }) => (
  <g><rect x={x} y={y} width={w} height={h} fill="#fff" stroke="#7A7A7A" />
    {items.map((s, i) => <g key={s + i}>{i === sel ? <rect x={x + 2} y={y + 2 + i * 28} width={w - 4} height={28} fill="#0F6CBD" /> : null}<T x={x + 10} y={y + 22 + i * 28} size={17} fill={i === sel ? "#fff" : C.xlTxt} font={CELLF}>{s}</T></g>)}</g>
);
export const Radio = ({ x, y, label, on }: { x: number; y: number; label: string; on?: boolean }) => (
  <g><circle cx={x + 9} cy={y - 5} r={9} fill="#fff" stroke="#6B6B6B" strokeWidth={1.4} />{on ? <circle cx={x + 9} cy={y - 5} r={5} fill="#0F6CBD" /> : null}<T x={x + 28} y={y} size={17} fill={C.xlTxt}>{label}</T></g>
);
export const Check = ({ x, y, label, on }: { x: number; y: number; label: string; on?: boolean }) => (
  <g><rect x={x} y={y - 16} width={18} height={18} rx={2} fill={on ? "#0F6CBD" : "#fff"} stroke="#6B6B6B" strokeWidth={1.4} />{on ? <path d={`M${x + 4} ${y - 7}l4 4 7 -9`} stroke="#fff" strokeWidth={2.2} fill="none" /> : null}<T x={x + 28} y={y} size={17} fill={C.xlTxt}>{label}</T></g>
);
export const MenuList = ({ x, y, w, items, hi, op = 1 }: { x: number; y: number; w: number; items: string[]; hi?: number; op?: number }) => (
  <g opacity={op}><rect x={x + 4} y={y + 5} width={w} height={items.length * 36 + 12} fill="#000" opacity={0.2} /><rect x={x} y={y} width={w} height={items.length * 36 + 12} fill="#fff" stroke="#B4B4B4" />
    {items.map((s, i) => <g key={s}>{i === hi ? <rect x={x + 3} y={y + 6 + i * 36} width={w - 6} height={34} fill="#E4F2EA" stroke={C.xlSel} /> : null}<T x={x + 40} y={y + 29 + i * 36} size={17} fill={C.xlTxt}>{s}</T></g>)}</g>
);

// ---------- pointer, glow, tags ----------
export const Pointer = ({ pts, f }: { pts: [number, number, number][]; f: number }) => {
  let x = pts[0][1], y = pts[0][2];
  for (let i = 1; i < pts.length; i++) {
    const [f0, x0, y0] = pts[i - 1], [f1, x1, y1] = pts[i];
    if (f >= f1) { x = x1; y = y1; } else if (f > f0) { const t = easeIO((f - f0) / (f1 - f0)); x = lerp(x0, x1, t); y = lerp(y0, y1, t); break; } else break;
  }
  return <path transform={`translate(${x} ${y})`} d="M0 0L0 24L6 19L10 28L14.5 26L10.5 17.5L18 17.5Z" fill="#fff" stroke="#111" strokeWidth={1.6} />;
};
export const Click = ({ x, y, f, at }: { x: number; y: number; f: number; at: number }) => {
  const t = prog(f, at, 14); if (t <= 0 || t >= 1) return null;
  return <circle cx={x} cy={y} r={8 + 26 * t} fill="none" stroke={C.blue} strokeWidth={3} opacity={1 - t} />;
};
// Neon region: stacked strokes (no blur/filter -> fast render).
export const Neon = ({ x, y, w, h, c = C.blue, op = 1, f = 0, rx = 8 }: { x: number; y: number; w: number; h: number; c?: string; op?: number; f?: number; rx?: number }) => {
  const p = 0.75 + 0.25 * Math.sin(f / 9);
  return <g opacity={op}>{[[16, 0.07], [10, 0.12], [5, 0.25]].map(([s, a], i) => <rect key={i} x={x - s / 2} y={y - s / 2} width={w + s} height={h + s} rx={rx + s / 2} fill="none" stroke={c} strokeWidth={s} opacity={a * p} />)}
    <rect x={x} y={y} width={w} height={h} rx={rx} fill="none" stroke={c} strokeWidth={2.5} /></g>;
};
export const Arrow = ({ x1, y1, x2, y2, c = C.blue, op = 1 }: { x1: number; y1: number; x2: number; y2: number; c?: string; op?: number }) => {
  const a = Math.atan2(y2 - y1, x2 - x1), s = 14;
  return <g opacity={op}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={4} strokeLinecap="round" />
    <path d={`M${x2} ${y2}L${x2 - s * Math.cos(a - 0.45)} ${y2 - s * Math.sin(a - 0.45)}L${x2 - s * Math.cos(a + 0.45)} ${y2 - s * Math.sin(a + 0.45)}Z`} fill={c} /></g>;
};
export const Tag = ({ f, a, b, c, title, sub, rtl = false }: { f: number; a: number; b: number; c: string; title: string; sub?: string; rtl?: boolean }) => {
  const o = Math.min(prog(f, a, 14), 1 - prog(f, b - 12, 12)); if (o <= 0) return null;
  const w = 1500, x = (W - w) / 2, y = 930 + (1 - easeOut(prog(f, a, 14))) * 14;
  return <g opacity={o}>
    <rect x={x} y={y} width={w} height={104} rx={14} fill={C.panel} stroke={c} strokeWidth={3} />
    <rect x={x} y={y} width={10} height={104} rx={5} fill={c} />
    <T x={W / 2} y={y + 44} size={34} anchor="middle" w={700} fill={C.text} rtl={rtl}>{title}</T>
    {sub ? <T x={W / 2} y={y + 84} size={26} anchor="middle" fill={c} font={MONO} w={600}>{sub}</T> : null}
  </g>;
};
export const Pill = ({ x, y, w, h = 38, c, label, op = 1, size = 20 }: { x: number; y: number; w: number; h?: number; c: string; label: string; op?: number; size?: number }) => (
  <g opacity={op}><rect x={x} y={y} width={w} height={h} rx={h / 2} fill={C.panel} stroke={c} strokeWidth={2.4} /><T x={x + w / 2} y={y + h / 2 + size * 0.35} size={size} anchor="middle" w={600} fill={c}>{label}</T></g>
);

// ---------- stage + top bar ----------
export const Bg = () => <rect x={0} y={0} width={W} height={H} fill={C.bg} />;
export const TopBar = () => (
  <g>
    <image href={staticFile(LOGO_FILE)} x={-10} y={-44} width={176} height={176} />
    <T x={150} y={40} size={26} w={700}>Manzooma Excel Masterclass</T>
    <T x={150} y={68} size={17} fill={C.mute}>Excel From Zero to Professional</T>
    <rect x={W - 1064} y={14} width={1030} height={58} rx={29} fill={C.panel} stroke={C.blue} strokeWidth={2} />
    <T x={W - 549} y={52} size={24} anchor="middle" w={600} rtl>الدرس 66 من 76 • الوحدة 13 من 14 • تحليل السيناريوهات والحساسية</T>
  </g>
);
