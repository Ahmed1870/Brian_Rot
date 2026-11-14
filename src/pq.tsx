import React from "react";
import {C, M, WIN_H, FONT_AR, MONO} from "./theme";
import {Icon} from "./xl";
import {Dialog, WinBtn, vis, prog} from "./kit";

/* ───────── Power Query Editor geometry (window-local) ───────── */
export const RY = 70, RH = 112, BODY_Y = 182, LEFT_W = 200, RIGHT_X = 1500, FB_H = 34, TBL_Y = BODY_Y + FB_H, HDR_H = 36, ROW_H = 28, RN_W = 46, COL_X0 = LEFT_W + RN_W, STATUS_Y = WIN_H - 24;
export const PQT = ["File", "Home", "Transform", "Add Column", "View", "Tools", "Help"];
const tw = (t: string) => t.length * 8.4 + 34;
export const pqTab = (name: string) => { let x = 12; for (const t of PQT) { if (t === name) return {x, w: tw(t)}; x += tw(t); } return {x: 0, w: 0}; };
export const pqTabStage = (name: string) => { const b = pqTab(name); return {x: M.x + b.x + b.w / 2, y: M.y + 36 + 17}; };
// ribbon controls (window-local rects)
export const BTN = {
  conditional: {x: 276, y: RY + 8, w: 190, h: 24}, custom: {x: 102, y: RY + 6, w: 76, h: 96},
  closeLoad: {x: 10, y: RY + 6, w: 80, h: 96}, advanced: {x: 432, y: RY + 34, w: 150, h: 24}, manageParams: {x: 1410, y: RY + 6, w: 96, h: 96},
  refresh: {x: 340, y: RY + 6, w: 84, h: 96},
};
export const st = (r: {x: number; y: number; w: number; h: number}, dx = 0.5, dy = 0.5) => ({x: M.x + r.x + r.w * dx, y: M.y + r.y + r.h * dy});

export type Col = {k: string; label: string; w: number; t: "abc" | "123" | "1.2"};
export const colX = (cols: Col[], k: string) => { let x = COL_X0; for (const c of cols) { if (c.k === k) return x; x += c.w; } return x; };
export const colW = (cols: Col[], k: string) => cols.find((c) => c.k === k)?.w ?? 100;
export const rowY = (r: number) => TBL_Y + HDR_H + r * ROW_H;
export type PCell = {text: string; color?: string; bold?: boolean; bg?: string; num?: boolean};

