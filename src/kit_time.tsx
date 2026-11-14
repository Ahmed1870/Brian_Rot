// Lesson 62 visuals: month/year shift panel, cumulative bars, Mark-as-Date-Table dialog + menu. 2D only.
import React from "react";
import { F, prog } from "./kit";
import { DBtn, Dialog, Field, Lbl } from "./kit_ui";
import { C } from "./theme";
import { MONTHS12, ORDER_TOT, PY12, num } from "./data";

const card = (x: number, y: number, w: number, h: number, t: number, color: string): React.CSSProperties => ({ position: "absolute", left: x, top: y + (1 - t) * 14, width: w, height: h, opacity: t, background: "rgba(15,23,42,.96)", border: `2px solid ${color}`, borderRadius: 16, boxShadow: `0 0 22px ${color}66`, boxSizing: "border-box", zIndex: 26 });

// ---------- two-year timeline panel (2025 full, 2026 Jan-Jun) with a shifting filter-context arrow ----------
export const ShiftPanel: React.FC<{ x: number; y: number; t: number; sel: number; color: string; arrow: number; tgtRow: 0 | 1; tgtCol: number; caption: string; showVals?: boolean }> = ({ x, y, t, sel, color, arrow, tgtRow, tgtCol, caption, showVals = true }) => {
  if (t <= 0) return null;
  const cw = 106, ch = 62, X0 = 96, Y0 = 70, gy = 96;
  const cx = (c: number): number => X0 + c * (cw + 4);
  const cy = (r: number): number => Y0 + r * gy;
  const from = { x: cx(sel) + cw / 2, y: cy(1) }, to = { x: cx(tgtCol) + cw / 2, y: tgtRow === 0 ? cy(0) + ch : cy(1) - 2 };
  const same = tgtRow === 1;
  const d = same ? `M${from.x} ${cy(1) + ch} C${from.x} ${cy(1) + ch + 46} ${to.x} ${cy(1) + ch + 46} ${to.x} ${cy(1) + ch + 2}` : `M${from.x} ${from.y} C${from.x} ${from.y - 38} ${to.x} ${to.y + 38} ${to.x} ${to.y}`;
  const cell = (r: number, c: number): React.ReactNode => {
    const v = r === 0 ? PY12[c] : c < 6 ? ORDER_TOT[c] : null;
    const isTgt = r === tgtRow && c === tgtCol && arrow > 0.9, isSel = r === 1 && c === sel;
    const bc = isTgt ? color : isSel ? C.blue : "#475569";
    return (
      <div key={r + "-" + c} style={{ position: "absolute", left: cx(c), top: cy(r), width: cw, height: ch, boxSizing: "border-box", border: `${isTgt || isSel ? 2.5 : 1}px solid ${bc}`, borderRadius: 8, background: v === null ? "#0B1220" : isTgt ? `${color}33` : isSel ? `${C.blue}26` : "#1E293B", boxShadow: isTgt ? `0 0 18px ${color}` : isSel ? `0 0 12px ${C.blue}` : undefined, textAlign: "center", fontFamily: F.ui, color: C.text }}>
        <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 6 }}>{MONTHS12[c]} {r === 0 ? 2025 : 2026}</div>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 17, marginTop: 6, color: v === null ? "#64748B" : C.text }}>{v === null ? "—" : showVals ? num(v) : "···"}</div>
      </div>
    );
  };
  return (
    <div style={card(x, y, 1456, 330, t, color)}>
      <div style={{ position: "absolute", left: 22, top: 14, fontFamily: F.ui, fontWeight: 700, fontSize: 20, color: C.text }}>Dim_Date timeline · Total Sales by month</div>
      <div style={{ position: "absolute", left: 22, top: Y0 + 22, fontFamily: F.mono, fontSize: 18, color: "#94A3B8" }}>2025</div>
      <div style={{ position: "absolute", left: 22, top: Y0 + gy + 22, fontFamily: F.mono, fontSize: 18, color: C.blue }}>2026</div>
      {Array.from({ length: 12 }, (_, c) => cell(0, c))}{Array.from({ length: 12 }, (_, c) => cell(1, c))}
      <svg width={1456} height={330} style={{ position: "absolute", left: 0, top: 0 }}>
        {arrow > 0 ? <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth="4" strokeDasharray="1" strokeDashoffset={1 - arrow} style={{ filter: `drop-shadow(0 0 6px ${color})` }} /> : null}
        {arrow > 0.95 ? <circle cx={to.x} cy={same ? cy(1) + ch + 2 : to.y} r={7} fill={color} /> : null}
      </svg>
      <div style={{ position: "absolute", left: 22, right: 22, top: 270, height: 44, borderRadius: 10, background: "#0B1220", border: `1px solid ${color}`, display: "flex", alignItems: "center", padding: "0 16px", fontFamily: F.mono, fontSize: 18, color: C.text }}>{caption}</div>
    </div>
  );
};

