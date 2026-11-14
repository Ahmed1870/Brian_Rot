import React from "react";
import { useCurrentFrame } from "remotion";
import { A1, A2, A3, A4, A5, A6, SCENES } from "./sync";
import { FACT_COLS, MONTHS12, N_ROWS, ORDER_TOT, PY12, QTD6, YOY6, YTD6, dateRow, factRow, num, pct } from "./data";
import { Excel, F, buildCols, camAt, lerp, path, prog, ribbonPos, type Cell, type GRow } from "./kit";
import { Cursor, FieldsPane, KpiCard, Logo, SceneFx, TopStrip } from "./kit_ui";
import { PP, PPWindow, PP_BODY_Y, ppBtn, type PPTbl } from "./kit_pp";
import { AccBars, DateMenu, DaysStrip, MarkDateDialog, ShiftPanel, mdOk } from "./kit_time";
import { MeasureDialog, measCheck, measOk } from "./kit_rel";
import { C, M, WIN_H, WIN_W, XLSX_NAME } from "./theme";

const badge = "Lesson 62 / 76 · Unit 12 / 14";
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
const DTBL: PPTbl = { name: "Dim_Date", cols: ["DateKey", "Date", "Year", "Quarter", "Month", "Day Name"], widths: [110, 190, 80, 90, 110, 130], row: dateRow, total: 730, right: [0] };
const DTABS = ["Fact_Sales", "Dim_Product", "Dim_Customer", "Dim_Date"];
const mp = ribbonPos("powerpivot", "measures");
const menuL = mp.x - 40, menuT = mp.y + 38;
const MeasMenu: React.FC<{ t: number; item: number; hot: boolean }> = ({ t, item, hot }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", left: menuL, top: menuT, width: 180, background: "#fff", border: "1px solid #B5B5B5", boxShadow: "0 6px 16px rgba(0,0,0,.3)", opacity: t, zIndex: 40, fontFamily: F.ui, fontSize: 12.5, color: C.ink }}>
      {["New Measure…", "Manage Measures…"].map((q, i) => <div key={q} style={{ height: 32, display: "flex", alignItems: "center", padding: "0 12px", ...(i === item && hot ? { background: "#E2EFE7", outline: `2px solid ${C.purple}` } : {}) }}>{q}</div>)}
    </div>
  )
);
const menuItem = (i: number): { x: number; y: number } => ({ x: menuL + 85, y: menuT + 16 + 32 * i });
const DX = 418, DY = 120;
const typedAt = (s: string, f: number, from: number, rate: number): string => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((f - from) * rate))));

