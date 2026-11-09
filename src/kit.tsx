import type {CSSProperties, ReactNode} from "react";
import {Img, staticFile, useCurrentFrame} from "remotion";
import {C, F, LOGO_FILE, M} from "./theme";

/* ───────────── helpers ───────────── */
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const prog = (f: number, s: number, d = 15) => clamp((f - s) / d);
export const eo = (t: number) => 1 - Math.pow(1 - t, 3);
export const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
export const typed = (s: string, f: number, start: number, cps = 12) =>
  s.slice(0, Math.max(0, Math.floor(((f - start) * cps) / 30)));
export const colName = (c: number) => {
  let s = "";
  let n = c;
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
};
export const fmtInt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const pos = (x: number, y: number, w: number, h: number, extra: CSSProperties = {}): CSSProperties => ({
  position: "absolute", left: x, top: y, width: w, height: h, ...extra,
});
const flex = (extra: CSSProperties = {}): CSSProperties => ({display: "flex", alignItems: "center", ...extra});

/* ───────────── sheet geometry ───────────── */
export const DEF_W = M.colW;
export const colX = (widths: number[] | undefined, c: number, hdrW: number = M.rowHdrW) => {
  let x = hdrW;
  for (let i = 1; i < c; i++) x += widths?.[i - 1] ?? DEF_W;
  return x;
};
export const cellRect = (c: number, r: number, widths?: number[], hdrW: number = M.rowHdrW, firstRow = 1) => ({
  x: colX(widths, c, hdrW), y: M.gridTop + (r - firstRow) * M.rowH, w: widths?.[c - 1] ?? DEF_W, h: M.rowH,
});
export const rangeRect = (r1: number, c1: number, r2: number, c2: number, widths?: number[], hdrW: number = M.rowHdrW, firstRow = 1) => {
  const a = cellRect(c1, r1, widths, hdrW, firstRow);
  const b = cellRect(c2, r2, widths, hdrW, firstRow);
  return {x: a.x, y: a.y, w: b.x + b.w - a.x, h: b.y + b.h - a.y};
};

/* ───────────── icons (generic, hand-drawn; no Microsoft artwork) ───────────── */
const S1 = {fill: "none", stroke: "#505050", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
const ICON: Record<string, ReactNode> = {
  paste: <g><rect x="5" y="5" width="14" height="16" rx="2" fill="#E8C98B" stroke="#8A6D3B" strokeWidth="1.3" /><rect x="9" y="3" width="6" height="4" rx="1" fill="#fff" stroke="#8A6D3B" strokeWidth="1.2" /><rect x="8" y="10" width="11" height="11" fill="#fff" stroke="#505050" strokeWidth="1.2" /></g>,
  cut: <g {...S1}><circle cx="7" cy="17" r="2.6" /><circle cx="17" cy="17" r="2.6" /><path d="M8.5 14.8 L16 4 M15.5 14.8 L8 4" /></g>,
  copy: <g {...S1}><rect x="4" y="4" width="10" height="12" rx="1" fill="#fff" /><rect x="9" y="8" width="10" height="12" rx="1" fill="#fff" /></g>,
  painter: <g {...S1}><rect x="6" y="3" width="11" height="6" rx="1" fill="#F6C142" /><path d="M11.5 9 V13 M9 13 H14 V20 H9 Z" /></g>,
  borders: <g {...S1}><rect x="4" y="4" width="16" height="16" /><path d="M12 4 V20 M4 12 H20" strokeDasharray="2 2" /></g>,
  fill: <g><path d="M6 11 L12 4 L18 10 L12 16 Z" fill="#fff" stroke="#505050" strokeWidth="1.3" /><rect x="4" y="19" width="16" height="3.5" fill="#FFE100" /></g>,
  fontc: <g><text x="12" y="17" fontSize="15" fontWeight="700" textAnchor="middle" fill="#333" fontFamily="Lato, sans-serif">A</text><rect x="4" y="19" width="16" height="3.5" fill="#E02020" /></g>,
  top: <g {...S1}><path d="M4 4 H20 M7 9 H17 M7 13 H15" /></g>,
  mid: <g {...S1}><path d="M7 6 H17 M4 12 H20 M7 18 H17" /></g>,
  bot: <g {...S1}><path d="M7 11 H17 M7 15 H15 M4 20 H20" /></g>,
  orient: <g><text x="4" y="19" fontSize="11" fontWeight="700" fill="#333" transform="rotate(-35 4 19)" fontFamily="Lato, sans-serif">ab</text><path d="M14 18 L20 8" {...S1} /></g>,
  wrap: <g {...S1}><path d="M4 5 H20 M4 10 H16 a3 3 0 0 1 0 6 H10 M4 20 H12" /><path d="M12 14 L10 16 L12 18" /></g>,
  alL: <g {...S1}><path d="M4 5 H20 M4 10 H14 M4 15 H20 M4 20 H14" /></g>,
  alC: <g {...S1}><path d="M4 5 H20 M7 10 H17 M4 15 H20 M7 20 H17" /></g>,
  alR: <g {...S1}><path d="M4 5 H20 M10 10 H20 M4 15 H20 M10 20 H20" /></g>,
  indL: <g {...S1}><path d="M4 5 H20 M11 10 H20 M11 15 H20 M4 20 H20 M7 9 L4 12.5 L7 16" /></g>,
  indR: <g {...S1}><path d="M4 5 H20 M11 10 H20 M11 15 H20 M4 20 H20 M4 9 L7 12.5 L4 16" /></g>,
  merge: <g {...S1}><rect x="3" y="6" width="18" height="12" /><path d="M7 12 H17 M9.5 9.5 L7 12 L9.5 14.5 M14.5 9.5 L17 12 L14.5 14.5" /></g>,
  decL: <g {...S1}><text x="3" y="12" fontSize="8" fill="#333" stroke="none" fontFamily="Lato, sans-serif">.0</text><text x="3" y="21" fontSize="8" fill="#333" stroke="none" fontFamily="Lato, sans-serif">.00</text><path d="M16 7 L20 11 L16 15" /></g>,
  decR: <g {...S1}><text x="3" y="12" fontSize="8" fill="#333" stroke="none" fontFamily="Lato, sans-serif">.00</text><text x="3" y="21" fontSize="8" fill="#333" stroke="none" fontFamily="Lato, sans-serif">.0</text><path d="M20 7 L16 11 L20 15" /></g>,
  cond: <g><rect x="3" y="4" width="18" height="16" fill="#fff" stroke="#505050" strokeWidth="1.2" /><rect x="5" y="7" width="8" height="3" fill="#E0504A" /><rect x="5" y="12" width="12" height="3" fill="#4CAF50" /><rect x="5" y="17" width="5" height="2" fill="#F2B63D" /></g>,
  table: <g><rect x="3" y="4" width="18" height="16" fill="#fff" stroke="#505050" strokeWidth="1.2" /><rect x="3" y="4" width="18" height="4" fill="#4A86C8" /><path d="M3 12 H21 M3 16 H21 M10 8 V20 M15 8 V20" stroke="#8AA" strokeWidth="1" /></g>,
  styles: <g><rect x="3" y="5" width="8" height="6" fill="#C6E0B4" stroke="#6A8" /><rect x="13" y="5" width="8" height="6" fill="#FFE699" stroke="#BA6" /><rect x="3" y="13" width="8" height="6" fill="#BDD7EE" stroke="#69A" /><rect x="13" y="13" width="8" height="6" fill="#F8CBAD" stroke="#B87" /></g>,
  ins: <g {...S1}><rect x="3" y="8" width="14" height="12" fill="#fff" /><path d="M3 14 H17 M10 8 V20" /><path d="M18 3 V9 M15 6 H21" stroke="#107C41" strokeWidth="2" /></g>,
  del: <g {...S1}><rect x="3" y="8" width="14" height="12" fill="#fff" /><path d="M3 14 H17 M10 8 V20" /><path d="M15 6 H21" stroke="#C0392B" strokeWidth="2" /></g>,
  fmt: <g {...S1}><rect x="3" y="6" width="14" height="14" fill="#fff" /><path d="M3 13 H17 M10 6 V20" /><circle cx="18" cy="6" r="3" fill="#fff" /></g>,
  sigma: <g><text x="12" y="19" fontSize="19" fontWeight="700" textAnchor="middle" fill="#2B6CB0" fontFamily="Lato, sans-serif">Σ</text></g>,
  fillD: <g {...S1}><rect x="5" y="3" width="14" height="14" fill="#fff" /><path d="M12 6 V19 M8.5 15.5 L12 19 L15.5 15.5" stroke="#2B6CB0" strokeWidth="1.8" /></g>,
  clear: <g {...S1}><path d="M5 15 L13 5 L20 11 L13 20 H8 Z" fill="#fff" /><path d="M9 11 L16 17" /></g>,
  sort: <g {...S1}><text x="2" y="10" fontSize="8" fill="#333" stroke="none" fontFamily="Lato, sans-serif">A</text><text x="2" y="20" fontSize="8" fill="#333" stroke="none" fontFamily="Lato, sans-serif">Z</text><path d="M14 4 V19 M11 16 L14 19 L17 16" stroke="#2B6CB0" strokeWidth="1.6" /><path d="M19 5 H22" /></g>,
  find: <g {...S1}><circle cx="10" cy="10" r="5.5" fill="#fff" /><path d="M14.5 14.5 L20 20" strokeWidth="2.2" /></g>,
  analyze: <g {...S1}><rect x="3" y="12" width="4" height="8" fill="#7FB3E6" /><rect x="10" y="7" width="4" height="13" fill="#4A86C8" /><rect x="17" y="3" width="4" height="17" fill="#2F5F9E" /></g>,
  save: <g {...S1}><path d="M4 4 H17 L20 7 V20 H4 Z" fill="#fff" /><rect x="8" y="4" width="7" height="5" /><rect x="7" y="13" width="10" height="7" fill="#DDD" /></g>,
  undo: <g {...S1}><path d="M9 6 L4 11 L9 16 M4 11 H15 a5 5 0 0 1 0 10 H10" /></g>,
  redo: <g {...S1}><path d="M15 6 L20 11 L15 16 M20 11 H9 a5 5 0 0 0 0 10 H14" /></g>,
  search: <g {...S1}><circle cx="10" cy="10" r="5.5" /><path d="M14.5 14.5 L20 20" /></g>,
  comment: <g {...S1}><path d="M4 5 H20 V16 H11 L7 20 V16 H4 Z" fill="#fff" /></g>,
  pvt: <g><rect x="3" y="4" width="18" height="16" fill="#fff" stroke="#505050" strokeWidth="1.2" /><rect x="3" y="4" width="18" height="4" fill="#4A86C8" /><path d="M9 8 V20 M3 12 H21 M3 16 H21" stroke="#8AA" /></g>,
  refresh: <g {...S1}><path d="M19 8 A8 8 0 1 0 20 13" /><path d="M19 3 V8 H14" /></g>,
  slicer: <g {...S1}><rect x="4" y="4" width="12" height="16" fill="#fff" /><path d="M7 8 H13 M7 12 H13 M7 16 H13" stroke="#2B6CB0" strokeWidth="2" /></g>,
  timeline: <g {...S1}><rect x="3" y="7" width="18" height="10" fill="#fff" /><rect x="8" y="9" width="7" height="6" fill="#7FB3E6" /></g>,
  pchart: <g><rect x="3" y="3" width="18" height="18" fill="#fff" stroke="#505050" strokeWidth="1.2" /><rect x="6" y="12" width="3" height="6" fill="#4A86C8" /><rect x="11" y="8" width="3" height="10" fill="#ED7D31" /><rect x="16" y="5" width="3" height="13" fill="#70AD47" /></g>,
  flist: <g {...S1}><rect x="4" y="3" width="16" height="18" fill="#fff" /><path d="M7 8 H17 M7 12 H17 M7 16 H13" /></g>,
  fis: <g><rect x="3" y="4" width="18" height="16" fill="#fff" stroke="#505050" strokeWidth="1.2" /><text x="12" y="17" fontSize="12" fontWeight="700" textAnchor="middle" fill="#2B6CB0" fontFamily="Georgia, serif" fontStyle="italic">fx</text></g>,
  group: <g {...S1}><path d="M7 4 H4 V20 H7 M17 4 H20 V20 H17" /><path d="M9 9 H15 M9 15 H15" /></g>,
  funnel: <g {...S1}><path d="M3 4 H21 L14 13 V20 L10 18 V13 Z" fill="#fff" /></g>,
  source: <g {...S1}><ellipse cx="12" cy="6" rx="7" ry="3" fill="#fff" /><path d="M5 6 V18 A7 3 0 0 0 19 18 V6" /></g>,
  share: <g {...S1}><circle cx="6" cy="12" r="2.4" /><circle cx="18" cy="6" r="2.4" /><circle cx="18" cy="18" r="2.4" /><path d="M8 11 L16 7 M8 13 L16 17" /></g>,
};
export const Ico = ({n, s = 16}: {n: string; s?: number}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{display: "block", flex: "none"}}>{ICON[n]}</svg>
);