// ---------- TOTALYTD / TOTALQTD / TOTALMTD mini bar charts (Jan-Jun 2026) ----------
export const AccBars: React.FC<{ x: number; y: number; t: number; title: string; sub: string; vals: number[]; color: string; rise: number; maxV: number; w?: number }> = ({ x, y, t, title, sub, vals, color, rise, maxV, w = 440 }) => {
  if (t <= 0) return null;
  const bh = 190, bw = 44, gap = (w - 40 - 6 * bw) / 5;
  return (
    <div style={card(x, y, w, 330, t, color)}>
      <div style={{ position: "absolute", left: 20, top: 14, fontFamily: F.mono, fontWeight: 700, fontSize: 22, color }}>{title}</div>
      <div style={{ position: "absolute", left: 20, top: 46, fontFamily: F.ui, fontSize: 15, color: "#94A3B8" }}>{sub}</div>
      {vals.map((v, i) => {
        const k = prog(rise, i * 0.12, 0.5), h = (v / maxV) * bh * k;
        return (
          <div key={i}>
            <div style={{ position: "absolute", left: 20 + i * (bw + gap), top: 96 + bh - h, width: bw, height: h, background: `linear-gradient(${color}, ${color}88)`, borderRadius: "4px 4px 0 0", boxShadow: `0 0 10px ${color}66` }} />
            <div style={{ position: "absolute", left: 20 + i * (bw + gap) - 6, top: 96 + bh + 8, width: bw + 12, textAlign: "center", fontFamily: F.ui, fontSize: 14, color: "#CBD5E1" }}>{MONTHS12[i]}</div>
            <div style={{ position: "absolute", left: 20 + i * (bw + gap) - 14, top: 96 + bh - h - 20, width: bw + 28, textAlign: "center", fontFamily: F.mono, fontSize: 11.5, color: C.text, opacity: k > 0.9 ? 1 : 0 }}>{num(v / 1000)}k</div>
          </div>
        );
      })}
    </div>
  );
};

// ---------- days strip: contiguous vs gap ----------
export const DaysStrip: React.FC<{ x: number; y: number; t: number; fix: number }> = ({ x, y, t, fix }) => {
  if (t <= 0) return null;
  const gaps = [6, 7, 18];
  return (
    <div style={card(x, y, 1000, 126, t, C.green)}>
      <div style={{ position: "absolute", left: 18, top: 10, fontFamily: F.ui, fontWeight: 700, fontSize: 18, color: C.text }}>Date column check · one row per day</div>
      <div style={{ position: "absolute", left: 18, top: 44, display: "flex", gap: 5 }}>
        {Array.from({ length: 31 }, (_, i) => {
          const gap = gaps.includes(i) && fix < 0.5;
          return <div key={i} style={{ width: 25, height: 28, borderRadius: 4, boxSizing: "border-box", border: `1.5px ${gap ? "dashed" : "solid"} ${gap ? C.red : C.green}`, background: gap ? "#7F1D1D55" : `${C.green}26`, color: gap ? C.red : C.green, fontFamily: F.mono, fontSize: 11, textAlign: "center", lineHeight: "25px" }}>{gap ? "✗" : i + 1}</div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 18, top: 88, fontFamily: F.ui, fontSize: 15, color: fix < 0.5 ? C.red : C.green }}>{fix < 0.5 ? "Missing days break the time functions ✗" : "Contiguous · no gaps · no duplicates ✓"}</div>
    </div>
  );
};

// ---------- Power Pivot: Date Table dropdown + Mark as Date Table dialog ----------
export const DateMenu: React.FC<{ x: number; y: number; t: number; hover: boolean }> = ({ x, y, t, hover }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, width: 190, background: "#fff", border: "1px solid #B5B5B5", boxShadow: "0 6px 16px rgba(0,0,0,.3)", opacity: t, zIndex: 40, fontFamily: F.ui, fontSize: 12.5, color: C.ink }}>
      {["Mark as Date Table", "Date Table Settings"].map((q, i) => <div key={q} style={{ height: 30, display: "flex", alignItems: "center", padding: "0 12px", color: i === 1 ? "#9A9A9A" : C.ink, ...(i === 0 && hover ? { background: "#E2EFE7", outline: `2px solid ${C.green}` } : {}) }}>{q}</div>)}
    </div>
  )
);
export const MD = { w: 540, h: 214 };
export const mdOk = (x: number, y: number): { x: number; y: number } => ({ x: x + MD.w - 190 + 40, y: y + 30 + 134 + 12 });
export const MarkDateDialog: React.FC<{ x: number; y: number; t: number; col: string; ok?: number; glow?: string }> = ({ x, y, t, col, ok = 0, glow }) => (
  <Dialog x={x} y={y} w={MD.w} h={MD.h} title="Mark as Date Table" t={t}>
    <Lbl x={18} y={14} text="Choose a column that contains unique dates (one row per day):" />
    <Field x={18} y={48} w={300} value={col} dd h={24} hi={glow} />
    <Lbl x={18} y={84} text="The date column must have unique values with no gaps." color="#555" />
    <DBtn x={MD.w - 190} y={134} w={80} label="OK" def press={ok} />
    <DBtn x={MD.w - 100} y={134} w={80} label="Cancel" />
  </Dialog>
);
