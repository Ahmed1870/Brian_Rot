import React from "react";
import {C, X, M, COLS, GRID_Y, RIBBON_Y, WIN_H, FONT_AR} from "./theme";
import {clamp01} from "./kit";

/* ───────── generic hand-drawn icons (no Microsoft artwork) ───────── */
export const Icon: React.FC<{n: string; s?: number; c?: string}> = ({n, s = 28, c = "#3A3A3A"}) => {
  const st = {fill: "none", stroke: c, strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
  let g: React.ReactNode;
  switch (n) {
    case "paste": g = <g {...st}><rect x="6" y="6" width="16" height="19" rx="2" /><rect x="10" y="3" width="8" height="5" rx="1.5" fill="#fff" /><path d="M10 13h8M10 17h8M10 21h5" /></g>; break;
    case "copy": g = <g {...st}><rect x="9" y="8" width="13" height="16" rx="1.5" /><path d="M6 20V5h12" /></g>; break;
    case "cut": g = <g {...st}><circle cx="9" cy="21" r="3.2" /><circle cx="19" cy="21" r="3.2" /><path d="M11 18L19 4M17 18L9 4" /></g>; break;
    case "brush": g = <g {...st}><rect x="6" y="5" width="15" height="7" rx="1.5" /><path d="M13 12v4M10 16h6v8h-6z" /></g>; break;
    case "bold": g = <text x="14" y="21" textAnchor="middle" fontSize="20" fontWeight="800" fill={c} fontFamily="Arial">B</text>; break;
    case "italic": g = <text x="14" y="21" textAnchor="middle" fontSize="20" fontStyle="italic" fill={c} fontFamily="Georgia">I</text>; break;
    case "underline": g = <g><text x="14" y="19" textAnchor="middle" fontSize="18" fill={c} fontFamily="Arial">U</text><path d="M7 24h14" {...st} /></g>; break;
    case "border": g = <g {...st}><rect x="5" y="5" width="18" height="18" /><path d="M5 14h18M14 5v18" strokeDasharray="2 2" /></g>; break;
    case "fill": g = <g {...st}><path d="M6 14l8-8 8 8-7 7z" /><rect x="5" y="23" width="18" height="3" fill="#FFD43B" stroke="none" /></g>; break;
    case "fontcolor": g = <g><text x="14" y="19" textAnchor="middle" fontSize="19" fontWeight="700" fill={c} fontFamily="Arial">A</text><rect x="5" y="23" width="18" height="3" fill="#E03131" /></g>; break;
    case "align": g = <g {...st}><path d="M5 7h18M5 12h12M5 17h18M5 22h12" /></g>; break;
    case "wrap": g = <g {...st}><path d="M5 7h18M5 13h14a4 4 0 010 8h-5M5 21h5" /><path d="M16 18l-3 3 3 3" /></g>; break;
    case "merge": g = <g {...st}><rect x="4" y="7" width="20" height="14" rx="1.5" /><path d="M8 14h12M10 11l-3 3 3 3M18 11l3 3-3 3" /></g>; break;
    case "pct": g = <text x="14" y="21" textAnchor="middle" fontSize="19" fontWeight="700" fill={c} fontFamily="Arial">%</text>; break;
    case "comma": g = <text x="14" y="20" textAnchor="middle" fontSize="17" fontWeight="800" fill={c} fontFamily="Arial">000</text>; break;
    case "dec": g = <text x="14" y="20" textAnchor="middle" fontSize="15" fontWeight="700" fill={c} fontFamily="Arial">.00</text>; break;
    case "cond": g = <g {...st}><rect x="5" y="5" width="18" height="18" /><path d="M5 11h18M5 17h18M11 5v18" /><rect x="12" y="12" width="6" height="5" fill="#F59E0B" stroke="none" /></g>; break;
    case "fmttable": g = <g {...st}><rect x="4" y="5" width="20" height="18" /><rect x="4" y="5" width="20" height="5" fill="#4EA72E" stroke="#4EA72E" /><path d="M4 15h20M12 10v13" /></g>; break;
    case "styles": g = <g {...st}><rect x="4" y="7" width="20" height="14" rx="3" /><text x="14" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill={c} stroke="none" fontFamily="Arial">Aa</text></g>; break;
    case "insert": g = <g {...st}><rect x="4" y="7" width="15" height="14" /><path d="M4 14h15M11 7v14M21 5v8M17 9h8" stroke="#107C41" /></g>; break;
    case "delete": g = <g {...st}><rect x="4" y="7" width="15" height="14" /><path d="M4 14h15M11 7v14" /><path d="M17 6l7 7M24 6l-7 7" stroke="#C42B1C" /></g>; break;
    case "format": g = <g {...st}><rect x="4" y="6" width="20" height="16" /><path d="M4 12h20M12 6v16" /><circle cx="20" cy="20" r="3.5" fill="#fff" /></g>; break;
    case "sum": g = <text x="14" y="23" textAnchor="middle" fontSize="26" fontWeight="700" fill="#107C41" fontFamily="Arial">Σ</text>; break;
    case "filldown": g = <g {...st}><rect x="7" y="4" width="14" height="8" /><path d="M14 13v10M10 19l4 4 4-4" /></g>; break;
    case "clear": g = <g {...st}><path d="M6 17l9-10 8 7-6 7H9z" /><path d="M9 21h12" /></g>; break;
    case "sort": g = <g {...st}><path d="M8 5v18M4 19l4 4 4-4" /><path d="M18 8h6M18 13h4M18 18h2" /></g>; break;
    case "find": g = <g {...st}><circle cx="12" cy="12" r="6" /><path d="M17 17l7 7" /></g>; break;
    case "pivot": g = <g {...st}><rect x="4" y="5" width="20" height="18" /><path d="M4 11h20M11 5v18" /><path d="M14 14l6 6M20 14v6h-6" stroke="#107C41" /></g>; break;
    case "dup": g = <g {...st}><rect x="4" y="6" width="16" height="16" /><path d="M4 12h16M12 6v16" /><path d="M17 17l7 7M24 17l-7 7" stroke="#C42B1C" /></g>; break;
    case "convert": g = <g {...st}><rect x="4" y="6" width="16" height="14" /><path d="M4 13h16M12 6v14M18 23h7M22 20l3 3-3 3" transform="translate(0,-2)" /></g>; break;
    case "slicer": g = <g {...st}><rect x="5" y="4" width="18" height="20" rx="2" /><rect x="8" y="9" width="12" height="4" fill="#4EA72E" stroke="none" /><path d="M8 17h12" /></g>; break;
    case "export": g = <g {...st}><rect x="4" y="9" width="14" height="14" /><path d="M12 14l10-8M16 6h6v6" /></g>; break;
    case "refresh": g = <g {...st}><path d="M22 14a8 8 0 01-14 5M6 14a8 8 0 0114-5" /><path d="M20 4v5h-5M8 24v-5h5" /></g>; break;
    case "browser": g = <g {...st}><circle cx="14" cy="14" r="9" /><path d="M5 14h18M14 5c4 4 4 14 0 18M14 5c-4 4-4 14 0 18" /></g>; break;
    case "unlink": g = <g {...st}><path d="M11 17l-3 3a3.5 3.5 0 01-5-5l3-3M17 11l3-3a3.5 3.5 0 015 5l-3 3M9 9l-2-2M19 19l2 2" /></g>; break;
    case "resize": g = <g {...st}><rect x="5" y="5" width="16" height="16" /><path d="M15 15l9 9M18 24h6v-6" /></g>; break;
    case "undo": g = <g {...st}><path d="M9 11h9a5 5 0 010 10h-5M12 7L8 11l4 4" /></g>; break;
    case "redo": g = <g {...st}><path d="M19 11h-9a5 5 0 000 10h5M16 7l4 4-4 4" /></g>; break;
    case "save": g = <g {...st}><path d="M5 5h15l3 3v15H5z" /><rect x="9" y="5" width="9" height="6" /><rect x="9" y="15" width="10" height="8" /></g>; break;
    case "grid": g = <g {...st}><rect x="4" y="5" width="20" height="18" /><path d="M4 11h20M4 17h20M11 5v18M17 5v18" /></g>; break;
    default: g = <rect x="6" y="6" width="16" height="16" {...st} />;
  }
  return <svg width={s} height={s} viewBox="0 0 28 28" style={{flexShrink: 0}}>{g}</svg>;
};

/* ───────── ribbon building blocks ───────── */
const lbl: React.CSSProperties = {fontSize: 12.5, color: "#3B3B3B", lineHeight: "14px", textAlign: "center", fontFamily: FONT_AR};
const Big: React.FC<{i: string; l: string; w?: number}> = ({i, l, w = 64}) => (
  <div style={{width: w, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, paddingTop: 4}}>
    <Icon n={i} s={36} />
    <div style={{...lbl, width: w - 4}}>{l}</div>
  </div>
);
const Small: React.FC<{i: string; l: string}> = ({i, l}) => (
  <div style={{display: "flex", alignItems: "center", gap: 7, height: 24, whiteSpace: "nowrap"}}>
    <Icon n={i} s={20} />
    <span style={{...lbl, textAlign: "left"}}>{l}</span>
  </div>
);
const Box: React.FC<{t: string; w: number}> = ({t, w}) => (
  <div style={{width: w, height: 24, border: "1px solid #ABABAB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6px", fontSize: 13.5, color: "#222", fontFamily: FONT_AR}}>
    <span>{t}</span><span style={{fontSize: 9, color: "#555"}}>▼</span>
  </div>
);
const Grp: React.FC<{name: string; children?: React.ReactNode}> = ({name, children}) => (
  <div style={{position: "relative", height: M.ribbonH, padding: "0 10px", borderRight: "1px solid #E1E1E1", display: "flex", flexDirection: "column"}}>
    <div style={{flex: 1, display: "flex", gap: 6, alignItems: "flex-start", paddingTop: 6}}>{children}</div>
    <div style={{...lbl, color: "#6B6B6B", fontSize: 12, height: 18}}>{name}</div>
  </div>
);
const Stack: React.FC<{children?: React.ReactNode}> = ({children}) => <div style={{display: "flex", flexDirection: "column", gap: 2, paddingTop: 2}}>{children}</div>;
const IconRow: React.FC<{items: string[]}> = ({items}) => (
  <div style={{display: "flex", gap: 2}}>{items.map((n) => <div key={n} style={{width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center"}}><Icon n={n} s={20} /></div>)}</div>
);

const HomeRibbon: React.FC = () => (
  <div style={{display: "flex", height: M.ribbonH}}>
    <Grp name="Clipboard"><Big i="paste" l="Paste" w={56} /><Stack><Small i="cut" l="Cut" /><Small i="copy" l="Copy" /><Small i="brush" l="Format Painter" /></Stack></Grp>
    <Grp name="Font"><div style={{display: "flex", flexDirection: "column", gap: 6, paddingTop: 2}}><div style={{display: "flex", gap: 6}}><Box t="Calibri" w={120} /><Box t="11" w={46} /></div><IconRow items={["bold", "italic", "underline", "border", "fill", "fontcolor"]} /></div></Grp>
    <Grp name="Alignment"><div style={{display: "flex", flexDirection: "column", gap: 6, paddingTop: 2}}><IconRow items={["align", "align", "align", "align"]} /><IconRow items={["align", "align", "align", "align"]} /></div><Stack><Small i="wrap" l="Wrap Text" /><Small i="merge" l="Merge & Center" /></Stack></Grp>
    <Grp name="Number"><div style={{display: "flex", flexDirection: "column", gap: 6, paddingTop: 2}}><Box t="General" w={130} /><IconRow items={["comma", "pct", "comma", "dec", "dec"]} /></div></Grp>
    <Grp name="Styles"><Big i="cond" l="Conditional Formatting" w={92} /><Big i="fmttable" l="Format as Table" w={78} /><Big i="styles" l="Cell Styles" w={64} /></Grp>
    <Grp name="Cells"><Big i="insert" l="Insert" w={56} /><Big i="delete" l="Delete" w={56} /><Big i="format" l="Format" w={56} /></Grp>
    <Grp name="Editing"><Stack><Small i="sum" l="AutoSum" /><Small i="filldown" l="Fill" /><Small i="clear" l="Clear" /></Stack><Big i="sort" l="Sort & Filter" w={74} /><Big i="find" l="Find & Select" w={74} /></Grp>
  </div>
);

/** fixed positions (window-local) used for cursor targets */
export const TD = {nameBox: {x: 14, y: RIBBON_Y + 28, w: 150, h: 24}, totalChk: {x: 756, y: RIBBON_Y + 30, w: 110, h: 20}};

const Chk: React.FC<{x: number; y: number; l: string; on: boolean}> = ({x, y, l, on}) => (
  <div style={{position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, color: "#222", fontFamily: FONT_AR, whiteSpace: "nowrap"}}>
    <div style={{width: 15, height: 15, border: `1.5px solid ${on ? X.green : "#6E6E6E"}`, background: on ? X.green : "#fff", color: "#fff", fontSize: 12, lineHeight: "13px", textAlign: "center"}}>{on ? "✓" : ""}</div>{l}
  </div>
);
const Sw: React.FC<{x: number; c: string; sel?: boolean}> = ({x, c, sel}) => (
  <div style={{position: "absolute", left: x, top: 14, width: 66, height: 54, border: `${sel ? 2.5 : 1}px solid ${sel ? X.green : "#BDBDBD"}`, background: "#fff", padding: 3}}>
    <div style={{height: 10, background: c}} />
    {[0, 1, 2, 3].map((i) => <div key={i} style={{height: 8, marginTop: 2, background: i % 2 === 0 ? `${c}55` : "#fff"}} />)}
  </div>
);

const TableDesignRibbon: React.FC<{name: string; nameFocus: number; typing: boolean; totalRow: boolean; caret: boolean}> = ({name, nameFocus, typing, totalRow, caret}) => {
  return (
    <div style={{position: "absolute", left: 0, top: 0, width: "100%", height: M.ribbonH}}>
      <div style={{position: "absolute", left: 14, top: 8, ...lbl, fontSize: 13}}>Table Name:</div>
      <div style={{position: "absolute", left: 14, top: 28, width: 150, height: 24, border: `1.5px solid ${nameFocus > 0 ? "#0F6CBD" : "#ABABAB"}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 6px", fontSize: 14.5, color: "#222", fontFamily: FONT_AR}}>
        <span style={{background: nameFocus > 0.5 && !typing ? "#2F80D0" : "transparent", color: nameFocus > 0.5 && !typing ? "#fff" : "#222", padding: "0 1px"}}>{name}</span>
        {typing && caret ? <span style={{width: 1.5, height: 16, background: "#222", marginLeft: 1}} /> : null}
      </div>
      <div style={{position: "absolute", left: 14, top: 62}}><Small i="resize" l="Resize Table" /></div>
      <div style={{position: "absolute", left: 14, top: M.ribbonH - 18, width: 160, ...lbl, color: "#6B6B6B", fontSize: 12}}>Properties</div>
      <div style={{position: "absolute", left: 186, top: 0, bottom: 0, width: 1, background: "#E1E1E1"}} />
      <div style={{position: "absolute", left: 196, top: 8, display: "flex", flexDirection: "column", gap: 2}}><Small i="pivot" l="Summarize with PivotTable" /><Small i="dup" l="Remove Duplicates" /><Small i="convert" l="Convert to Range" /></div>
      <div style={{position: "absolute", left: 392, top: 4}}><Big i="slicer" l="Insert Slicer" w={80} /></div>
      <div style={{position: "absolute", left: 196, top: M.ribbonH - 18, width: 270, ...lbl, color: "#6B6B6B", fontSize: 12}}>Tools</div>
      <div style={{position: "absolute", left: 478, top: 0, bottom: 0, width: 1, background: "#E1E1E1"}} />
      <div style={{position: "absolute", left: 486, top: 4}}><Big i="export" l="Export" w={56} /></div>
      <div style={{position: "absolute", left: 546, top: 4}}><Big i="refresh" l="Refresh" w={56} /></div>
      <div style={{position: "absolute", left: 608, top: 10}}><Stack><Small i="browser" l="Open in Browser" /><Small i="unlink" l="Unlink" /></Stack></div>
      <div style={{position: "absolute", left: 486, top: M.ribbonH - 18, width: 230, ...lbl, color: "#6B6B6B", fontSize: 12}}>External Table Data</div>
      <div style={{position: "absolute", left: 742, top: 0, bottom: 0, width: 1, background: "#E1E1E1"}} />
      <Chk x={756} y={8} l="Header Row" on />
      <Chk x={TD.totalChk.x} y={30} l="Total Row" on={totalRow} />
      <Chk x={756} y={52} l="Banded Rows" on />
      <Chk x={900} y={8} l="First Column" on={false} />
      <Chk x={900} y={30} l="Last Column" on={false} />
      <Chk x={900} y={52} l="Banded Columns" on={false} />
      <Chk x={756} y={74} l="Filter Button" on />
      <div style={{position: "absolute", left: 756, top: M.ribbonH - 18, width: 240, ...lbl, color: "#6B6B6B", fontSize: 12}}>Table Style Options</div>
      <div style={{position: "absolute", left: 1046, top: 0, bottom: 0, width: 1, background: "#E1E1E1"}} />
      <div style={{position: "absolute", left: 1060, top: 0}}>
        {["#5B9BD5", "#ED7D31", "#A5A5A5", "#FFC000", "#4472C4", "#4EA72E", "#7030A0"].map((c, i) => <Sw key={c} x={i * 74} c={c} sel={i === 5} />)}
      </div>
      <div style={{position: "absolute", left: 1060, top: M.ribbonH - 18, width: 540, ...lbl, color: "#6B6B6B", fontSize: 12}}>Table Styles</div>
    </div>
  );
};

/* ───────── window geometry helpers (window-local coordinates) ───────── */
export const colLeft = (c: number) => M.rowHdrW + COLS.slice(0, c).reduce((a, b) => a + b, 0);
export const cellBox = (rows: number[], r: number, c: number) => {
  const idx = rows.indexOf(r);
  return {x: colLeft(c), y: GRID_Y + idx * M.rowH, w: COLS[c], h: M.rowH, idx};
};
export const colName = (c: number) => String.fromCharCode(65 + c);
export const rowsRange = (from: number, n = M.rows) => Array.from({length: n}, (_, i) => from + i);

export const TAB_NAMES = ["File", "Home", "Insert", "Draw", "Page Layout", "Formulas", "Data", "Review", "View", "Automate", "Help"];
const tabW = (t: string) => t.length * 8.4 + 30;
export const tabBox = (name: string) => {
  let x = 10;
  for (const t of [...TAB_NAMES, "Table Design"]) {
    const gap = t === "Table Design" ? 14 : 0;
    x += gap;
    if (t === name) return {x, w: tabW(t)};
    x += tabW(t);
  }
  return {x: 0, w: 0};
};

/* ───────── grid ───────── */
export type CellSty = {text?: string; bold?: boolean; color?: string; bg?: string; num?: boolean; edit?: boolean; err?: boolean};
export type TableGeo = {top: number; bottom: number; left: number; right: number; p: number; total?: number; filterCol?: number; rowsF?: number; glow?: number};
export type Sel = {r1: number; c1: number; r2: number; c2: number; t?: number};

export const Grid: React.FC<{
  rows: number[];
  cell: (r: number, c: number) => CellSty | undefined;
  table?: TableGeo;
  sel?: Sel | null;
  refs?: {r: number; c: number; color: string}[];
  caret?: boolean;
  f?: number;
  tableAlpha?: number;
}> = ({rows, cell, table, sel, refs = [], caret = true, f = 0}) => {
  const totalW = M.w;
  const els: React.ReactNode[] = [];
  const bodyH = M.rows * M.rowH;
  const lefts = COLS.map((_, c) => colLeft(c));
  // gridlines
  const lines: React.ReactNode[] = [];
  for (let i = 0; i <= M.rows; i++) lines.push(<line key={"h" + i} x1={0} x2={totalW} y1={GRID_Y + i * M.rowH} y2={GRID_Y + i * M.rowH} stroke={X.grid} strokeWidth={1} />);
  COLS.forEach((w, c) => lines.push(<line key={"v" + c} x1={lefts[c] + w} x2={lefts[c] + w} y1={GRID_Y - M.hdrH} y2={GRID_Y + bodyH} stroke={X.grid} strokeWidth={1} />));
  // header highlight sets
  const selC1 = sel ? Math.min(sel.c1, sel.c2) : -1;
  const selC2 = sel ? Math.max(sel.c1, sel.c2) : -2;
  const selR1 = sel ? Math.min(sel.r1, sel.r2) : -1;
  const selR2 = sel ? Math.max(sel.r1, sel.r2) : -2;
  // cells
  rows.forEach((r, ri) => {
    COLS.forEach((w, c) => {
      const s = cell(r, c);
      const inT = table && r >= table.top && r <= table.bottom && c >= table.left && c <= table.right;
      if (!s && !inT) return;
      let bg = s?.bg || "transparent";
      let color = s?.color || X.text;
      let bold = !!s?.bold;
      let arrow = 0;
      if (inT && table) {
        const k = clamp01(table.p * 1.7 - ((r - table.top) * 0.035 + (c - table.left) * 0.05));
        const isHdr = r === table.top;
        const isTot = table.total === r;
        if (isHdr) {
          bg = `rgba(78,167,46,${k})`;
          if (k > 0.45) { color = "#fff"; bold = true; }
          arrow = k;
        } else if (isTot) {
          bg = `rgba(255,255,255,${k})`;
          if (k > 0.45) bold = true;
        } else if ((r - table.top) % 2 === 1) {
          bg = `rgba(220,235,213,${k})`;
        }
      }
      const editSty: React.CSSProperties = s?.edit ? {background: "#fff", outline: `2px solid ${X.green}`, zIndex: 3, overflow: "visible"} : {};
      els.push(
        <div key={r + ":" + c} style={{position: "absolute", left: lefts[c] + 1, top: GRID_Y + ri * M.rowH + 1, width: w - 1, height: M.rowH - 1, background: bg, color, fontWeight: bold ? 700 : 400, fontSize: 17, lineHeight: `${M.rowH - 1}px`, padding: "0 6px", boxSizing: "border-box", whiteSpace: "nowrap", overflow: "hidden", textAlign: s?.num ? "right" : "left", fontFamily: FONT_AR, direction: "ltr", ...editSty}}>
          <span style={s?.err ? {color: "#C00000"} : undefined}>{s?.text ?? ""}</span>
          {s?.edit && caret ? <span style={{display: "inline-block", width: 1.5, height: 16, background: "#222", verticalAlign: "middle", marginLeft: 1}} /> : null}
          {arrow > 0.8 ? <div style={{position: "absolute", right: 2, top: 3, width: 17, height: 17, background: "#fff", border: "1px solid #8D8D8D", fontSize: 8, lineHeight: "16px", textAlign: "center", color: "#222", opacity: arrow}}>{table && table.filterCol === c ? "⏷" : "▼"}</div> : null}
        </div>
      );
    });
  });
  const rect = (r1: number, c1: number, r2: number, c2: number) => {
    const a = rows.indexOf(Math.min(r1, r2)), b = rows.indexOf(Math.max(r1, r2));
    const ia = a < 0 ? 0 : a, ib = b < 0 ? rows.length - 1 : b;
    const cA = Math.min(c1, c2), cB = Math.max(c1, c2);
    return {x: lefts[cA], y: GRID_Y + ia * M.rowH, w: lefts[cB] + COLS[cB] - lefts[cA], h: (ib - ia + 1) * M.rowH};
  };
  // table outline
  let outline: React.ReactNode = null;
  if (table && table.p > 0.6) {
    const rb = rect(table.top, table.left, table.bottom, table.right);
    const hh = table.rowsF !== undefined ? table.rowsF * M.rowH : rb.h;
    const g = table.glow || 0;
    outline = <div style={{position: "absolute", left: rb.x, top: rb.y, width: rb.w, height: Math.min(hh, M.rows * M.rowH - (rb.y - GRID_Y)), border: "1.5px solid #4EA72E", boxShadow: g > 0 ? `0 0 ${22 * g}px ${C.green}, inset 0 0 ${12 * g}px ${C.green}66` : "none", pointerEvents: "none", zIndex: 4}} />;
  }
  // selection
  let selEl: React.ReactNode = null;
  if (sel) {
    const b = rect(sel.r1, sel.c1, sel.r2, sel.c2);
    const t = sel.t === undefined ? 1 : sel.t;
    const single = sel.r1 === sel.r2 && sel.c1 === sel.c2;
    selEl = (
      <div style={{position: "absolute", left: b.x, top: b.y, width: b.w * t, height: b.h * t, background: single ? "transparent" : X.greenTint, border: `2.5px solid ${X.green}`, boxSizing: "border-box", pointerEvents: "none", zIndex: 5}}>
        {t > 0.95 ? <div style={{position: "absolute", right: -5, bottom: -5, width: 8, height: 8, background: X.green, border: "1.5px solid #fff"}} /> : null}
      </div>
    );
  }
  return (
    <div style={{position: "absolute", left: 0, top: 0, width: totalW, height: WIN_H, fontFamily: FONT_AR}}>
      <div style={{position: "absolute", left: 0, top: GRID_Y - M.hdrH, width: totalW, height: bodyH + M.hdrH, background: "#fff"}} />
      <svg width={totalW} height={WIN_H} style={{position: "absolute", left: 0, top: 0}}>{lines}</svg>
      {/* column headers */}
      <div style={{position: "absolute", left: 0, top: GRID_Y - M.hdrH, width: totalW, height: M.hdrH, background: X.hdr, borderBottom: `1px solid ${X.grid}`}} />
      <svg width={M.rowHdrW} height={M.hdrH} style={{position: "absolute", left: 0, top: GRID_Y - M.hdrH}}><path d={`M${M.rowHdrW - 4} 6 L${M.rowHdrW - 4} ${M.hdrH - 4} L${M.rowHdrW - 18} ${M.hdrH - 4} Z`} fill="#A8A8A8" /></svg>
      {COLS.map((w, c) => {
        const on = c >= selC1 && c <= selC2;
        return (
          <div key={"ch" + c} style={{position: "absolute", left: lefts[c], top: GRID_Y - M.hdrH, width: w, height: M.hdrH, background: on ? X.hdrSel : "transparent", borderRight: `1px solid ${X.grid}`, borderBottom: on ? `2.5px solid ${X.green}` : "none", textAlign: "center", lineHeight: `${M.hdrH}px`, fontSize: 14, color: on ? X.green : "#444", fontWeight: on ? 700 : 400, boxSizing: "border-box"}}>{colName(c)}</div>
        );
      })}
      {/* row headers */}
      <div style={{position: "absolute", left: 0, top: GRID_Y, width: M.rowHdrW, height: bodyH, background: X.hdr, borderRight: `1px solid ${X.grid}`}} />
      {rows.map((r, i) => {
        const on = r >= selR1 && r <= selR2;
        const filtered = table && table.filterCol !== undefined && i > 0 && rows[i] - rows[i - 1] > 1;
        return (
          <div key={"rh" + i} style={{position: "absolute", left: 0, top: GRID_Y + i * M.rowH, width: M.rowHdrW, height: M.rowH, background: on ? X.hdrSel : "transparent", borderBottom: `1px solid ${X.grid}`, borderRight: on ? `2.5px solid ${X.green}` : "none", textAlign: "center", lineHeight: `${M.rowH}px`, fontSize: 13.5, color: filtered ? "#0F6CBD" : on ? X.green : "#444", fontWeight: on ? 700 : 400, boxSizing: "border-box"}}>{r}</div>
        );
      })}
      {els}
      {refs.map((q, i) => {
        const b = cellBox(rows, q.r, q.c);
        return <div key={"ref" + i} style={{position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, border: `2px dashed ${q.color}`, boxSizing: "border-box", zIndex: 4, background: `${q.color}14`}} />;
      })}
      {outline}
      {selEl}
    </div>
  );
};

/* ───────── window chrome ───────── */
export type WinProps = {
  f: number;
  fileName?: string;
  tab: string;
  ctxTab?: boolean;
  tableName?: string;
  nameFocus?: number;
  nameTyping?: boolean;
  totalRow?: boolean;
  nameBox: string;
  formula?: string;
  editing?: boolean;
  status?: string;
  grid: React.ReactNode;
  overlays?: React.ReactNode;
};

export const ExcelWindow: React.FC<WinProps> = ({f, fileName = "manzooma_sales_2026.xlsx", tab, ctxTab, tableName = "Table1", nameFocus = 0, nameTyping = false, totalRow = false, nameBox, formula = "", editing = false, status = "Ready", grid, overlays}) => {
  const caret = Math.floor(f / 15) % 2 === 0;
  const tabs = ctxTab ? [...TAB_NAMES, "Table Design"] : TAB_NAMES;
  const fy = RIBBON_Y + M.ribbonH;
  return (
    <div style={{position: "absolute", left: M.x, top: M.y, width: M.w, height: WIN_H, background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.55), 0 0 0 1px #0B1220", fontFamily: FONT_AR, color: X.text}}>
      {/* title bar */}
      <div style={{position: "absolute", left: 0, top: 0, width: "100%", height: M.titleH, background: X.chrome, display: "flex", alignItems: "center"}}>
        <div style={{display: "flex", alignItems: "center", gap: 12, paddingLeft: 12}}>
          <div style={{width: 22, height: 22, borderRadius: 4, background: X.green, display: "flex", alignItems: "center", justifyContent: "center"}}><Icon n="grid" s={16} c="#fff" /></div>
          <div style={{display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#555"}}>AutoSave <div style={{width: 30, height: 14, borderRadius: 8, background: "#ccc", position: "relative"}}><div style={{position: "absolute", left: 2, top: 2, width: 10, height: 10, borderRadius: 5, background: "#fff"}} /></div></div>
          <Icon n="save" s={17} /><Icon n="undo" s={17} /><Icon n="redo" s={17} />
        </div>
        <div style={{position: "absolute", left: 560, width: 680, top: 5, height: 28, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid #D0D0D0", borderRadius: 5, padding: "0 12px", fontSize: 14, color: "#555"}}><span>{fileName} - Saved</span><span style={{color: "#888"}}>Search (Alt+Q)</span></div>
        <div style={{position: "absolute", right: 0, top: 0, display: "flex", fontSize: 16, color: "#222"}}>
          {["—", "▢", "✕"].map((t) => <div key={t} style={{width: 46, height: M.titleH, textAlign: "center", lineHeight: `${M.titleH}px`}}>{t}</div>)}
        </div>
      </div>
      {/* tabs */}
      <div style={{position: "absolute", left: 0, top: M.titleH, width: "100%", height: M.tabsH, background: X.chrome}}>
        {tabs.map((t) => {
          const b = tabBox(t);
          const on = t === tab;
          const ctx = t === "Table Design";
          return (
            <div key={t} style={{position: "absolute", left: b.x, top: 0, width: b.w, height: M.tabsH, textAlign: "center", lineHeight: `${M.tabsH - 2}px`, fontSize: 15, fontWeight: on ? 700 : 400, color: ctx ? X.green : "#2B2B2B", background: on ? X.ribbon : "transparent", borderTop: on ? `2px solid ${ctx ? X.green : "transparent"}` : "none", borderRadius: "6px 6px 0 0"}}>
              {t}
              {on ? <div style={{position: "absolute", left: 14, right: 14, bottom: 0, height: 3, background: X.green, borderRadius: 2}} /> : null}
            </div>
          );
        })}
      </div>
      {/* ribbon */}
      <div style={{position: "absolute", left: 0, top: RIBBON_Y, width: "100%", height: M.ribbonH, background: X.ribbon, borderTop: `1px solid ${X.border}`, borderBottom: `1px solid ${X.border}`, boxSizing: "border-box", overflow: "hidden"}}>
        {tab === "Table Design" ? <TableDesignRibbon name={tableName} nameFocus={nameFocus} typing={nameTyping} totalRow={totalRow} caret={caret} /> : <HomeRibbon />}
      </div>
      {/* formula bar */}
      <div style={{position: "absolute", left: 0, top: fy, width: "100%", height: M.fbarH, background: "#fff", borderBottom: `1px solid ${X.border}`, display: "flex", alignItems: "center", gap: 8, padding: "0 8px", boxSizing: "border-box"}}>
        <div style={{width: 126, height: 24, border: "1px solid #ABABAB", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", fontSize: 14.5}}><span>{nameBox}</span><span style={{fontSize: 9, color: "#555"}}>▼</span></div>
        <div style={{display: "flex", gap: 14, fontSize: 17, color: editing ? "#222" : "#B5B5B5", width: 72, justifyContent: "center"}}><span>✕</span><span style={{color: editing ? X.green : "#B5B5B5"}}>✓</span></div>
        <div style={{width: 34, textAlign: "center", fontStyle: "italic", fontFamily: "Georgia, serif", fontSize: 17, color: "#444"}}>fx</div>
        <div style={{flex: 1, height: 24, border: "1px solid #ABABAB", display: "flex", alignItems: "center", padding: "0 8px", fontSize: 15.5, direction: "ltr", fontFamily: FONT_AR}}>
          <span>{formula}</span>{editing && caret ? <span style={{width: 1.5, height: 16, background: "#222", marginLeft: 1}} /> : null}
        </div>
        <div style={{width: 20, textAlign: "center", fontSize: 10, color: "#555"}}>⌄</div>
      </div>
      {grid}
      {/* sheet tabs */}
      <div style={{position: "absolute", left: 0, top: GRID_Y + M.rows * M.rowH, width: "100%", height: M.sheetH, background: X.chrome, borderTop: `1px solid ${X.border}`, display: "flex", alignItems: "center", boxSizing: "border-box"}}>
        <div style={{width: 72, display: "flex", justifyContent: "space-around", color: "#555", fontSize: 12}}><span>◀</span><span>▶</span></div>
        <div style={{height: 28, padding: "0 22px", background: "#fff", borderBottom: `3px solid ${X.green}`, fontWeight: 700, fontSize: 14.5, lineHeight: "26px", color: X.green}}>Sales</div>
        <div style={{width: 36, textAlign: "center", fontSize: 20, color: "#555"}}>+</div>
      </div>
      {/* status bar */}
      <div style={{position: "absolute", left: 0, top: WIN_H - M.statusH, width: "100%", height: M.statusH, background: X.chrome, borderTop: `1px solid ${X.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", fontSize: 13, color: "#444", boxSizing: "border-box"}}>
        <span>{status === "Ready" ? "Ready" : "Ready"}</span>
        <span style={{fontWeight: 600}}>{status === "Ready" ? "" : status}</span>
        <span style={{display: "flex", gap: 14, alignItems: "center"}}><Icon n="grid" s={14} /><span>−  ─────●─────  +</span><span>100%</span></span>
      </div>
      {overlays}
    </div>
  );
};
