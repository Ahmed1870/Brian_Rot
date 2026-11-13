import React from "react";
import { useCurrentFrame } from "remotion";
import { A1, A2, A3, A4, A5, A6, SCENES } from "./sync";
import { FACT_COLS, MONTHS, N_ROWS, ORDER_TOT, SHIP_TOT, factRow, num } from "./data";
import { Excel, F, buildCols, camAt, lerp, path, prog, ribbonPos, type Cell, type GRow } from "./kit";
import { Cursor, FieldsPane, KpiCard, Logo, SceneFx, TopStrip } from "./kit_ui";
import { PP, PPWindow, PP_BODY_Y, type PPTbl } from "./kit_pp";
import { EditRelDialog, L_CUST, L_ORD, L_PROD, L_SHIP, MeasureDialog, RelCanvas, editRelOk, measCheck, measOk, type Bx, type Ln } from "./kit_rel";
import { C, M, WIN_H, WIN_W, XLSX_NAME } from "./theme";

const badge = "Lesson 55 / 76 · Unit 11 / 14";
const win = (a: number, b: number, f: number, r = 8): number => prog(f, a, r) * (1 - prog(f, b, r));
const D = SCENES.map((s) => s.end - s.start);
const sl = (d: number, f: number, a: string, b: string, ca: string, cb: string, arA = false): React.ReactNode => (
  <TopStrip f={f} badge={badge} lines={[{ from: 60, to: Math.round(d * 0.45), text: a, color: ca, ar: arA }, { from: Math.round(d * 0.55), to: Math.round(d * 0.95), text: b, color: cb }]} />
);
const Chip: React.FC<{ x: number; y: number; text: string; color: string; t: number; mono?: boolean; big?: boolean }> = ({ x, y, text, color, t, mono, big }) => (
  t <= 0 ? null : <div style={{ position: "absolute", left: x, top: y, opacity: t, transform: `translateY(${(1 - t) * 8}px)`, background: C.slate, color: C.text, border: `2px solid ${color}`, borderRadius: 8, padding: big ? "10px 18px" : "6px 12px", boxShadow: `0 0 14px ${color}88`, fontFamily: mono ? F.mono : F.ui, fontWeight: 600, fontSize: big ? 22 : mono ? 14 : 15, whiteSpace: "nowrap", zIndex: 45 }}>{text}</div>
);
const Seal: React.FC<{ t: number; line1: string; line2: string; x?: number; y?: number }> = ({ t, line1, line2, x = 1146, y = 300 }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, width: 340, opacity: t, transform: `scale(${0.7 + 0.3 * t})`, zIndex: 60, textAlign: "center" }}>
      <div style={{ width: 170, height: 170, margin: "0 auto", borderRadius: 85, background: `radial-gradient(circle, ${C.green}33, ${C.slate})`, border: `4px solid ${C.green}`, boxShadow: `0 0 40px ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 92, color: C.green }}>✓</div>
      <div style={{ marginTop: 12, background: C.slate, border: `1.5px solid ${C.green}`, borderRadius: 12, padding: "8px 12px", fontFamily: F.ui, fontWeight: 700, fontSize: 21, color: C.text }}>{line1}</div>
      <div style={{ marginTop: 8, fontFamily: F.ar, fontWeight: 600, fontSize: 19, color: C.green, background: C.slate, borderRadius: 10, padding: "4px 10px" }}>{line2}</div>
    </div>
  )
);
const cell = (v: string | number, o: Partial<Cell> = {}): Cell => ({ v, ...o });
const FC = buildCols([84, 92, 92, 84, 92, 44, 84]);
const factRows = (n: number): GRow[] => [
  { id: "h", hdr: 1, slot: 0, h: 1, cells: FACT_COLS.map((t) => cell(t, { b: true, fill: "#E2EFDA" })) },
  ...Array.from({ length: n }, (_, i) => ({ id: "r" + i, hdr: i + 2, slot: i + 1, h: 1, cells: factRow(i).map((v, c) => cell(v, { al: c >= 5 ? ("r" as const) : ("l" as const) })) })),
];
type SP = { f: number; tab?: string; glow?: { id: string; color: string; t: number }; children?: React.ReactNode };
const camA = { z: 1, cx: 768, cy: 403 };
const Sheet: React.FC<SP> = (p) => (
  <Excel cam={camAt(p.f, [{ f: 0, ...camA }, { f: 9999, ...camA }])} file={XLSX_NAME} tab={p.tab ?? "powerpivot"} glow={p.glow} nameBox="A1" formula="SalesKey"
    sheets={["Fact_Sales", "Dim_Product", "Dim_Customer", "Dim_Date"]} sheet="Fact_Sales" grid={{ cols: FC, rows: factRows(26), fixedHdr: true, lines: true, active: { c: 0, slot: 0 }, sel: null }}>{p.children}</Excel>
);
const P0 = { x: PP.x, y: PP.y + PP_BODY_Y }; // body origin in stage px
const st = (p: [number, number]): { x: number; y: number } => ({ x: P0.x + p[0], y: P0.y + p[1] });
const NOTBL: PPTbl = { name: "", cols: [], widths: [], row: () => [], total: 0 };
const ppProps = { tbl: NOTBL, tabs: [] as string[], tab: 0, view: "diagram" as const };
const GRAY = "#8A94A6";
const Tag: React.FC<{ x: number; y: number; text: string; color: string; t: number }> = ({ x, y, text, color, t }) => (
  t <= 0 ? null : <div style={{ position: "absolute", left: x, top: y, opacity: t, background: "#fff", border: `1.5px solid ${color}`, color: C.ink, borderRadius: 4, padding: "2px 8px", fontFamily: F.ui, fontSize: 12.5, fontWeight: 700, boxShadow: `0 0 10px ${color}66` }}>{text}</div>
);
const Warn: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  t <= 0 ? null : <div style={{ position: "absolute", left: x, top: y, width: 30, height: 30, borderRadius: 15, background: C.red, color: "#fff", fontWeight: 800, fontSize: 19, textAlign: "center", lineHeight: "30px", opacity: t, boxShadow: `0 0 16px ${C.red}` }}>!</div>
);
const baseLines = (f: number, o: { flow?: boolean; prod?: string; prodDir?: "down" | "both"; flowOthers?: boolean; ship?: Ln | null }): Ln[] => {
  const ph = f / 70;
  const out: Ln[] = [
    { pts: L_PROD, color: o.prod ?? C.blue, dir: o.prodDir ?? "down", t: prog(f, 30, 30), flow: o.flow ? 1 : undefined, a: "1", b: "*" },
    { pts: L_CUST, color: C.blue, dir: "down", t: prog(f, 40, 30), flow: o.flow || o.flowOthers ? 1 : undefined, a: "1", b: "*" },
    { pts: L_ORD, color: C.blue, dir: "down", t: prog(f, 50, 30), flow: o.flow || o.flowOthers ? 1 : undefined, a: "1", b: "*" },
  ];
  if (o.ship) out.push(o.ship);
  void ph;
  return out;
};

// ================= SC01: filter propagation concept =================
export const Scene1: React.FC = () => {
  const f = useCurrentFrame(); const A = A1;
  const chaos = win(A.wrong, A.propag + 14, f, 12);
  const flowOn = f >= 188 && !(f >= A.wrong && f < A.propag);
  return (
    <SceneFx f={f} dur={D[0]} kind="fade">
      <Sheet f={f}>
        <PPWindow {...ppProps} t={prog(f, 0, 24)} custom={
          <RelCanvas t={prog(f, 8, 22)} lines={baseLines(f, { flow: flowOn })} ph={f / 70} hl={f >= A.propag ? { Dim_Product: C.blue, Fact_Sales: C.blue } : {}}>
            {chaos > 0.02 ? (
              <svg width={1440} height={504} style={{ position: "absolute", left: 0, top: 0, opacity: chaos }}>
                {["M850 300 Q1000 470 380 186", "M590 330 Q330 470 1060 190", "M380 150 Q700 -10 1060 150", "M720 112 Q450 200 300 186"].map((d, i) => <path key={i} d={d} stroke={C.red} strokeWidth="3" fill="none" strokeDasharray="10 7" />)}
                <text x="880" y="450" fontSize="22" fontWeight="700" fill={C.red} fontFamily="Arial">Total ≠ Σ rows  ✗</text>
              </svg>
            ) : null}
          </RelCanvas>} />
        <Chip x={360} y={650} big text="Relationship Types & Filter Propagation Engine" color={C.blue} t={win(A.hello, A.dive - 20, f, 14)} />
        <Chip x={360} y={650} text="Evaluation context · how filters travel through relationships" color={C.blue} t={win(A.dive, A.wrong - 12, f, 12)} />
        <Chip x={360} y={650} text="Chaotic filtering → double-counted totals ✗" color={C.red} t={win(A.wrong, A.propag - 6, f, 12)} />
        <Chip x={360} y={650} text="Downstream filter flow: Dimension (1) → Fact (*)" color={C.blue} t={win(A.propag, A.decide - 6, f, 12)} />
        <Chip x={360} y={650} text="You decide the filter direction · safely" color={C.green} t={prog(f, A.decide, 12)} />
      </Sheet>
      {sl(D[0], f, "الدرس 55 من 76 | الوحدة 11 من 14 ──► Relationship Types & Filter Propagation Engine", "Deterministic Evaluation Context ──► Downstream Filter Flow from Dimension (1) to Fact (*)", C.blue, C.green, true)}
    </SceneFx>
  );
};

// ================= SC02: single vs both =================
export const Scene2: React.FC = () => {
  const f = useCurrentFrame(); const A = A2;
  const DX = 448, DY = 140, okp = editRelOk(DX, DY), line = st([485, 218]);
  const both = f >= A.both && f < A.golden - 20;
  const prod = both ? C.amber : f >= A.single ? C.green : C.blue;
  const cur = path(f, [{ f: 0, x: 900, y: 420 }, { f: A.std - 18, x: line.x, y: line.y }, { f: A.std + 150, x: line.x, y: line.y }, { f: A.std + 180, x: okp.x, y: okp.y }, { f: A.single + 6, x: okp.x, y: okp.y }, { f: A.single + 70, x: 700, y: 560 }, { f: 1240, x: 700, y: 560 }]);
  return (
    <SceneFx f={f} dur={D[1]} kind="left">
      <Sheet f={f}>
        <PPWindow {...ppProps} t={1} custom={
          <RelCanvas t={1} lines={baseLines(f, { flow: f >= A.single, flowOthers: f >= A.tap, prod, prodDir: both ? "both" : "down" })} ph={f / 70}
            hl={both ? { Dim_Product: C.amber, Fact_Sales: C.amber } : f >= A.single ? { Dim_Product: C.green, Fact_Sales: C.green } : {}} hotF={f >= A.tap && !both ? { "Dim_Product.Category": C.green, "Dim_Customer.City": C.green } : {}}>
            <Warn x={470} y={204} t={win(A.loops, A.golden - 20, f, 10)} />
          </RelCanvas>} />
        <EditRelDialog x={DX} y={DY} t={win(A.std + 4, A.single - 28, f, 10)} glow={C.green} ok={prog(f, A.std + 176, 4) > 0.5 ? 1 : 0} />
        <Chip x={330} y={650} text="Double-click the line → Edit Relationship · Excel Data Model: One-to-Many only" color={C.blue} t={win(A.std + 4, A.single - 30, f, 10)} />
        <Chip x={330} y={650} text="Single Direction · One Side (Dim) → Many Side (Fact)" color={C.green} t={win(A.single, A.tap - 6, f, 10)} />
        <Chip x={330} y={650} text="Filter on Category / City → flows down to the sales rows" color={C.green} t={win(A.tap, A.both - 6, f, 10)} />
        <Chip x={200} y={650} mono text="Both = DAX only: CROSSFILTER(Fact_Sales[ProductKey], Dim_Product[ProductKey], Both)" color={C.amber} t={win(A.both, A.loops - 6, f, 10)} />
        <Chip x={330} y={650} text="Ambiguous circular filter paths ⚠" color={C.red} t={win(A.loops, A.perf - 6, f, 10)} />
        <Chip x={330} y={650} text="VertiPaq slows down · results get unpredictable" color={C.amber} t={win(A.perf, A.golden - 6, f, 10)} />
        <Chip x={330} y={650} text="Single direction = the golden rule ✓" color={C.green} t={prog(f, A.golden, 12)} />
        <Cursor x={cur.x} y={cur.y} f={f} clicks={[A.std - 14, A.std - 6, A.std + 176]} />
      </Sheet>
      {sl(D[1], f, "Cross Filtering Direction ──► Single (Standard & Recommended) vs. Both (High Risk)", "Architectural Warning ──► Bi-Directional Filtering Causes Ambiguous Calculations & Performance Drops", C.green, C.amber)}
    </SceneFx>
  );
};

// ================= SC03: USERELATIONSHIP =================
const FORMULA = "CALCULATE([Total Sales], USERELATIONSHIP(Fact_Sales[ShipDateKey], Dim_Date[DateKey]))";
export const Scene3: React.FC = () => {
  const f = useCurrentFrame(); const A = A3;
  const ppT = Math.max(0, Math.min(1, 1 - prog(f, 596, 12) + prog(f, 884, 14)));
  const mp = ribbonPos("powerpivot", "measures"), DX = 418, DY = 120;
  const menuL = mp.x - 40, menuT = mp.y + 38, item = { x: menuL + 85, y: menuT + 16 };
  const chk = measCheck(DX, DY), okp = measOk(DX, DY);
  const typed = FORMULA.slice(0, Math.max(0, Math.floor((f - 700) * 0.78)));
  const nameTyped = "Sales By Ship Date".slice(0, Math.max(0, Math.floor((f - 680) * 0.9)));
  const act = win(A.activ, A.activ + 150, f, 14);
  const ship: Ln = { pts: L_SHIP, color: act > 0.3 ? C.purple : GRAY, dashed: act < 0.5, dir: act > 0.3 ? "down" : "none", t: prog(f, A.inactive, 20), flow: act > 0.5 ? 1 : undefined, a: "1", b: "*" };
  const shipLine = st([790, 170]);
  const cur = path(f, [{ f: 0, x: 900, y: 520 }, { f: A.inactive - 20, x: 900, y: 520 }, { f: A.inactive + 30, x: shipLine.x, y: shipLine.y }, { f: 560, x: shipLine.x, y: shipLine.y }, { f: 636, x: mp.x, y: mp.y }, { f: 668, x: item.x, y: item.y }, { f: 690, x: DX + 300, y: DY + 175 }, { f: 842, x: chk.x, y: chk.y }, { f: 878, x: okp.x, y: okp.y }, { f: 960, x: 700, y: 560 }, { f: 1290, x: 700, y: 560 }]);
  const menu = win(646, 676, f, 6);
  const dlg = win(678, 892, f, 10);
  return (
    <SceneFx f={f} dur={D[2]} kind="down">
      <Sheet f={f} glow={{ id: "measures", color: C.purple, t: win(620, 700, f, 8) }}>
        <PPWindow {...ppProps} t={ppT} custom={
          <RelCanvas t={1} lines={baseLines(f, { ship })} ph={f / 40} hl={act > 0.3 ? { Dim_Date: C.purple, Fact_Sales: C.purple } : {}} hotF={f >= A.two && f < A.inactive ? { "Fact_Sales.OrderDateKey": C.blue, "Fact_Sales.ShipDateKey": C.purple } : {}}>
            <Tag x={540} y={150} text="Active · OrderDateKey" color={C.blue} t={prog(f, A.two, 12)} />
            <Tag x={805} y={150} text={act > 0.3 ? "Active during evaluation" : "Inactive · ShipDateKey"} color={act > 0.3 ? C.purple : GRAY} t={prog(f, A.inactive, 12)} />
          </RelCanvas>} />
        {menu > 0 ? <div style={{ position: "absolute", left: menuL, top: menuT, width: 180, background: "#fff", border: "1px solid #B5B5B5", boxShadow: "0 6px 16px rgba(0,0,0,.3)", opacity: menu, zIndex: 40, fontFamily: F.ui, fontSize: 12.5, color: C.ink }}>
          {["New Measure…", "Manage Measures…"].map((t, i) => <div key={t} style={{ height: 32, display: "flex", alignItems: "center", padding: "0 12px", ...(i === 0 && f >= 662 ? { background: "#E2EFE7", outline: `2px solid ${C.purple}` } : {}) }}>{t}</div>)}
        </div> : null}
        <MeasureDialog x={DX} y={DY} t={dlg} name={nameTyped} formula={typed} caret={f >= 700 && f < 850 && Math.floor(f / 8) % 2 === 0} hiF={f >= A.user - 22 && f < 870 ? C.purple : undefined} check={prog(f, 838, 4) > 0.5 ? 1 : 0} ok={prog(f, 878, 4) > 0.5 ? 1 : 0} />
        <Chip x={330} y={650} text="Two date columns in one fact table: Order Date & Ship Date" color={C.blue} t={win(A.two, A.inactive - 6, f, 10)} />
        <Chip x={330} y={650} text="Inactive Relationship · dashed line · only one can be active" color={C.purple} t={win(A.inactive, A.ship - 40, f, 10)} />
        <Chip x={330} y={662} text="Power Pivot tab → Measures → New Measure…" color={C.purple} t={win(A.ship - 8, A.ship + 120, f, 10) * (f < 700 ? 1 : 0.0)} />
        <Chip x={330} y={650} text="Dynamic DAX Activation ──► USERELATIONSHIP" color={C.purple} t={win(A.activ - 4, A.star - 6, f, 10)} />
        <Chip x={330} y={650} text="Star schema untouched · Order Date stays the active relationship" color={C.green} t={prog(f, A.star, 12)} />
        <Cursor x={cur.x} y={cur.y} f={f} clicks={[640, 666, 842, 880]} />
      </Sheet>
      {sl(D[2], f, "Inactive Relationship Management ──► Order Date (Active Solid Line) vs. Ship Date (Inactive Dashed Line)", "Dynamic DAX Activation ──► USERELATIONSHIP(Fact[ShipDateKey], Dim_Date[DateKey])", C.purple, C.purple)}
    </SceneFx>
  );
};

// ================= SC04: cardinality & bridge =================
const Mini: React.FC<{ x: number; y: number; w: number; t: number; color: string; title: string; sub: string; a: string; b: string; la: string; lb: string; pulse?: number; cross?: boolean }> = ({ x, y, w, t, color, title, sub, a, b, la, lb, pulse = 0, cross }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y + (1 - t) * 18, width: w, height: 330, opacity: t, background: "rgba(30,41,59,.96)", border: `2.5px solid ${color}`, borderRadius: 18, boxShadow: `0 0 ${14 + 24 * pulse}px ${color}`, boxSizing: "border-box", padding: 22, zIndex: 30 }}>
      <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 26, color: C.text }}>{title}</div>
      <div style={{ fontFamily: F.ui, fontSize: 17, color, marginTop: 4 }}>{sub}</div>
      <div style={{ position: "relative", height: 200, marginTop: 40 }}>
        {[[0, a], [w - 44 - 150, b]].map(([lx, n], i) => <div key={i} style={{ position: "absolute", left: lx as number, top: 40, width: 150, height: 90, background: "#fff", border: "1.5px solid #8E9AAF", borderRadius: 4, fontFamily: F.ui, fontWeight: 700, fontSize: 15, color: C.ink }}><div style={{ height: 28, background: "#DCE3EE", display: "flex", alignItems: "center", padding: "0 8px" }}>{n as string}</div><div style={{ padding: "6px 8px", fontWeight: 400, fontSize: 12, color: C.inkSoft }}>key · attributes…</div></div>)}
        <div style={{ position: "absolute", left: 150, top: 84, width: w - 44 - 300, height: 3, background: color, boxShadow: `0 0 10px ${color}` }} />
        <div style={{ position: "absolute", left: 156, top: 56, fontFamily: F.mono, fontWeight: 700, fontSize: 24, color }}>{la}</div>
        <div style={{ position: "absolute", left: w - 44 - 150 - 30, top: 56, fontFamily: F.mono, fontWeight: 700, fontSize: 24, color }}>{lb}</div>
        {cross ? <div style={{ position: "absolute", left: (w - 44) / 2 - 20, top: 62, fontSize: 36, color: C.red }}>⚠</div> : null}
      </div>
    </div>
  )
);
export const Scene4: React.FC = () => {
  const f = useCurrentFrame(); const A = A4;
  const p1 = f < A.bridge - 14;
  const bt = prog(f, A.bridge, 34), g = prog(f, A.rel2, 34);
  const BOXW = 250;
  return (
    <SceneFx f={f} dur={D[3]} kind="expand">
      <Sheet f={f}>
        <div style={{ position: "absolute", left: 30, top: 70, width: WIN_W - 60, height: WIN_H - 130, background: "rgba(15,23,42,.97)", border: `2px solid ${C.slate2}`, borderRadius: 20, zIndex: 25 }} />
        {p1 ? (
          <>
            <Mini x={52} y={130} w={470} t={prog(f, A.card, 16)} color={C.green} title="One-to-Many (1:*)" sub="Standard · optimal for VertiPaq" a="Dim_Product" b="Fact_Sales" la="1" lb="*" pulse={win(A.o2m, A.m2m - 10, f, 10)} />
            <Mini x={534} y={130} w={470} t={prog(f, A.card + 14, 16)} color={C.amber} title="One-to-One (1:1)" sub="Usually merge into one table" a="Dim_Product" b="Product_Info" la="1" lb="1" />
            <Mini x={1016} y={130} w={470} t={prog(f, A.card + 28, 16)} color={C.red} title="Many-to-Many (*:*)" sub="Ambiguous filter context · avoid" a="Dim_Product" b="Dim_Campaign" la="*" lb="*" cross pulse={win(A.m2m, A.bridge - 20, f, 10)} />
            <Chip x={420} y={600} text="Excel Data Model: relationships are One-to-Many only" color={C.blue} t={win(A.m2m + 20, A.bridge - 20, f, 10)} />
          </>
        ) : (
          <div style={{ position: "absolute", left: 52, top: 110, width: 1432, height: 560, zIndex: 30, opacity: prog(f, A.bridge - 14, 12) }}>
            <svg width={1432} height={560} style={{ position: "absolute", left: 0, top: 0 }}>
              <path d={`M${60 + BOXW} 250 H${1432 - 60 - BOXW}`} stroke={C.red} strokeWidth="4" strokeDasharray="10 8" opacity={1 - prog(f, A.bridge + 6, 24)} />
              <path d={`M${60 + BOXW} 250 H${716 - 150}`} stroke={C.green} strokeWidth="4" opacity={g} style={{ filter: `drop-shadow(0 0 6px ${C.green})` }} />
              <path d={`M${716 + 150} 250 H${1432 - 60 - BOXW}`} stroke={C.green} strokeWidth="4" opacity={g} style={{ filter: `drop-shadow(0 0 6px ${C.green})` }} />
              {[[60 + BOXW + 8, "1"], [716 - 150 - 34, "*"], [716 + 150 + 8, "*"], [1432 - 60 - BOXW - 30, "1"]].map(([x, t]) => <text key={String(x)} x={x as number} y={236} fontSize="26" fontWeight="700" fill={C.green} fontFamily="monospace" opacity={g}>{t}</text>)}
              <text x={716 - 14} y={236} fontSize="26" fontWeight="700" fill={C.red} fontFamily="monospace" opacity={1 - prog(f, A.bridge + 6, 24)}>* : *</text>
            </svg>
            {[["Dim_Product", 60, ["ProductKey", "ProductName", "Category"]], ["Dim_Campaign", 1432 - 60 - BOXW, ["CampaignKey", "CampaignName", "Channel"]]].map(([n, x, fs]) => (
              <div key={n as string} style={{ position: "absolute", left: x as number, top: 190, width: BOXW, background: "#fff", border: "1.5px solid #8E9AAF", fontFamily: F.ui, color: C.ink }}><div style={{ height: 30, background: "#DCE3EE", display: "flex", alignItems: "center", padding: "0 10px", fontWeight: 700, fontSize: 15 }}>{n as string}</div>{(fs as string[]).map((q) => <div key={q} style={{ height: 24, padding: "0 12px", display: "flex", alignItems: "center", fontSize: 13 }}>{q}</div>)}</div>
            ))}
            <div style={{ position: "absolute", left: 716 - 150, top: 190 + (1 - bt) * -200, width: 300, opacity: bt, background: "#fff", border: `2px solid ${C.amber}`, boxShadow: `0 0 ${14 + 14 * bt}px ${C.amber}`, fontFamily: F.ui, color: C.ink }}><div style={{ height: 30, background: "#FDEFD2", display: "flex", alignItems: "center", padding: "0 10px", fontWeight: 700, fontSize: 15 }}>Bridge_ProductCampaign</div>{["ProductKey", "CampaignKey"].map((q) => <div key={q} style={{ height: 24, padding: "0 12px", display: "flex", alignItems: "center", fontSize: 13 }}>{q}</div>)}</div>
            <Chip x={430} y={430} text="Many-to-Many → two clean One-to-Many relationships" color={C.green} t={win(A.rel2, A.keep - 6, f, 10)} />
            <Chip x={430} y={430} text="Bridge Table Pattern ──► predictable filter context" color={C.amber} t={win(A.bridge, A.rel2 - 6, f, 10)} />
            <Chip x={430} y={430} text="Filters flow cleanly · totals stay correct" color={C.green} t={prog(f, A.keep, 12)} />
          </div>
        )}
      </Sheet>
      {sl(D[3], f, "Relationship Cardinality Evaluation ──► Standard 1:* Topology vs. Complex *:* Cardinality", "Bridge Table Pattern ──► Converts Complex *:* into Two Standard 1:* Relationships", C.green, C.green)}
    </SceneFx>
  );
};

// ================= SC05: enterprise execution =================
const PC = buildCols([110, 150, 190]);
export const Scene5: React.FC = () => {
  const f = useCurrentFrame(); const A = A5;
  const ld = prog(f, A.file, 150);
  const fx = 1246, fy = 124;
  const chkY = (i: number): number => fy + 98 + 22 * i;
  const rowsOn = f >= 404, v1 = f >= 436, v2 = f >= 476;
  const tot1 = ORDER_TOT.reduce((a, b) => a + b, 0), tot2 = SHIP_TOT.reduce((a, b) => a + b, 0);
  const R = (id: string, slot: number, vals: Cell[]): GRow => ({ id, hdr: slot + 1, slot, h: 1, cells: vals });
  const rows: GRow[] = Array.from({ length: 26 }, (_, s) => R("e" + s, s, [cell(""), cell(""), cell("")]));
  rows[2] = R("hd", 2, [cell(rowsOn ? "Row Labels" : "", { b: true, fill: rowsOn ? "#DDEBF7" : undefined }), cell(v1 ? "Total Sales" : "", { b: true, fill: v1 ? "#DDEBF7" : undefined, al: "r" }), cell(v2 ? "Sales By Ship Date" : "", { b: true, fill: v2 ? "#DDEBF7" : undefined, al: "r" })]);
  MONTHS.forEach((m, i) => { rows[3 + i] = R("m" + i, 3 + i, [cell(f >= 410 + i * 6 ? m : ""), cell(v1 && f >= 440 + i * 8 ? num(ORDER_TOT[i]) : "", { al: "r" }), cell(v2 && f >= 480 + i * 8 ? num(SHIP_TOT[i]) : "", { al: "r" })]); });
  rows[9] = R("gt", 9, [cell(f >= 540 ? "Grand Total" : "", { b: true, fill: f >= 540 ? "#DDEBF7" : undefined }), cell(f >= 540 ? num(tot1) : "", { b: true, fill: f >= 540 ? "#DDEBF7" : undefined, al: "r" }), cell(f >= 540 ? num(tot2) : "", { b: true, fill: f >= 540 ? "#DDEBF7" : undefined, al: "r" })]);
  const cur = path(f, [{ f: 0, x: 700, y: 480 }, { f: 380, x: 700, y: 480 }, { f: 398, x: fx + 17, y: chkY(0) }, { f: 428, x: fx + 17, y: chkY(2) }, { f: 468, x: fx + 17, y: chkY(3) }, { f: 520, x: 700, y: 520 }, { f: 1193, x: 700, y: 520 }]);
  return (
    <SceneFx f={f} dur={D[4]} kind="expand">
      <Excel cam={camAt(f, [{ f: 0, ...camA }, { f: 9999, ...camA }])} file={XLSX_NAME} tab={f >= 380 ? "pivotanalyze" : "insert"} nameBox="A3" formula={rowsOn ? "Row Labels" : ""} sheets={["Fact_Sales", "Pivot"]} sheet="Pivot" grid={{ cols: PC, rows, fixedHdr: true, lines: true, active: { c: 0, slot: 2 }, sel: null }}>
        {f >= 380 ? <FieldsPane top={fy} h={WIN_H - fy - 52} fields={[{ name: "Month", on: rowsOn }, { name: "Year", on: false }, { name: "Total Sales", on: v1 }, { name: "Sales By Ship Date", on: v2 }, { name: "Amount", on: false }]} rows={rowsOn ? ["Month"] : []} values={[...(v1 ? ["Total Sales"] : []), ...(v2 ? ["Sales By Ship Date"] : [])]} /> : null}
        <Chip x={620} y={196} mono text={`${XLSX_NAME} · Order + Ship dates`} color={C.blue} t={win(A.file, A.meas + 20, f, 10)} />
        <KpiCard x={640} y={150} label="ROWS IN DATA MODEL" value={num(N_ROWS * ld)} color={C.blue} t={win(A.file + 10, 1100, f, 10)} flash={ld < 1 ? 1 : 0} />
        <KpiCard x={640} y={330} label="RESPONSE" value="< 2 ms" color={C.green} t={prog(f, A.ms, 12)} flash={win(A.ms, A.perf, f, 10)} />
        <Chip x={540} y={500} text="Order Date vs Ship Date · both measures, one model" color={C.purple} t={win(A.fifty, A.ms - 6, f, 10)} />
        <Seal x={700} y={420} t={prog(f, A.perf + 20, 26)} line1="Enterprise Filter Propagation" line2="سياق الفلترة لحظي على 50,000 صف" />
        <Cursor x={cur.x} y={cur.y} f={f} clicks={[400, 430, 470]} />
      </Excel>
      {sl(D[4], f, "Enterprise Filter Execution ──► Propagate Filters & Execute USERELATIONSHIP on 50,000 Rows", "Zero Latency Filter Context ──► High-Speed Dynamic Filter Context Processing in <2ms", C.blue, C.green)}
    </SceneFx>
  );
};

// ================= SC06: outro =================
export const Scene6: React.FC = () => {
  const f = useCurrentFrame(); const A = A6;
  const pr = prog(f, 60, 110), pct2 = (55 / 76) * 100;
  const skills = ["Filter propagation · Dimension (1) → Fact (*)", "Single direction · avoid Both (DAX only)", "Inactive relationships · USERELATIONSHIP", "Bridge table · replaces *:* relationships"];
  const fadeOut = 1 - prog(f, D[5] - 50, 50);
  const card: React.CSSProperties = { background: "rgba(30,41,59,.72)", border: "1.5px solid rgba(148,163,184,.35)", borderRadius: 28 };
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 20% 10%, #16324a 0%, ${C.slate} 55%)`, opacity: Math.min(prog(f, 0, 20), fadeOut) }}>
      <div style={{ position: "absolute", left: 90, top: 60, display: "flex", alignItems: "center", gap: 20, opacity: prog(f, 0, 20) }}>
        <Logo s={120} />
        <div><div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 46, color: C.text }}>منظومة أكاديمي | Manzooma Excel Masterclass</div><div style={{ fontFamily: F.ui, fontSize: 22, color: "#94A3B8", marginTop: 4 }}>Excel From Zero to Professional</div></div>
      </div>
      <div style={{ ...card, position: "absolute", left: 90, top: 200, width: 1010, height: 700, padding: 44, boxSizing: "border-box", opacity: prog(f, 20, 20), transform: `translateY(${(1 - prog(f, 20, 20)) * 24}px)` }}>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 38, color: C.text }}>Lesson 55 · Relationship Types & Filter Propagation</div>
        <div style={{ fontFamily: F.ar, fontSize: 28, color: "#CBD5E1", marginTop: 8, direction: "rtl", textAlign: "left" }}>الدرس الخامس والخمسون | الوحدة الحادية عشرة</div>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.text }}><span>Course progress · Lesson 55 of 76</span><span style={{ color: C.green }}>{(pr * pct2).toFixed(1)}%</span></div>
        <div style={{ marginTop: 12, height: 26, borderRadius: 13, background: "#0B1220", overflow: "hidden", border: "1px solid #334155" }}><div style={{ width: `${pr * pct2}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, #34D399)`, boxShadow: `0 0 18px ${C.green}` }} /></div>
        <div style={{ marginTop: 10, fontFamily: F.ui, fontSize: 20, color: "#94A3B8" }}>Unit 11 of 14 · Data Model & Power Pivot · Lesson 4 of the unit</div>
        <div style={{ marginTop: 28 }}>
          {skills.map((s, i) => { const t = prog(f, 110 + i * 28, 16); return <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20, opacity: t, transform: `translateX(${(1 - t) * 30}px)`, fontFamily: F.ui, fontSize: 28, color: C.text }}><span style={{ color: C.green, fontWeight: 700, fontSize: 34 }}>✓</span>{s}</div>; })}
        </div>
        <div style={{ marginTop: 22, display: "flex", gap: 18, opacity: prog(f, A.sheet, 16) }}>
          <div style={{ background: C.slate, border: `1.5px solid ${C.blue}`, borderRadius: 12, padding: "10px 18px", fontFamily: F.mono, fontSize: 21, color: C.text }}>{XLSX_NAME}</div>
          <div style={{ background: C.slate, border: `1.5px solid ${C.green}`, borderRadius: 12, padding: "10px 18px", fontFamily: F.mono, fontSize: 21, color: C.green, opacity: prog(f, A.link, 16) }}>solutions.gomaaintelligence.me</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1150, top: 200, width: 680, display: "flex", flexDirection: "column", gap: 30 }}>
        <div style={{ ...card, height: 230, display: "flex", alignItems: "center", justifyContent: "center", gap: 28, opacity: prog(f, 190, 20), transform: `scale(${0.85 + 0.15 * prog(f, 190, 20)})` }}>
          <div style={{ width: 130, height: 130, borderRadius: 65, background: `radial-gradient(circle, ${C.green}, #047857)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76, color: C.slate, boxShadow: `0 0 40px ${C.green}88` }}>✓</div>
          <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: C.green, lineHeight: "38px" }}>Filter Propagation<div style={{ fontWeight: 500, fontSize: 21, color: "#CBD5E1" }}>Lesson 55 mastered</div></div>
        </div>
        <div style={{ ...card, height: 440, padding: 34, boxSizing: "border-box", opacity: prog(f, A.l56 - 20, 20), transform: `translateY(${(1 - prog(f, A.l56 - 20, 20)) * 30}px)`, border: `1.5px solid ${C.blue}` }}>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.blue, letterSpacing: 1 }}>NEXT · LESSON 56 · UNIT 11 FINALE</div>
          <div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 34, color: C.text, marginTop: 10, direction: "rtl", textAlign: "right", lineHeight: "48px" }}>الدرس 56: تشغيل وتدقيق نموذج البيانات وحدوده</div>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: "#CBD5E1", marginTop: 8 }}>Data Model Execution & Audit Engine</div>
          <div style={{ marginTop: 22, display: "flex", gap: 14 }}>{[["Run", C.blue], ["Audit", C.green], ["Limits", C.amber]].map(([t, c], i) => <div key={i} style={{ flex: 1, height: 96, borderRadius: 10, background: C.slate, border: `2px solid ${c}`, boxShadow: `0 0 14px ${c}66`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 700, fontSize: 24, color: C.text }}>{t}</div>)}</div>
        </div>
      </div>
    </div>
  );
};
void lerp; void PP; void KpiCard;
