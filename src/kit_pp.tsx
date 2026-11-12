// Shared Power Pivot / Power Query / Import Data UI kit (Microsoft 365 desktop, Windows). Logical px inside the Excel stage.
import React from "react";
import { F, Icon, prog } from "./kit";
import { DBtn, Dialog, Field, Lbl } from "./kit_ui";
import { C } from "./theme";

const ui = (size: number, extra?: React.CSSProperties): React.CSSProperties => ({ fontFamily: F.ui, fontSize: size, color: C.ink, ...extra });
const glowStyle = (on: boolean, color: string, t: number): React.CSSProperties =>
  on ? { boxShadow: `0 0 ${10 + 12 * t}px ${color}, inset 0 0 0 2px ${color}`, background: `${color}22`, borderRadius: 4 } : {};

// ---------- window metrics (Power Pivot + Power Query share the same frame) ----------
export const PP = { x: 48, y: 40, w: 1440, h: 726, title: 28, tabs: 26, ribbon: 92, fbar: 26, tabsBar: 26, status: 24 };
export const PP_BODY_Y = PP.title + PP.tabs + PP.ribbon + PP.fbar;
export const PP_BODY_H = PP.h - PP_BODY_Y - PP.tabsBar - PP.status;
const winStyle = (t: number): React.CSSProperties => ({ position: "absolute", left: PP.x, top: PP.y, width: PP.w, height: PP.h, background: "#fff", border: "1px solid #6B6B6B", boxShadow: "0 18px 50px rgba(0,0,0,.45)", boxSizing: "border-box", overflow: "hidden", opacity: Math.min(1, t * 1.6), transform: `scale(${0.95 + 0.05 * t})`, transformOrigin: "50% 40%", zIndex: 25 });
const Title: React.FC<{ text: string; icon: string }> = ({ text, icon }) => (
  <div style={{ height: PP.title, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 10, ...ui(12) }}>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon k={icon} s={16} /><span>{text}</span></div>
    <div style={{ display: "flex", height: "100%" }}>{["—", "☐", "✕"].map((g, i) => <div key={i} style={{ width: 46, display: "flex", alignItems: "center", justifyContent: "center", ...ui(13) }}>{g}</div>)}</div>
  </div>
);
const TabRow: React.FC<{ tabs: string[]; active: string; fileColor: string }> = ({ tabs, active, fileColor }) => (
  <div style={{ height: PP.tabs, background: "#F3F3F3", display: "flex", alignItems: "flex-end", borderBottom: `1px solid ${C.line}` }}>
    {tabs.map((t, i) => (
      <div key={t} style={{ height: 24, padding: "0 16px", display: "flex", alignItems: "center", ...ui(12.5, i === 0 ? { background: fileColor, color: "#fff", fontWeight: 600 } : t === active ? { color: C.xGreenDark, fontWeight: 600, background: "#F9F9F9", borderTop: `1px solid ${C.line}`, borderLeft: `1px solid ${C.line}`, borderRight: `1px solid ${C.line}` } : {}) }}>{t}</div>
    ))}
  </div>
);