// ================= SC01 =================
const MANUAL = [["Jan", "=SUMIFS(Amt,Date,EDATE(B2,-12))", "352,400", 0], ["Feb", "=SUMIFS(Amt,Date,EDATE(B3,-12))", "#REF!", 1], ["Mar", "=SUMIFS(Amt,Date,EDATE(B4,-11))", "389,600", 0], ["Apr", "=SUMIFS(Amt,Date,EDATE(B5,-12))", "#VALUE!", 1], ["May", "=SUMIFS(Amt,Date,EDATE(B6,-13))", "402,300", 1]] as const;
export const Scene1: React.FC = () => {
  const f = useCurrentFrame(); const A = A1;
  const L = prog(f, 36, 24), R = prog(f, A.last - 8, 24);
  const sweep = prog(f, A.last + 10, 220), sh = prog(f, A.last + 260, 120);
  const nWin = Math.max(1, Math.round(1 + sweep * 5));
  const err = win(A.manual - 6, A.manual + 150, f, 10);
  const cellW = 46;
  const tl = (r: number, c: number): React.ReactNode => {
    const on = r === 1 ? c < nWin : false, py = r === 0 && sh > 0.5 && c < nWin;
    return <div key={r + "_" + c} style={{ position: "absolute", left: 70 + c * (cellW + 4), top: 112 + r * 70, width: cellW, height: 46, boxSizing: "border-box", borderRadius: 6, border: `1.5px solid ${on ? C.blue : py ? C.purple : "#94A3B8"}`, background: on ? `${C.blue}33` : py ? `${C.purple}33` : "#fff", boxShadow: on ? `0 0 10px ${C.blue}` : py ? `0 0 10px ${C.purple}` : undefined, fontFamily: F.ui, fontSize: 11.5, color: C.ink, textAlign: "center", paddingTop: 6 }}>{MONTHS12[c]}<div style={{ fontFamily: F.mono, fontSize: 10, color: C.inkSoft }}>{r === 0 ? "25" : "26"}</div></div>;
  };
  const body = (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 30, top: 20, width: 660, height: 410, opacity: L, background: "#fff", border: `2.5px solid ${C.red}`, boxShadow: `0 0 ${14 + 18 * err}px ${C.red}`, boxSizing: "border-box", padding: 20 }}>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 20, color: C.red }}>Manual cell offsets · brittle</div>
        <div style={{ fontFamily: F.ui, fontSize: 14, color: C.inkSoft, marginTop: 2 }}>Hand-built prior-year formulas, one per cell</div>
        <div style={{ marginTop: 18, border: "1px solid #C9C9C9" }}>
          {MANUAL.map(([m, fm, v, bad], i) => {
            const shown = bad ? err > 0.2 || f < A.manual - 6 : true;
            return <div key={m} style={{ display: "flex", height: 44, borderBottom: "1px solid #E4E4E4", alignItems: "center", fontFamily: F.cell, fontSize: 14, color: C.ink, opacity: prog(f, 60 + i * 14, 12) }}>
              <div style={{ width: 70, padding: "0 10px", fontFamily: F.ui }}>{m}</div><div style={{ flex: 1, fontFamily: F.mono, fontSize: 13 }}>{fm}</div>
              <div style={{ width: 120, textAlign: "right", paddingRight: 12, fontWeight: 700, color: bad && err > 0.2 ? C.red : C.ink, background: bad && err > 0.2 ? "#FDE9E7" : undefined, height: "100%", lineHeight: "44px" }}>{shown && bad && err > 0.2 ? (v.startsWith("#") ? v : v + " ✗") : bad ? "—" : v}</div>
            </div>;
          })}
        </div>
        <div style={{ marginTop: 16, fontFamily: F.ui, fontSize: 15, color: C.red, opacity: err }}>Deleted row · wrong offset · stale ranges ✗</div>
      </div>
      <div style={{ position: "absolute", left: 720, top: 20, width: 690, height: 410, opacity: R, background: "#fff", border: `2.5px solid ${C.blue}`, boxShadow: `0 0 ${16 + 10 * sweep}px ${C.blue}`, boxSizing: "border-box" }}>
        <div style={{ position: "absolute", left: 20, top: 16, fontFamily: F.ui, fontWeight: 700, fontSize: 20, color: C.blue }}>DAX Time Intelligence Engine</div>
        <div style={{ position: "absolute", left: 20, top: 46, fontFamily: F.ui, fontSize: 14, color: C.inkSoft }}>Dynamic temporal context · evaluated per filter</div>
        <div style={{ position: "absolute", left: 20, top: 100, fontFamily: F.mono, fontSize: 13, color: C.inkSoft }}>2025</div>
        <div style={{ position: "absolute", left: 20, top: 170, fontFamily: F.mono, fontSize: 13, color: C.blue }}>2026</div>
        {Array.from({ length: 12 }, (_, c) => tl(0, c))}{Array.from({ length: 12 }, (_, c) => tl(1, c))}
        <svg width={690} height={410} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={70} y1={262} x2={650} y2={262} stroke="#CBD5E1" strokeWidth="3" />
          {R > 0.5 ? Array.from({ length: 8 }, (_, k) => <circle key={k} cx={70 + ((f / 90 + k / 8) % 1) * 580} cy={262} r={5} fill={C.blue} />) : null}
          {sh > 0.5 ? <path d="M180 166 C180 130 180 130 180 116" stroke={C.purple} strokeWidth="3" fill="none" /> : null}
        </svg>
        <div style={{ position: "absolute", left: 20, top: 288, right: 20, display: "flex", gap: 10, opacity: prog(f, A.engine, 14) }}>
          {[["TOTALYTD", C.green], ["SAMEPERIODLASTYEAR", C.purple], ["DATEADD", C.purple]].map(([n, c]) => <div key={n} style={{ border: `1.5px solid ${c}`, borderRadius: 6, padding: "6px 10px", fontFamily: F.mono, fontSize: 13, fontWeight: 700, color: c, background: "#fff" }}>{n}</div>)}
        </div>
        <div style={{ position: "absolute", left: 20, top: 350, fontFamily: F.ui, fontSize: 15, color: C.green, opacity: prog(f, A.auto, 14) }}>Context rebuilt automatically · no manual offsets ✓</div>
      </div>
    </div>
  );
  return (
    <SceneFx f={f} dur={D[0]} kind="fade">
      <Sheet f={f}>
        <PPWindow {...ppProps} t={prog(f, 0, 24)} custom={body} />
        <Chip x={330} y={650} big text="Lesson 62 · Final lesson of Unit 12" color={C.blue} t={win(A.hello, A.last - 14, f, 14)} />
        <Chip x={330} y={650} text="Time intelligence engine starts · temporal filter context streams" color={C.blue} t={win(A.last, A.engine - 30, f, 12)} />
        <Chip x={330} y={650} text="DAX Time Intelligence Engine · YTD · QTD · YoY" color={C.blue} t={win(A.engine, A.manual - 10, f, 12)} />
        <Chip x={330} y={650} text="Manual date formulas break · ranges drift ✗" color={C.red} t={win(A.manual, A.auto - 10, f, 12)} />
        <Chip x={330} y={650} text="Automatic · reliable · every time ✓" color={C.green} t={prog(f, A.auto, 12)} />
      </Sheet>
      {sl(D[0], f, "الدرس 62 من 76 | ختام الوحدة 12 من 14 ──► DAX Time Intelligence Engine", "Dynamic Temporal Context ──► Automated YTD, QTD & Year-over-Year Comparisons", C.blue, C.blue, true)}
    </SceneFx>
  );
};