const lbl: React.CSSProperties = {fontSize: 12.5, color: "#3B3B3B", lineHeight: "14px", textAlign: "center", fontFamily: FONT_AR};
const RB: React.FC<{x: number; w: number; i: string; l: string; y?: number; hot?: boolean}> = ({x, w, i, l, y = 6, hot}) => (
  <div style={{position: "absolute", left: x, top: y, width: w, height: 96, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, paddingTop: 4, background: hot ? "#CDE8F7" : "transparent"}}><Icon n={i} s={36} /><div style={{...lbl, width: w - 4}}>{l}</div></div>
);
const RS: React.FC<{x: number; y: number; w: number; i: string; l: string}> = ({x, y, w, i, l}) => (
  <div style={{position: "absolute", left: x, top: y, width: w, height: 24, display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap", overflow: "hidden"}}><Icon n={i} s={20} /><span style={{...lbl, textAlign: "left"}}>{l}</span></div>
);
const RG: React.FC<{x: number; w: number; name: string}> = ({x, w, name}) => (
  <div><div style={{position: "absolute", left: x + w, top: 6, width: 1, height: 100, background: "#E1E1E1"}} /><div style={{position: "absolute", left: x, top: 94, width: w, ...lbl, color: "#6B6B6B", fontSize: 12}}>{name}</div></div>
);
const HomeR: React.FC = () => (
  <div style={{position: "absolute", left: 0, top: 0, width: "100%", height: RH}}>
    <RB x={10} w={80} i="export" l="Close & Load" /><RG x={6} w={92} name="Close" />
    <RB x={106} w={70} i="grid" l="New Source" /><RB x={178} w={70} i="grid" l="Recent Sources" /><RB x={250} w={70} i="insert" l="Enter Data" /><RG x={102} w={222} name="New Query" />
    <RB x={340} w={84} i="refresh" l="Refresh Preview" /><RS x={432} y={8} w={150} i="format" l="Properties" /><RS x={432} y={34} w={150} i="fx" l="Advanced Editor" /><RS x={432} y={60} w={150} i="grid" l="Manage" /><RG x={336} w={256} name="Query" />
    <RB x={612} w={74} i="grid" l="Choose Columns" /><RB x={688} w={74} i="delete" l="Remove Columns" /><RG x={608} w={158} name="Manage Columns" />
    <RB x={770} w={72} i="filldown" l="Keep Rows" /><RB x={844} w={72} i="delete" l="Remove Rows" /><RG x={766} w={154} name="Reduce Rows" />
    <RS x={930} y={14} w={130} i="sort" l="Sort Ascending" /><RS x={930} y={44} w={130} i="sort" l="Sort Descending" /><RG x={926} w={140} name="Sort" />
    <RS x={1080} y={8} w={150} i="grid" l="Split Column" /><RS x={1080} y={34} w={150} i="pivot" l="Group By" /><RS x={1080} y={60} w={150} i="format" l="Data Type: Any" /><RG x={1076} w={164} name="Transform" />
    <RB x={1250} w={74} i="pivot" l="Merge Queries" /><RB x={1326} w={74} i="insert" l="Append Queries" /><RG x={1246} w={158} name="Combine" />
    <RB x={1410} w={96} i="cond" l="Manage Parameters ▾" /><RG x={1406} w={106} name="Parameters" />
    <RB x={1520} w={96} i="format" l="Data source settings" /><RG x={1516} w={106} name="Data Sources" />
  </div>
);
const AddR: React.FC = () => (
  <div style={{position: "absolute", left: 0, top: 0, width: "100%", height: RH}}>
    <RB x={10} w={88} i="fx" l="Column From Examples" /><RB x={102} w={76} i="format" l="Custom Column" /><RB x={182} w={88} i="fx" l="Invoke Custom Function" />
    <RS x={276} y={8} w={190} i="cond" l="Conditional Column" /><RS x={276} y={34} w={190} i="insert" l="Index Column" /><RS x={276} y={60} w={190} i="dup" l="Duplicate Column" /><RG x={6} w={462} name="General" />
    <RB x={496} w={64} i="format" l="Format" /><RB x={562} w={64} i="grid" l="Extract" /><RB x={628} w={64} i="find" l="Parse" /><RG x={492} w={204} name="From Text" />
    <RB x={712} w={74} i="sum" l="Statistics" /><RB x={788} w={74} i="format" l="Standard" /><RB x={864} w={74} i="fx" l="Scientific" /><RG x={708} w={234} name="From Number" />
    <RB x={958} w={60} i="grid" l="Date" /><RB x={1020} w={60} i="grid" l="Time" /><RB x={1082} w={72} i="grid" l="Duration" /><RG x={954} w={204} name="From Date & Time" />
    <RB x={1174} w={90} i="find" l="Text Analytics" /><RB x={1266} w={70} i="browser" l="Vision" /><RB x={1338} w={100} i="fx" l="Azure Machine Learning" /><RG x={1170} w={272} name="AI Insights" />
  </div>
);

export const PQWindow: React.FC<{
  f: number; tab: string; title?: string; queries: {name: string; kind: "table" | "param"}[]; steps: string[]; sel: number; formula: string;
  cols: Col[]; nRows: number; cell: (r: number, k: string) => PCell | undefined; status?: string; hdrSel?: string; hot?: string; dim?: number; children?: React.ReactNode;
}> = ({f, tab, title = "Sales - Power Query Editor", queries, steps, sel, formula, cols, nRows, cell, status = "", hdrSel, hot, dim = 1, children}) => {
  const glyph = (t: Col["t"]) => (t === "abc" ? "ABC" : t === "123" ? "123" : "1.2");
  const totalW = cols.reduce((a, c) => a + c.w, 0);
  return (
    <div style={{position: "absolute", left: M.x, top: M.y, width: M.w, height: WIN_H, background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.55), 0 0 0 1px #0B1220", fontFamily: FONT_AR, color: "#242424", opacity: dim}}>
      <div style={{position: "absolute", left: 0, top: 0, width: "100%", height: 36, background: "#F3F3F3", display: "flex", alignItems: "center"}}>
        <div style={{display: "flex", alignItems: "center", gap: 10, paddingLeft: 12, fontSize: 14, color: "#444"}}><div style={{width: 20, height: 20, borderRadius: 4, background: "#107C41", display: "flex", alignItems: "center", justifyContent: "center"}}><Icon n="grid" s={14} c="#fff" /></div>{title}</div>
        <div style={{position: "absolute", right: 0, top: 0, display: "flex", fontSize: 16}}>{["—", "▢", "✕"].map((t) => <div key={t} style={{width: 46, height: 36, textAlign: "center", lineHeight: "36px"}}>{t}</div>)}</div>
      </div>
      <div style={{position: "absolute", left: 0, top: 36, width: "100%", height: 34, background: "#F3F3F3"}}>
        {PQT.map((t) => { const b = pqTab(t); const on = t === tab; return <div key={t} style={{position: "absolute", left: b.x, top: 0, width: b.w, height: 34, textAlign: "center", lineHeight: "32px", fontSize: 15, fontWeight: on ? 700 : 400, background: on ? "#FAFAFA" : "transparent", borderRadius: "6px 6px 0 0", color: t === "File" ? "#fff" : "#2B2B2B", ...(t === "File" ? {background: "#107C41", borderRadius: 4} : {})}}>{t}{on && t !== "File" ? <div style={{position: "absolute", left: 14, right: 14, bottom: 0, height: 3, background: "#107C41", borderRadius: 2}} /> : null}</div>; })}
      </div>
      <div style={{position: "absolute", left: 0, top: RY, width: "100%", height: RH, background: "#FAFAFA", borderTop: "1px solid #D1D1D1", borderBottom: "1px solid #D1D1D1", boxSizing: "border-box", overflow: "hidden"}}>
        {tab === "Add Column" ? <AddR /> : <HomeR />}
        {hot ? (() => { const r = (BTN as Record<string, {x: number; y: number; w: number; h: number}>)[hot]; return r ? <div style={{position: "absolute", left: r.x, top: r.y - RY, width: r.w, height: r.h, background: "rgba(56,189,248,.28)", border: "1.5px solid #0F6CBD", boxSizing: "border-box"}} /> : null; })() : null}
      </div>
      {/* queries pane */}
      <div style={{position: "absolute", left: 0, top: BODY_Y, width: LEFT_W, height: STATUS_Y - BODY_Y, background: "#F7F7F7", borderRight: "1px solid #D1D1D1"}}>
        <div style={{height: 30, padding: "0 12px", fontSize: 14, fontWeight: 700, lineHeight: "30px", borderBottom: "1px solid #E1E1E1"}}>Queries [{queries.length}]</div>
        {queries.map((q, i) => <div key={q.name} style={{height: 30, padding: "0 12px", display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, background: i === 0 ? "#DCEBD5" : "transparent", fontWeight: i === 0 ? 700 : 400}}><span style={{width: 16, height: 14, background: q.kind === "param" ? "#A855F7" : "#107C41", borderRadius: 3, color: "#fff", fontSize: 9, textAlign: "center", lineHeight: "14px"}}>{q.kind === "param" ? "ABC" : "▦"}</span>{q.name}</div>)}
      </div>
      {/* formula bar */}
      <div style={{position: "absolute", left: LEFT_W, top: BODY_Y, width: RIGHT_X - LEFT_W, height: FB_H, borderBottom: "1px solid #D1D1D1", display: "flex", alignItems: "center", padding: "0 8px", gap: 10, boxSizing: "border-box", background: "#fff"}}>
        <span style={{color: "#B5B5B5", fontSize: 16}}>✕ ✓</span><span style={{fontStyle: "italic", fontFamily: "Georgia, serif", fontSize: 17, color: "#444"}}>fx</span>
        <div style={{flex: 1, height: 24, border: "1px solid #ABABAB", padding: "0 8px", fontSize: 14, lineHeight: "22px", whiteSpace: "nowrap", overflow: "hidden", direction: "ltr", fontFamily: MONO}}>{formula}</div>
      </div>
      {/* table */}
      <div style={{position: "absolute", left: LEFT_W, top: TBL_Y, width: RIGHT_X - LEFT_W, height: STATUS_Y - TBL_Y, background: "#fff", overflow: "hidden"}}>
        <div style={{position: "absolute", left: 0, top: 0, width: RN_W, height: HDR_H, background: "#F0F0F0", borderRight: "1px solid #D6D6D6", borderBottom: "1px solid #D6D6D6", boxSizing: "border-box"}} />
        {cols.map((c) => { const x = colX(cols, c.k) - LEFT_W; const on = hdrSel === c.k; return (
          <div key={c.k} style={{position: "absolute", left: x, top: 0, width: c.w, height: HDR_H, background: on ? "#C9E3D3" : "#F0F0F0", borderRight: "1px solid #D6D6D6", borderBottom: "1px solid #D6D6D6", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 5, padding: "0 5px", fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap"}}>
            <span style={{fontSize: 9, color: "#107C41", fontWeight: 800, border: "1px solid #9CC9AE", borderRadius: 3, padding: "0 3px"}}>{glyph(c.t)}</span><span style={{flex: 1, overflow: "hidden"}}>{c.label}</span><span style={{fontSize: 9, color: "#555", border: "1px solid #BBB", padding: "0 3px", background: "#fff"}}>▼</span>
          </div>); })}
        {Array.from({length: nRows}, (_, r) => (
          <div key={r} style={{position: "absolute", left: 0, top: HDR_H + r * ROW_H, width: RN_W + totalW, height: ROW_H, borderBottom: "1px solid #EDEDED", background: r % 2 ? "#FBFBFB" : "#fff"}}>
            <div style={{position: "absolute", left: 0, width: RN_W, height: ROW_H, background: "#F5F5F5", borderRight: "1px solid #E0E0E0", textAlign: "center", lineHeight: `${ROW_H}px`, fontSize: 13, color: "#666"}}>{r + 1}</div>
            {cols.map((c) => { const v = cell(r, c.k); if (!v) return null; return <div key={c.k} style={{position: "absolute", left: colX(cols, c.k) - LEFT_W, width: c.w, height: ROW_H, padding: "0 8px", boxSizing: "border-box", lineHeight: `${ROW_H}px`, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textAlign: v.num ? "right" : "left", color: v.color ?? "#242424", fontWeight: v.bold ? 700 : 400, background: v.bg}}>{v.text}</div>; })}
          </div>
        ))}
      </div>
      {/* query settings */}
      <div style={{position: "absolute", left: RIGHT_X, top: BODY_Y, width: M.w - RIGHT_X, height: STATUS_Y - BODY_Y, background: "#F7F7F7", borderLeft: "1px solid #D1D1D1"}}>
        <div style={{height: 30, padding: "0 12px", fontSize: 14, fontWeight: 700, lineHeight: "30px", borderBottom: "1px solid #E1E1E1"}}>Query Settings</div>
        <div style={{padding: "8px 12px", fontSize: 12.5, color: "#666"}}>PROPERTIES</div>
        <div style={{margin: "0 12px", height: 26, border: "1px solid #ABABAB", background: "#fff", padding: "0 8px", fontSize: 14, lineHeight: "24px"}}>Sales</div>
        <div style={{padding: "8px 12px", fontSize: 13, color: "#0F6CBD"}}>All Properties</div>
        <div style={{padding: "10px 12px 4px", fontSize: 12.5, color: "#666"}}>APPLIED STEPS</div>
        {steps.map((s, i) => <div key={s} style={{height: 30, padding: "0 12px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14, background: i === sel ? "#DCEBD5" : "transparent", borderLeft: i === sel ? "3px solid #107C41" : "3px solid transparent", fontWeight: i === sel ? 700 : 400}}><span style={{display: "flex", gap: 8}}>{i > 0 ? <span style={{color: "#C00000", fontSize: 12}}>✕</span> : <span style={{width: 10}} />}{s}</span>{i > 0 ? <Icon n="format" s={14} /> : null}</div>)}
      </div>
      <div style={{position: "absolute", left: 0, top: STATUS_Y, width: "100%", height: 24, background: "#F3F3F3", borderTop: "1px solid #D1D1D1", fontSize: 12.5, color: "#444", padding: "0 14px", lineHeight: "24px", boxSizing: "border-box"}}>{status || `${cols.length} COLUMNS, ${nRows} ROWS    Column profiling based on top 1000 rows`}</div>
      {children}
    </div>
  );
};

/* ───────── dialogs (stage coordinates) ───────── */
export const DX = {cond: {x: 480, y: 150, w: 860, h: 470}, cust: {x: 520, y: 160, w: 820, h: 480}, param: {x: 440, y: 130, w: 960, h: 600}, filt: {x: 560, y: 260, w: 760, h: 330}, adv: {x: 330, y: 130, w: 1260, h: 780}};
export const dpt = (d: {x: number; y: number}, dx: number, dy: number) => ({x: d.x + dx, y: d.y + 34 + dy});
const Lb: React.FC<{x: number; y: number; t: string; c?: string; s?: number; b?: boolean}> = ({x, y, t, c = "#222", s = 15, b}) => <div style={{position: "absolute", left: x, top: y, fontSize: s, color: c, fontWeight: b ? 700 : 400, whiteSpace: "nowrap", fontFamily: FONT_AR}}>{t}</div>;
export const Inp: React.FC<{x: number; y: number; w: number; t: string; dd?: boolean; caret?: boolean; h?: number; hot?: boolean; mono?: boolean; ph?: string}> = ({x, y, w, t, dd, caret, h = 30, hot, mono, ph}) => (
  <div style={{position: "absolute", left: x, top: y, width: w, height: h, border: `${hot ? 2 : 1}px solid ${hot ? "#0F6CBD" : "#8A8A8A"}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", boxSizing: "border-box", fontSize: 15, fontFamily: mono ? MONO : FONT_AR, color: t ? "#1B1B1B" : "#8A8A8A", whiteSpace: "nowrap", overflow: "hidden"}}>
    <span>{t || ph || ""}{caret ? <span style={{display: "inline-block", width: 1.5, height: 17, background: "#222", verticalAlign: "middle", marginLeft: 1}} /> : null}</span>{dd ? <span style={{fontSize: 9, color: "#555"}}>▼</span> : null}
  </div>
);
const Btns: React.FC<{w: number; h: number; ok: string; okHot: boolean}> = ({w, h, ok, okHot}) => <div style={{position: "absolute", left: w - 18 - 178, top: h - 34 - 14 - 30, display: "flex", gap: 10}}><WinBtn label={ok} primary hot={okHot} /><WinBtn label="Cancel" /></div>;

export const CondDialog: React.FC<{f: number; a: number; b: number; foc: string; name: string; c1: string; op1: string; v1: string; o1: string; rule2: boolean; c2: string; op2: string; v2: string; o2: string; els: string; okHot: boolean; addHot: boolean}> = (p) => {
  const D = DX.cond;
  const row = (y: number, lab: string, c: string, op: string, v: string, o: string, k: string) => (
    <div>
      <Lb x={20} y={y + 6} t={lab} b />
      <Inp x={86} y={y} w={170} t={c} dd /><Inp x={266} y={y} w={190} t={op} dd /><Inp x={466} y={y} w={120} t={v} caret={p.foc === "v" + k} hot={p.foc === "v" + k} />
      <Lb x={600} y={y + 6} t="then" /><Inp x={650} y={y} w={140} t={o} caret={p.foc === "o" + k} hot={p.foc === "o" + k} />
    </div>
  );
  return (
    <Dialog f={p.f} a={p.a} b={p.b} x={D.x} y={D.y} w={D.w} h={D.h} title="Add Conditional Column">
      <Lb x={20} y={8} t="Add a conditional column that is computed from the other columns or values." c="#444" />
      <Lb x={20} y={44} t="New column name" /><Inp x={20} y={68} w={360} t={p.name} caret={p.foc === "name"} hot={p.foc === "name"} />
      <Lb x={86} y={112} t="Column Name" c="#555" s={13} /><Lb x={266} y={112} t="Operator" c="#555" s={13} /><Lb x={466} y={112} t="Value" c="#555" s={13} /><Lb x={650} y={112} t="Output" c="#555" s={13} />
      {row(132, "If", p.c1, p.op1, p.v1, p.o1, "1")}
      {p.rule2 ? row(182, "Else If", p.c2, p.op2, p.v2, p.o2, "2") : null}
      <Lb x={20} y={(p.rule2 ? 238 : 188) + 6} t="Else" b /><Inp x={86} y={p.rule2 ? 238 : 188} w={170} t={p.els} caret={p.foc === "else"} hot={p.foc === "else"} />
      <div style={{position: "absolute", left: 20, top: p.rule2 ? 300 : 250, width: 120, height: 30, border: `${p.addHot ? 2 : 1}px solid ${p.addHot ? "#0F6CBD" : "#8A8A8A"}`, background: p.addHot ? "#CFE4F7" : "#fff", textAlign: "center", lineHeight: "28px", fontSize: 14.5, boxSizing: "border-box"}}>+ Add Rule</div>
      <Btns w={D.w} h={D.h} ok="OK" okHot={p.okHot} />
    </Dialog>
  );
};
export const CD = {name: {x: 20, y: 68}, c1: {x: 86, y: 132, w: 170}, op1: {x: 266, y: 132, w: 190}, v1: {x: 466, y: 132, w: 120}, o1: {x: 650, y: 132, w: 140}, c2y: 182, els1y: 188, els2y: 238, add1y: 250, add2y: 300, ok: {x: DX.cond.w - 18 - 178 + 42, y: DX.cond.h - 34 - 14 - 15}};

export const CustDialog: React.FC<{f: number; a: number; b: number; foc: string; name: string; formula: string; okHot: boolean; ok: boolean}> = (p) => {
  const D = DX.cust;
  return (
    <Dialog f={p.f} a={p.a} b={p.b} x={D.x} y={D.y} w={D.w} h={D.h} title="Custom Column">
      <Lb x={20} y={8} t="Add a column that is computed from the other columns." c="#444" />
      <Lb x={20} y={44} t="New column name" /><Inp x={20} y={68} w={340} t={p.name} caret={p.foc === "name"} hot={p.foc === "name"} />
      <Lb x={20} y={112} t="Custom column formula:" />
      <div style={{position: "absolute", left: 20, top: 136, width: 500, height: 180, border: `${p.foc === "f" ? 2 : 1}px solid ${p.foc === "f" ? "#0F6CBD" : "#8A8A8A"}`, background: "#fff", padding: "8px 10px", boxSizing: "border-box", fontFamily: MONO, fontSize: 15.5, lineHeight: 1.5, color: "#1B1B1B", whiteSpace: "pre-wrap", overflow: "hidden"}}><span style={{color: "#888"}}>= </span>{p.formula}{p.foc === "f" ? <span style={{display: "inline-block", width: 1.5, height: 17, background: "#222", verticalAlign: "middle", marginLeft: 1}} /> : null}</div>
      <Lb x={540} y={112} t="Available columns" />
      <div style={{position: "absolute", left: 540, top: 136, width: 240, height: 180, border: "1px solid #8A8A8A", background: "#fff", fontSize: 14.5, padding: "4px 0", boxSizing: "border-box"}}>{["OrderID", "Branch", "Region", "UnitPrice", "Quantity", "DiscountRate", "Amount"].map((c) => <div key={c} style={{height: 24, padding: "0 10px", lineHeight: "24px"}}>{c}</div>)}</div>
      <div style={{position: "absolute", left: 660, top: 324, width: 120, height: 28, border: "1px solid #8A8A8A", background: "#F3F3F3", textAlign: "center", lineHeight: "26px", fontSize: 14, boxSizing: "border-box"}}>&lt;&lt; Insert</div>
      <div style={{position: "absolute", left: 20, top: 332, fontSize: 14.5, color: p.ok ? "#107C41" : "#999"}}>{p.ok ? "✓ No syntax errors have been detected." : "Checking…"}</div>
      <div style={{position: "absolute", left: 20, top: 360, fontSize: 14, color: "#0F6CBD"}}>Learn about Power Query formulas</div>
      <Btns w={D.w} h={D.h} ok="OK" okHot={p.okHot} />
    </Dialog>
  );
};
export const CU = {name: {x: 20, y: 68}, formula: {x: 20, y: 136}, ok: {x: DX.cust.w - 18 - 178 + 42, y: DX.cust.h - 34 - 14 - 15}};

export const ParamDialog: React.FC<{f: number; a: number; b: number; foc: string; list: string[]; sel: number; name: string; type: string; sug: string; items: string[]; def: string; cur: string; okHot: boolean; newHot: boolean}> = (p) => {
  const D = DX.param;
  return (
    <Dialog f={p.f} a={p.a} b={p.b} x={D.x} y={D.y} w={D.w} h={D.h} title="Manage Parameters">
      <div style={{position: "absolute", left: 18, top: 8, width: 250, height: 470, border: "1px solid #BDBDBD", background: "#fff"}}>
        <div style={{height: 34, padding: "0 12px", lineHeight: "32px", fontSize: 14.5, color: "#0F6CBD", borderBottom: "1px solid #E1E1E1", background: p.newHot ? "#CFE4F7" : "transparent"}}>✱ New</div>
        {p.list.map((n, i) => <div key={n} style={{height: 30, padding: "0 12px", lineHeight: "30px", fontSize: 14.5, background: i === p.sel ? "#CDE8F7" : "transparent"}}>{n}</div>)}
      </div>
      <Lb x={290} y={14} t="Name" /><Inp x={290} y={38} w={520} t={p.name} caret={p.foc === "name"} hot={p.foc === "name"} />
      <Lb x={290} y={80} t="Description" /><Inp x={290} y={104} w={520} t="" />
      <div style={{position: "absolute", left: 290, top: 148, display: "flex", alignItems: "center", gap: 8, fontSize: 14.5}}><span style={{width: 16, height: 16, border: "1.5px solid #333", background: "#fff", textAlign: "center", lineHeight: "14px", color: "#107C41", fontWeight: 800}}>✓</span>Required</div>
      <Lb x={290} y={184} t="Type" /><Inp x={290} y={208} w={250} t={p.type} dd hot={p.foc === "type"} />
      <Lb x={290} y={252} t="Suggested Values" /><Inp x={290} y={276} w={250} t={p.sug} dd hot={p.foc === "sug"} />
      {p.items.length > 0 ? <div style={{position: "absolute", left: 560, top: 252, width: 250, height: 130, border: "1px solid #8A8A8A", background: "#fff", fontSize: 14.5}}>{p.items.map((n) => <div key={n} style={{height: 26, padding: "0 10px", lineHeight: "26px", borderBottom: "1px solid #EEE"}}>{n}</div>)}</div> : null}
      <Lb x={290} y={320} t="Default Value" /><Inp x={290} y={344} w={250} t={p.def} dd hot={p.foc === "def"} />
      <Lb x={290} y={388} t="Current Value" /><Inp x={290} y={412} w={250} t={p.cur} dd hot={p.foc === "cur"} />
      <Btns w={D.w} h={D.h} ok="OK" okHot={p.okHot} />
    </Dialog>
  );
};
export const PA = {newBtn: {x: 100, y: 25}, name: {x: 290, y: 38, w: 520}, type: {x: 290, y: 208, w: 250}, sug: {x: 290, y: 276, w: 250}, def: {x: 290, y: 344, w: 250}, cur: {x: 290, y: 412, w: 250}, ok: {x: DX.param.w - 18 - 178 + 42, y: DX.param.h - 34 - 14 - 15}};

export const FiltDialog: React.FC<{f: number; a: number; b: number; param: boolean; pname: string; okHot: boolean}> = (p) => {
  const D = DX.filt;
  return (
    <Dialog f={p.f} a={p.a} b={p.b} x={D.x} y={D.y} w={D.w} h={D.h} title="Filter Rows">
      <div style={{position: "absolute", left: 20, top: 10, display: "flex", gap: 24, fontSize: 14.5}}><span>◉ Basic</span><span style={{color: "#666"}}>○ Advanced</span></div>
      <Lb x={20} y={50} t="Keep rows where 'Branch'" b />
      <Inp x={20} y={84} w={190} t="equals" dd /><Inp x={226} y={84} w={190} t={p.param ? "Parameter" : "ABC  Text"} dd hot={p.param} /><Inp x={432} y={84} w={190} t={p.pname} dd />
      <Btns w={D.w} h={D.h} ok="OK" okHot={p.okHot} />
    </Dialog>
  );
};
export const FI = {op: {x: 20, y: 84, w: 190}, vt: {x: 226, y: 84, w: 190}, pv: {x: 432, y: 84, w: 190}, ok: {x: DX.filt.w - 18 - 178 + 42, y: DX.filt.h - 34 - 14 - 15}};

const KW = ["let", "in", "each", "if", "then", "else", "type"];
export const AdvEditor: React.FC<{f: number; a: number; b: number; lines: string[]; shown: number; hl: number[]; hlColor: string; letIn: boolean; doneHot: boolean}> = (p) => {
  const D = DX.adv;
  const tok = (s: string) => s.split(/(\s+|"[^"]*"|#"[^"]*"|[(){}\[\],=])/).map((t, i) => <span key={i} style={{color: KW.includes(t) ? "#0000FF" : t.startsWith('"') || t.startsWith('#"') ? "#A31515" : /^[A-Z][A-Za-z.]*\./.test(t) ? "#795E26" : "#1B1B1B", fontWeight: KW.includes(t) ? 700 : 400}}>{t}</span>);
  return (
    <Dialog f={p.f} a={p.a} b={p.b} x={D.x} y={D.y} w={D.w} h={D.h} title="Advanced Editor">
      <Lb x={18} y={4} t="Sales" b s={16} /><Lb x={1080} y={6} t="Display Options ▾" c="#0F6CBD" s={14} />
      <div style={{position: "absolute", left: 18, top: 40, width: D.w - 36 - 36, height: 560, border: "1px solid #8A8A8A", background: "#fff", fontFamily: MONO, fontSize: 18, lineHeight: "32px"}}>
        {p.lines.slice(0, p.shown).map((l, i) => {
          const isLI = (l === "let" || l === "in") && p.letIn;
          const h = p.hl.includes(i);
          return <div key={i} style={{display: "flex", height: 32, background: isLI ? "rgba(16,185,129,.22)" : h ? `${p.hlColor}33` : "transparent", boxShadow: isLI ? "inset 4px 0 0 #10B981" : h ? `inset 4px 0 0 ${p.hlColor}` : "none"}}><span style={{width: 50, textAlign: "right", paddingRight: 12, color: "#999"}}>{i + 1}</span><span style={{whiteSpace: "pre"}}>{tok(l)}</span></div>;
        })}
      </div>
      <div style={{position: "absolute", left: 18, top: 612, fontSize: 15, color: "#107C41"}}>✓ No syntax errors have been detected.</div>
      <Btns w={D.w} h={D.h} ok="Done" okHot={p.doneHot} />
    </Dialog>
  );
};
export const AD = {done: {x: DX.adv.w - 18 - 178 + 42, y: DX.adv.h - 34 - 14 - 15}};
export {vis as _v, prog as _p, C as _C};
