// Shared Excel-UI kit (Microsoft 365 desktop, Windows, light theme). Reused by every lesson.
// All coordinates are LOGICAL px (1536 x 806.4 window); the stage scales them by S.
import React from "react";
import { Easing, interpolate } from "remotion";
import { loadFont as loadLato } from "@remotion/google-fonts/Lato";
import { loadFont as loadOpen } from "@remotion/google-fonts/OpenSans";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansArabic";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { C, GRID_TOP, HEIGHT, M, NSLOT, S, STRIP_H, WIDTH, WIN_H, WIN_W } from "./theme";

const lato = loadLato("normal", { weights: ["400", "700"], subsets: ["latin"] });
const open = loadOpen("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
const plex = loadPlex("normal", { weights: ["400", "500", "600", "700"], subsets: ["arabic", "latin"] });
const mono = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] });
export const F = {
  cell: `${lato.fontFamily}, Carlito, Calibri, sans-serif`, // Calibri substitute (open licence)
  ui: `${open.fontFamily}, "Segoe UI", sans-serif`,
  ar: `${plex.fontFamily}, ${open.fontFamily}, sans-serif`,
  mono: `${mono.fontFamily}, monospace`,
};

// ---------- motion helpers ----------
export const ease = Easing.bezier(0.4, 0, 0.2, 1);
export const prog = (f: number, from: number, dur: number): number =>
  interpolate(f, [from, from + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const typed = (s: string, f: number, from: number, perFrame = 0.5): string =>
  s.slice(0, Math.max(0, Math.min(s.length, Math.floor((f - from) * perFrame))));
export type KF = { f: number; x: number; y: number };
export const path = (f: number, k: KF[]): { x: number; y: number } => {
  if (f <= k[0].f) return { x: k[0].x, y: k[0].y };
  for (let i = 1; i < k.length; i++) {
    if (f <= k[i].f) {
      const t = prog(f, k[i - 1].f, k[i].f - k[i - 1].f);
      return { x: lerp(k[i - 1].x, k[i].x, t), y: lerp(k[i - 1].y, k[i].y, t) };
    }
  }
  const l = k[k.length - 1];
  return { x: l.x, y: l.y };
};
// Row slots after collapsing: vis[i] in 0..1  ->  slot position of each row.
export const stack = (vis: number[], start = 0): number[] => {
  let s = start;
  return vis.map((v) => { const r = s; s += v; return r; });
};

// ---------- grid geometry ----------
export type Col = { w: number; label: string };
export const colLabel = (i: number): string => (i < 26 ? String.fromCharCode(65 + i) : String.fromCharCode(64 + Math.floor(i / 26)) + String.fromCharCode(65 + (i % 26)));
export const buildCols = (widths: number[]): Col[] => {
  const cols: Col[] = widths.map((w, i) => ({ w, label: colLabel(i) }));
  let x = widths.reduce((a, b) => a + b, 0);
  let i = widths.length;
  while (x < WIN_W - M.rowHdr) { cols.push({ w: M.colW, label: colLabel(i) }); x += M.colW; i++; }
  return cols;
};
export const colX = (cols: Col[], c: number): number => M.rowHdr + cols.slice(0, c).reduce((a, k) => a + k.w, 0);
export const cellX = colX;
export const slotY = (slot: number): number => GRID_TOP + slot * M.rowH;
export const cellCenter = (cols: Col[], c: number, slot: number): { x: number; y: number } => ({
  x: colX(cols, c) + cols[c].w / 2, y: slotY(slot) + M.rowH / 2,
});

// ---------- icons (generic, no trademarks) ----------
export type IconKind = string;
export const Icon: React.FC<{ k: IconKind; s?: number; c?: string }> = ({ k, s = 16, c = "#444" }) => {
  const g = C.xGreen, b = "#2B7CD3", o = "#D83B01";
  const sw = { fill: "none", stroke: c, strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let body: React.ReactNode;
  switch (k) {
    case "paste": body = <g><rect x="3" y="3" width="10" height="11" rx="1" {...sw} /><rect x="6" y="1.5" width="4" height="3" rx="1" fill="#fff" stroke={c} strokeWidth="1.2" /><rect x="7" y="7" width="8" height="8" fill="#fff" stroke={b} strokeWidth="1.2" /></g>; break;
    case "cut": body = <g><circle cx="5" cy="12" r="2" {...sw} /><circle cx="11" cy="12" r="2" {...sw} /><path d="M6 10 L11 2 M10 10 L5 2" {...sw} /></g>; break;
    case "copy": body = <g><rect x="2.5" y="2.5" width="8" height="9" {...sw} /><rect x="6" y="5.5" width="8" height="9" fill="#fff" stroke={c} strokeWidth="1.2" /></g>; break;
    case "brush": body = <g><rect x="3" y="2" width="9" height="4" fill={o} stroke="none" /><path d="M7.5 6 V10 M5.5 10 H9.5 V14 H5.5 Z" {...sw} /></g>; break;
    case "sortaz": body = <g><text x="1" y="7" fontSize="6.5" fontWeight="700" fill={c} fontFamily="Arial">A</text><text x="1" y="14" fontSize="6.5" fontWeight="700" fill={c} fontFamily="Arial">Z</text><path d="M11 3 V13 M8.5 10.5 L11 13.5 L13.5 10.5" {...sw} stroke={b} /></g>; break;
    case "sortza": body = <g><text x="1" y="7" fontSize="6.5" fontWeight="700" fill={c} fontFamily="Arial">Z</text><text x="1" y="14" fontSize="6.5" fontWeight="700" fill={c} fontFamily="Arial">A</text><path d="M11 3 V13 M8.5 10.5 L11 13.5 L13.5 10.5" {...sw} stroke={b} /></g>; break;
    case "sort": body = <g><text x="0.5" y="6.5" fontSize="6" fontWeight="700" fill={c} fontFamily="Arial">A</text><text x="0.5" y="13.5" fontSize="6" fontWeight="700" fill={c} fontFamily="Arial">Z</text><rect x="8" y="3" width="7" height="2" fill={b} /><rect x="8" y="7" width="5" height="2" fill={b} /><rect x="8" y="11" width="3" height="2" fill={b} /></g>; break;
    case "filter": body = <g><path d="M2 3 H14 L9.2 8.6 V13 L6.8 11.6 V8.6 Z" fill="#fff" stroke={b} strokeWidth="1.3" strokeLinejoin="round" /></g>; break;
    case "filteron": body = <g><path d="M2 3 H14 L9.2 8.6 V13 L6.8 11.6 V8.6 Z" fill={b} stroke={b} strokeWidth="1.3" strokeLinejoin="round" /></g>; break;
    case "clearf": body = <g><path d="M2 3 H11 L7.5 7.6 V12 L5.5 10.8 V7.6 Z" fill="#fff" stroke={b} strokeWidth="1.2" strokeLinejoin="round" /><path d="M10 9 L14 13 M14 9 L10 13" {...sw} stroke={o} /></g>; break;
    case "reapply": body = <g><path d="M2 3 H11 L7.5 7.6 V12 L5.5 10.8 V7.6 Z" fill="#fff" stroke={b} strokeWidth="1.2" strokeLinejoin="round" /><path d="M10 11 A2.6 2.6 0 1 0 12 8.6 M12 7 V9 H10" {...sw} stroke={g} /></g>; break;
    case "adv": body = <g><path d="M2 3 H12 L8 7.6 V12 L6 10.8 V7.6 Z" fill="#fff" stroke={b} strokeWidth="1.2" strokeLinejoin="round" /><path d="M11 10 H15 M13 8 V12" {...sw} stroke={g} /></g>; break;
    case "find": body = <g><circle cx="6.5" cy="6.5" r="4" {...sw} /><path d="M9.6 9.6 L14 14" {...sw} strokeWidth={1.8} /><path d="M3 15 H6" {...sw} stroke={b} /></g>; break;
    case "sum": body = <path d="M12 3 H4 L8 8 L4 13 H12" {...sw} stroke={o} strokeWidth="1.8" />; break;
    case "fill": body = <g><rect x="2" y="2" width="12" height="12" {...sw} /><path d="M8 4 V12 M5.5 9.5 L8 12.5 L10.5 9.5" {...sw} stroke={g} /></g>; break;
    case "eraser": body = <g><path d="M3 11 L9 3 L14 7 L9 14 H5 Z" fill="#fff" stroke={c} strokeWidth="1.2" /><path d="M6 10 L11 6" {...sw} /></g>; break;
    case "cond": body = <g><rect x="2" y="2" width="12" height="12" {...sw} /><rect x="3.5" y="3.5" width="4" height="3" fill={o} /><rect x="3.5" y="8" width="4" height="3" fill={g} /><rect x="9" y="5" width="4" height="3" fill={b} /></g>; break;
    case "table": body = <g><rect x="2" y="2" width="12" height="12" {...sw} /><rect x="2" y="2" width="12" height="3" fill={b} /><path d="M2 8 H14 M8 5 V14" {...sw} /></g>; break;
    case "styles": body = <g><rect x="2" y="3" width="12" height="10" rx="1" {...sw} /><rect x="4" y="5" width="8" height="2" fill={g} /><rect x="4" y="9" width="5" height="2" fill={b} /></g>; break;
    case "insert": body = <g><rect x="2" y="3" width="9" height="9" {...sw} /><path d="M12 10 V15 M9.5 12.5 H14.5" {...sw} stroke={g} strokeWidth="1.8" /></g>; break;
    case "delete": body = <g><rect x="2" y="3" width="9" height="9" {...sw} /><path d="M10 11 L15 15 M15 11 L10 15" {...sw} stroke={o} strokeWidth="1.6" /></g>; break;
    case "format": body = <g><rect x="2" y="2" width="12" height="12" {...sw} /><path d="M2 6 H14 M6 6 V14" {...sw} /><circle cx="11" cy="11" r="1.6" fill={g} /></g>; break;
    case "analyze": body = <g><rect x="2" y="9" width="3" height="5" fill={b} /><rect x="6.5" y="5" width="3" height="9" fill={g} /><rect x="11" y="2" width="3" height="12" fill={o} /></g>; break;
    case "get": body = <g><rect x="2" y="3" width="9" height="10" rx="1" {...sw} /><path d="M2 6 H11" {...sw} /><path d="M12 6 V13 M9.8 11 L12 13.4 L14.2 11" {...sw} stroke={g} /></g>; break;
    case "refresh": body = <g><path d="M13 8 A5 5 0 1 1 11 4 M11.5 1.5 V4.5 H8.5" {...sw} stroke={g} strokeWidth="1.6" /></g>; break;
    case "csv": body = <g><rect x="3" y="1.5" width="10" height="13" rx="1" {...sw} /><path d="M5 6 H11 M5 9 H11 M5 12 H9" {...sw} /></g>; break;
    case "web": body = <g><circle cx="8" cy="8" r="6" {...sw} /><ellipse cx="8" cy="8" rx="2.6" ry="6" {...sw} /><path d="M2 8 H14" {...sw} /></g>; break;
    case "text2col": body = <g><rect x="2" y="3" width="12" height="10" {...sw} /><path d="M8 3 V13" {...sw} stroke={b} /><path d="M4 6.5 H6.5 M4 9.5 H6.5 M9.5 6.5 H12 M9.5 9.5 H12" {...sw} /></g>; break;
    case "flash": body = <path d="M9 1.5 L3.5 9 H7.5 L6.5 14.5 L12.5 7 H8.5 Z" fill={o} stroke="none" />; break;
    case "dedupe": body = <g><rect x="2" y="2" width="10" height="9" {...sw} /><path d="M4 5 H10 M4 8 H10" {...sw} /><path d="M10 11 L15 15 M15 11 L10 15" {...sw} stroke={o} /></g>; break;
    case "valid": body = <g><rect x="2" y="3" width="11" height="9" {...sw} /><path d="M5 8 L7 10 L11 5.5" {...sw} stroke={g} strokeWidth="1.6" /></g>; break;
    case "whatif": body = <g><rect x="2" y="2" width="12" height="12" {...sw} /><path d="M6 6 Q8 3.5 10 6 Q10 8 8 9 M8 11 V11.6" {...sw} stroke={b} /></g>; break;
    case "group": body = <g><path d="M3 3 V13 M3 4 H7 M3 12 H7" {...sw} /><rect x="8" y="2.5" width="6" height="3" {...sw} /><rect x="8" y="10.5" width="6" height="3" {...sw} /></g>; break;
    case "align": body = <g><path d="M2 4 H14 M2 7 H10 M2 10 H14 M2 13 H10" {...sw} /></g>; break;
    case "aligncenter": body = <g><path d="M2 4 H14 M4 7 H12 M2 10 H14 M4 13 H12" {...sw} /></g>; break;
    case "alignright": body = <g><path d="M2 4 H14 M6 7 H14 M2 10 H14 M6 13 H14" {...sw} /></g>; break;
    case "wrap": body = <g><path d="M2 4 H14 M2 8 H11 Q14 8 14 10.5 Q14 13 11 13 H8 M9.5 11.5 L8 13 L9.5 14.5" {...sw} /></g>; break;
    case "merge": body = <g><rect x="2" y="3" width="12" height="10" {...sw} /><path d="M5 8 H11 M5 8 L7 6.5 M5 8 L7 9.5 M11 8 L9 6.5 M11 8 L9 9.5" {...sw} stroke={b} /></g>; break;
    case "borders": body = <g><rect x="2.5" y="2.5" width="11" height="11" {...sw} strokeDasharray="1.5 1.5" /><path d="M2.5 13.5 H13.5" {...sw} strokeWidth="1.8" /></g>; break;
    case "fillc": body = <g><path d="M4 8 L8 3 L12 8 L8 12 Z" fill="#fff" stroke={c} strokeWidth="1.2" /><rect x="2" y="13" width="12" height="2.2" fill="#FFD400" /></g>; break;
    case "fontc": body = <g><text x="4.5" y="11" fontSize="10" fontWeight="700" fill={c} fontFamily="Arial">A</text><rect x="2" y="13" width="12" height="2.2" fill="#E81123" /></g>; break;
    case "dollar": body = <text x="4" y="12.5" fontSize="11" fontWeight="700" fill={g} fontFamily="Arial">$</text>; break;
    case "percent": body = <text x="2.5" y="12" fontSize="11" fontWeight="700" fill={c} fontFamily="Arial">%</text>; break;
    case "comma": body = <text x="5" y="13" fontSize="13" fontWeight="700" fill={c} fontFamily="Arial">,</text>; break;
    case "dec": body = <text x="0.5" y="11.5" fontSize="8" fontWeight="700" fill={c} fontFamily="Arial">.00</text>; break;
    case "chev": body = <path d="M4 6 L8 10 L12 6" {...sw} />; break;
    case "search": body = <g><circle cx="7" cy="7" r="4" {...sw} /><path d="M10 10 L14 14" {...sw} /></g>; break;
    case "save": body = <g><path d="M2.5 2.5 H11.5 L13.5 4.5 V13.5 H2.5 Z" {...sw} /><rect x="5" y="2.5" width="5" height="3.5" {...sw} /><rect x="4.5" y="9" width="7" height="4.5" {...sw} /></g>; break;
    case "undo": body = <path d="M5 4 L2 7 L5 10 M2 7 H10 A3.5 3.5 0 0 1 10 14 H7" {...sw} />; break;
    case "redo": body = <path d="M11 4 L14 7 L11 10 M14 7 H6 A3.5 3.5 0 0 0 6 14 H9" {...sw} />; break;
    case "grid": body = <g><rect x="2" y="2" width="12" height="12" rx="1" fill={g} stroke="none" /><path d="M2 6 H14 M2 10 H14 M6 2 V14 M10 2 V14" stroke="#fff" strokeWidth="1" /></g>; break;
    case "comment": body = <path d="M2.5 3 H13.5 V10.5 H8 L5 13.5 V10.5 H2.5 Z" {...sw} />; break;
    case "share": body = <g><path d="M8 10 V2.5 M5 5 L8 2 L11 5" {...sw} stroke="#fff" /><path d="M3 8 V13.5 H13 V8" {...sw} stroke="#fff" /></g>; break;
    case "model": body = <g><rect x="1.5" y="2" width="5" height="4" {...sw} /><rect x="9.5" y="2" width="5" height="4" {...sw} /><rect x="5.5" y="10" width="5" height="4" {...sw} /><path d="M6.5 4 H9.5 M8 6 V10" {...sw} stroke={g} strokeWidth="1.6" /></g>; break;
    case "db": body = <g><ellipse cx="8" cy="4" rx="5" ry="2" {...sw} /><path d="M3 4 V12 A5 2 0 0 0 13 12 V4 M3 8 A5 2 0 0 0 13 8" {...sw} /></g>; break;
    case "kpi": body = <g><path d="M2 12 A6 6 0 0 1 14 12" {...sw} /><path d="M8 12 L11 7" {...sw} stroke={o} strokeWidth="1.6" /></g>; break;
    case "adddm": body = <g><rect x="2" y="2" width="9" height="9" {...sw} /><path d="M2 5 H11 M6 5 V11" {...sw} /><path d="M12 10 V15 M9.5 12.5 H14.5" {...sw} stroke={g} strokeWidth="1.8" /></g>; break;
    case "paste2": body = <g><rect x="3" y="3" width="10" height="11" rx="1" {...sw} /><path d="M6 8 H10 M6 11 H10" {...sw} /></g>; break;
    default: body = <g><rect x="2" y="2" width="12" height="12" rx="2" {...sw} /><path d="M5 6 H11 M5 9 H11" {...sw} /></g>;
  }
  return <svg width={s} height={s} viewBox="0 0 16 16" style={{ display: "block", flex: "none" }}>{body}</svg>;
};

// Icon-set arrows (3 Arrows, coloured) used in cells and in the filter menu.
export const Arrow: React.FC<{ kind: "up" | "side" | "down"; s?: number }> = ({ kind, s = 13 }) => {
  const col = kind === "up" ? "#00B050" : kind === "down" ? "#E0301E" : "#FFC000";
  const rot = kind === "up" ? 0 : kind === "side" ? 90 : 180;
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" style={{ display: "block", flex: "none" }}>
      <g transform={`rotate(${rot} 8 8)`}><path d="M8 1.5 L14.5 9 H10.5 V14.5 H5.5 V9 H1.5 Z" fill={col} /></g>
    </svg>
  );
};

// ---------- ribbon ----------
type RItem = { id: string; label: string; icon: string; dd?: boolean };
type RCol = { kind: "L" | "S"; items: RItem[] };
type RGroup = { id: string; label: string; cols: RCol[]; custom?: "font" | "align" | "number" };
const L = (id: string, label: string, icon: string, dd = false): RCol => ({ kind: "L", items: [{ id, label, icon, dd }] });
const Sx = (...items: [string, string, string, boolean?][]): RCol => ({ kind: "S", items: items.map(([id, label, icon, dd]) => ({ id, label, icon, dd: !!dd })) });
export const RIBBON: Record<string, RGroup[]> = {
  home: [
    { id: "clipboard", label: "Clipboard", cols: [L("paste", "Paste", "paste", true), Sx(["cut", "Cut", "cut"], ["copy", "Copy", "copy", true], ["fp", "Format Painter", "brush"])] },
    { id: "font", label: "Font", cols: [], custom: "font" },
    { id: "alignment", label: "Alignment", cols: [], custom: "align" },
    { id: "number", label: "Number", cols: [], custom: "number" },
    { id: "styles", label: "Styles", cols: [L("cf", "Conditional\nFormatting", "cond", true), L("fat", "Format as\nTable", "table", true), L("cs", "Cell\nStyles", "styles", true)] },
    { id: "cells", label: "Cells", cols: [L("ins", "Insert", "insert", true), L("del", "Delete", "delete", true), L("fmt", "Format", "format", true)] },
    { id: "editing", label: "Editing", cols: [Sx(["autosum", "AutoSum", "sum", true], ["fillb", "Fill", "fill", true], ["clearb", "Clear", "eraser", true]), L("sortfilter", "Sort &\nFilter", "sort", true), L("findsel", "Find &\nSelect", "find", true)] },
    { id: "analysis", label: "Analysis", cols: [L("analyze", "Analyze\nData", "analyze")] },
  ],
  formulas: [
    { id: "funclib", label: "Function Library", cols: [L("insfn", "Insert\nFunction", "sum"), L("autosum2", "AutoSum", "sum", true), L("recent", "Recently\nUsed", "generic", true), L("fin", "Financial", "dollar", true), L("logical", "Logical", "valid", true), L("text", "Text", "align", true), L("datetime", "Date &\nTime", "table", true), L("lookup", "Lookup &\nReference", "find", true), L("math", "Math &\nTrig", "analyze", true), L("morefn", "More\nFunctions", "generic", true)] },
    { id: "names", label: "Defined Names", cols: [L("namemgr", "Name\nManager", "table"), Sx(["defname", "Define Name", "generic", true], ["useform", "Use in Formula", "generic", true], ["createsel", "Create from Selection", "generic"])] },
    { id: "audit", label: "Formula Auditing", cols: [Sx(["traceprec", "Trace Precedents", "generic"], ["tracedep", "Trace Dependents", "generic"], ["rmarrows", "Remove Arrows", "generic", true]), Sx(["showf", "Show Formulas", "generic"], ["errchk", "Error Checking", "valid", true], ["evalf", "Evaluate Formula", "generic"]), L("watch", "Watch\nWindow", "find")] },
    { id: "calc", label: "Calculation", cols: [L("calcopt", "Calculation\nOptions", "refresh", true), Sx(["calcnow", "Calculate Now", "refresh"], ["calcsheet", "Calculate Sheet", "refresh"])] },
  ],
  powerpivot: [
    { id: "dmodel", label: "Data Model", cols: [L("manage", "Manage", "model")] },
    { id: "pcalcs", label: "Calculations", cols: [L("measures", "Measures", "sum", true), L("kpis", "KPIs", "kpi", true)] },
    { id: "ptables", label: "Tables", cols: [L("adddm", "Add to\nData Model", "adddm")] },
    { id: "prels", label: "Relationships", cols: [L("detect", "Detect", "generic")] },
    { id: "psettings", label: "Settings", cols: [L("psett", "Settings", "format")] },
  ],
  pivotanalyze: [
    { id: "pt", label: "PivotTable", cols: [Sx(["ptname", "PivotTable1", "generic"], ["ptopt", "Options", "generic", true])] },
    { id: "activefield", label: "Active Field", cols: [Sx(["afname", "Sum of Amount", "generic"], ["fieldset", "Field Settings", "format"]), Sx(["drilldown", "Drill Down", "generic"], ["drillup", "Drill Up", "generic"]), Sx(["expandf", "Expand Field", "insert"], ["collapsef", "Collapse Field", "delete"])] },
    { id: "pgroup", label: "Group", cols: [Sx(["groupsel", "Group Selection", "group"], ["ungroup", "Ungroup", "group"], ["groupfield", "Group Field", "group"])] },
    { id: "pfilter", label: "Filter", cols: [Sx(["inslicer", "Insert Slicer", "filter"], ["instl", "Insert Timeline", "table"], ["filtconn", "Filter Connections", "filter"])] },
    { id: "pdata", label: "Data", cols: [L("prefresh", "Refresh", "refresh", true), L("chgsrc", "Change Data\nSource", "table", true)] },
    { id: "pactions", label: "Actions", cols: [Sx(["pclear", "Clear", "eraser", true], ["pselect", "Select", "generic", true], ["pmove", "Move PivotTable", "generic"])] },
    { id: "pcalc", label: "Calculations", cols: [Sx(["pfields", "Fields, Items, & Sets", "generic", true], ["prel", "Relationships", "generic"], ["olap", "OLAP Tools", "generic", true])] },
    { id: "ptools", label: "Tools", cols: [L("pchart", "PivotChart", "analyze"), L("recpt", "Recommended\nPivotTables", "table")] },
    { id: "pshow", label: "Show", cols: [Sx(["flist", "Field List", "generic"], ["pmbtn", "+/- Buttons", "generic"], ["fhead", "Field Headers", "generic"])] },
  ],
  pivotchart: [
    { id: "pcname", label: "PivotChart", cols: [Sx(["cname", "Chart 1", "generic"])] },
    { id: "cactive", label: "Active Field", cols: [Sx(["caf", "Sum of Amount", "generic"], ["cfs", "Field Settings", "format"]), Sx(["cexp", "Expand Field", "insert"], ["ccol", "Collapse Field", "delete"])] },
    { id: "cfilter", label: "Filter", cols: [Sx(["cslicer", "Insert Slicer", "filter"], ["ctl", "Insert Timeline", "table"], ["cfc", "Filter Connections", "filter"])] },
    { id: "cdata", label: "Data", cols: [L("crefresh", "Refresh", "refresh", true), L("cchg", "Change Data\nSource", "table", true)] },
    { id: "cactions", label: "Actions", cols: [Sx(["cclear", "Clear", "eraser", true], ["cselect", "Select", "generic", true], ["cmove", "Move Chart", "generic"])] },
    { id: "cshow", label: "Show/Hide", cols: [Sx(["cflist", "Field List", "generic"], ["cfbtn", "Field Buttons", "filter", true])] },
  ],
  slicer: [
    { id: "sl", label: "Slicer", cols: [Sx(["slcap", "Slicer Caption: Branch", "generic"], ["slset", "Slicer Settings", "format"]), L("slconn", "Report\nConnections", "filter")] },
    { id: "slstyle", label: "Slicer Styles", cols: [L("slqs", "Quick\nStyles", "styles", true)] },
    { id: "slarr", label: "Arrange", cols: [Sx(["slfwd", "Bring Forward", "generic", true], ["slback", "Send Backward", "generic", true], ["slsel", "Selection Pane", "generic"]), Sx(["slalign", "Align", "generic", true], ["slgrp", "Group", "group", true], ["slrot", "Rotate", "generic", true])] },
    { id: "slbtn", label: "Buttons", cols: [Sx(["slcols", "Columns: 1", "generic"], ["slh", "Height: 0.3", "generic"], ["slw", "Width: 1.9", "generic"])] },
    { id: "slsize", label: "Size", cols: [Sx(["slsh", "Height: 3.5", "generic"], ["slsw", "Width: 1.9", "generic"])] },
  ],
  data: [
    { id: "gettransform", label: "Get & Transform Data", cols: [L("getdata", "Get\nData", "get", true), Sx(["csv", "From Text/CSV", "csv"], ["web", "From Web", "web"], ["range", "From Table/Range", "table"]), Sx(["recent", "Recent Sources", "generic"], ["existing", "Existing Connections", "generic"])] },
    { id: "queries", label: "Queries & Connections", cols: [L("refreshall", "Refresh\nAll", "refresh", true), Sx(["qc", "Queries & Connections", "generic"], ["props", "Properties", "generic"], ["links", "Edit Links", "generic"])] },
    { id: "datatypes", label: "Data Types", cols: [L("stocks", "Stocks", "analyze"), L("currencies", "Currencies", "dollar")] },
    { id: "sortfilter-data", label: "Sort & Filter", cols: [Sx(["sortaz", "", "sortaz"], ["sortza", "", "sortza"]), L("sortbtn", "Sort", "sort"), L("filterbtn", "Filter", "filter"), Sx(["clearbtn", "Clear", "clearf"], ["reapplybtn", "Reapply", "reapply"], ["advbtn", "Advanced", "adv"])] },
    { id: "datatools", label: "Data Tools", cols: [Sx(["t2c", "Text to\nColumns", "text2col"], ["ff", "Flash Fill", "flash"], ["rd", "Remove Duplicates", "dedupe"]), Sx(["dv", "Data Validation", "valid", true], ["cons", "Consolidate", "generic"], ["rel", "Relationships", "generic"])] },
    { id: "forecast", label: "Forecast", cols: [L("whatif", "What-If\nAnalysis", "whatif", true), L("fsheet", "Forecast\nSheet", "analyze")] },
    { id: "outline", label: "Outline", cols: [L("grp", "Group", "group", true), L("ungrp", "Ungroup", "group", true), L("subt", "Subtotal", "generic")] },
  ],
};
const colW = (c: RCol): number =>
  c.kind === "L" ? Math.max(50, Math.max(...c.items[0].label.split("\n").map((s) => s.length)) * 6.6 + 14) :
    Math.max(...c.items.map((i) => 24 + i.label.length * 6 + (i.dd ? 12 : 0)), 28);
const customW: Record<string, number> = { font: 232, align: 214, number: 168 };
const groupW = (g: RGroup): number => (g.custom ? customW[g.custom] : g.cols.reduce((a, c) => a + colW(c), 0) + 10);

const tx = (size: number, extra?: React.CSSProperties): React.CSSProperties => ({ fontFamily: F.ui, fontSize: size, color: C.ink, ...extra });
const Box: React.FC<{ w: number; h?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w, h = 22, children, style }) => (
  <div style={{ width: w, height: h, border: "1px solid #BDBDBD", background: "#fff", boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 5px", ...tx(12), ...style }}>{children}</div>
);
const SmallIcons: React.FC<{ ks: string[]; gap?: number }> = ({ ks, gap = 8 }) => (
  <div style={{ display: "flex", gap, alignItems: "center", height: 22 }}>{ks.map((k, i) => <Icon key={i} k={k} s={16} />)}</div>
);
const CustomGroup: React.FC<{ kind: "font" | "align" | "number" }> = ({ kind }) => {
  if (kind === "font") return (
    <div style={{ padding: "6px 6px 0", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}><Box w={110} style={{ justifyContent: "space-between", fontFamily: F.cell }}>Calibri<Icon k="chev" s={10} /></Box><Box w={46} style={{ justifyContent: "space-between", fontFamily: F.cell }}>11<Icon k="chev" s={10} /></Box><span style={tx(13, { fontWeight: 700 })}>A˄</span><span style={tx(11, { fontWeight: 700 })}>A˅</span></div>
      <div style={{ display: "flex", gap: 9, alignItems: "center", height: 22 }}><span style={tx(14, { fontWeight: 700, width: 12 })}>B</span><span style={tx(14, { fontStyle: "italic", width: 12, fontFamily: F.cell })}>I</span><span style={tx(14, { textDecoration: "underline", width: 12 })}>U</span><Icon k="borders" /><Icon k="fillc" /><Icon k="fontc" /></div>
    </div>
  );
  if (kind === "align") return (
    <div style={{ padding: "6px 6px 0", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", height: 22 }}><SmallIcons ks={["align", "aligncenter", "alignright"]} /><Icon k="wrap" /><span style={tx(12)}>Wrap Text</span></div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", height: 22 }}><SmallIcons ks={["align", "aligncenter", "alignright"]} /><Icon k="merge" /><span style={tx(12)}>Merge & Center ▾</span></div>
    </div>
  );
  return (
    <div style={{ padding: "6px 6px 0", display: "flex", flexDirection: "column", gap: 6 }}>
      <Box w={150} style={{ justifyContent: "space-between" }}>General<Icon k="chev" s={10} /></Box>
      <div style={{ display: "flex", gap: 10, alignItems: "center", height: 22 }}><SmallIcons ks={["dollar", "percent", "comma", "dec", "dec"]} gap={11} /></div>
    </div>
  );
};

export const Ribbon: React.FC<{ tab: string; glow?: { id: string; color: string; t: number } }> = ({ tab, glow }) => {
  const groups = RIBBON[tab] ?? [];
  const lit = (id: string): boolean => !!glow && glow.id === id && glow.t > 0.02;
  const gl = (id: string): React.CSSProperties => lit(id) && glow
    ? { boxShadow: `0 0 ${10 + 12 * glow.t}px ${glow.color}, inset 0 0 0 2px ${glow.color}`, background: `${glow.color}22`, borderRadius: 4, opacity: 1 } : {};
  return (
    <div style={{ position: "absolute", left: 0, top: M.titleBar + M.tabs, width: WIN_W, height: M.ribbon, background: C.ribbon, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, boxSizing: "border-box", display: "flex", padding: "2px 6px", overflow: "hidden" }}>
      {groups.map((g) => (
        <div key={g.id} style={{ display: "flex", flexDirection: "column", width: groupW(g), borderRight: `1px solid ${C.line}`, boxSizing: "border-box", ...gl(g.id), borderRadius: lit(g.id) ? 4 : 0 }}>
          <div style={{ flex: 1, display: "flex", padding: "2px 3px 0" }}>
            {g.custom ? <CustomGroup kind={g.custom} /> : g.cols.map((c, ci) => (
              <div key={ci} style={{ width: colW(c), display: "flex", flexDirection: c.kind === "L" ? "row" : "column", justifyContent: c.kind === "L" ? "center" : "flex-start", gap: c.kind === "S" ? 2 : 0, paddingTop: c.kind === "S" ? 1 : 0 }}>
                {c.items.map((it) => c.kind === "L" ? (
                  <div key={it.id} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 2, ...gl(it.id) }}>
                    <Icon k={it.icon} s={32} />
                    <div style={tx(11, { textAlign: "center", lineHeight: "13px", whiteSpace: "pre", marginTop: 3 })}>{it.label}{it.dd ? (it.label.includes("\n") ? " ▾" : "\n▾") : ""}</div>
                  </div>
                ) : (
                  <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 6, height: 22, padding: "0 3px", ...gl(it.id) }}>
                    <Icon k={it.icon} s={16} /><span style={tx(11.5, { whiteSpace: "pre", lineHeight: "12px" })}>{it.label.replace("\n", " ")}{it.dd ? " ▾" : ""}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={tx(11, { textAlign: "center", color: C.inkSoft, height: 15, lineHeight: "15px" })}>{g.label}</div>
        </div>
      ))}
    </div>
  );
};

// ---------- title bar + tabs ----------
export const TitleBar: React.FC<{ file: string }> = ({ file }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: WIN_W, height: M.titleBar, background: C.chrome, display: "flex", alignItems: "center", ...tx(12) }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 10, width: 470 }}>
      <Icon k="grid" s={18} />
      <span style={tx(12, { fontWeight: 600 })}>AutoSave</span>
      <div style={{ width: 30, height: 14, borderRadius: 7, border: "1.5px solid #666", boxSizing: "border-box", position: "relative" }}><div style={{ position: "absolute", left: 2, top: 2, width: 7, height: 7, borderRadius: 4, background: "#666" }} /></div>
      <span style={tx(11, { color: C.inkSoft })}>Off</span>
      <Icon k="save" /><Icon k="undo" /><Icon k="redo" />
      <span style={tx(12, { marginLeft: 6 })}>{file}</span><span style={tx(10, { color: C.inkSoft })}>▾</span>
    </div>
    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
      <div style={{ width: 380, height: 22, borderRadius: 4, background: "#fff", border: "1px solid #D0D0D0", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 6, padding: "0 8px", ...tx(12, { color: C.inkSoft }) }}><Icon k="search" s={14} />Search</div>
    </div>
    <div style={{ width: 470, display: "flex", justifyContent: "flex-end", alignItems: "center", height: "100%" }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: "#6B7A90", color: "#fff", ...tx(11, { color: "#fff" }), display: "flex", alignItems: "center", justifyContent: "center", marginRight: 14 }}>A</div>
      {["—", "☐", "✕"].map((g, i) => <div key={i} style={{ width: 46, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", ...tx(13, { color: "#333" }) }}>{g}</div>)}
    </div>
  </div>
);
export const TAB_NAME: Record<string, string> = { home: "Home", insert: "Insert", formulas: "Formulas", data: "Data", powerpivot: "Power Pivot", pivotanalyze: "PivotTable Analyze", pivotchart: "PivotChart Analyze", slicer: "Slicer" };
export const CTX_TABS: Record<string, string[]> = { pivotanalyze: ["PivotTable Analyze", "Design"], pivotchart: ["PivotChart Analyze", "Design", "Format"], slicer: ["Slicer"] };
export const TABS = ["File", "Home", "Insert", "Page Layout", "Formulas", "Data", "Review", "View", "Automate", "Help", "Power Pivot"];
export const TabsRow: React.FC<{ active: string; hot?: { tab: string; color: string; t: number }; extra?: string[] }> = ({ active, hot, extra = [] }) => {
  let x = 10;
  const all = [...TABS.map((t) => ({ t, ctx: false })), ...extra.map((t) => ({ t, ctx: true }))];
  return (
    <div style={{ position: "absolute", left: 0, top: M.titleBar, width: WIN_W, height: M.tabs, background: C.chrome }}>
      {all.map((it, i) => {
        const t = it.t; const w = t.length * 7.2 + 26; if (it.ctx && !all[i - 1]?.ctx) x += 16; const left = x; x += w;
        const on = t === active; const h = hot && hot.tab === t && hot.t > 0.02;
        return (
          <div key={t + i} style={{ position: "absolute", left, top: 2, width: w, height: M.tabs - 2, ...tx(13, { fontWeight: on ? 600 : 400, color: on ? C.xGreenDark : it.ctx ? "#7A3DB8" : C.ink }), display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, ...(h && hot ? { boxShadow: `0 0 12px ${hot.color}, inset 0 0 2px ${hot.color}` } : {}) }}>
            {t}
            {it.ctx ? <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: "#7A3DB8" }} /> : null}
            {on ? <div style={{ position: "absolute", left: 10, right: 10, bottom: 0, height: 3, background: C.xGreen, borderRadius: 2 }} /> : null}
          </div>
        );
      })}
      <div style={{ position: "absolute", right: 14, top: 3, display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", ...tx(12) }}><Icon k="comment" />Comments</div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", height: 22, padding: "0 12px", background: C.xGreen, borderRadius: 4, ...tx(12, { color: "#fff", fontWeight: 600 }) }}><Icon k="share" />Share</div>
      </div>
    </div>
  );
};

// ---------- formula bar ----------
export const FormulaBar: React.FC<{ name: string; value: string; editing?: boolean }> = ({ name, value, editing }) => (
  <div style={{ position: "absolute", left: 0, top: GRID_TOP - M.colHdr - M.formula, width: WIN_W, height: M.formula, background: "#fff", borderBottom: `1px solid ${C.line}`, boxSizing: "border-box", display: "flex", alignItems: "center", ...tx(13) }}>
    <div style={{ width: 96, height: 22, margin: "0 4px 0 6px", border: "1px solid #BDBDBD", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px 0 6px", fontFamily: F.ui, fontSize: 13 }}><span>{name}</span><Icon k="chev" s={10} /></div>
    <span style={tx(14, { color: "#BBB", width: 8, textAlign: "center" })}>⋮</span>
    <span style={tx(15, { color: editing ? "#C42B1C" : "#BBB", width: 24, textAlign: "center" })}>✕</span>
    <span style={tx(15, { color: editing ? C.xGreen : "#BBB", width: 24, textAlign: "center" })}>✓</span>
    <span style={tx(13, { fontStyle: "italic", fontWeight: 600, color: "#555", width: 26, textAlign: "center", fontFamily: F.cell })}>fx</span>
    <div style={{ flex: 1, height: 22, borderLeft: "1px solid #D0D0D0", paddingLeft: 6, display: "flex", alignItems: "center", fontFamily: F.cell, fontSize: 14.67, whiteSpace: "pre" }}>{value}</div>
    <div style={{ width: 28, textAlign: "center" }}><Icon k="chev" s={12} /></div>
  </div>
);

// ---------- grid ----------
export type Cell = { v: string | number; al?: "l" | "r" | "c"; b?: boolean; pm?: "+" | "-"; indent?: number; fill?: string; fg?: string; icon?: "up" | "side" | "down"; err?: boolean };
export type GRow = { id: string | number; hdr: string | number; cells: Cell[]; slot: number; h: number; head?: boolean };
export type FBtn = { c: number; state: "on" | "open" | "off"; t: number };
export type GridProps = {
  cols: Col[]; rows: GRow[]; fixedHdr?: boolean; hdrBlue?: boolean;
  active?: { c: number; slot: number } | null;
  sel?: { c1: number; c2: number; s1: number; s2: number } | null;
  fbtns?: FBtn[]; cellFx?: (id: string | number, c: number) => string | undefined;
  marching?: { c1: number; c2: number; s1: number; s2: number } | null; frame?: number; hiRows?: (string | number)[];
  lines?: boolean; boxes?: Box[];
};
export type Box = { c1: number; c2: number; s1: number; s2: number; color: string; t?: number; fill?: string; dash?: boolean; w?: number };
const Btn: React.FC<{ b: FBtn; w: number }> = ({ b, w }) => (
  <div style={{ position: "absolute", left: w - 18, top: 2, width: 16, height: 16, boxSizing: "border-box", border: "1px solid #A0A0A0", background: b.state === "open" ? "#CFE5D8" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${b.t})`, transformOrigin: "center", opacity: Math.min(1, b.t * 1.4) }}>
    <Icon k={b.state === "on" ? "filteron" : "chev"} s={b.state === "on" ? 12 : 10} />
  </div>
);
export const Grid: React.FC<GridProps> = (p) => {
  const { cols, rows } = p;
  const totalW = cols.reduce((a, c) => a + c.w, 0);
  const selC = (c: number): boolean => !!p.sel && c >= p.sel.c1 && c <= p.sel.c2 || (!p.sel && !!p.active && p.active.c === c);
  const selS = (s: number): boolean => !!p.sel && s >= p.sel.s1 && s <= p.sel.s2 || (!p.sel && !!p.active && Math.floor(p.active.slot) === s);
  const box = (a: { c1: number; c2: number; s1: number; s2: number }) => ({ left: colX(cols, a.c1), top: slotY(a.s1) - GRID_TOP + M.colHdr, width: colX(cols, a.c2 + 1) - colX(cols, a.c1), height: (a.s2 - a.s1 + 1) * M.rowH });
  return (
    <div style={{ position: "absolute", left: 0, top: GRID_TOP - M.colHdr, width: WIN_W, height: WIN_H - (GRID_TOP - M.colHdr) - M.sheetBar - M.statusBar, background: "#fff", overflow: "hidden" }}>
      {/* column headers */}
      <div style={{ position: "absolute", left: 0, top: 0, width: WIN_W, height: M.colHdr, background: C.hdr, borderBottom: `1px solid ${C.line}`, boxSizing: "border-box" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: M.rowHdr, height: M.colHdr, borderRight: `1px solid ${C.line}`, boxSizing: "border-box" }}>
          <svg width={M.rowHdr} height={M.colHdr}><path d={`M${M.rowHdr - 4} 4 V${M.colHdr - 4} H4 Z`} fill="#BDBDBD" /></svg>
        </div>
        {cols.map((c, i) => (
          <div key={i} style={{ position: "absolute", left: colX(cols, i), top: 0, width: c.w, height: M.colHdr, boxSizing: "border-box", borderRight: `1px solid ${C.line}`, background: selC(i) ? C.hdrSel : C.hdr, color: selC(i) ? C.xGreenDark : "#444", ...tx(13, { fontFamily: F.cell }), display: "flex", alignItems: "center", justifyContent: "center", borderBottom: selC(i) ? `2px solid ${C.xGreen}` : undefined }}>{c.label}</div>
        ))}
      </div>
      {/* rows */}
      <div style={{ position: "absolute", left: 0, top: M.colHdr, width: WIN_W, height: 4000, overflow: "visible" }}>
        {p.lines ? (
          <div style={{ position: "absolute", left: 0, top: 0, width: WIN_W, height: NSLOT * M.rowH }}>
            {cols.map((c, i) => <div key={"v" + i} style={{ position: "absolute", left: colX(cols, i) + c.w - 1, top: 0, width: 1, height: NSLOT * M.rowH, background: C.grid }} />)}
            {Array.from({ length: NSLOT }, (_, s) => <div key={"l" + s} style={{ position: "absolute", left: M.rowHdr, top: (s + 1) * M.rowH - 1, width: WIN_W - M.rowHdr, height: 1, background: C.grid }} />)}
          </div>
        ) : null}
        {p.fixedHdr ? Array.from({ length: NSLOT }, (_, s) => (
          <div key={"h" + s} style={{ position: "absolute", left: 0, top: s * M.rowH, width: M.rowHdr, height: M.rowH, boxSizing: "border-box", borderRight: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, background: selS(s) ? C.hdrSel : C.hdr, color: selS(s) ? C.xGreenDark : "#444", ...tx(13, { fontFamily: F.cell }), display: "flex", alignItems: "center", justifyContent: "center" }}>{s + 1}</div>
        )) : null}
        {rows.map((r) => {
          if (r.h <= 0.01) return null;
          const hi = p.hiRows?.includes(r.id);
          return (
            <div key={r.id} style={{ position: "absolute", left: 0, top: r.slot * M.rowH, width: WIN_W, height: r.h * M.rowH, overflow: "hidden" }}>
              {!p.fixedHdr ? (
                <div style={{ position: "absolute", left: 0, top: 0, width: M.rowHdr, height: M.rowH, boxSizing: "border-box", borderRight: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, background: selS(Math.round(r.slot)) ? C.hdrSel : C.hdr, color: p.hdrBlue ? C.filtBlue : "#444", ...tx(13, { fontFamily: F.cell }), display: "flex", alignItems: "center", justifyContent: "center" }}>{r.hdr}</div>
              ) : null}
              {cols.map((c, ci) => {
                const cell = r.cells[ci];
                if (p.lines && !cell) return null;
                const fx = p.cellFx?.(r.id, ci);
                return (
                  <div key={ci} style={{ position: "absolute", left: colX(cols, ci), top: 0, width: c.w, height: M.rowH, boxSizing: "border-box", borderRight: p.lines ? undefined : `1px solid ${C.grid}`, borderBottom: p.lines ? undefined : `1px solid ${C.grid}`, backgroundColor: cell?.fill ?? (hi ? "#FFF6D6" : p.lines ? undefined : "#fff"), backgroundImage: fx ? `linear-gradient(${fx}, ${fx})` : undefined, color: cell?.fg ?? C.ink, fontFamily: F.cell, fontSize: 14.67, fontWeight: cell?.b ? 700 : 400, padding: "0 3px", display: "flex", alignItems: "center", justifyContent: cell?.icon ? "space-between" : cell?.al === "r" ? "flex-end" : cell?.al === "c" ? "center" : "flex-start", whiteSpace: "nowrap", overflow: "hidden" }}>
                    {cell?.icon ? <Arrow kind={cell.icon} /> : null}
                    {cell?.pm ? <span style={{ width: 9, height: 9, border: "1px solid #7F7F7F", boxSizing: "border-box", marginRight: 4, marginLeft: (cell.indent ?? 0) * 12, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, lineHeight: "9px", color: "#444", flex: "none", background: "#fff" }}>{cell.pm === "+" ? "+" : "−"}</span> : cell?.indent ? <span style={{ width: (cell.indent ?? 0) * 12 + 13, flex: "none" }} /> : null}
                    <span>{cell ? String(cell.v) : ""}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
        {/* filter buttons live on the header row (slot 0) */}
        {(p.fbtns ?? []).map((b) => <div key={"fb" + b.c} style={{ position: "absolute", left: colX(cols, b.c), top: 0, width: cols[b.c].w, height: M.rowH }}><Btn b={b} w={cols[b.c].w} /></div>)}
        {/* range selection + active cell */}
        {p.sel ? <div style={{ position: "absolute", ...box(p.sel), top: box(p.sel).top - M.colHdr, background: C.xSel, border: `2px solid ${C.xGreen}`, boxSizing: "border-box", pointerEvents: "none" }} /> : null}
        {p.marching ? <div style={{ position: "absolute", ...box(p.marching), top: box(p.marching).top - M.colHdr, boxSizing: "border-box", border: "2px dashed #107C41", opacity: 0.9, backgroundImage: "none", outline: `1px dashed #fff`, transform: `translate(${((p.frame ?? 0) % 6) * 0}px,0)` }} /> : null}
        {(p.boxes ?? []).map((b, i) => {
          const t = b.t ?? 1; if (t <= 0.02) return null;
          const x = colX(cols, b.c1), w = colX(cols, b.c2 + 1) - x, y = b.s1 * M.rowH, h = (b.s2 - b.s1 + 1) * M.rowH;
          return <div key={"bx" + i} style={{ position: "absolute", left: x - 1, top: y - 1, width: w + 1, height: h + 1, border: `${b.w ?? 2}px ${b.dash ? "dashed" : "solid"} ${b.color}`, boxShadow: `0 0 ${6 + 8 * t}px ${b.color}`, background: b.fill, opacity: t, boxSizing: "border-box", zIndex: 2, pointerEvents: "none" }} />;
        })}
        {p.active ? (
          <div style={{ position: "absolute", left: colX(cols, p.active.c) - 1, top: p.active.slot * M.rowH - 1, width: cols[p.active.c].w + 1, height: M.rowH + 1, border: `2px solid ${C.xGreen}`, boxSizing: "border-box", pointerEvents: "none", background: p.sel ? "#fff" : "transparent", zIndex: 1 }}>
            {!p.sel ? <div style={{ position: "absolute", right: -5, bottom: -5, width: 6, height: 6, background: C.xGreen, border: "1px solid #fff" }} /> : null}
          </div>
        ) : null}
      </div>
      <div style={{ position: "absolute", left: totalW + M.rowHdr, top: 0, width: 1, height: 1 }} />
    </div>
  );
};

// ---------- sheet tabs + status bar ----------
export const SheetBar: React.FC<{ sheets: string[]; active: string }> = ({ sheets, active }) => (
  <div style={{ position: "absolute", left: 0, top: WIN_H - M.sheetBar - M.statusBar, width: WIN_W, height: M.sheetBar, background: C.chrome, borderTop: `1px solid ${C.line}`, boxSizing: "border-box", display: "flex", alignItems: "flex-end", ...tx(12) }}>
    <div style={{ display: "flex", gap: 14, padding: "0 12px", alignItems: "center", height: "100%", color: "#777" }}>◂ ▸</div>
    {sheets.map((s) => (
      <div key={s} style={{ height: 24, padding: "0 16px", display: "flex", alignItems: "center", background: s === active ? "#fff" : "transparent", color: s === active ? C.xGreenDark : C.ink, fontWeight: s === active ? 700 : 400, borderBottom: s === active ? `3px solid ${C.xGreen}` : "none", borderLeft: `1px solid ${C.line}`, borderRight: `1px solid ${C.line}`, boxSizing: "border-box", ...tx(13, { fontWeight: s === active ? 700 : 400, color: s === active ? C.xGreenDark : C.ink }) }}>{s}</div>
    ))}
    <div style={{ width: 30, height: 24, display: "flex", alignItems: "center", justifyContent: "center", ...tx(18, { color: "#555" }) }}>+</div>
  </div>
);
export const StatusBar: React.FC<{ left?: string; stats?: string[]; zoom?: number }> = ({ left = "Ready", stats = [], zoom = 100 }) => (
  <div style={{ position: "absolute", left: 0, top: WIN_H - M.statusBar, width: WIN_W, height: M.statusBar, background: C.chrome, borderTop: `1px solid ${C.line}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", ...tx(12) }}>
    <div style={{ display: "flex", gap: 22, alignItems: "center" }}><span>{left}</span></div>
    <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
      {stats.map((s, i) => <span key={i}>{s}</span>)}
      <span style={{ letterSpacing: 6 }}>▦▤▥</span>
      <span>−</span><div style={{ width: 90, height: 2, background: "#888", position: "relative" }}><div style={{ position: "absolute", left: 43, top: -4, width: 4, height: 10, background: "#555" }} /></div><span>+</span>
      <span style={{ width: 36, textAlign: "right" }}>{zoom}%</span>
    </div>
  </div>
);

// ---------- window + camera ----------
export type Cam = { z: number; cx: number; cy: number };
export const camAt = (f: number, k: { f: number; z: number; cx: number; cy: number }[]): Cam => {
  if (f <= k[0].f) return k[0];
  for (let i = 1; i < k.length; i++) {
    if (f <= k[i].f) { const t = prog(f, k[i - 1].f, k[i].f - k[i - 1].f); return { z: lerp(k[i - 1].z, k[i].z, t), cx: lerp(k[i - 1].cx, k[i].cx, t), cy: lerp(k[i - 1].cy, k[i].cy, t) }; }
  }
  return k[k.length - 1];
};
export type ExcelProps = {
  cam: Cam; file: string; tab: string; hotTab?: { tab: string; color: string; t: number }; glow?: { id: string; color: string; t: number };
  nameBox: string; formula: string; editing?: boolean; grid: GridProps; sheets?: string[]; sheet?: string;
  statusLeft?: string; stats?: string[]; children?: React.ReactNode;
};
export const Excel: React.FC<ExcelProps> = (p) => {
  const sz = S * p.cam.z, vw = WIDTH, vh = HEIGHT - STRIP_H;
  const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
  const tx0 = clamp(vw / 2 - p.cam.cx * sz, vw - WIN_W * sz, 0);
  const ty0 = clamp(vh / 2 - p.cam.cy * sz, vh - WIN_H * sz, 0);
  return (
    <div style={{ position: "absolute", left: 0, top: STRIP_H, width: vw, height: vh, overflow: "hidden", background: "#fff" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: WIN_W, height: WIN_H, transformOrigin: "0 0", transform: `translate(${tx0}px, ${ty0}px) scale(${sz})` }}>
        <Grid {...p.grid} />
        <FormulaBar name={p.nameBox} value={p.formula} editing={p.editing} />
        <Ribbon tab={p.tab} glow={p.glow} />
        <TabsRow active={TAB_NAME[p.tab] ?? "Home"} hot={p.hotTab} extra={CTX_TABS[p.tab] ?? []} />
        <TitleBar file={p.file} />
        <SheetBar sheets={p.sheets ?? ["Sales", "Branches"]} active={p.sheet ?? "Sales"} />
        <StatusBar left={p.statusLeft} stats={p.stats} />
        {p.children}
      </div>
    </div>
  );
};
export { HEIGHT };

// Centre of a ribbon button (logical px) so cursors/glows can target it.
export const ribbonPos = (tab: string, id: string): { x: number; y: number } => {
  let x = 6;
  for (const g of RIBBON[tab] ?? []) {
    const gw = groupW(g);
    if (!g.custom) {
      let cx = x + 3;
      for (const c of g.cols) {
        const w = colW(c);
        for (let i = 0; i < c.items.length; i++) {
          if (c.items[i].id === id) return { x: cx + w / 2, y: M.titleBar + M.tabs + (c.kind === "L" ? 40 : 16 + 22 * i) };
        }
        cx += w;
      }
    }
    x += gw;
  }
  return { x: 0, y: 0 };
};