// ================= SC02 =================
const F_YTD = "TOTALYTD([Total Sales], Dim_Date[Date])";
export const Scene2: React.FC = () => {
  const f = useCurrentFrame(); const A = A2;
  const ppT = prog(f, 0, 24) * (1 - prog(f, 560, 14));
  const design = f >= 192;
  const dt = ppBtn("datetbl", "design"), dtab = { x: PP.x + 154, y: PP.y + PP.title + 12 };
  const mx = dt.x - 80, my = dt.y + 30, mdx = 480, mdy = 250, okp = mdOk(mdx, mdy);
  const marked = f >= 376;
  const menuT = win(248, 296, f, 6), dlg = win(290, 380, f, 8);
  const typed = typedAt(F_YTD, f, 650, 0.8);
  const mdlg = win(648, 768, f, 10);
  const mi = menuItem(0);
  const cur = path(f, [{ f: 0, x: 900, y: 420 }, { f: 150, x: 900, y: 420 }, { f: 186, x: dtab.x, y: dtab.y }, { f: 236, x: dt.x, y: dt.y }, { f: 280, x: mx + 60, y: my + 15 }, { f: 330, x: okp.x - 120, y: okp.y - 60 }, { f: 370, x: okp.x, y: okp.y }, { f: 420, x: 800, y: 500 }, { f: 560, x: 800, y: 500 }, { f: 596, x: mp.x, y: mp.y }, { f: 640, x: mi.x, y: mi.y }, { f: 690, x: DX + 300, y: DY + 175 }, { f: 728, x: DX + 93, y: DY + 30 + 274 }, { f: 758, x: DX + 580, y: DY + 30 + 312 }, { f: 800, x: 800, y: 560 }, { f: 1400, x: 800, y: 560 }]);
  return (
    <SceneFx f={f} dur={D[1]} kind="left">
      <Sheet f={f} glow={{ id: "measures", color: C.purple, t: win(590, 650, f, 8) }}>
        <PPWindow {...ppProps} view="data" tbl={DTBL} tabs={DTABS} tab={3} rtab={design ? "design" : "home"} t={ppT} hiCol={marked ? 1 : undefined} hiColor={C.green} glow={{ id: "datetbl", color: C.green, t: win(236, 300, f, 8) }} sel={null} />
        <DateMenu x={mx} y={my} t={menuT} hover={f >= 262} />
        <MarkDateDialog x={mdx} y={mdy} t={dlg} col="Date" ok={prog(f, 368, 4) > 0.5 ? 1 : 0} glow={C.green} />
        <DaysStrip x={270} y={520} t={win(A.contig - 18, 640, f, 12) * ppT} fix={prog(f, A.contig + 30, 20)} />
        <MeasMenu t={win(600, 650, f, 6)} item={0} hot={f >= 636} />
        <MeasureDialog x={DX} y={DY} t={mdlg} name={typedAt("YTD Sales", f, 654, 0.4)} formula={typed} caret={f >= 650 && f < 740 && Math.floor(f / 8) % 2 === 0} hiF={f >= A.ytd - 30 && f < 740 ? C.green : undefined} check={prog(f, 728, 4) > 0.5 ? 1 : 0} ok={prog(f, 758, 4) > 0.5 ? 1 : 0} />
        <AccBars x={40} y={250} t={prog(f, 774, 14)} title="TOTALYTD" sub="Jan 1 → selected date · keeps accumulating" vals={YTD6} color={C.green} rise={prog(f, 780, 70)} maxV={YTD6[5]} />
        <AccBars x={520} y={250} t={prog(f, A.qtd - 8, 14)} title="TOTALQTD" sub="Resets at the start of each quarter" vals={QTD6} color={C.blue} rise={prog(f, A.qtd, 60)} maxV={1600000} />
        <AccBars x={1000} y={250} t={prog(f, A.mtd - 8, 14)} title="TOTALMTD" sub="Resets every month" vals={ORDER_TOT} color={C.purple} rise={prog(f, A.mtd, 60)} maxV={600000} />
        <Chip x={330} y={660} text="Time intelligence prerequisite: a proper Date table" color={C.blue} t={win(20, 140, f, 10) * ppT} />
        <Chip x={330} y={660} text="Power Pivot window → Design tab → Date Table ▾" color={C.blue} t={win(150, 288, f, 10)} />
        <Chip x={330} y={660} text="Mark as Date Table → pick the unique Date column" color={C.green} t={win(288, 414, f, 10)} />
        <Chip x={330} y={660} text="Contiguous days · no gaps · no duplicates" color={C.green} t={win(420, A.full, f, 10)} />
        <Chip x={330} y={660} text="Full calendar years · Jan 1 → Dec 31" color={C.green} t={win(A.full, 600, f, 10)} />
        <Chip x={330} y={660} text="Power Pivot tab → Measures → New Measure…" color={C.purple} t={win(600, 770, f, 10)} />
        <Chip x={330} y={660} text="TOTALYTD · cumulative from Jan 1 to the selected date" color={C.green} t={win(774, A.qtd, f, 10)} />
        <Chip x={330} y={660} text="TOTALQTD · quarter-to-date" color={C.blue} t={win(A.qtd, A.mtd, f, 10)} />
        <Chip x={330} y={660} text="TOTALMTD · month-to-date" color={C.purple} t={win(A.mtd, A.reshape, f, 10)} />
        <Chip x={330} y={660} text="Filter context rebuilt automatically ✓" color={C.green} t={prog(f, A.reshape, 12)} />
        <Cursor x={cur.x} y={cur.y} f={f} clicks={[184, 244, 286, 370, 600, 646, 730, 760]} />
      </Sheet>
      {sl(D[1], f, "Date Table Prerequisite ──► Design ──► Mark as Date Table (Contiguous Full Years)", "Cumulative Time Aggregators ──► TOTALYTD([Total Sales], Dim_Date[Date]) & TOTALQTD / TOTALMTD", C.green, C.green)}
    </SceneFx>
  );
};

