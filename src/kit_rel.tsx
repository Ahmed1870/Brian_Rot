// Shared relationship-model UI (Power Pivot diagram canvas, Edit Relationship dialog, New Measure dialog). Written once, reused by lessons.
import React from "react";
import { F, prog } from "./kit";
import { DBtn, Dialog, Field, Lbl } from "./kit_ui";
import { C } from "./theme";

export type Pt = [number, number];
export type Bx = { n: string; f: string[]; x: number; y: number; w: number };
export type Ln = { pts: Pt[]; color: string; dashed?: boolean; dir: "down" | "both" | "none"; t: number; flow?: number; a?: string; b?: string; rev?: string };
export const BH = 28, FH = 20;
export const bxH = (b: Bx): number => BH + b.f.length * FH + 8;
const along = (pts: Pt[], u: number): { x: number; y: number; ang: number } => {
  const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const tot = segs.reduce((a, b) => a + b, 0); let d = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const k = segs[i] ? Math.min(1, d / segs[i]) : 0; const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, ang: (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI }; } d -= segs[i]; }
  return { x: pts[0][0], y: pts[0][1], ang: 0 };
};
export const STAR: Bx[] = [
  { n: "Dim_Date", f: ["DateKey", "Month", "Year"], x: 590, y: 16, w: 260 },
  { n: "Dim_Product", f: ["ProductKey", "ProductName", "Category", "UnitPrice"], x: 130, y: 70, w: 250 },
  { n: "Dim_Customer", f: ["CustomerKey", "CustomerName", "City", "Segment"], x: 1060, y: 70, w: 250 },
  { n: "Fact_Sales", f: ["SalesKey", "OrderDateKey", "ShipDateKey", "ProductKey", "CustomerKey", "Qty", "Amount"], x: 590, y: 230, w: 260 },
];
export const L_PROD: Pt[] = [[380, 108], [485, 108], [485, 328], [590, 328]];
export const L_CUST: Pt[] = [[1060, 108], [955, 108], [955, 348], [850, 348]];
export const L_ORD: Pt[] = [[650, 112], [650, 230]];
export const L_SHIP: Pt[] = [[790, 112], [790, 230]];
export const bodyPt = (px: number, py: number, wx: number, wy: number): Pt => [wx + px, wy + py];

const Arrow: React.FC<{ p: { x: number; y: number; ang: number }; color: string; s?: number }> = ({ p, color, s = 9 }) => (
  <polygon points={`${s},0 ${-s * 0.7},${s * 0.7} ${-s * 0.7},${-s * 0.7}`} fill={color} transform={`translate(${p.x},${p.y}) rotate(${p.ang})`} />
);
export const RelCanvas: React.FC<{ t: number; boxes?: Bx[]; lines: Ln[]; hl?: Record<string, string>; hotF?: Record<string, string>; ph?: number; children?: React.ReactNode }> = ({ t, boxes = STAR, lines, hl = {}, hotF = {}, ph = 0, children }) => (
  <div style={{ position: "absolute", inset: 0, opacity: t }}>
    <svg width={1440} height={504} style={{ position: "absolute", left: 0, top: 0 }}>
      {lines.map((l, i) => {
        if (l.t <= 0) return null;
        const d = "M" + l.pts.map((p) => p.join(" ")).join(" L");
        const s0 = l.pts[0], s1 = l.pts[l.pts.length - 1];
        return (
          <g key={i} opacity={l.t}>
            <path d={d} stroke={l.color} strokeWidth={l.dashed ? 2.4 : 3} fill="none" strokeDasharray={l.dashed ? "8 6" : undefined} />
            {l.dir !== "none" ? <Arrow p={along(l.pts, 0.86)} color={l.color} /> : null}
            {l.dir === "both" ? <Arrow p={{ ...along(l.pts, 0.14), ang: along(l.pts, 0.14).ang + 180 }} color={C.amber} /> : null}
            {l.flow !== undefined ? Array.from({ length: 6 }, (_, k) => { const u = (ph * l.flow! + k / 6) % 1, p = along(l.pts, u); return <circle key={k} cx={p.x} cy={p.y} r={5} fill={l.color} opacity={0.9} />; }) : null}
            {l.flow !== undefined && l.dir === "both" ? Array.from({ length: 4 }, (_, k) => { const u = 1 - ((ph * l.flow! + k / 4) % 1), p = along(l.pts, u); return <circle key={"r" + k} cx={p.x} cy={p.y} r={5} fill={C.amber} opacity={0.9} />; }) : null}
            {l.a ? <text x={s0[0] + (s0[0] < s1[0] ? 8 : s0[0] > s1[0] ? -16 : 8)} y={s0[1] + (s0[1] < s1[1] && s0[0] === s1[0] ? 16 : -6)} fontSize="15" fontWeight="700" fill="#333" fontFamily="Arial">{l.a}</text> : null}
            {l.b ? <text x={s1[0] + (s0[0] < s1[0] ? -18 : s0[0] > s1[0] ? 8 : 8)} y={s1[1] + (s0[0] === s1[0] ? -8 : -6)} fontSize="17" fontWeight="700" fill="#333" fontFamily="Arial">{l.b}</text> : null}
          </g>
        );
      })}
    </svg>
    {boxes.map((b) => {
      const on = hl[b.n];
      return (
        <div key={b.n} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: bxH(b), background: "#fff", border: `1.5px solid ${on ?? "#8E9AAF"}`, boxShadow: on ? `0 0 18px ${on}` : "0 2px 6px rgba(0,0,0,.2)", boxSizing: "border-box" }}>
          <div style={{ height: BH, background: "#DCE3EE", borderBottom: "1px solid #B9C4D6", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", fontFamily: F.ui, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{b.n}<span style={{ fontSize: 11, color: C.inkSoft }}>▭ ▢</span></div>
          {b.f.map((q) => <div key={q} style={{ height: FH, display: "flex", alignItems: "center", padding: "0 10px", fontFamily: F.ui, fontSize: 12, color: C.ink, background: hotF[b.n + "." + q] ? `${hotF[b.n + "." + q]}33` : undefined, boxShadow: hotF[b.n + "." + q] ? `inset 0 0 0 1.5px ${hotF[b.n + "." + q]}` : undefined }}>{q}</div>)}
        </div>
      );
    })}
    {children}
  </div>
);