/* ───────────── Manzooma logo badge (only logo allowed) ───────────── */
export const LogoBadge = ({s = 26}: {s?: number}) => (
  <div style={{width: s, height: s, borderRadius: s / 2, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 1px rgba(0,0,0,.15)"}}>
    <Img src={staticFile(LOGO_FILE)} style={{width: s * 0.84, height: s * 0.84, objectFit: "contain"}} />
  </div>
);

/* ───────────── Ribbon pieces ───────────── */
const TXT: CSSProperties = {fontSize: 11.5, color: "#262626", whiteSpace: "nowrap", lineHeight: "13px"};
const Big = ({x, w, icon, label, y = 66}: {x: number; w: number; icon: string; label: string; y?: number}) => (
  <div style={pos(x, y, w, 70, {display: "flex", flexDirection: "column", alignItems: "center"})}>
    <Ico n={icon} s={26} />
    <div style={{...TXT, textAlign: "center", marginTop: 2, whiteSpace: "pre"}}>{label}</div>
    <div style={{fontSize: 8, color: "#555", marginTop: 1}}>▾</div>
  </div>
);
const Sm = ({x, y, icon, label, w = 22, caret}: {x: number; y: number; icon: string; label?: string; w?: number; caret?: boolean}) => (
  <div style={pos(x, y, w, 22, flex({gap: 4, paddingLeft: 3}))}>
    <Ico n={icon} s={16} />
    {label ? <span style={TXT}>{label}</span> : null}
    {caret ? <span style={{fontSize: 8, color: "#555"}}>▾</span> : null}
  </div>
);
const Txt = ({x, y, w = 22, children, b, i, u, size = 14}: {x: number; y: number; w?: number; children: ReactNode; b?: boolean; i?: boolean; u?: boolean; size?: number}) => (
  <div style={pos(x, y, w, 22, flex({justifyContent: "center", fontSize: size, color: "#262626", fontWeight: b ? 700 : 400, fontStyle: i ? "italic" : "normal", textDecoration: u ? "underline" : "none", fontFamily: F.ui}))}>{children}</div>
);
const Group = ({x, w, label}: {x: number; w: number; label: string}) => (
  <div>
    <div style={pos(x + w - 1, M.ribTop + 6, 1, M.ribH - 12, {background: "#D9D9D9"})} />
    <div style={pos(x, M.ribTop + M.ribH - 15, w, 13, {textAlign: "center", fontSize: 11, color: "#555"})}>{label}</div>
  </div>
);
export const NUMBOX = {x: 562, y: M.ribTop + 6, w: 150, h: 22};
const Box = ({x, y, w, label}: {x: number; y: number; w: number; label: string}) => (
  <div style={pos(x, y, w, 22, flex({justifyContent: "space-between", padding: "0 6px", border: "1px solid #BDBDBD", background: "#fff", borderRadius: 2, fontSize: 13, color: "#262626", boxSizing: "border-box"}))}>
    <span>{label}</span><span style={{fontSize: 8, color: "#555"}}>▾</span>
  </div>
);

const TABS: [string, number][] = [["File", 14], ["Home", 62], ["Insert", 116], ["Draw", 172], ["Page Layout", 220], ["Formulas", 314], ["Data", 382], ["Review", 430], ["View", 488], ["Automate", 540], ["Help", 608]];

export type StatusP = {avg?: string; count?: string; sum?: string};
export type SheetP = {
  cells: CellD[]; widths?: number[]; hdrW?: number; sel?: Rng; active?: {r: number; c: number}; ants?: Rng; firstRow?: number;
};
export type CellD = {r: number; c: number; t: ReactNode; a?: "l" | "r" | "c"; color?: string; bold?: boolean; bg?: string; tri?: boolean; style?: CSSProperties};
export type Rng = {r1: number; c1: number; r2: number; c2: number; whole?: "col" | "row"};

export type AppP = {
  file?: string; tab?: string; numFmt?: string; name?: string; fx?: ReactNode; fxGlow?: string; editing?: boolean;
  sheets?: string[]; activeSheet?: string; status?: StatusP; sheet: SheetP; children?: ReactNode; ribbonBold?: boolean; ribbon?: "home" | "pivot"; pivotTabs?: boolean;
};

/* ───────────── Sheet (grid, headers, selection) ───────────── */
export const Sheet = ({cells, widths, hdrW = M.rowHdrW, sel, active, ants, firstRow = 1}: SheetP) => {
  const f = useCurrentFrame();
  const H = M.sheetTabsTop - M.hdrTop;
  const nr = M.visRows;
  const w = (c: number) => widths?.[c - 1] ?? DEF_W;
  const xs: number[] = [];
  let acc = hdrW;
  let nc = 0;
  while (acc < M.W - 17 && nc < 60) { xs.push(acc); acc += w(nc + 1); nc++; }
  const rr = (r: Rng) => {
    const x = colX(widths, r.c1, hdrW);
    let wd = 0;
    for (let c = r.c1; c <= r.c2; c++) wd += w(c);
    const y = M.hdrH + (r.r1 - firstRow) * M.rowH;
    return {x, y: r.whole === "col" ? M.hdrH : y, w: wd, h: r.whole === "col" ? H - M.hdrH : (r.r2 - r.r1 + 1) * M.rowH};
  };
  const colSel = (c: number) => !!sel && c >= sel.c1 && c <= sel.c2;
  const rowSel = (r: number) => !!sel && r >= sel.r1 && r <= sel.r2;
  const whole = sel?.whole === "col";
  const ar = active ? rr({r1: active.r, c1: active.c, r2: active.r, c2: active.c}) : null;
  const sr = sel ? rr(sel) : null;
  const multi = !!sel && (sel.r1 !== sel.r2 || sel.c1 !== sel.c2);
  return (
    <div style={pos(0, M.hdrTop, M.W, H, {overflow: "hidden", background: "#fff", fontFamily: F.ui})}>
      <svg width={M.W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        <rect x="0" y="0" width={M.W} height={M.hdrH} fill={C.hdr} />
        <rect x="0" y="0" width={hdrW} height={H} fill={C.hdr} />
        {xs.map((x, i) => {
          const c = i + 1;
          const on = colSel(c);
          return (
            <g key={"ch" + c}>
              {on ? <rect x={x} y={0} width={w(c)} height={M.hdrH} fill={whole ? C.greenLine : C.sel} /> : null}
              {on && !whole ? <rect x={x} y={M.hdrH - 2} width={w(c)} height={2} fill={C.green} /> : null}
              <line x1={x + w(c) - 0.5} y1={0} x2={x + w(c) - 0.5} y2={M.hdrH} stroke="#C8C8C8" />
              <text x={x + w(c) / 2} y={14.5} fontSize={13} textAnchor="middle" fill={on ? (whole ? "#fff" : C.green) : C.hdrTxt} fontWeight={on ? 700 : 400}>{colName(c)}</text>
            </g>
          );
        })}
        {Array.from({length: nr}).map((_, i) => {
          const r = i + firstRow;
          const on = rowSel(r);
          const y = M.hdrH + i * M.rowH;
          return (
            <g key={"rh" + r}>
              {on ? <rect x={0} y={y} width={hdrW} height={M.rowH} fill={sel?.whole === "row" ? C.greenLine : C.sel} /> : null}
              {on ? <rect x={hdrW - 2} y={y} width={2} height={M.rowH} fill={C.green} /> : null}
              <line x1={0} y1={y + M.rowH - 0.5} x2={hdrW} y2={y + M.rowH - 0.5} stroke="#C8C8C8" />
              <text x={hdrW / 2} y={y + 14.5} fontSize={13} textAnchor="middle" fill={on ? C.green : C.hdrTxt} fontWeight={on ? 700 : 400}>{r}</text>
            </g>
          );
        })}
        {xs.map((x, i) => <line key={"vl" + i} x1={x + w(i + 1) - 0.5} y1={M.hdrH} x2={x + w(i + 1) - 0.5} y2={H} stroke={C.grid} />)}
        {Array.from({length: nr + 1}).map((_, i) => <line key={"hl" + i} x1={hdrW} y1={M.hdrH + (i + 1) * M.rowH - 0.5} x2={M.W} y2={M.hdrH + (i + 1) * M.rowH - 0.5} stroke={C.grid} />)}
        <path d={`M${hdrW - 4} ${M.hdrH - 3} L${hdrW - 4} ${M.hdrH - 12} L${hdrW - 13} ${M.hdrH - 3} Z`} fill="#B5B5B5" />
        <line x1={0} y1={M.hdrH - 0.5} x2={M.W} y2={M.hdrH - 0.5} stroke="#C8C8C8" />
        <line x1={hdrW - 0.5} y1={0} x2={hdrW - 0.5} y2={H} stroke="#C8C8C8" />
      </svg>
      {cells.map((c, i) => {
        const x = colX(widths, c.c, hdrW);
        const y = M.hdrH + (c.r - firstRow) * M.rowH;
        const a = c.a ?? "l";
        return (
          <div key={"c" + i} style={pos(x, y, w(c.c) - 1, M.rowH - 1, {background: c.bg, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: a === "r" ? "flex-end" : a === "c" ? "center" : "flex-start", padding: "0 3px", boxSizing: "border-box", fontSize: 14.67, color: c.color ?? C.txt, fontWeight: c.bold ? 700 : 400, whiteSpace: "nowrap", ...c.style})}>
            {c.t}
            {c.tri ? <div style={{position: "absolute", left: 0, top: 0, width: 0, height: 0, borderTop: "6px solid #21A366", borderRight: "6px solid transparent"}} /> : null}
          </div>
        );
      })}
      {sr && multi ? <div style={pos(sr.x, sr.y, sr.w, sr.h, {background: "rgba(16,124,65,0.13)"})} /> : null}
      {ar && multi ? <div style={pos(ar.x, ar.y, ar.w - 1, ar.h - 1, {background: "rgba(255,255,255,0.0)"})} /> : null}
      {sr ? <div style={pos(sr.x - 1, sr.y - 1, sr.w + 1, sr.h + 1, {border: `2px solid ${C.green}`, boxSizing: "border-box", pointerEvents: "none"})} /> : null}
      {sr && !whole ? <div style={pos(sr.x + sr.w - 5, sr.y + sr.h - 5, 7, 7, {background: C.green, border: "1px solid #fff", boxSizing: "border-box"})} /> : null}
      {ants ? (() => {
        const q = rr(ants);
        return <svg width={M.W} height={H} style={{position: "absolute", left: 0, top: 0}}><rect x={q.x} y={q.y} width={q.w} height={q.h} fill="none" stroke="#222" strokeWidth={1.6} strokeDasharray="4 3" strokeDashoffset={-(f % 7)} /></svg>;
      })() : null}
      <div style={pos(M.W - 17, M.hdrH, 17, H - M.hdrH, {background: "#F0F0F0", borderLeft: "1px solid #D6D6D6"})}><div style={pos(3, 6, 10, 70, {background: "#BDBDBD", borderRadius: 2})} /></div>
    </div>
  );
};

/* ───────────── The whole Excel window ───────────── */
export const ExcelApp = ({file = "Book1", tab = "Home", numFmt = "General", name = "A1", fx = "", fxGlow, editing = false, sheets = ["Sheet1"], activeSheet, status, sheet, children, ribbon = "home", pivotTabs = false}: AppP) => {
  const act = activeSheet ?? sheets[0];
  return (
    <div style={{position: "relative", width: M.W, height: M.H, overflow: "hidden", background: "#fff", fontFamily: F.ui, color: C.txt}}>
      {/* title bar + Quick Access */}
      <div style={pos(0, 0, M.W, M.titleH, {background: C.chrome})}>
        <div style={pos(12, 7, 18, 18, {background: C.green, borderRadius: 3})}><svg width="18" height="18" viewBox="0 0 18 18"><path d="M4 5 H14 M4 9 H14 M4 13 H14 M8 4 V14" stroke="#fff" strokeWidth="1.4" /></svg></div>
        <div style={pos(40, 8, 70, 16, {fontSize: 12.5, display: "flex", alignItems: "center"})}>AutoSave</div>
        <div style={pos(100, 9, 40, 14, flex({fontSize: 10.5, color: "#555"}))}><div style={{width: 24, height: 12, borderRadius: 6, border: "1.4px solid #777", boxSizing: "border-box", position: "relative", marginRight: 4}}><div style={{position: "absolute", left: 2, top: 1.5, width: 6, height: 6, borderRadius: 3, background: "#777"}} /></div>Off</div>
        <div style={pos(150, 8, 16, 16)}><Ico n="save" /></div>
        <div style={pos(176, 8, 16, 16)}><Ico n="undo" /></div>
        <div style={pos(200, 8, 16, 16)}><Ico n="redo" /></div>
        <div style={pos(228, 8, 220, 16, {fontSize: 12.5, display: "flex", alignItems: "center", whiteSpace: "nowrap"})}>{file} <span style={{color: "#777", marginLeft: 6}}>• Saved</span> <span style={{fontSize: 8, marginLeft: 4}}>▾</span></div>
        <div style={pos(470, 4, 340, 24, flex({background: "#fff", border: "1px solid #CFCFCF", borderRadius: 4, boxSizing: "border-box", padding: "0 8px", gap: 6, fontSize: 12.5, color: "#666"}))}><Ico n="search" s={14} />Search</div>
        <div style={pos(1096, 3, 26, 26)}><LogoBadge s={26} /></div>
        <div style={pos(1142, 0, 46, 32, flex({justifyContent: "center"}))}><div style={{width: 10, height: 1.2, background: "#222"}} /></div>
        <div style={pos(1188, 0, 46, 32, flex({justifyContent: "center"}))}><div style={{width: 9, height: 9, border: "1.2px solid #222", boxSizing: "border-box"}} /></div>
        <div style={pos(1234, 0, 46, 32, flex({justifyContent: "center", fontSize: 16, color: "#222"}))}>✕</div>
      </div>
      {/* tabs */}
      <div style={pos(0, M.tabsTop, M.W, M.tabsH, {background: C.chrome})}>
        {(pivotTabs ? [...TABS, ["PivotTable Analyze", 660] as [string, number], ["Design", 800] as [string, number]] : TABS).map(([t, x]) => (
          <div key={t} style={pos(x - 6, 0, t.length * 7.4 + 12, M.tabsH, flex({justifyContent: "center", fontSize: 13, fontWeight: t === tab ? 700 : 400, color: t === tab ? "#1F1F1F" : "#404040"}))}>
            {t}
            {t === tab ? <div style={pos(6, M.tabsH - 4, t.length * 7.4, 3, {background: C.green, borderRadius: 2})} /> : null}
          </div>
        ))}
        <div style={pos(1084, 3, 88, 22, flex({gap: 5, fontSize: 12.5, paddingLeft: 6, border: "1px solid #D0D0D0", borderRadius: 4, boxSizing: "border-box", background: "#fff"}))}><Ico n="comment" s={14} />Comments</div>
        <div style={pos(1178, 3, 84, 22, flex({gap: 5, fontSize: 12.5, paddingLeft: 8, borderRadius: 4, background: C.green, color: "#fff", boxSizing: "border-box"}))}><Ico n="share" s={14} />Share</div>
      </div>
      {/* ribbon (Home) */}
      <div style={pos(0, M.ribTop, M.W, M.ribH, {background: C.ribbon, borderTop: "1px solid #E4E4E4", borderBottom: `1px solid ${C.line}`, boxSizing: "border-box"})} />
      {ribbon === "pivot" ? <PivotRibbon /> : (<div>
      <Big x={10} w={46} icon="paste" label="Paste" />
      <Sm x={62} y={M.ribTop + 6} icon="cut" label="Cut" w={70} />
      <Sm x={62} y={M.ribTop + 30} icon="copy" label="Copy" w={70} caret />
      <Sm x={62} y={M.ribTop + 54} icon="painter" label="Format Painter" w={72} />
      <Group x={6} w={130} label="Clipboard" />
      <Box x={146} y={M.ribTop + 6} w={90} label="Calibri" />
      <Box x={240} y={M.ribTop + 6} w={40} label="11" />
      <Txt x={286} y={M.ribTop + 6} size={13} b>A<span style={{fontSize: 9}}>▴</span></Txt>
      <Txt x={308} y={M.ribTop + 6} size={11} b>A<span style={{fontSize: 9}}>▾</span></Txt>
      <Txt x={146} y={M.ribTop + 34} b>B</Txt><Txt x={168} y={M.ribTop + 34} i>I</Txt><Txt x={190} y={M.ribTop + 34} u>U</Txt>
      <Sm x={216} y={M.ribTop + 34} icon="borders" caret w={32} /><Sm x={250} y={M.ribTop + 34} icon="fill" caret w={32} /><Sm x={284} y={M.ribTop + 34} icon="fontc" caret w={32} />
      <Group x={136} w={186} label="Font" />
      <Sm x={328} y={M.ribTop + 6} icon="top" /><Sm x={352} y={M.ribTop + 6} icon="mid" /><Sm x={376} y={M.ribTop + 6} icon="bot" /><Sm x={402} y={M.ribTop + 6} icon="orient" caret w={32} />
      <Sm x={440} y={M.ribTop + 6} icon="wrap" label="Wrap Text" w={86} />
      <Sm x={328} y={M.ribTop + 34} icon="alL" /><Sm x={352} y={M.ribTop + 34} icon="alC" /><Sm x={376} y={M.ribTop + 34} icon="alR" /><Sm x={402} y={M.ribTop + 34} icon="indL" /><Sm x={426} y={M.ribTop + 34} icon="indR" />
      <Sm x={444} y={M.ribTop + 34} icon="merge" label="Merge & Center" w={112} caret />
      <Group x={322} w={238} label="Alignment" />
      <Box x={NUMBOX.x} y={NUMBOX.y} w={NUMBOX.w} label={numFmt} />
      <Txt x={NUMBOX.x} y={M.ribTop + 34} w={34} size={13}>$<span style={{fontSize: 8, marginLeft: 3}}>▾</span></Txt><Txt x={NUMBOX.x + 38} y={M.ribTop + 34} size={14}>%</Txt><Txt x={NUMBOX.x + 62} y={M.ribTop + 34} size={17} b>,</Txt>
      <Sm x={NUMBOX.x + 90} y={M.ribTop + 34} icon="decL" /><Sm x={NUMBOX.x + 116} y={M.ribTop + 34} icon="decR" />
      <Group x={556} w={198} label="Number" />
      <Big x={760} w={56} icon="cond" label={"Conditional\nFormatting"} /><Big x={818} w={52} icon="table" label={"Format as\nTable"} /><Big x={872} w={46} icon="styles" label={"Cell\nStyles"} />
      <Group x={756} w={168} label="Styles" />
      <Sm x={934} y={M.ribTop + 6} icon="ins" label="Insert" w={80} caret /><Sm x={934} y={M.ribTop + 30} icon="del" label="Delete" w={80} caret /><Sm x={934} y={M.ribTop + 54} icon="fmt" label="Format" w={80} caret />
      <Group x={928} w={96} label="Cells" />
      <Sm x={1032} y={M.ribTop + 6} icon="sigma" label="AutoSum" w={72} caret /><Sm x={1032} y={M.ribTop + 30} icon="fillD" label="Fill" w={72} caret /><Sm x={1032} y={M.ribTop + 54} icon="clear" label="Clear" w={72} caret />
      <Big x={1106} w={52} icon="sort" label={"Sort &\nFilter"} /><Big x={1160} w={52} icon="find" label={"Find &\nSelect"} />
      <Group x={1026} w={190} label="Editing" />
      <Big x={1224} w={46} icon="analyze" label={"Analyze\nData"} />
      </div>)}
      {/* formula bar */}
      <div style={pos(0, M.fbTop, M.W, M.fbH, {background: "#fff", borderBottom: `1px solid ${C.line}`, boxSizing: "border-box"})} />
      <div style={pos(4, M.fbTop + 3, 104, 22, flex({justifyContent: "space-between", padding: "0 6px 0 8px", border: "1px solid #BDBDBD", borderRadius: 2, boxSizing: "border-box", fontSize: 13.5}))}><span>{name}</span><span style={{fontSize: 8, color: "#555"}}>▾</span></div>
      <div style={pos(114, M.fbTop + 8, 4, 12, {borderLeft: "2px dotted #AAA"})} />
      <div style={pos(124, M.fbTop + 3, 22, 22, flex({justifyContent: "center", fontSize: 15, color: editing ? "#333" : "#B5B5B5"}))}>✕</div>
      <div style={pos(148, M.fbTop + 3, 22, 22, flex({justifyContent: "center", fontSize: 15, color: editing ? "#333" : "#B5B5B5"}))}>✓</div>
      <div style={pos(172, M.fbTop + 3, 26, 22, flex({justifyContent: "center", fontSize: 13, fontStyle: "italic", fontWeight: 700, color: "#444", fontFamily: "Georgia, serif"}))}>fx</div>
      <div style={pos(204, M.fbTop + 3, M.W - 204 - 30, 22, flex({padding: "0 8px", border: `1px solid ${fxGlow ?? "#BDBDBD"}`, borderRadius: 2, boxSizing: "border-box", fontSize: 14.67, boxShadow: fxGlow ? `0 0 12px ${fxGlow}, inset 0 0 10px ${rgba(fxGlow, 0.25)}` : "none", background: fxGlow ? rgba(fxGlow, 0.08) : "#fff"}))}>{fx}</div>
      <div style={pos(M.W - 24, M.fbTop + 3, 20, 22, flex({justifyContent: "center", fontSize: 11, color: "#555"}))}>⌄</div>
      <Sheet {...sheet} />
      {/* sheet tabs bar */}
      <div style={pos(0, M.sheetTabsTop, M.W, M.sheetTabsH, {background: C.chrome, borderTop: `1px solid ${C.line}`, boxSizing: "border-box"})}>
        <div style={pos(8, 4, 40, 18, {fontSize: 11, color: "#777", letterSpacing: 8})}>◂▸</div>
        {sheets.map((s, i) => (
          <div key={s} style={pos(58 + sheets.slice(0, i).reduce((x, t) => x + (t.length > 10 ? 116 : 92), 0), 0, s.length > 10 ? 104 : 88, M.sheetTabsH - 1, flex({justifyContent: "center", fontSize: 13, background: s === act ? "#fff" : "transparent", color: s === act ? C.green : "#444", fontWeight: s === act ? 700 : 400, borderBottom: s === act ? `2px solid ${C.green}` : "none", boxSizing: "border-box"}))}>{s}</div>
        ))}
        <div style={pos(58 + sheets.reduce((x, t) => x + (t.length > 10 ? 116 : 92), 0) + 4, 2, 22, 22, flex({justifyContent: "center", fontSize: 18, color: "#444"}))}>+</div>
        <div style={pos(720, 7, 540, 11, {background: "#E4E4E4", border: "1px solid #D0D0D0", boxSizing: "border-box"})}><div style={pos(2, 1, 200, 7, {background: "#BDBDBD"})} /></div>
      </div>
      {/* status bar */}
      <div style={pos(0, M.statusTop, M.W, M.statusH, {background: C.chrome, borderTop: `1px solid ${C.line}`, boxSizing: "border-box", fontSize: 12, color: "#333"})}>
        <div style={pos(10, 4, 60, 16)}>Ready</div>
        <div style={pos(70, 4, 200, 16, {color: "#555"})}>♿ Accessibility: Good to go</div>
        <div style={pos(500, 4, 500, 16, {textAlign: "right"})}>
          {status ? [status.avg ? `Average: ${status.avg}` : "", status.count ? `Count: ${status.count}` : "", status.sum ? `Sum: ${status.sum}` : ""].filter((s) => s).join("      ") : ""}
        </div>
        <div style={pos(1030, 5, 70, 14, {letterSpacing: 10, color: "#555", fontSize: 11})}>▦▤▥</div>
        <div style={pos(1118, 3, 20, 18, {fontSize: 15, color: "#444", textAlign: "center"})}>−</div>
        <div style={pos(1142, 11, 76, 2, {background: "#9A9A9A"})} />
        <div style={pos(1177, 6, 3, 12, {background: "#444"})} />
        <div style={pos(1222, 3, 20, 18, {fontSize: 15, color: "#444", textAlign: "center"})}>+</div>
        <div style={pos(1240, 4, 38, 16, {textAlign: "right", paddingRight: 6, boxSizing: "border-box"})}>100%</div>
      </div>
      {children}
    </div>
  );
};

/* ───────────── Format Cells dialog (Windows look) ───────────── */
const CATS = ["General", "Number", "Currency", "Accounting", "Date", "Time", "Percentage", "Fraction", "Scientific", "Text", "Special", "Custom"];
const FMTS = ["General", "0", "0.00", "#,##0", "#,##0.00", "#,##0_);(#,##0)", "#,##0_);[Red](#,##0)", "0%"];
export const DLG = {w: 420, h: 432};
export type DlgP = {x: number; y: number; k?: number; cat?: string; sample?: ReactNode; sampleColor?: string; type?: ReactNode; listSel?: number; okHot?: number; list?: string[]; desc?: string; typeGlow?: string};
export const FormatCellsDialog = ({x, y, k = 1, cat = "Custom", sample = "", sampleColor, type = "", listSel = -1, okHot = 0, list = FMTS, desc, typeGlow}: DlgP) => {
  const f = useCurrentFrame();
  const L = (cx: number, cy: number, t: string) => <div style={pos(cx, cy, 200, 16, {fontSize: 12.5})}>{t}</div>;
  return (
    <div style={{...pos(x, y, DLG.w, DLG.h, {background: "#F0F0F0", border: "1px solid #6B6B6B", boxShadow: "0 12px 40px rgba(0,0,0,.45)", opacity: k, transform: `scale(${0.94 + 0.06 * k})`, transformOrigin: "50% 40%", fontFamily: F.ui, color: "#111", boxSizing: "border-box"})}}>
      <div style={pos(0, 0, DLG.w, 30, {background: "#fff", borderBottom: "1px solid #E0E0E0"})}>
        <div style={pos(12, 7, 200, 16, {fontSize: 13})}>Format Cells</div>
        <div style={pos(DLG.w - 84, 0, 40, 30, flex({justifyContent: "center", fontSize: 13})) }>?</div>
        <div style={pos(DLG.w - 44, 0, 44, 30, flex({justifyContent: "center", fontSize: 15}))}>✕</div>
      </div>
      {["Number", "Alignment", "Font", "Border", "Fill", "Protection"].map((t, i) => (
        <div key={t} style={pos(10 + i * 64, 38, 64, 24, flex({justifyContent: "center", fontSize: 12.5, background: i === 0 ? "#fff" : "#F0F0F0", border: "1px solid #D0D0D0", borderBottom: i === 0 ? "1px solid #fff" : "1px solid #D0D0D0", boxSizing: "border-box", zIndex: i === 0 ? 2 : 1}))}>{t}</div>
      ))}
      <div style={pos(10, 61, 400, 308, {background: "#fff", border: "1px solid #D0D0D0", boxSizing: "border-box"})} />
      {L(22, 72, "Category:")}
      <div style={pos(22, 90, 128, 220, {border: "1px solid #7A7A7A", background: "#fff", boxSizing: "border-box", overflow: "hidden"})}>
        {CATS.map((c) => <div key={c} style={{height: 18, lineHeight: "18px", padding: "0 6px", fontSize: 12.5, background: c === cat ? "#CCE8FF" : "transparent", outline: c === cat ? "1px solid #66B5F0" : "none"}}>{c}</div>)}
      </div>
      <div style={pos(162, 70, 240, 50, {border: "1px solid #D0D0D0", boxSizing: "border-box"})} />
      <div style={pos(170, 63, 50, 14, {background: "#fff", fontSize: 12, padding: "0 3px"})}>Sample</div>
      <div style={pos(172, 86, 220, 26, flex({fontSize: 15, color: sampleColor ?? "#111", fontWeight: 400}))}>{sample}</div>
      {L(162, 128, "Type:")}
      <div style={pos(162, 146, 240, 24, flex({border: `1.5px solid ${typeGlow ?? "#7A7A7A"}`, background: "#fff", boxSizing: "border-box", padding: "0 6px", fontFamily: F.mono, fontSize: 13, boxShadow: typeGlow ? `0 0 12px ${typeGlow}` : "none", whiteSpace: "nowrap", overflow: "hidden"}))}>{type}<span style={{display: "inline-block", width: 1.5, height: 15, background: Math.floor(f / 15) % 2 ? "transparent" : "#111", marginLeft: 1}} /></div>
      <div style={pos(162, 174, 240, 118, {border: "1px solid #7A7A7A", background: "#fff", boxSizing: "border-box", overflow: "hidden"})}>
        {list.map((c, i) => <div key={c} style={{height: 16, lineHeight: "16px", padding: "0 6px", fontSize: 12, fontFamily: F.mono, background: i === listSel ? "#CCE8FF" : "transparent"}}>{c}</div>)}
      </div>
      <div style={pos(332, 296, 70, 22, flex({justifyContent: "center", fontSize: 12.5, border: "1px solid #ADADAD", background: "#E1E1E1", boxSizing: "border-box"}))}>Delete</div>
      <div style={pos(162, 322, 240, 40, {fontSize: 11.5, color: "#333", lineHeight: "14px"})}>{desc ?? "Type the number format code, using one of the existing codes as a starting point."}</div>
      <div style={pos(240, 386, 80, 26, flex({justifyContent: "center", fontSize: 12.5, border: "2px solid #0078D7", background: okHot ? "#CCE4F7" : "#E1E1E1", boxSizing: "border-box", transform: `scale(${1 - 0.04 * okHot})`, boxShadow: okHot ? "0 0 10px #38BDF8" : "none"}))}>OK</div>
      <div style={pos(328, 386, 80, 26, flex({justifyContent: "center", fontSize: 12.5, border: "1px solid #ADADAD", background: "#E1E1E1", boxSizing: "border-box"}))}>Cancel</div>
    </div>
  );
};

/* ───────────── overlays: glow, callout, cursor, keycaps, x-ray ───────────── */
export const Glow = ({x, y, w, h, color, k = 1, fill = 0.08, r = 3}: {x: number; y: number; w: number; h: number; color: string; k?: number; fill?: number; r?: number}) => (
  <div style={pos(x - 2, y - 2, w + 4, h + 4, {border: `2px solid ${color}`, borderRadius: r, boxShadow: `0 0 ${12 * k}px ${color}, inset 0 0 ${8 * k}px ${rgba(color, 0.3)}`, opacity: k, background: rgba(color, fill), boxSizing: "border-box", pointerEvents: "none"})} />
);
export const Callout = ({x, y, w, tx, ty, color, k = 1, children, size = 15}: {x: number; y: number; w: number; tx: number; ty: number; color: string; k?: number; children: ReactNode; size?: number}) => {
  const h = size + 14;
  const sx = clamp(tx, x + 14, x + w - 14);
  const sy = ty > y ? y + h : y;
  return (
    <div style={{position: "absolute", left: 0, top: 0, width: M.W, height: M.H, opacity: k, pointerEvents: "none"}}>
      <svg width={M.W} height={M.H} style={{position: "absolute", left: 0, top: 0}}>
        <line x1={sx} y1={sy} x2={tx} y2={ty} stroke={color} strokeWidth={2} />
        <circle cx={tx} cy={ty} r={4} fill={color} />
      </svg>
      <div style={pos(x, y - 0 + (1 - k) * 6, w, h, flex({justifyContent: "center", background: C.slate, border: `1.5px solid ${color}`, borderRadius: 6, color, fontWeight: 700, fontSize: size, boxShadow: `0 0 12px ${rgba(color, 0.55)}`, boxSizing: "border-box", whiteSpace: "nowrap", fontFamily: F.ui}))}>{children}</div>
    </div>
  );
};
export type Key = {f: number; x: number; y: number; click?: boolean};
export const Cursor = ({keys}: {keys: Key[]}) => {
  const f = useCurrentFrame();
  if (!keys.length || f < keys[0].f) return null;
  let x = keys[keys.length - 1].x;
  let y = keys[keys.length - 1].y;
  for (let i = 0; i < keys.length - 1; i++) {
    if (f >= keys[i].f && f < keys[i + 1].f) {
      const t = eio(prog(f, keys[i].f, keys[i + 1].f - keys[i].f));
      x = lerp(keys[i].x, keys[i + 1].x, t);
      y = lerp(keys[i].y, keys[i + 1].y, t);
    }
  }
  const ck = keys.find((k) => k.click && f >= k.f && f < k.f + 12);
  return (
    <div style={{position: "absolute", left: 0, top: 0, width: M.W, height: M.H, pointerEvents: "none"}}>
      {ck ? <div style={pos(ck.x - 12, ck.y - 12, 24, 24, {borderRadius: 12, border: `2px solid ${C.blue}`, opacity: 1 - (f - ck.f) / 12, transform: `scale(${0.6 + (f - ck.f) / 12})`})} /> : null}
      <svg width="18" height="24" viewBox="0 0 18 24" style={{position: "absolute", left: x, top: y}}><path d="M1 1 V18 L5.5 14 L9 21.5 L12 20 L8.6 13 H14.5 Z" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" /></svg>
    </div>
  );
};
export const KeyCaps = ({x, y, keys, k = 1}: {x: number; y: number; keys: string[]; k?: number}) => (
  <div style={{position: "absolute", left: x, top: y + (1 - k) * 8, opacity: k, display: "flex", gap: 6, alignItems: "center", fontFamily: F.mono}}>
    {keys.map((t, i) => (
      <div key={i} style={{display: "flex", alignItems: "center", gap: 6}}>
        {i > 0 ? <span style={{color: C.slate, fontWeight: 700, fontSize: 16}}>+</span> : null}
        <div style={{minWidth: 34, height: 32, padding: "0 10px", boxSizing: "border-box", borderRadius: 6, background: C.slate, color: "#fff", border: `1.5px solid ${C.blue}`, borderBottom: `4px solid ${C.blue}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700}}>{t}</div>
      </div>
    ))}
  </div>
);
export const XRay = ({x, y, w, h, t, color = C.purple}: {x: number; y: number; w: number; h: number; t: number; color?: string}) => {
  const sy = y + (h - 3) * clamp(t);
  return (
    <div style={{pointerEvents: "none"}}>
      <Glow x={x} y={y} w={w} h={h} color={color} k={1} fill={0.14 * (1 - Math.abs(t - 0.5))} />
      <div style={pos(x - 6, sy, w + 12, 3, {background: color, boxShadow: `0 0 14px ${color}`})} />
    </div>
  );
};

/* ───────────── camera (2D smooth zoom, clamped so the window always fills the frame) ───────────── */
export const Camera = ({z = 1, fx = 0, fy = 0, children}: {z?: number; fx?: number; fy?: number; children: ReactNode}) => {
  const s = M.S * z;
  const vw = 1920;
  const vh = M.H * M.S;
  const tx = clamp(vw / 2 - fx * s, vw - M.W * s, 0);
  const ty = clamp(vh / 2 - fy * s, vh - M.H * s, 0);
  return <div style={{position: "absolute", left: 0, top: 0, width: M.W, height: M.H, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})`}}>{children}</div>;
};

/* ───────────── caption strip + badges (1920-space) ───────────── */
export const Strip = ({children}: {children?: ReactNode}) => (
  <div style={pos(0, M.H * M.S, 1920, M.capH, {background: `linear-gradient(180deg, ${C.slate2}, ${C.slate})`, borderTop: `3px solid ${C.green}`, boxSizing: "border-box"})}>{children}</div>
);
export const Cap = ({f, a, b, children}: {f: number; a: number; b: number; children: ReactNode}) => {
  const k = Math.min(prog(f, a, 10), 1 - prog(f, b - 10, 10));
  if (k <= 0) return null;
  return <div style={pos(0, 0, 1920, M.capH - 3, {display: "flex", alignItems: "center", justifyContent: "center", opacity: k, transform: `translateY(${(1 - k) * 10}px)`})}>{children}</div>;
};
export const TopBadge = ({ar, en}: {ar: string; en: string}) => (
  <div style={{display: "flex", alignItems: "center", gap: 18, padding: "10px 30px", borderRadius: 40, background: rgba(C.blue, 0.12), border: `2px solid ${C.blue}`, boxShadow: `0 0 18px ${rgba(C.blue, 0.4)}`}}>
    <span dir="rtl" style={{fontFamily: F.ar, fontWeight: 700, fontSize: 34, color: C.ink}}>{ar}</span>
    <span style={{color: C.blue, fontSize: 30}}>|</span>
    <span dir="ltr" style={{fontFamily: F.ui, fontWeight: 700, fontSize: 32, color: C.blue}}>{en}</span>
  </div>
);
export const Tag = ({label, parts, color}: {label: string; parts: {t: string; c?: string}[]; color: string}) => (
  <div style={{display: "flex", alignItems: "center", gap: 16, padding: "10px 28px", borderRadius: 12, background: rgba(color, 0.12), border: `2px solid ${color}`, boxShadow: `0 0 18px ${rgba(color, 0.35)}`, fontFamily: F.mono, fontSize: 30, fontWeight: 700, color: C.ink, whiteSpace: "pre"}} dir="ltr">
    <span style={{color}}>{label}</span><span style={{color}}>──►</span>
    {parts.map((p, i) => <span key={i} style={{color: p.c ?? C.ink}}>{p.t}</span>)}
  </div>
);

/* ───────────── generic scene fade (flat 2D) ───────────── */
export const FadeIn = ({f, d = 12, children}: {f: number; d?: number; children: ReactNode}) => <div style={{opacity: prog(f, 0, d), width: "100%", height: "100%", position: "absolute", left: 0, top: 0}}>{children}</div>;

/* ───────────── Excel formula-entry helpers: autocomplete list, argument tooltip, spill border ───────────── */
const FNS = ["CHOOSE", "CHOOSECOLS", "CHOOSEROWS", "DROP", "HSTACK", "SORT", "SORTBY", "TAKE", "UNIQUE", "VALUE", "VLOOKUP", "VSTACK"];
export const AutoComp = ({x, y, typed}: {x: number; y: number; typed: string}) => {
  const q = typed.replace(/^=/, "").toUpperCase();
  const items = FNS.filter((s) => s.startsWith(q)).slice(0, 6);
  if (!q || !items.length || q.length > 5) return null;
  return (
    <div style={pos(x, y, 190, items.length * 20 + 4, {background: "#fff", border: "1px solid #8A8A8A", boxShadow: "0 4px 12px rgba(0,0,0,.25)", boxSizing: "border-box", fontFamily: F.ui, fontSize: 13})}>
      {items.map((s, i) => (
        <div key={s} style={{height: 20, display: "flex", alignItems: "center", gap: 6, padding: "0 6px", background: i === 0 ? "#CCE8FF" : "transparent"}}><span style={{color: C.green, fontStyle: "italic", fontWeight: 700, fontFamily: "Georgia, serif", fontSize: 11}}>fx</span>{s}</div>
      ))}
    </div>
  );
};
export const ArgTip = ({x, y, sig, cur}: {x: number; y: number; sig: string[]; cur: number}) => (
  <div style={pos(x, y, 440, 22, {background: "#FFFFE1", border: "1px solid #8A8A8A", boxShadow: "0 2px 8px rgba(0,0,0,.2)", boxSizing: "border-box", fontFamily: F.ui, fontSize: 12.5, padding: "0 8px", display: "flex", alignItems: "center", whiteSpace: "nowrap"})}>
    {sig.map((s, i) => <span key={i} style={{fontWeight: i === cur ? 700 : 400, marginRight: 3}}>{s}</span>)}
  </div>
);
export const SpillBox = ({r1, c1, r2, c2, widths, k = 1, color = "#1F6FEB"}: {r1: number; c1: number; r2: number; c2: number; widths?: number[]; k?: number; color?: string}) => {
  const q = rangeRect(r1, c1, r2, c2, widths);
  return <div style={pos(q.x - 1, q.y - 1, q.w + 1, q.h + 1, {border: `2px solid ${color}`, boxSizing: "border-box", opacity: k, background: rgba(color, 0.05), pointerEvents: "none"})} />;
};

/* ───────────── PivotTable Analyze ribbon, Fields pane, menus and calculated-field dialogs ───────────── */
export const FIS = {x: 726, y: M.ribTop + 6, w: 84, h: 70};
const PivotRibbon = () => (
  <div>
    <div style={pos(0, M.ribTop, M.W, M.ribH, {background: C.ribbon, borderTop: "1px solid #E4E4E4", borderBottom: `1px solid ${C.line}`, boxSizing: "border-box"})} />
    <div style={pos(10, M.ribTop + 8, 120, 22, flex({border: "1px solid #BDBDBD", background: "#fff", padding: "0 6px", fontSize: 12.5, boxSizing: "border-box"}))}>PivotTable1</div>
    <Sm x={10} y={M.ribTop + 34} icon="pvt" label="Options" w={80} caret /><Group x={6} w={140} label="PivotTable" />
    <div style={pos(156, M.ribTop + 8, 120, 22, flex({border: "1px solid #BDBDBD", background: "#fff", padding: "0 6px", fontSize: 12, boxSizing: "border-box", whiteSpace: "nowrap", overflow: "hidden"}))}>Sum of Sales_Amount</div>
    <Sm x={156} y={M.ribTop + 34} icon="fmt" label="Field Settings" w={110} /><Group x={150} w={140} label="Active Field" />
    <Big x={300} w={56} icon="group" label={"Group\nSelection"} /><Group x={296} w={66} label="Group" />
    <Big x={368} w={60} icon="slicer" label={"Insert\nSlicer"} /><Big x={430} w={64} icon="timeline" label={"Insert\nTimeline"} /><Big x={496} w={70} icon="funnel" label={"Filter\nConnections"} /><Group x={364} w={208} label="Filter" />
    <Big x={580} w={56} icon="refresh" label={"Refresh"} /><Big x={638} w={64} icon="source" label={"Change Data\nSource"} /><Group x={576} w={132} label="Data" />
    <Big x={FIS.x} w={FIS.w} icon="fis" label={"Fields, Items,\n& Sets"} />
    <Sm x={820} y={M.ribTop + 6} icon="source" label="OLAP Tools" w={90} caret /><Sm x={820} y={M.ribTop + 34} icon="share" label="Relationships" w={96} /><Group x={716} w={214} label="Calculations" />
    <Big x={940} w={64} icon="pchart" label={"PivotChart"} /><Big x={1006} w={90} icon="pvt" label={"Recommended\nPivotTables"} /><Group x={936} w={166} label="Tools" />
    <Sm x={1110} y={M.ribTop + 6} icon="flist" label="Field List" w={90} /><Sm x={1110} y={M.ribTop + 30} icon="ins" label="+/- Buttons" w={96} /><Sm x={1110} y={M.ribTop + 54} icon="table" label="Field Headers" w={110} /><Group x={1106} w={170} label="Show" />
  </div>
);
export const Menu = ({x, y, items, hot = -1, k = 1}: {x: number; y: number; items: [string, string][]; hot?: number; k?: number}) => (
  <div style={pos(x, y, 236, items.length * 26 + 8, {background: "#fff", border: "1px solid #8A8A8A", boxShadow: "0 6px 18px rgba(0,0,0,.3)", boxSizing: "border-box", padding: "4px 0", opacity: k, fontFamily: F.ui, fontSize: 13})}>
    {items.map(([ic, t], i) => <div key={t} style={{height: 26, display: "flex", alignItems: "center", gap: 10, padding: "0 10px", background: i === hot ? "#CCE8FF" : "transparent"}}><Ico n={ic} s={16} />{t}</div>)}
  </div>
);
export type PF = {n: string; on: boolean; calc?: boolean};
export const PivotPane = ({x = 1000, fields, areas, k = 1}: {x?: number; fields: PF[]; areas: {f: string[]; c: string[]; r: string[]; v: string[]}; k?: number}) => {
  const box = (t: string, l: number, tp: number, items: string[]) => (
    <div style={pos(l, tp, 124, 58, {border: "1px solid #C8C8C8", background: "#fff", boxSizing: "border-box", padding: "2px 4px", fontSize: 11})}>
      <div style={{color: "#555"}}>{t}</div>
      {items.map((s) => <div key={s} style={{height: 15, background: "#EEF3FA", border: "1px solid #BFD0E8", marginTop: 1, padding: "0 4px", whiteSpace: "nowrap", overflow: "hidden", lineHeight: "13px"}}>{s}</div>)}
    </div>
  );
  return (
    <div style={pos(x, M.hdrTop, M.W - x, M.sheetTabsTop - M.hdrTop, {background: "#fff", borderLeft: "1px solid #BDBDBD", opacity: k, fontFamily: F.ui, fontSize: 12.5, boxSizing: "border-box", overflow: "hidden"})}>
      <div style={pos(0, 0, M.W - x, 26, {background: "#F3F3F3", padding: "5px 8px", fontWeight: 700, boxSizing: "border-box"})}>PivotTable Fields</div>
      <div style={pos(8, 32, 250, 16, {color: "#555", fontSize: 11.5})}>Choose fields to add to report:</div>
      <div style={pos(8, 52, 262, 20, {border: "1px solid #BDBDBD", boxSizing: "border-box", padding: "0 6px", color: "#888"})}>Search</div>
      {fields.map((f, i) => (
        <div key={f.n} style={pos(8, 78 + i * 19, 262, 19, {display: "flex", alignItems: "center", gap: 6})}>
          <div style={{width: 12, height: 12, border: "1px solid #666", background: f.on ? C.green : "#fff", color: "#fff", fontSize: 10, lineHeight: "10px", textAlign: "center", flex: "none"}}>{f.on ? "✓" : ""}</div>
          {f.calc ? <span style={{fontStyle: "italic", fontWeight: 700, color: "#2B6CB0", fontFamily: "Georgia, serif", fontSize: 11}}>fx</span> : null}{f.n}
        </div>
      ))}
      {box("Filters", 8, 248, areas.f)}{box("Columns", 140, 248, areas.c)}{box("Rows", 8, 312, areas.r)}{box("Σ Values", 140, 312, areas.v)}
    </div>
  );
};
const Win = ({x, y, w, h, title, k, children}: {x: number; y: number; w: number; h: number; title: string; k: number; children: ReactNode}) => (
  <div style={pos(x, y, w, h, {background: "#F0F0F0", border: "1px solid #6B6B6B", boxShadow: "0 12px 40px rgba(0,0,0,.45)", opacity: k, transform: `scale(${0.94 + 0.06 * k})`, transformOrigin: "50% 40%", fontFamily: F.ui, color: "#111", boxSizing: "border-box", fontSize: 12.5})}>
    <div style={pos(0, 0, w, 30, {background: "#fff", borderBottom: "1px solid #E0E0E0"})}><div style={pos(12, 7, w - 60, 16, {fontSize: 13})}>{title}</div><div style={pos(w - 44, 0, 44, 30, flex({justifyContent: "center", fontSize: 15}))}>✕</div></div>
    {children}
  </div>
);
const Bt = ({x, y, w, t, hot}: {x: number; y: number; w: number; t: string; hot?: boolean}) => <div style={pos(x, y, w, 24, flex({justifyContent: "center", border: hot ? "2px solid #0078D7" : "1px solid #ADADAD", background: hot ? "#CCE4F7" : "#E1E1E1", boxSizing: "border-box", boxShadow: hot ? "0 0 10px #38BDF8" : "none"}))}>{t}</div>;
const Inp = ({x, y, w, children, glow}: {x: number; y: number; w: number; children?: ReactNode; glow?: string}) => {
  const f = useCurrentFrame();
  return <div style={pos(x, y, w, 24, flex({border: `1.5px solid ${glow ?? "#7A7A7A"}`, background: "#fff", boxSizing: "border-box", padding: "0 6px", whiteSpace: "nowrap", overflow: "hidden", boxShadow: glow ? `0 0 12px ${glow}` : "none", fontSize: 13}))}>{children}{glow ? <span style={{display: "inline-block", width: 1.5, height: 15, background: Math.floor(f / 15) % 2 ? "transparent" : "#111", marginLeft: 1}} /> : null}</div>;
};
export const CalcDlg = ({x, y, k = 1, kind, name, formula, list, sel = -1, items, hot, glow}: {x: number; y: number; k?: number; kind: "field" | "item"; name: ReactNode; formula: ReactNode; list: string[]; sel?: number; items?: string[]; hot?: "add" | "ok" | "insert"; glow?: "name" | "formula"}) => (
  <Win x={x} y={y} w={430} h={kind === "item" ? 340 : 300} title={kind === "field" ? "Insert Calculated Field" : "Insert Calculated Item in \"Branch\""} k={k}>
    <div style={pos(14, 42, 60, 16)}>Name:</div><Inp x={78} y={38} w={226} glow={glow === "name" ? C.blue : undefined}>{name}</Inp>
    <Bt x={314} y={38} w={100} t="Add" hot={hot === "add"} />
    <div style={pos(14, 76, 60, 16)}>Formula:</div><Inp x={78} y={72} w={226} glow={glow === "formula" ? C.blue : undefined}>{formula}</Inp>
    <Bt x={314} y={72} w={100} t="Delete" />
    <div style={pos(14, 108, 60, 16)}>Fields:</div>
    <div style={pos(78, 108, 226, kind === "item" ? 80 : 130, {border: "1px solid #7A7A7A", background: "#fff", boxSizing: "border-box", overflow: "hidden"})}>{list.map((s, i) => <div key={s} style={{height: 18, lineHeight: "18px", padding: "0 6px", background: i === sel ? "#CCE8FF" : "transparent"}}>{s}</div>)}</div>
    {kind === "item" ? <div style={pos(14, 198, 60, 16)}>Items:</div> : null}
    {kind === "item" ? <div style={pos(78, 198, 226, 80, {border: "1px solid #7A7A7A", background: "#fff", boxSizing: "border-box", overflow: "hidden"})}>{(items ?? []).map((s, i) => <div key={s} style={{height: 18, lineHeight: "18px", padding: "0 6px", background: i === sel - 100 ? "#CCE8FF" : "transparent"}}>{s}</div>)}</div> : null}
    <Bt x={314} y={kind === "item" ? 198 : 108} w={100} t={kind === "item" ? "Insert Item" : "Insert Field"} hot={hot === "insert"} />
    <Bt x={232} y={kind === "item" ? 300 : 260} w={84} t="OK" hot={hot === "ok"} /><Bt x={326} y={kind === "item" ? 300 : 260} w={84} t="Close" />
  </Win>
);
export const SolveDlg = ({x, y, k = 1, rows, sel, hot}: {x: number; y: number; k?: number; rows: string[]; sel: number; hot?: "up" | "close"}) => (
  <Win x={x} y={y} w={430} h={290} title="Calculated Item Solve Order" k={k}>
    <div style={pos(14, 38, 300, 16)}>Solve order:</div>
    <div style={pos(14, 58, 300, 170, {border: "1px solid #7A7A7A", background: "#fff", boxSizing: "border-box", overflow: "hidden"})}>{rows.map((s, i) => <div key={s} style={{height: 22, lineHeight: "22px", padding: "0 8px", background: i === sel ? "#CCE8FF" : "transparent", whiteSpace: "nowrap"}}>{s}</div>)}</div>
    <Bt x={324} y={58} w={92} t="Move Up" hot={hot === "up"} /><Bt x={324} y={90} w={92} t="Move Down" /><Bt x={324} y={122} w={92} t="Delete" />
    <Bt x={324} y={250} w={92} t="Close" hot={hot === "close"} />
    <div style={pos(14, 236, 300, 30, {fontSize: 11.5, color: "#444"})}>Formulas are solved from top to bottom; the last one wins at an intersection.</div>
  </Win>
);
