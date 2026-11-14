// Shared Power Query Editor kit (Microsoft 365, Windows). Logical px, same 1536 x 806.4 window as the Excel kit.
import React from "react";
import { Dialog, DBtn, Field, Lbl, CtxMenu } from "./kit_ui";
import { Icon, Ribbon, F, camAt, prog, type Cam } from "./kit";
import { C, HEIGHT, M, S, STRIP_H, WIDTH, WIN_H, WIN_W } from "./theme";

export { CtxMenu };
const ui = (size: number, extra?: React.CSSProperties): React.CSSProperties => ({ fontFamily: F.ui, fontSize: size, color: C.ink, ...extra });
export const PQ_BODY = M.titleBar + M.tabs + M.ribbon + M.formula; // 182
export const PQ_ROW = 22, PQ_HEAD = 36, PQ_LEFT = 150, PQ_RIGHT = 250, PQ_NUM = 40;
export type PQCol = { name: string; type: "text" | "dec" | "int" | "date" | "any"; w: number };
export type PQCell = { v: string; kind?: "null" | "error" | "num" | "date" };
export type PQRow = { id: string; cells: PQCell[]; h: number; slot: number };
export const pqColX = (cols: PQCol[], c: number): number => PQ_LEFT + PQ_NUM + cols.slice(0, c).reduce((a, k) => a + k.w, 0);
export const pqRowY = (slot: number): number => PQ_BODY + PQ_HEAD + slot * PQ_ROW;