// ---------- generic ribbon (explicit widths so cursors can target buttons) ----------
type PI = { id: string; label: string; icon: string; w: number; s?: boolean };
type PG = { id: string; label: string; items: PI[] };
const L = (id: string, label: string, icon: string, w: number): PI => ({ id, label, icon, w });
const Sm = (id: string, label: string, icon: string): PI => ({ id, label, icon, w: 0, s: true });
const PPR: PG[] = [
  { id: "clip", label: "Clipboard", items: [L("paste", "Paste", "paste", 52), Sm("pasteapp", "Paste Append", "paste2"), Sm("pasterep", "Paste Replace", "paste2")] },
  { id: "ext", label: "Get External Data", items: [L("fromdb", "From\nDatabase ▾", "db", 80), L("fromsvc", "From Data\nService ▾", "web", 80), L("fromother", "From Other\nSources", "get", 80), L("existing", "Existing\nConnections", "db", 84)] },
  { id: "rfsh", label: "", items: [L("refresh", "Refresh ▾", "refresh", 62)] },
  { id: "pvt", label: "", items: [L("pivot", "PivotTable ▾", "analyze", 74)] },
  { id: "fmt", label: "Formatting", items: [Sm("dtype", "Data Type: Whole Number ▾", "generic"), Sm("fmtb", "Format: General ▾", "generic"), Sm("fmtn", "$ ▾   %   ,   .0←   .00→", "dollar")] },
  { id: "sf", label: "Sort and Filter", items: [Sm("sortaz", "Sort A to Z", "sortaz"), Sm("sortza", "Sort Z to A", "sortza"), Sm("clrsort", "Clear Sort", "clearf"), L("clrfil", "Clear All\nFilters", "clearf", 58)] },
  { id: "find", label: "Find", items: [L("find", "Find", "find", 52)] },
  { id: "calc", label: "Calculations", items: [Sm("autosum", "AutoSum ▾", "sum"), Sm("kpi", "Create KPI", "kpi")] },
  { id: "view", label: "View", items: [L("dataview", "Data\nView", "table", 58), L("diagview", "Diagram\nView", "model", 62), L("hidden", "Show\nHidden", "generic", 58), L("calcarea", "Calculation\nArea", "generic", 76)] },
];
const sW = (g: PG): number => Math.max(100, ...g.items.filter((i) => i.s).map((i) => 30 + i.label.length * 5.6));
const gW = (g: PG): number => g.items.filter((i) => !i.s).reduce((a, i) => a + i.w, 0) + (g.items.some((i) => i.s) ? sW(g) : 0) + 8;
export const ppBtn = (id: string): { x: number; y: number } => {
  let gx = PP.x + 6; const top = PP.y + PP.title + PP.tabs;
  for (const g of PPR) {
    let ix = gx + 3; const sw = sW(g); let si = 0;
    for (const it of g.items) {
      if (it.s) { if (it.id === id) return { x: ix + sw / 2, y: top + 16 + si * 22 }; si++; if (si === g.items.filter((q) => q.s).length) ix += sw; }
      else { if (it.id === id) return { x: ix + it.w / 2, y: top + 34 }; ix += it.w; }
    }
    gx += gW(g);
  }
  return { x: 0, y: 0 };
};
const PPRibbon: React.FC<{ view: "data" | "diagram"; glow?: { id: string; color: string; t: number } }> = ({ view, glow }) => {
  const lit = (id: string): boolean => !!glow && glow.id === id && glow.t > 0.02;
  const gs = (id: string): React.CSSProperties => (glow && lit(id) ? glowStyle(true, glow.color, glow.t) : {});
  return (
    <div style={{ height: PP.ribbon, background: C.ribbon, borderBottom: `1px solid ${C.line}`, display: "flex", padding: "2px 6px", boxSizing: "border-box" }}>
      {PPR.map((g) => (
        <div key={g.id} style={{ width: gW(g), display: "flex", flexDirection: "column", borderRight: `1px solid ${C.line}`, boxSizing: "border-box" }}>
          <div style={{ flex: 1, display: "flex", padding: "2px 3px 0" }}>
            {g.items.filter((i) => !i.s).map((it) => (
              <div key={it.id} style={{ width: it.w, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 2, ...(it.id === (view === "data" ? "dataview" : "diagview") ? { background: "#CFE5D8", border: "1px solid #8FBF9F" } : {}), ...gs(it.id) }}>
                <Icon k={it.icon} s={30} /><div style={ui(11, { textAlign: "center", lineHeight: "13px", whiteSpace: "pre", marginTop: 3 })}>{it.label}</div>
              </div>
            ))}
            {g.items.some((i) => i.s) ? (
              <div style={{ width: sW(g), display: "flex", flexDirection: "column", gap: 2, order: g.id === "clip" ? 1 : 0 }}>
                {g.items.filter((i) => i.s).map((it) => <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 6, height: 22, padding: "0 3px", ...gs(it.id) }}><Icon k={it.icon} s={16} /><span style={ui(11.5, { whiteSpace: "nowrap" })}>{it.label}</span></div>)}
              </div>
            ) : null}
          </div>
          <div style={ui(11, { textAlign: "center", color: C.inkSoft, height: 15, lineHeight: "15px" })}>{g.label}</div>
        </div>
      ))}
    </div>
  );
};