// ================= SC03 =================
const F_PY = "CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Dim_Date[Date]))";
const F_PM = "CALCULATE([Total Sales], DATEADD(Dim_Date[Date], -1, MONTH))";
export const Scene3: React.FC = () => {
  const f = useCurrentFrame(); const A = A3;
  const d1 = win(172, 384, f, 10), d2 = win(720, 892, f, 10);
  const i0 = menuItem(0);
  const cur = path(f, [{ f: 0, x: 900, y: 520 }, { f: 120, x: 900, y: 520 }, { f: 138, x: mp.x, y: mp.y }, { f: 168, x: i0.x, y: i0.y }, { f: 215, x: DX + 300, y: DY + 175 }, { f: 350, x: DX + 93, y: DY + 30 + 274 }, { f: 380, x: DX + 580, y: DY + 30 + 312 }, { f: 430, x: 900, y: 600 }, { f: 680, x: 900, y: 600 }, { f: 690, x: mp.x, y: mp.y }, { f: 716, x: i0.x, y: i0.y }, { f: 760, x: DX + 300, y: DY + 175 }, { f: 860, x: DX + 93, y: DY + 30 + 274 }, { f: 888, x: DX + 580, y: DY + 30 + 312 }, { f: 940, x: 900, y: 620 }, { f: 1340, x: 900, y: 620 }]);
  const sply = prog(f, 424, 90), dadd = prog(f, 905, 60);
  const mode2 = f >= 892;
  return (
    <SceneFx f={f} dur={D[2]} kind="down">
      <Sheet f={f} glow={{ id: "measures", color: C.purple, t: win(110, 180, f, 8) + win(680, 724, f, 8) }}>
        <ShiftPanel x={40} y={330} t={Math.max(prog(f, 392, 14), 0)} sel={5} color={C.purple} arrow={mode2 ? dadd : sply} tgtRow={mode2 ? 1 : 0} tgtCol={mode2 ? 4 : 5} caption={mode2 ? "DATEADD(Dim_Date[Date], -1, MONTH) → filter context: May 2026 · PM Sales = " + num(ORDER_TOT[4]) : sply > 0.9 ? "SAMEPERIODLASTYEAR → filter context: Jun 2025 · PY Sales = " + num(PY12[5]) : "Current filter context: Jun 2026 · Total Sales = " + num(ORDER_TOT[5])} />
        <MeasMenu t={win(142, 176, f, 6) + win(692, 722, f, 6)} item={0} hot={f >= 166 && f < 190 || f >= 714} />
        <MeasureDialog x={DX} y={DY} t={d1} name={typedAt("PY Sales", f, 182, 0.4)} formula={typedAt(F_PY, f, 215, 0.55)} caret={f >= 215 && f < 340 && Math.floor(f / 8) % 2 === 0} hiF={f >= A.sply - 22 && f < 350 ? C.purple : undefined} check={prog(f, 348, 4) > 0.5 ? 1 : 0} ok={prog(f, 378, 4) > 0.5 ? 1 : 0} />
        <MeasureDialog x={DX} y={DY} t={d2} name={typedAt("PM Sales", f, 726, 0.4)} formula={typedAt(F_PM, f, 745, 0.6)} caret={f >= 745 && f < 850 && Math.floor(f / 8) % 2 === 0} hiF={f >= A.dateadd - 30 && f < 860 ? C.purple : undefined} check={prog(f, 858, 4) > 0.5 ? 1 : 0} ok={prog(f, 886, 4) > 0.5 ? 1 : 0} />
        <Chip x={330} y={690} text="Compare today with history · shift the filter context" color={C.blue} t={win(10, 110, f, 10)} />
        <Chip x={330} y={690} text="Power Pivot tab → Measures → New Measure…" color={C.purple} t={win(124, 240, f, 10)} />
        <Chip x={330} y={690} text="CALCULATE · re-shapes the filter context" color={C.purple} t={win(A.calc, A.sply + 20, f, 10)} />
        <Chip x={330} y={690} text="SAMEPERIODLASTYEAR(Dim_Date[Date])" color={C.purple} t={win(A.sply + 20, 392, f, 10)} />
        <Chip x={330} y={690} text="Same period, one year back · day, month or quarter" color={C.purple} t={win(430, 700, f, 10)} />
        <Chip x={330} y={690} text="DATEADD · move any distance, back or forward" color={C.purple} t={win(A.dateadd, 900, f, 10)} />
        <Chip x={330} y={690} text="DATEADD(…, -1, MONTH / QUARTER / YEAR / DAY)" color={C.purple} t={win(905, 1160, f, 10)} />
        <Chip x={330} y={690} text="Exact historical comparison ✓" color={C.green} t={prog(f, 1170, 12)} />
        <Cursor x={cur.x} y={cur.y} f={f} clicks={[140, 168, 350, 380, 690, 716, 860, 888]} />
      </Sheet>
      {sl(D[2], f, "Prior Year Comparison ──► CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Dim_Date[Date]))", "Flexible Period Shifting ──► DATEADD(Dim_Date[Date], -1, MONTH / QUARTER / YEAR)", C.purple, C.purple)}
    </SceneFx>
  );
};