const TypeIcon: React.FC<{ t: PQCol["type"] }> = ({ t }) => (
  <div style={{ width: 24, height: 16, border: "1px solid #8A8A8A", borderRadius: 2, background: "#fff", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", ...ui(t === "text" ? 8 : 9, { fontWeight: 700, color: "#444", letterSpacing: -0.3 }), flex: "none" }}>
    {t === "text" ? "ABC" : t === "dec" ? "1.2" : t === "int" ? "123" : t === "date" ? "▦" : "ABC\u2009123"}
  </div>
);
export const PQTitle: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: WIN_W, height: M.titleBar, background: C.chrome, display: "flex", alignItems: "center", ...ui(12) }}>
    <div style={{ paddingLeft: 10, display: "flex", gap: 10, alignItems: "center", width: 300 }}><Icon k="table" s={16} /><Icon k="save" s={15} /><Icon k="undo" s={15} /></div>
    <div style={{ flex: 1, textAlign: "center" }}>{title}</div>
    <div style={{ width: 300, display: "flex", justifyContent: "flex-end", height: "100%" }}>{["—", "☐", "✕"].map((g, i) => <div key={i} style={{ width: 46, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", ...ui(13) }}>{g}</div>)}</div>
  </div>
);
export const PQTabs: React.FC<{ active: string; hot?: { tab: string; color: string; t: number } }> = ({ active, hot }) => {
  const tabs = ["File", "Home", "Transform", "Add Column", "View", "Tools", "Help"];
  let x = 6;
  return (
    <div style={{ position: "absolute", left: 0, top: M.titleBar, width: WIN_W, height: M.tabs, background: C.chrome }}>
      {tabs.map((t) => {
        const w = t.length * 7.4 + 28; const left = x; x += w; const on = t === active; const file = t === "File"; const h = hot && hot.tab === t && hot.t > 0.02;
        return (
          <div key={t} style={{ position: "absolute", left, top: 2, width: w, height: M.tabs - 2, ...ui(13, { fontWeight: on ? 600 : 400, color: file ? "#fff" : on ? C.xGreenDark : C.ink }), background: file ? C.xGreen : "transparent", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: file ? 0 : 4, ...(h && hot ? { boxShadow: `0 0 12px ${hot.color}, inset 0 0 2px ${hot.color}` } : {}) }}>
            {t}{on ? <div style={{ position: "absolute", left: 10, right: 10, bottom: 0, height: 3, background: C.xGreen, borderRadius: 2 }} /> : null}
          </div>
        );
      })}
    </div>
  );
};
export type PQGridProps = { cols: PQCol[]; rows: PQRow[]; q?: number[][]; selCols?: number[]; colGlow?: { c: number; color: string; t: number }[]; cellFx?: (rowId: string, c: number) => string | undefined; typeGlow?: { c: number; color: string; t: number }; clip?: number };
export const PQGrid: React.FC<PQGridProps> = (p) => {
  const gw = WIN_W - PQ_LEFT - PQ_RIGHT;
  const sel = (c: number): boolean => !!p.selCols && p.selCols.includes(c);
  return (
    <div style={{ position: "absolute", left: PQ_LEFT, top: PQ_BODY, width: gw, height: WIN_H - PQ_BODY - M.statusBar, background: "#fff", overflow: "hidden", clipPath: p.clip !== undefined ? `inset(0 0 ${(1 - p.clip) * 100}% 0)` : undefined }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: gw, height: PQ_HEAD, background: "#F3F3F3", borderBottom: "1px solid #D0D0D0" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: PQ_NUM, height: PQ_HEAD, borderRight: "1px solid #D0D0D0", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>▦</div>
        {p.cols.map((c, i) => {
          const x = pqColX(p.cols, i) - PQ_LEFT; const q = p.q?.[i] ?? [1, 0, 0]; const g = p.colGlow?.find((z) => z.c === i && z.t > 0.02); const tg = p.typeGlow && p.typeGlow.c === i && p.typeGlow.t > 0.02 ? p.typeGlow : undefined;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: 0, width: c.w, height: PQ_HEAD, boxSizing: "border-box", borderRight: "1px solid #D0D0D0", background: sel(i) ? "#F3C969" : "transparent", boxShadow: g ? `inset 0 0 0 2px ${g.color}, 0 0 14px ${g.color}` : undefined }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 6px 0", height: 26 }}>
                <div style={tg ? { borderRadius: 3, boxShadow: `0 0 12px 3px ${tg.color}`, outline: `2px solid ${tg.color}` } : undefined}><TypeIcon t={c.type} /></div>
                <span style={{ ...ui(12.5), flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>{c.name}</span><span style={{ fontSize: 8, color: "#555" }}>▼</span>
              </div>
              <div style={{ display: "flex", height: 4, margin: "2px 6px 0" }}><div style={{ width: `${q[0] * 100}%`, background: "#4CAF50" }} /><div style={{ width: `${q[1] * 100}%`, background: "#E53935" }} /><div style={{ width: `${q[2] * 100}%`, background: "#777" }} /></div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, top: PQ_HEAD, width: gw, height: 900 }}>
        {p.rows.map((r, ri) => r.h <= 0.01 ? null : (
          <div key={r.id} style={{ position: "absolute", left: 0, top: r.slot * PQ_ROW, width: gw, height: r.h * PQ_ROW, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: PQ_NUM, height: PQ_ROW, background: "#F3F3F3", borderRight: "1px solid #D0D0D0", boxSizing: "border-box", ...ui(11.5, { color: "#777" }), display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 6px" }}>{ri + 1}</div>
            {p.cols.map((c, ci) => {
              const cell = r.cells[ci]; if (!cell) return null; const fx = p.cellFx?.(r.id, ci);
              const err = cell.kind === "error", nul = cell.kind === "null", right = cell.kind === "num" || cell.kind === "date";
              return (
                <div key={ci} style={{ position: "absolute", left: pqColX(p.cols, ci) - PQ_LEFT, top: 0, width: c.w, height: PQ_ROW, boxSizing: "border-box", borderRight: "1px solid #EDEDED", borderBottom: "1px solid #EDEDED", background: sel(ci) ? "rgba(243,201,105,.18)" : "#fff", backgroundImage: fx ? `linear-gradient(${fx}, ${fx})` : err ? "linear-gradient(#FADBD8,#FADBD8)" : undefined, padding: "0 6px", display: "flex", alignItems: "center", justifyContent: right ? "flex-end" : "flex-start", ...ui(12.5, { fontStyle: nul ? "italic" : "normal", color: err ? "#C0392B" : nul ? "#8A8A8A" : C.ink }), whiteSpace: "pre", overflow: "hidden" }}>{err ? "Error" : nul ? "null" : cell.v}</div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
export const PQFormula: React.FC<{ text: string; glow?: string }> = ({ text, glow }) => (
  <div style={{ position: "absolute", left: 0, top: PQ_BODY - M.formula, width: WIN_W, height: M.formula, background: "#fff", borderTop: "1px solid #E1E1E1", borderBottom: "1px solid #D0D0D0", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 8, padding: "0 8px", ...ui(13) }}>
    <span style={{ color: "#BBB" }}>✕</span><span style={{ color: "#BBB" }}>✓</span><span style={{ fontStyle: "italic", fontFamily: F.cell, fontWeight: 700, color: "#555" }}>fx</span>
    <div style={{ flex: 1, height: 22, display: "flex", alignItems: "center", padding: "0 6px", borderRadius: 3, boxShadow: glow ? `0 0 12px ${glow}, inset 0 0 0 2px ${glow}` : undefined, fontFamily: F.mono, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden" }}>{text}</div>
  </div>
);
export const PQQueries: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: PQ_BODY, width: PQ_LEFT, height: WIN_H - PQ_BODY - M.statusBar, background: "#F8F8F8", borderRight: "1px solid #D0D0D0", boxSizing: "border-box" }}>
    <div style={{ height: 28, display: "flex", alignItems: "center", padding: "0 10px", ...ui(12, { fontWeight: 600 }) }}>Queries [1]</div>
    <div style={{ height: 28, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", background: "#DCE8F6", ...ui(12.5) }}><Icon k="table" s={14} />Sales</div>
  </div>
);
export const PQSettings: React.FC<{ steps: { name: string; t?: number }[]; sel: number; glow?: string }> = ({ steps, sel, glow }) => (
  <div style={{ position: "absolute", left: WIN_W - PQ_RIGHT, top: PQ_BODY, width: PQ_RIGHT, height: WIN_H - PQ_BODY - M.statusBar, background: "#F8F8F8", borderLeft: "1px solid #D0D0D0", boxSizing: "border-box", boxShadow: glow ? `inset 0 0 0 2px ${glow}, 0 0 16px ${glow}` : undefined }}>
    <div style={{ height: 28, display: "flex", alignItems: "center", padding: "0 10px", ...ui(12.5, { fontWeight: 600 }) }}>Query Settings</div>
    <div style={{ padding: "4px 12px", ...ui(11, { color: C.inkSoft, fontWeight: 600 }) }}>PROPERTIES</div>
    <div style={{ padding: "2px 12px" }}><div style={ui(11.5, { color: C.inkSoft })}>Name</div><div style={{ marginTop: 3, height: 22, border: "1px solid #BDBDBD", background: "#fff", padding: "0 6px", display: "flex", alignItems: "center", ...ui(12.5) }}>Sales</div></div>
    <div style={{ padding: "6px 12px", ...ui(11.5, { color: "#0563C1" }) }}>All Properties</div>
    <div style={{ padding: "8px 12px 4px", ...ui(11, { color: C.inkSoft, fontWeight: 600 }) }}>APPLIED STEPS</div>
    {steps.map((s, i) => (
      <div key={i} style={{ height: 26, margin: "0 6px", display: "flex", alignItems: "center", gap: 8, padding: "0 8px", background: i === sel ? "#C7DCF3" : "transparent", border: i === sel ? "1px solid #8FB4E3" : "1px solid transparent", opacity: s.t ?? 1, transform: `translateX(${(1 - (s.t ?? 1)) * 14}px)`, ...ui(12.5) }}>
        <span style={{ color: i === sel ? "#C42B1C" : "transparent", fontSize: 11 }}>✕</span><span style={{ flex: 1, whiteSpace: "nowrap" }}>{s.name}</span>{i > 1 ? <span style={{ fontSize: 11, color: "#777" }}>⚙</span> : null}
      </div>
    ))}
  </div>
);
export const PQStatus: React.FC<{ ncols: number; nrows: string }> = ({ ncols, nrows }) => (
  <div style={{ position: "absolute", left: 0, top: WIN_H - M.statusBar, width: WIN_W, height: M.statusBar, background: C.chrome, borderTop: "1px solid #D0D0D0", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", ...ui(11, { color: "#444" }) }}>
    <span>{ncols} COLUMNS, {nrows} ROWS</span><span>Column profiling based on top 1000 rows</span><span>PREVIEW DOWNLOADED ON TUESDAY</span>
  </div>
);
export type PQProps = { cam: Cam; title?: string; tab: string; glow?: { id: string; color: string; t: number }; hotTab?: { tab: string; color: string; t: number }; formula: string; formulaGlow?: string; grid: PQGridProps; steps: { name: string; t?: number }[]; sel: number; stepsGlow?: string; ncols: number; nrows: string; children?: React.ReactNode; extraGrid?: React.ReactNode };
export const PQStage: React.FC<PQProps> = (p) => {
  const sz = S * p.cam.z, vw = WIDTH, vh = HEIGHT - STRIP_H;
  const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
  const tx0 = clamp(vw / 2 - p.cam.cx * sz, vw - WIN_W * sz, 0), ty0 = clamp(vh / 2 - p.cam.cy * sz, vh - WIN_H * sz, 0);
  return (
    <div style={{ position: "absolute", left: 0, top: STRIP_H, width: vw, height: vh, overflow: "hidden", background: "#fff" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: WIN_W, height: WIN_H, transformOrigin: "0 0", transform: `translate(${tx0}px, ${ty0}px) scale(${sz})` }}>
        <PQQueries /><PQSettings steps={p.steps} sel={p.sel} glow={p.stepsGlow} />
        <PQGrid {...p.grid} />{p.extraGrid}
        <PQFormula text={p.formula} glow={p.formulaGlow} />
        <Ribbon tab={p.tab} glow={p.glow} />
        <PQTabs active={p.tab === "pqhome" ? "Home" : "Transform"} hot={p.hotTab} />
        <PQTitle title={p.title ?? "Sales - Power Query Editor"} />
        <PQStatus ncols={p.ncols} nrows={p.nrows} />
        {p.children}
      </div>
    </div>
  );
};
export { camAt, prog };
// ---------- PQ dialogs ----------
export const ReplaceValuesDialog: React.FC<{ x: number; y: number; t: number; find: string; repl: string; ok?: number; hi?: string }> = ({ x, y, t, find, repl, ok = 0, hi }) => (
  <Dialog x={x} y={y} w={420} h={300} title="Replace Values" t={t}>
    <Lbl x={14} y={12} text="Replace one value with another in the selected columns." />
    <Lbl x={14} y={50} text="Value To Find" /><Field x={14} y={70} w={380} value={find} caret hi={hi} />
    <Lbl x={14} y={110} text="Replace With" /><Field x={14} y={130} w={380} value={repl} hi={hi} />
    <Lbl x={14} y={172} text="▸ Advanced options" />
    <DBtn x={222} y={228} w={86} label="OK" def press={ok} /><DBtn x={316} y={228} w={86} label="Cancel" />
  </Dialog>
);
export const ReplaceErrorsDialog: React.FC<{ x: number; y: number; t: number; val: string; ok?: number; hi?: string }> = ({ x, y, t, val, ok = 0, hi }) => (
  <Dialog x={x} y={y} w={420} h={230} title="Replace Errors" t={t}>
    <Lbl x={14} y={12} text="Replace the error values in the selected columns." />
    <Lbl x={14} y={50} text="Value" /><Field x={14} y={70} w={380} value={val} caret hi={hi} />
    <DBtn x={222} y={160} w={86} label="OK" def press={ok} /><DBtn x={316} y={160} w={86} label="Cancel" />
  </Dialog>
);
export const SplitDialog: React.FC<{ x: number; y: number; t: number; delim: string; ok?: number; hi?: string }> = ({ x, y, t, delim, ok = 0, hi }) => (
  <Dialog x={x} y={y} w={480} h={360} title="Split Column by Delimiter" t={t}>
    <Lbl x={14} y={12} text="Specify the delimiter used to split the text column." />
    <Lbl x={14} y={46} text="Select or enter delimiter" /><Field x={14} y={66} w={220} value="--Custom--" dd /><Field x={244} y={66} w={120} value={delim} caret hi={hi} />
    <Lbl x={14} y={112} text="Split at" />
    {["Left-most delimiter", "Right-most delimiter", "Each occurrence of the delimiter"].map((s, i) => (
      <div key={s} style={{ position: "absolute", left: 24, top: 136 + i * 26, display: "flex", alignItems: "center", gap: 8, ...ui(12.5) }}><div style={{ width: 14, height: 14, borderRadius: 7, border: "1px solid #555", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{i === 2 ? <div style={{ width: 7, height: 7, borderRadius: 4, background: "#0078D7" }} /> : null}</div>{s}</div>
    ))}
    <Lbl x={14} y={226} text="▸ Advanced options" />
    <DBtn x={282} y={288} w={86} label="OK" def press={ok} /><DBtn x={376} y={288} w={86} label="Cancel" />
  </Dialog>
);