// ---------- Edit Relationship (Power Pivot diagram view; Excel Data Model = one-to-many only) ----------
const Grid: React.FC<{ x: number; y: number; cols: string[]; rows: string[][]; hi: number; color?: string }> = ({ x, y, cols, rows, hi, color = C.blue }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 590, border: "1px solid #A8A8A8", background: "#fff", fontFamily: F.ui, fontSize: 12 }}>
    <div style={{ display: "flex", background: "#EDEDED", height: 22, borderBottom: "1px solid #BDBDBD" }}>{cols.map((c, i) => <div key={c} style={{ flex: 1, padding: "0 6px", display: "flex", alignItems: "center", fontWeight: 600, borderRight: "1px solid #D0D0D0", background: i === hi ? `${color}44` : undefined, boxShadow: i === hi ? `inset 0 0 0 2px ${color}` : undefined }}>{c}</div>)}</div>
    {rows.map((r, k) => <div key={k} style={{ display: "flex", height: 20, borderBottom: "1px solid #EEE" }}>{r.map((v, i) => <div key={i} style={{ flex: 1, padding: "0 6px", display: "flex", alignItems: "center", borderRight: "1px solid #EEE", fontFamily: F.cell, background: i === hi ? `${color}14` : undefined }}>{v}</div>)}</div>)}
  </div>
);
export const EDIT_REL = { w: 640, h: 440 };
export const editRelOk = (x: number, y: number): { x: number; y: number } => ({ x: x + EDIT_REL.w - 190 + 40, y: y + 30 + EDIT_REL.h - 30 - 52 + 12 });
export const EditRelDialog: React.FC<{ x: number; y: number; t: number; glow?: string; ok?: number }> = ({ x, y, t, glow, ok = 0 }) => (
  <Dialog x={x} y={y} w={EDIT_REL.w} h={EDIT_REL.h} title="Edit Relationship" t={t}>
    <Lbl x={18} y={10} text="Select the table and column to use for the relationship (many side), then the related lookup table (one side)." />
    <Lbl x={18} y={42} text="Table:" bold /><Field x={70} y={38} w={200} value="Fact_Sales" dd h={22} />
    <Grid x={18} y={68} cols={["SalesKey", "OrderDateKey", "ProductKey", "Qty"]} rows={[["100001", "20260412", "88", "4"], ["100002", "20260203", "20", "1"], ["100003", "20260115", "464", "2"]]} hi={2} color={glow ?? C.blue} />
    <Lbl x={18} y={176} text="Related Lookup Table:" bold /><Field x={160} y={172} w={200} value="Dim_Product" dd h={22} />
    <Grid x={18} y={202} cols={["ProductKey", "ProductName", "Category", "UnitPrice"]} rows={[["1", "Laptop 15", "Computers", "18,500"], ["2", "Wireless Mouse", "Accessories", "450"], ["3", "Mechanical Keyboard", "Accessories", "1,200"]]} hi={0} color={glow ?? C.blue} />
    <div style={{ position: "absolute", left: 18, top: 312, fontFamily: F.ui, fontSize: 12.5, color: C.ink, display: "flex", gap: 8, alignItems: "center" }}><div style={{ width: 14, height: 14, border: "1.5px solid #555", boxSizing: "border-box", background: "#fff", fontSize: 11, lineHeight: "11px", textAlign: "center" }}>✔</div>Active</div>
    <Lbl x={18} y={340} text="Cardinality: One-to-Many (1:*)  ·  filter direction: Single (Dim → Fact)" color={C.xGreenDark} />
    <DBtn x={EDIT_REL.w - 190} y={EDIT_REL.h - 30 - 52} w={80} label="OK" def press={ok} />
    <DBtn x={EDIT_REL.w - 100} y={EDIT_REL.h - 30 - 52} w={80} label="Cancel" />
  </Dialog>
);