// ================= SC04 =================
const F_Y1 = "DIVIDE([Total Sales] - [PY Sales], [PY Sales], 0)";
const F_Y2 = "IF(NOT ISBLANK([Total Sales]), DIVIDE([Total Sales] - [PY Sales], [PY Sales], 0))";
const PC4 = buildCols([110, 110, 110, 120]);
export const Scene4: React.FC = () => {
  const f = useCurrentFrame(); const A = A4;
  const R = (id: string, slot: number, vals: Cell[]): GRow => ({ id, hdr: slot + 1, slot, h: 1, cells: vals });
  const rows: GRow[] = Array.from({ length: 26 }, (_, s) => R("e" + s, s, [cell(""), cell(""), cell(""), cell("")]));
  const hh = (t: string, on: boolean): Cell => cell(on ? t : "", { b: true, fill: on ? "#DDEBF7" : undefined, al: "r" });
  const yOn = f >= 385, guard = f >= 770;
  rows[2] = R("hd", 2, [cell("Row Labels", { b: true, fill: "#DDEBF7" }), hh("Total Sales", true), hh("PY Sales", f >= 60), hh("YoY Growth %", yOn)]);
  MONTHS12.forEach((m, i) => {
    const hasCur = i < 6;
    let yv: Cell = cell("");
    if (yOn && f >= 390 + i * 3) {
      if (hasCur) yv = cell(pct(YOY6[i]), { al: "r", fill: guard ? "#FFF2CC" : undefined, b: guard });
      else if (!guard) yv = cell("-100.0%", { al: "r", fg: "#C00000", fill: "#FDE9E7", b: true });
    }
    rows[3 + i] = R("m" + i, 3 + i, [cell(m), cell(hasCur && f >= 20 + i * 5 ? num(ORDER_TOT[i]) : "", { al: "r" }), cell(f >= 62 + i * 6 ? num(PY12[i]) : "", { al: "r" }), yv]);
  });
  const dOpen = win(205, 380, f, 10), eOpen = win(585, 756, f, 10);
  const inDlg = (f >= 176 && f < 392) || (f >= 556 && f < 764);
  const m1 = menuItem(0), m2 = menuItem(1);
  const fe = f < 628 ? F_Y1 : typedAt(F_Y2, f, 630, 0.9);
  const cur = path(f, [{ f: 0, x: 900, y: 600 }, { f: 150, x: 900, y: 600 }, { f: 172, x: mp.x, y: mp.y }, { f: 198, x: m1.x, y: m1.y }, { f: 250, x: DX + 300, y: DY + 175 }, { f: 345, x: DX + 93, y: DY + 30 + 274 }, { f: 376, x: DX + 580, y: DY + 30 + 312 }, { f: 420, x: 900, y: 620 }, { f: 548, x: 900, y: 620 }, { f: 560, x: mp.x, y: mp.y }, { f: 584, x: m2.x, y: m2.y }, { f: 640, x: DX + 300, y: DY + 175 }, { f: 722, x: DX + 93, y: DY + 30 + 274 }, { f: 750, x: DX + 580, y: DY + 30 + 312 }, { f: 800, x: 900, y: 620 }, { f: 1260, x: 900, y: 620 }]);
  return (
    <SceneFx f={f} dur={D[3]} kind="down">
      <Excel cam={camAt(f, [{ f: 0, ...camA }, { f: 9999, ...camA }])} file={XLSX_NAME} tab={inDlg ? "powerpivot" : "pivotanalyze"} glow={{ id: "measures", color: C.amber, t: win(166, 200, f, 6) + win(554, 590, f, 6) }} nameBox="A3" formula="Row Labels" sheets={["Fact_Sales", "Pivot"]} sheet="Pivot" grid={{ cols: PC4, rows, fixedHdr: true, lines: true, active: { c: 0, slot: 2 }, sel: null }}>
        <FieldsPane top={124} h={WIN_H - 124 - 52} fields={[{ name: "Month", on: true }, { name: "Total Sales", on: true }, { name: "PY Sales", on: f >= 60 }, { name: "YoY Growth %", on: yOn }, { name: "Amount", on: false }]} rows={["Month"]} values={["Total Sales", ...(f >= 60 ? ["PY Sales"] : []), ...(yOn ? ["YoY Growth %"] : [])]} />
        <MeasMenu t={win(178, 206, f, 6) + win(556, 590, f, 6)} item={f >= 540 ? 1 : 0} hot={(f >= 196 && f < 215) || f >= 582} />
        <MeasureDialog x={DX} y={DY} t={dOpen} name={"YoY Growth %".slice(0, Math.max(0, Math.floor((f - 212) * 0.5)))} formula={typedAt(F_Y1, f, 235, 0.5)} caret={f >= 235 && f < 340 && Math.floor(f / 8) % 2 === 0} hiF={f >= A.divide - 20 && f < 350 ? C.amber : undefined} check={prog(f, 343, 4) > 0.5 ? 1 : 0} ok={prog(f, 374, 4) > 0.5 ? 1 : 0} />
        <MeasureDialog x={DX} y={DY} t={eOpen} name="YoY Growth %" formula={fe} caret={f >= 630 && f < 710 && Math.floor(f / 8) % 2 === 0} hiF={f >= A.guard - 6 && f < 730 ? C.amber : undefined} check={prog(f, 720, 4) > 0.5 ? 1 : 0} ok={prog(f, 748, 4) > 0.5 ? 1 : 0} />
        <Chip x={330} y={650} text="PY Sales is ready · now the growth measure" color={C.blue} t={win(10, 150, f, 10)} />
        <Chip x={330} y={650} text="YoY Growth % = (Current − Prior Year) ÷ Prior Year" color={C.amber} t={win(A.yoy, 392, f, 10)} />
        <Chip x={330} y={650} text="Unguarded: future months show −100.0% ✗" color={C.red} t={win(400, 590, f, 10)} />
        <Chip x={330} y={650} text="Golden architectural rule · guard with a logical test" color={C.amber} t={win(A.golden, A.guard, f, 10)} />
        <Chip x={330} y={650} text="IF(NOT ISBLANK([Total Sales]), DIVIDE(…))" color={C.amber} t={win(A.guard, 770, f, 10)} />
        <Chip x={330} y={650} text="Future months are blank · only real growth remains ✓" color={C.green} t={prog(f, A.future, 12)} />
        <Cursor x={cur.x} y={cur.y} f={f} clicks={[172, 198, 345, 376, 560, 584, 722, 750]} />
      </Excel>
      {sl(D[3], f, "YoY Growth Formula ──► DIVIDE([Total Sales] - [PY Sales], [PY Sales], 0)", "Future Date Protection ──► Guard with IF(NOT ISBLANK([Total Sales])) to Prevent -100% Artifacts", C.amber, C.amber)}
    </SceneFx>
  );
};