// ---------- Power Pivot: data view ----------
export type PPTbl = { name: string; cols: string[]; widths: number[]; row: (i: number) => string[]; total: number; right?: number[] };
const RH = 21, HH = 24;
const DataView: React.FC<{ tbl: PPTbl; top: number; sel?: { r: number; c: number } | null; hiCol?: number; hiColor?: string }> = ({ tbl, top, sel, hiCol, hiColor }) => {
  const n = Math.floor((PP_BODY_H - HH) / RH);
  const thumbH = Math.max(14, Math.min(PP_BODY_H - 30, ((PP_BODY_H - HH) * n) / tbl.total)), thumbY = HH + ((PP_BODY_H - HH - thumbH) * top) / Math.max(1, tbl.total - n);
  let x = 0; const xs = tbl.widths.map((w) => { const v = x; x += w; return v; });
  return (
    <div style={{ position: "absolute", left: 0, top: PP_BODY_Y, width: PP.w, height: PP_BODY_H, background: "#fff", overflow: "hidden" }}>
      <div style={{ height: HH, background: "#EDEDED", borderBottom: "1px solid #BDBDBD", position: "relative" }}>
        {tbl.cols.map((c, i) => (
          <div key={c} style={{ position: "absolute", left: xs[i], top: 0, width: tbl.widths[i], height: HH, borderRight: "1px solid #C9C9C9", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6px", ...ui(12, { fontWeight: 600, color: "#333" }), ...(hiCol === i ? { background: `${hiColor ?? C.blue}33`, boxShadow: `inset 0 0 0 2px ${hiColor ?? C.blue}` } : {}) }}>{c}<Icon k="chev" s={10} /></div>
        ))}
        <div style={{ position: "absolute", left: x, top: 0, width: 120, height: HH, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 8px", ...ui(12, { color: "#8A8A8A", fontStyle: "italic" }) }}>Add Column</div>
      </div>
      {Array.from({ length: n }, (_, k) => {
        const vals = top + k < tbl.total ? tbl.row(top + k) : null;
        return vals ? (
          <div key={k} style={{ position: "absolute", left: 0, top: HH + k * RH, width: x, height: RH, borderBottom: "1px solid #E4E4E4", background: sel && sel.r === k ? "#EAF3EE" : "#fff" }}>
            {vals.map((v, i) => <div key={i} style={{ position: "absolute", left: xs[i], width: tbl.widths[i], height: RH, boxSizing: "border-box", borderRight: "1px solid #E4E4E4", padding: "0 6px", display: "flex", alignItems: "center", justifyContent: tbl.right?.includes(i) ? "flex-end" : "flex-start", fontFamily: F.cell, fontSize: 12.5, color: C.ink, whiteSpace: "nowrap", ...(sel && sel.r === k && sel.c === i ? { boxShadow: `inset 0 0 0 2px ${C.xGreen}`, background: "#fff" } : {}), ...(hiCol === i ? { background: `${hiColor ?? C.blue}14` } : {}) }}>{v}</div>)}
          </div>
        ) : null;
      })}
      <div style={{ position: "absolute", right: 0, top: 0, width: 16, height: PP_BODY_H, background: "#F0F0F0", borderLeft: "1px solid #DADADA" }}><div style={{ position: "absolute", left: 3, top: thumbY, width: 10, height: thumbH, background: "#B5B5B5" }} /></div>
    </div>
  );
};

// ---------- Power Pivot: diagram view ----------
type DBox = { n: string; f: string[]; x: number; y: number; w: number };
const DB: DBox[] = [
  { n: "Customers", f: ["CustomerID", "CustomerName", "City", "Segment"], x: 150, y: 40, w: 230 },
  { n: "Sales", f: ["SalesID", "Date", "CustomerID", "ProductID", "BranchID", "Qty", "Amount"], x: 600, y: 60, w: 250 },
  { n: "Products", f: ["ProductID", "ProductName", "Category", "UnitPrice"], x: 1050, y: 40, w: 230 },
  { n: "Branches", f: ["BranchID", "Branch", "Region"], x: 610, y: 350, w: 230 },
];
const BH = 28, FH = 20;
const boxH = (b: DBox): number => BH + b.f.length * FH + 8;
export const DIAG_POS = (name: string): { x: number; y: number; w: number; h: number } => { const b = DB.find((q) => q.n === name) ?? DB[0]; return { x: PP.x + b.x, y: PP.y + PP_BODY_Y + b.y, w: b.w, h: boxH(b) }; };
const Diagram: React.FC<{ t: number; rel: number; hl?: string; hlColor?: string }> = ({ t, rel, hl, hlColor = C.purple }) => {
  const S_ = DB[1];
  const lines: { a: DBox; fa: number; fb: number; side: "L" | "R" | "B" }[] = [{ a: DB[0], fa: 0, fb: 2, side: "L" }, { a: DB[2], fa: 0, fb: 3, side: "R" }, { a: DB[3], fa: 0, fb: 4, side: "B" }];
  return (
    <div style={{ position: "absolute", left: 0, top: PP_BODY_Y, width: PP.w, height: PP_BODY_H, background: "#E9E9E9", overflow: "hidden", opacity: t }}>
      <svg width={PP.w} height={PP_BODY_H} style={{ position: "absolute", left: 0, top: 0 }}>
        {lines.map((l, i) => {
          const ay = l.a.y + BH + l.fa * FH + FH / 2, by = S_.y + BH + l.fb * FH + FH / 2;
          const col = hlColor, on = prog(rel, i * 0.18, 0.5);
          if (l.side === "B") { const x1 = l.a.x + l.a.w / 2, y1 = l.a.y, x2 = S_.x + S_.w / 2, y2 = S_.y + boxH(S_); return <g key={i} opacity={on}><path d={`M${x1} ${y1} V${(y1 + y2) / 2} H${x2} V${y2}`} stroke={col} strokeWidth="2.2" fill="none" /><text x={x1 + 8} y={y1 - 6} fontSize="14" fontWeight="700" fill="#333" fontFamily="Arial">1</text><text x={x2 + 8} y={y2 + 16} fontSize="16" fontWeight="700" fill="#333" fontFamily="Arial">*</text></g>; }
          const x1 = l.side === "L" ? l.a.x + l.a.w : l.a.x, x2 = l.side === "L" ? S_.x : S_.x + S_.w, mx = (x1 + x2) / 2;
          return <g key={i} opacity={on}><path d={`M${x1} ${ay} H${mx} V${by} H${x2}`} stroke={col} strokeWidth="2.2" fill="none" /><text x={l.side === "L" ? x1 + 6 : x1 - 14} y={ay - 6} fontSize="14" fontWeight="700" fill="#333" fontFamily="Arial">1</text><text x={l.side === "L" ? x2 - 16 : x2 + 8} y={by - 6} fontSize="16" fontWeight="700" fill="#333" fontFamily="Arial">*</text></g>;
        })}
      </svg>
      {DB.map((b, i) => {
        const a = prog(t, 0.1 + i * 0.12, 0.4); const on = hl === b.n;
        return (
          <div key={b.n} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: boxH(b), background: "#fff", border: `1.5px solid ${on ? hlColor : "#8E9AAF"}`, boxShadow: on ? `0 0 18px ${hlColor}` : "0 2px 6px rgba(0,0,0,.2)", boxSizing: "border-box", opacity: a, transform: `translateY(${(1 - a) * 14}px)` }}>
            <div style={{ height: BH, background: "#DCE3EE", borderBottom: "1px solid #B9C4D6", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", ...ui(12.5, { fontWeight: 700 }) }}>{b.n}<span style={ui(11, { color: C.inkSoft })}>▭ ▢</span></div>
            {b.f.map((q) => <div key={q} style={{ height: FH, display: "flex", alignItems: "center", padding: "0 10px", ...ui(12) }}>{q}</div>)}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Power Pivot window ----------
export const PPWindow: React.FC<{ t: number; view: "data" | "diagram"; tbl: PPTbl; tabs: string[]; tab: number; top?: number; sel?: { r: number; c: number } | null; hiCol?: number; hiColor?: string; glow?: { id: string; color: string; t: number }; dgT?: number; relT?: number; dgHl?: string; fx?: string; recordNo?: number; children?: React.ReactNode }> = (p) => (
  <div style={winStyle(p.t)}>
    <Title text="Power Pivot for Excel - manzooma_sales_2026.xlsx" icon="model" />
    <TabRow tabs={["File", "Home", "Design", "Advanced"]} active="Home" fileColor={C.xGreen} />
    <PPRibbon view={p.view} glow={p.glow} />
    <div style={{ height: PP.fbar, background: "#fff", borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 8, padding: "0 8px", boxSizing: "border-box", ...ui(12) }}>
      <div style={{ width: 150, height: 20, border: "1px solid #BDBDBD", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 5px", boxSizing: "border-box" }}><span>{p.view === "data" ? p.tbl.cols[0] : ""}</span><Icon k="chev" s={10} /></div>
      <span style={ui(13, { fontStyle: "italic", color: "#555", fontFamily: "serif" })}>fx</span><span style={{ fontFamily: F.mono, fontSize: 12 }}>{p.fx ?? ""}</span>
    </div>
    {p.view === "data" ? <DataView tbl={p.tbl} top={p.top ?? 0} sel={p.sel} hiCol={p.hiCol} hiColor={p.hiColor} /> : <Diagram t={p.dgT ?? 1} rel={p.relT ?? 1} hl={p.dgHl} />}
    <div style={{ position: "absolute", left: 0, top: PP.h - PP.tabsBar - PP.status, width: PP.w, height: PP.tabsBar, background: "#F3F3F3", borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "flex-end", boxSizing: "border-box" }}>
      {p.view === "data" ? p.tabs.map((n, i) => <div key={n} style={{ height: 24, padding: "0 18px", display: "flex", alignItems: "center", background: i === p.tab ? "#fff" : "transparent", fontWeight: i === p.tab ? 700 : 400, color: i === p.tab ? C.xGreenDark : C.ink, borderRight: `1px solid ${C.line}`, borderBottom: i === p.tab ? `3px solid ${C.xGreen}` : "none", boxSizing: "border-box", ...ui(12) }}>{n}</div>) : <div style={ui(12, { padding: "0 12px", alignSelf: "center", color: C.inkSoft })}>Diagram View</div>}
    </div>
    <div style={{ position: "absolute", left: 0, top: PP.h - PP.status, width: PP.w, height: PP.status, background: "#F3F3F3", borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 12px", boxSizing: "border-box", ...ui(12) }}>
      {p.view === "data" ? `Record:  ◂ ◂   ${(p.recordNo ?? (p.top ?? 0) + 1).toLocaleString("en-US")} of ${p.tbl.total.toLocaleString("en-US")}   ▸ ▸` : "Ready"}
    </div>
    {p.children}
  </div>
);

// ---------- Power Query Editor ----------
const PQ_TABS = ["File", "Home", "Transform", "Add Column", "View", "Help"];
export const pqBtn = (id: string): { x: number; y: number } => {
  const m: Record<string, [number, number]> = { closeload: [50, 40], loadto: [92, 128], refresh: [150, 40], props: [212, 18] };
  const v = m[id] ?? [0, 0]; return { x: PP.x + v[0] + 14, y: PP.y + PP.title + PP.tabs + v[1] };
};
type PQI = [string, string, string, number];
const PQG = [["Close", [["closeload", "Close &\nLoad ▾", "get", 70]]], ["Query", [["refresh", "Refresh\nPreview ▾", "refresh", 64], ["props", "Properties", "generic", 70], ["adv", "Advanced\nEditor", "csv", 66], ["mng", "Manage ▾", "table", 64]]], ["Manage Columns", [["choose", "Choose\nColumns ▾", "table", 70], ["remcol", "Remove\nColumns ▾", "delete", 70]]], ["Reduce Rows", [["keep", "Keep\nRows ▾", "table", 60], ["remrows", "Remove\nRows ▾", "delete", 62]]], ["Sort", [["sort", "Sort", "sortaz", 56]]], ["Transform", [["split", "Split\nColumn ▾", "text2col", 66], ["group", "Group\nBy", "group", 56], ["fr", "Use First Row\nas Headers ▾", "table", 96]]], ["Combine", [["merge", "Merge\nQueries ▾", "table", 66], ["append", "Append\nQueries ▾", "table", 66]]]] as [string, PQI[]][];
export const PQWindow: React.FC<{ t: number; query: string; menu: number; hover?: string; glow?: { id: string; color: string; t: number }; tbl: PPTbl; queries: string[]; steps: string[]; children?: React.ReactNode }> = (p) => {
  const lit = glow(p.glow);
  const QW = 170, SW = 240, GH = PP_BODY_H + PP.tabsBar + PP.status - 24;
  return (
    <div style={winStyle(p.t)}>
      <Title text={`${p.query} - Power Query Editor`} icon="get" />
      <TabRow tabs={PQ_TABS} active="Home" fileColor={C.xGreen} />
      <div style={{ height: PP.ribbon, background: C.ribbon, borderBottom: `1px solid ${C.line}`, display: "flex", padding: "2px 6px", boxSizing: "border-box" }}>
        {PQG.map(([g, items]) => (
          <div key={g} style={{ display: "flex", flexDirection: "column", borderRight: `1px solid ${C.line}`, boxSizing: "border-box", paddingRight: 4 }}>
            <div style={{ flex: 1, display: "flex" }}>{items.map(([id, lab, ic, w]) => <div key={id} style={{ width: w, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4, ...(lit(id) ?? {}), ...(id === "closeload" ? { background: "#E6F2EA" } : {}) }}><Icon k={ic} s={28} /><div style={ui(11, { textAlign: "center", lineHeight: "13px", whiteSpace: "pre", marginTop: 3 })}>{lab}</div></div>)}</div>
            <div style={ui(11, { textAlign: "center", color: C.inkSoft, height: 15 })}>{g}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, top: PP_BODY_Y - PP.fbar + PP.fbar, width: QW, height: GH, background: "#F7F7F7", borderRight: `1px solid ${C.line}`, boxSizing: "border-box" }}>
        <div style={ui(12, { padding: "6px 8px", fontWeight: 600, borderBottom: `1px solid ${C.line}` })}>Queries [{p.queries.length}]</div>
        {p.queries.map((q) => <div key={q} style={{ height: 24, display: "flex", alignItems: "center", gap: 6, padding: "0 10px", background: q === p.query ? "#DCE9E1" : "transparent", ...ui(12.5, { fontWeight: q === p.query ? 600 : 400 }) }}><Icon k="table" s={14} />{q}</div>)}
      </div>
      <div style={{ position: "absolute", left: QW, top: PP_BODY_Y - PP.fbar, width: PP.w - QW - SW, height: PP.fbar, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 8px", boxSizing: "border-box", gap: 8, ...ui(12) }}>
        <span style={{ fontStyle: "italic", fontFamily: "serif", color: "#555" }}>fx</span><span style={{ fontFamily: F.mono, fontSize: 11.5, whiteSpace: "nowrap", overflow: "hidden" }}>{`= Table.TransformColumnTypes(#"Promoted Headers", {{"${p.tbl.cols[0]}", type text}, …})`}</span>
      </div>
      <div style={{ position: "absolute", left: QW, top: PP_BODY_Y, width: PP.w - QW - SW, height: PP_BODY_H + PP.tabsBar - 2, overflow: "hidden", background: "#fff" }}>
        <div style={{ display: "flex", height: 40, background: "#F3F3F3", borderBottom: "1px solid #BDBDBD" }}>
          <div style={{ width: 38, borderRight: "1px solid #D0D0D0" }} />
          {p.tbl.cols.map((c, i) => <div key={c} style={{ width: p.tbl.widths[i], borderRight: "1px solid #D0D0D0", boxSizing: "border-box", padding: "0 6px", display: "flex", alignItems: "center", justifyContent: "space-between", ...ui(12, { fontWeight: 600 }) }}><span><span style={{ color: "#2B7CD3", marginRight: 5, fontSize: 10 }}>{p.tbl.right?.includes(i) ? "123" : "ABC"}</span>{c}</span><Icon k="chev" s={10} /></div>)}
        </div>
        {Array.from({ length: 21 }, (_, k) => <div key={k} style={{ display: "flex", height: RH, borderBottom: "1px solid #EDEDED" }}><div style={{ width: 38, background: "#F3F3F3", borderRight: "1px solid #D0D0D0", boxSizing: "border-box", padding: "0 6px", display: "flex", alignItems: "center", justifyContent: "flex-end", ...ui(11, { color: "#777" }) }}>{k + 1}</div>{p.tbl.row(k).map((v, i) => <div key={i} style={{ width: p.tbl.widths[i], borderRight: "1px solid #EDEDED", boxSizing: "border-box", padding: "0 6px", display: "flex", alignItems: "center", justifyContent: p.tbl.right?.includes(i) ? "flex-end" : "flex-start", fontFamily: F.cell, fontSize: 12.5 }}>{v}</div>)}</div>)}
      </div>
      <div style={{ position: "absolute", right: 0, top: PP_BODY_Y - PP.fbar, width: SW, height: GH, background: "#F7F7F7", borderLeft: `1px solid ${C.line}`, boxSizing: "border-box", padding: 10, ...ui(12) }}>
        <div style={ui(13, { fontWeight: 700, marginBottom: 8 })}>Query Settings</div>
        <div style={ui(11, { color: C.inkSoft, fontWeight: 700 })}>PROPERTIES</div>
        <div style={{ margin: "6px 0 4px" }}>Name</div><div style={{ height: 22, background: "#fff", border: "1px solid #BDBDBD", display: "flex", alignItems: "center", padding: "0 6px", boxSizing: "border-box" }}>{p.query}</div>
        <div style={{ margin: "8px 0", color: "#2B6CB0" }}>All Properties</div>
        <div style={ui(11, { color: C.inkSoft, fontWeight: 700, marginTop: 10 })}>APPLIED STEPS</div>
        {p.steps.map((s, i) => <div key={s} style={{ height: 24, display: "flex", alignItems: "center", gap: 8, padding: "0 6px", background: i === p.steps.length - 1 ? "#DCE9E1" : "transparent" }}><span style={{ color: C.red, fontSize: 10 }}>✕</span>{s}</div>)}
      </div>
      <div style={{ position: "absolute", left: 0, top: PP.h - PP.status, width: PP.w, height: PP.status, background: "#F3F3F3", borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", boxSizing: "border-box", ...ui(11.5) }}><span>{p.tbl.cols.length} COLUMNS, 999+ ROWS</span><span>Column profiling based on top 1000 rows</span></div>
      {p.menu > 0 ? (
        <div style={{ position: "absolute", left: 14, top: PP.title + PP.tabs + 70, width: 190, background: "#fff", border: "1px solid #B5B5B5", boxShadow: "0 6px 16px rgba(0,0,0,.3)", opacity: p.menu, zIndex: 40, ...ui(12.5) }}>
          {[["closeload", "Close & Load"], ["loadto", "Close & Load To..."]].map(([id, lab]) => <div key={id} style={{ height: 30, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", ...(p.hover === id ? { background: "#E2EFE7", outline: `2px solid ${C.green}` } : {}) }}><Icon k="get" s={16} />{lab}</div>)}
        </div>
      ) : null}
      {p.children}
    </div>
  );
};
function glow(g?: { id: string; color: string; t: number }): (id: string) => React.CSSProperties | undefined {
  return (id) => (g && g.id === id && g.t > 0.02 ? glowStyle(true, g.color, g.t) : undefined);
}

// ---------- Import Data dialog (Power Query -> Close & Load To...) ----------
const Radio: React.FC<{ x: number; y: number; on: boolean; label: string; hi?: string; dis?: boolean }> = ({ x, y, on, label, hi, dis }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 8, ...ui(12.5, { color: dis ? "#8A8A8A" : C.ink }), ...(hi ? { boxShadow: `0 0 12px ${hi}`, outline: `2px solid ${hi}`, borderRadius: 4, padding: "2px 6px", margin: "-2px -6px" } : {}) }}>
    <div style={{ width: 14, height: 14, borderRadius: 7, border: "1.5px solid #555", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>{on ? <div style={{ width: 6, height: 6, borderRadius: 3, background: "#222" }} /> : null}</div>{label}
  </div>
);
const Check: React.FC<{ x: number; y: number; on: boolean; label: string; hi?: string; dis?: boolean }> = ({ x, y, on, label, hi, dis }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 8, ...ui(12.5, { color: dis ? "#8A8A8A" : C.ink }), ...(hi ? { boxShadow: `0 0 12px ${hi}`, outline: `2px solid ${hi}`, borderRadius: 4, padding: "2px 6px", margin: "-2px -6px" } : {}) }}>
    <div style={{ width: 14, height: 14, border: "1.5px solid #555", boxSizing: "border-box", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, lineHeight: "11px" }}>{on ? "✔" : ""}</div>{label}
  </div>
);
export const ImportDialog: React.FC<{ x: number; y: number; t: number; only: boolean; model: boolean; hiOnly?: string; hiModel?: string; ok?: number }> = ({ x, y, t, only, model, hiOnly, hiModel, ok = 0 }) => (
  <Dialog x={x} y={y} w={430} h={330} title="Import Data" t={t}>
    <Lbl x={18} y={14} text="Select how you want to view this data in your workbook." />
    <Radio x={30} y={46} on={false} label="Table" dis />
    <Radio x={30} y={72} on={false} label="PivotTable Report" dis />
    <Radio x={30} y={98} on={false} label="PivotChart" dis />
    <Radio x={30} y={124} on={only} label="Only Create Connection" hi={hiOnly} />
    <Lbl x={18} y={158} text="Where do you want to put the data?" />
    <Radio x={30} y={184} on={false} label="Existing worksheet:" dis />
    <Field x={168} y={180} w={150} value="=$A$1" h={22} />
    <Radio x={30} y={210} on={false} label="New worksheet" dis />
    <Check x={18} y={242} on={model} label="Add this data to the Data Model" hi={hiModel} />
    <DBtn x={18} y={268} w={90} label="Properties..." />
    <DBtn x={238} y={268} w={80} label="OK" def press={ok} />
    <DBtn x={328} y={268} w={80} label="Cancel" />
  </Dialog>
);

// ---------- Queries & Connections pane (docked right inside Excel) ----------
export const QCPane: React.FC<{ x: number; y: number; h: number; t: number; items: { name: string; note: string; hi?: string }[] }> = ({ x, y, h, t, items }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", left: x + (1 - t) * 40, top: y, width: 290, height: h, background: "#fff", borderLeft: `1px solid ${C.line}`, boxShadow: "-4px 0 14px rgba(0,0,0,.18)", opacity: t, zIndex: 20, ...ui(12.5) }}>
      <div style={ui(15, { fontWeight: 700, padding: "10px 12px 4px" })}>Queries & Connections</div>
      <div style={{ display: "flex", gap: 18, padding: "4px 12px", borderBottom: `1px solid ${C.line}`, ...ui(12.5) }}><span style={{ fontWeight: 700, color: C.xGreenDark, borderBottom: `3px solid ${C.xGreen}`, paddingBottom: 4 }}>Queries</span><span>Connections</span></div>
      <div style={ui(12, { padding: "8px 12px", color: C.inkSoft })}>{items.length} queries</div>
      {items.map((it) => <div key={it.name} style={{ padding: "8px 12px", borderBottom: "1px solid #EEE", ...(it.hi ? { boxShadow: `inset 0 0 0 2px ${it.hi}`, background: `${it.hi}18` } : {}) }}><div style={{ fontWeight: 700 }}>{it.name}</div><div style={ui(11.5, { color: C.inkSoft })}>{it.note}</div></div>)}
    </div>
  )
);

// ---------- VertiPaq column store illustration (compress: 0 = raw columns, 1 = compressed) ----------
export const ColumnStore: React.FC<{ x: number; y: number; w: number; h: number; t: number; color: string; names: string[]; dim?: number[]; focus?: number; scan?: number }> = ({ x, y, w, h, t, color, names, dim = [], focus = -1, scan = 0 }) => {
  const n = names.length, cw = (w - (n - 1) * 14) / n, rows = 12, rh = (h - 30) / rows;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {names.map((nm, ci) => {
        const cH = (rows * rh) * (1 - 0.68 * t), on = focus === ci, op = dim.includes(ci) ? 0.25 : 1;
        return (
          <div key={nm} style={{ position: "absolute", left: ci * (cw + 14), top: 0, width: cw, height: h, opacity: op }}>
            <div style={{ height: 24, fontFamily: F.ui, fontWeight: 700, fontSize: 13, color: on ? C.green : "#CBD5E1", textAlign: "center" }}>{nm}</div>
            <div style={{ position: "relative", width: cw, height: cH + 4, borderRadius: 6, border: `1.5px solid ${on ? C.green : color}`, boxShadow: `0 0 ${8 + 12 * t}px ${on ? C.green : color}`, background: on ? "rgba(16,185,129,.18)" : `${color}22`, boxSizing: "border-box", overflow: "hidden", padding: 2 }}>
              {Array.from({ length: rows }, (_, k) => <div key={k} style={{ height: rh * (1 - 0.68 * t) - 2 * (1 - t), marginBottom: 2 * (1 - t), borderRadius: 2, background: on ? C.green : color, opacity: 0.35 + 0.45 * (((k * 7 + ci * 3) % 5) / 5) }} />)}
              {on && scan > 0 ? <div style={{ position: "absolute", left: 0, right: 0, top: `${scan * 100}%`, height: 3, background: "#fff", boxShadow: `0 0 10px ${C.green}` }} /> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