// ---------- Measure dialog (Power Pivot tab -> Measures -> New Measure...) ----------
export const MEAS = { w: 700, h: 420 };
export const MeasureDialog: React.FC<{ x: number; y: number; t: number; formula: string; caret: boolean; name: string; hiF?: string; check?: number; ok?: number }> = ({ x, y, t, formula, caret, name, hiF, check = 0, ok = 0 }) => (
  <Dialog x={x} y={y} w={MEAS.w} h={MEAS.h} title="Measure" t={t}>
    <Lbl x={18} y={14} text="Table name:" bold /><Field x={150} y={10} w={220} value="Fact_Sales" dd h={22} />
    <Lbl x={18} y={46} text="Measure name:" bold /><Field x={150} y={42} w={320} value={name} h={22} />
    <Lbl x={18} y={78} text="Description:" bold /><Field x={150} y={74} w={520} value="" h={22} />
    <Lbl x={18} y={110} text="Formula:" bold />
    <div style={{ position: "absolute", left: 18, top: 132, width: 664, height: 120, background: "#fff", border: `1.5px solid ${hiF ?? "#7A7A7A"}`, boxShadow: hiF ? `0 0 14px ${hiF}` : undefined, boxSizing: "border-box", padding: "8px 10px", fontFamily: F.mono, fontSize: 14, color: C.ink, lineHeight: "22px", whiteSpace: "pre-wrap", overflow: "hidden" }}>
      <span style={{ color: "#888", marginRight: 6 }}>fx</span>{"="}{formula}{caret ? <span style={{ borderLeft: "2px solid #111", marginLeft: 1 }} /> : null}
    </div>
    <DBtn x={18} y={262} w={150} label="Check DAX Formula" press={check} />
    <div style={{ position: "absolute", left: 182, top: 264, fontFamily: F.ui, fontSize: 13, color: C.xGreenDark, opacity: check > 0.5 ? 1 : 0 }}>✓ No errors in formula.</div>
    <Lbl x={18} y={304} text="Formatting Options" bold />
    <Lbl x={30} y={332} text="Category:" /><Field x={150} y={328} w={220} value="Currency" dd h={22} />
    <DBtn x={MEAS.w - 190} y={MEAS.h - 30 - 52} w={80} label="OK" def press={ok} />
    <DBtn x={MEAS.w - 100} y={MEAS.h - 30 - 52} w={80} label="Cancel" />
  </Dialog>
);
export const measOk = (x: number, y: number): { x: number; y: number } => ({ x: x + MEAS.w - 190 + 40, y: y + 30 + MEAS.h - 30 - 52 + 12 });
export const measCheck = (x: number, y: number): { x: number; y: number } => ({ x: x + 18 + 75, y: y + 30 + 262 + 12 });
void prog;