// ================= SC05 =================
const PC5 = buildCols([100, 110, 110, 110, 120]);
export const Scene5: React.FC = () => {
  const f = useCurrentFrame(); const A = A5;
  const ld = prog(f, A.file, 150);
  const fy = 124, chkY = (i: number): number => fy + 98 + 22 * i;
  const on = [f >= 330, f >= 360, f >= 395, f >= 430];
  const R = (id: string, slot: number, vals: Cell[]): GRow => ({ id, hdr: slot + 1, slot, h: 1, cells: vals });
  const rows: GRow[] = Array.from({ length: 26 }, (_, s) => R("e" + s, s, [cell(""), cell(""), cell(""), cell(""), cell("")]));
  const H = (t: string, o: boolean): Cell => cell(o ? t : "", { b: true, fill: o ? "#DDEBF7" : undefined, al: "r" });
  rows[2] = R("hd", 2, [cell(f >= 300 ? "Row Labels" : "", { b: true, fill: f >= 300 ? "#DDEBF7" : undefined }), H("Total Sales", on[0]), H("YTD Sales", on[1]), H("PY Sales", on[2]), H("YoY Growth %", on[3])]);
  MONTHS12.slice(0, 6).forEach((m, i) => { rows[3 + i] = R("m" + i, 3 + i, [cell(f >= 305 + i * 4 ? m : ""), cell(on[0] && f >= 334 + i * 4 ? num(ORDER_TOT[i]) : "", { al: "r" }), cell(on[1] && f >= 364 + i * 4 ? num(YTD6[i]) : "", { al: "r", fill: "#E2F3E9" }), cell(on[2] && f >= 399 + i * 4 ? num(PY12[i]) : "", { al: "r" }), cell(on[3] && f >= 434 + i * 4 ? pct(YOY6[i]) : "", { al: "r", fill: "#FFF2CC" })]); });
  const cur = path(f, [{ f: 0, x: 800, y: 520 }, { f: 320, x: 800, y: 520 }, { f: 332, x: 1246 + 17, y: chkY(1) }, { f: 362, x: 1246 + 17, y: chkY(2) }, { f: 397, x: 1246 + 17, y: chkY(3) }, { f: 432, x: 1246 + 17, y: chkY(4) }, { f: 480, x: 800, y: 560 }, { f: 1100, x: 800, y: 560 }]);
  return (
    <SceneFx f={f} dur={D[4]} kind="expand">
      <Excel cam={camAt(f, [{ f: 0, ...camA }, { f: 9999, ...camA }])} file={XLSX_NAME} tab="pivotanalyze" nameBox="A3" formula={f >= 300 ? "Row Labels" : ""} sheets={["Fact_Sales", "Pivot"]} sheet="Pivot" grid={{ cols: PC5, rows, fixedHdr: true, lines: true, active: { c: 0, slot: 2 }, sel: null }}>
        <FieldsPane top={fy} h={WIN_H - fy - 52} fields={[{ name: "Month", on: f >= 300 }, { name: "Total Sales", on: on[0] }, { name: "YTD Sales", on: on[1] }, { name: "PY Sales", on: on[2] }, { name: "YoY Growth %", on: on[3] }]} rows={f >= 300 ? ["Month"] : []} values={["Total Sales", "YTD Sales", "PY Sales", "YoY Growth %"].filter((_, i) => on[i])} />
        <Chip x={640} y={196} mono text={`${XLSX_NAME} · Order dates 2025–2026`} color={C.blue} t={win(A.file, A.meas + 20, f, 10)} />
        <KpiCard x={760} y={150} label="ROWS IN DATA MODEL" value={num(N_ROWS * ld)} color={C.blue} t={win(A.file + 10, 1000, f, 10)} flash={ld < 1 ? 1 : 0} />
        <KpiCard x={760} y={330} label="RESPONSE" value="< 2 ms" color={C.green} t={prog(f, A.ms, 12)} flash={win(A.ms, A.dash, f, 10)} />
        <Chip x={560} y={500} text="Deploy YTD · PY · YoY across 50,000 sales records" color={C.green} t={win(A.meas, A.ms - 6, f, 10)} />
        <Seal x={800} y={400} t={prog(f, A.ms + 22, 26)} line1="Unit 12 Completion Seal" line2="اكتملت الوحدة 12 بالكامل" />
        <Chip x={380} y={620} text="Strategic dashboard · live historical view ✓" color={C.blue} t={prog(f, A.dash, 12) * (1 - prog(f, A.dash + 140, 10))} />
        <Cursor x={cur.x} y={cur.y} f={f} clicks={[330, 360, 395, 430]} />
      </Excel>
      {sl(D[4], f, "Enterprise Time Intelligence ──► Deploy YTD, PY & YoY Growth Across 50,000 Sales Records", "Unit 12 Completion Seal ──► DAX & Evaluation Context Engine Mastered in <2ms", C.green, C.green)}
    </SceneFx>
  );
};

// ================= SC06: outro =================
export const Scene6: React.FC = () => {
  const f = useCurrentFrame(); const A = A6;
  const pr = prog(f, 60, 110), pct2 = (62 / 76) * 100;
  const skills = ["Mark as Date Table · contiguous full years", "TOTALYTD · TOTALQTD · TOTALMTD", "SAMEPERIODLASTYEAR & DATEADD in CALCULATE", "YoY Growth % · guarded with IF(NOT ISBLANK)"];
  const fadeOut = 1 - prog(f, D[5] - 50, 50);
  const card: React.CSSProperties = { background: "rgba(30,41,59,.72)", border: "1.5px solid rgba(148,163,184,.35)", borderRadius: 28 };
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 20% 10%, #16324a 0%, ${C.slate} 55%)`, opacity: Math.min(prog(f, 0, 20), fadeOut) }}>
      <div style={{ position: "absolute", left: 90, top: 60, display: "flex", alignItems: "center", gap: 20, opacity: prog(f, 0, 20) }}>
        <Logo s={120} />
        <div><div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 46, color: C.text }}>منظومة أكاديمي | Manzooma Excel Masterclass</div><div style={{ fontFamily: F.ui, fontSize: 22, color: "#94A3B8", marginTop: 4 }}>Excel From Zero to Professional</div></div>
      </div>
      <div style={{ ...card, position: "absolute", left: 90, top: 200, width: 1010, height: 700, padding: 44, boxSizing: "border-box", opacity: prog(f, 20, 20), transform: `translateY(${(1 - prog(f, 20, 20)) * 24}px)` }}>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 38, color: C.text }}>Lesson 62 · DAX Time Intelligence Engine</div>
        <div style={{ fontFamily: F.ar, fontSize: 28, color: "#CBD5E1", marginTop: 8, direction: "rtl", textAlign: "left" }}>الدرس الثاني والستون | الوحدة الثانية عشرة</div>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.text }}><span>Course progress · Lesson 62 of 76</span><span style={{ color: C.green }}>{(pr * pct2).toFixed(1)}%</span></div>
        <div style={{ marginTop: 12, height: 26, borderRadius: 13, background: "#0B1220", overflow: "hidden", border: "1px solid #334155" }}><div style={{ width: `${pr * pct2}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, #34D399)`, boxShadow: `0 0 18px ${C.green}` }} /></div>
        <div style={{ marginTop: 10, fontFamily: F.ui, fontSize: 20, color: "#94A3B8" }}>Unit 12 of 14 · DAX & Evaluation Context · Lesson 6 of 6 · Unit complete</div>
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
          <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: C.green, lineHeight: "38px" }}>Unit 12 Mastered<div style={{ fontWeight: 500, fontSize: 21, color: "#CBD5E1" }}>DAX & Evaluation Context · 100%</div></div>
        </div>
        <div style={{ ...card, height: 440, padding: 34, boxSizing: "border-box", opacity: prog(f, A.l63 - 20, 20), transform: `translateY(${(1 - prog(f, A.l63 - 20, 20)) * 30}px)`, border: `1.5px solid ${C.blue}` }}>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.blue, letterSpacing: 1 }}>NEXT · LESSON 63 · UNIT 13 OPENER</div>
          <div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 34, color: C.text, marginTop: 10, direction: "rtl", textAlign: "right", lineHeight: "48px" }}>الدرس 63: أدوات التحليل الإحصائي في Excel</div>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: "#CBD5E1", marginTop: 8 }}>Statistical Analysis Tools in Excel</div>
          <div style={{ marginTop: 22, display: "flex", gap: 14 }}>{[["Statistics", C.blue], ["Analysis", C.green], ["Reports", C.amber]].map(([t, c], i) => <div key={i} style={{ flex: 1, height: 96, borderRadius: 10, background: C.slate, border: `2px solid ${c}`, boxShadow: `0 0 14px ${c}66`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 700, fontSize: 24, color: C.text }}>{t}</div>)}</div>
        </div>
      </div>
    </div>
  );
};
void lerp; void PP; void KpiCard;
