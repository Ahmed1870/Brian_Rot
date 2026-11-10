import React from "react";
import { useCurrentFrame } from "remotion";
import { A1, A2, A3, A4, A5, A6 } from "./sync";
import { BIG_N, BR, CUBE, DAYSUMS, MONTHSUMS, PN, aggB, aggP, aggQ, bigCube, bigOrder, detailRows, fmtDate, num, qTotal, type Cube, type Flt } from "./data";
import { Excel, F, buildCols, camAt, colX, lerp, prog, ribbonPos, slotY, stack, type Box, type Cell, type GRow } from "./kit";
import { ChartBox, Cursor, CtxMenu, FieldsPane, GroupingDialog, InsertChartDialog, KeyCaps, Logo, ReportConnDialog, SceneFx, Slicer, Timeline, TopStrip } from "./kit_ui";
import { C, WIN_H, XLSX_NAME } from "./theme";

const badge = "Lesson 30 / 76 · Unit 6 / 14";
const win = (a: number, b: number, f: number, r = 8): number => prog(f, a, r) * (1 - prog(f, b, r));
const cols = buildCols([190, 130]);
const PANE_TOP = 154, PANE_H = WIN_H - 154 - 52;
const HDR_FILL = "#DDEBF7";
const Chip: React.FC<{ x: number; y: number; text: string; color: string; t: number }> = ({ x, y, text, color, t }) => (
  t <= 0 ? null : <div style={{ position: "absolute", left: x, top: y, opacity: t, transform: `translateY(${(1 - t) * 8}px)`, background: C.slate, color: C.text, border: `2px solid ${color}`, borderRadius: 8, padding: "6px 12px", boxShadow: `0 0 14px ${color}88`, fontFamily: F.ui, fontWeight: 600, fontSize: 15, whiteSpace: "nowrap", zIndex: 45 }}>{text}</div>
);
const Seal: React.FC<{ t: number; line1: string; line2: string }> = ({ t, line1, line2 }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", right: 40, top: 520, width: 330, opacity: t, transform: `scale(${0.7 + 0.3 * t})`, zIndex: 60, textAlign: "center" }}>
      <div style={{ width: 140, height: 140, margin: "0 auto", borderRadius: 70, background: `radial-gradient(circle, ${C.green}33, ${C.slate})`, border: `4px solid ${C.green}`, boxShadow: `0 0 40px ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76, color: C.green }}>✓</div>
      <div style={{ marginTop: 10, background: C.slate, border: `1.5px solid ${C.green}`, borderRadius: 12, padding: "8px 12px", fontFamily: F.ui, fontWeight: 700, fontSize: 21, color: C.text }}>{line1}</div>
      <div style={{ marginTop: 8, fontFamily: F.ar, fontWeight: 600, fontSize: 19, color: C.green, background: C.slate, borderRadius: 10, padding: "4px 10px" }}>{line2}</div>
    </div>
  )
);
// ---------- pivot helpers ----------
type PI = { l: string; v: number; lvl: number; pm?: "+" | "-"; b?: boolean };
const yearSum = (yi: number): number => [0, 1, 2, 3].reduce((a, q) => a + qTotal(CUBE, yi, q), 0);
const GT = yearSum(0) + yearSum(1);
const itemsOf = (mode: "quarters" | "months" | "years"): PI[] => {
  const o: PI[] = [];
  for (let yi = 0; yi < 2; yi++) {
    o.push({ l: String(2025 + yi), v: yearSum(yi), lvl: 0, pm: mode === "years" ? "+" : "-", b: true });
    if (mode === "years") continue;
    for (let q = 0; q < 4; q++) {
      o.push({ l: "Qtr" + (q + 1), v: qTotal(CUBE, yi, q), lvl: 1, pm: mode === "months" ? "-" : "+" });
      if (mode === "months") for (let m = q * 3; m < q * 3 + 3; m++) o.push({ l: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m], v: MONTHSUMS[yi][m], lvl: 2 });
    }
  }
  o.push({ l: "Grand Total", v: GT, lvl: 0, b: true });
  return o;
};
const pivHead: GRow = { id: "ph", hdr: 3, slot: 2, h: 1, cells: [{ v: "Row Labels", b: true, fill: HDR_FILL }, { v: "Sum of Amount", b: true, fill: HDR_FILL, al: "r" }] };
const pivRow = (id: string, it: PI, slot: number, h: number): GRow => ({ id, hdr: 0, slot, h, cells: [{ v: it.l, b: it.b || it.lvl === 0, pm: it.pm, indent: it.lvl }, { v: num(it.v), al: "r", b: it.b || it.lvl === 0 }] });
const pivRows = (items: PI[], hs: (i: number) => number, pre = "p"): GRow[] => items.map((it, i) => pivRow(pre + i, it, 3 + i, hs(i)));
type SP = { cam: ReturnType<typeof camAt>; tab: string; nameBox: string; formula: string; rows: GRow[]; active: { c: number; slot: number }; boxes?: Box[]; cellFx?: (id: string | number, c: number) => string | undefined; glow?: { id: string; color: string; t: number }; sheet?: string; cols?: ReturnType<typeof buildCols>; children?: React.ReactNode; fixedHdr?: boolean };
const Sheet: React.FC<SP> = (p) => (
  <Excel cam={p.cam} file="manzooma_sales_2026.xlsx" tab={p.tab} glow={p.glow} nameBox={p.nameBox} formula={p.formula} statusLeft="Ready" sheets={["Data", "Pivots", "Dashboard"]} sheet={p.sheet ?? "Pivots"}
    grid={{ cols: p.cols ?? cols, rows: p.rows, fixedHdr: p.fixedHdr ?? true, lines: true, active: p.active, boxes: p.boxes, cellFx: p.cellFx }}>{p.children}</Excel>
);
const PaneS: React.FC<{ grouped: boolean; glow?: { area: "rows" | "values"; color: string; t: number } }> = ({ grouped, glow }) => (
  <FieldsPane top={PANE_TOP} h={PANE_H} fields={grouped ? [{ name: "Date", on: true }, { name: "Years", on: true }, { name: "Quarters", on: true }, { name: "Branch", on: false }, { name: "Product", on: false }, { name: "Amount", on: true }] : [{ name: "Date", on: true }, { name: "Branch", on: false }, { name: "Product", on: false }, { name: "Amount", on: true }]}
    rows={grouped ? ["Years", "Quarters", "Date"] : ["Date"]} values={["Sum of Amount"]} glow={glow} />
);
const camAll = { z: 1, cx: 768, cy: 403 };
const path2 = (f: number, k: { f: number; x: number; y: number }[]): { x: number; y: number } => {
  if (f <= k[0].f) return k[0];
  for (let i = 1; i < k.length; i++) if (f <= k[i].f) { const t = prog(f, k[i - 1].f, k[i].f - k[i - 1].f); return { x: lerp(k[i - 1].x, k[i].x, t), y: lerp(k[i - 1].y, k[i].y, t) }; }
  return k[k.length - 1];
};
// ---------- dashboard data (3 pivot charts) ----------
type CD = { cats: string[]; vals: number[]; groups?: { label: string; from: number; to: number }[] };
const dashOf = (c: Cube, f: Flt): { c1: CD; c2: CD; c3: CD } => {
  const q = aggQ(c, f);
  const c1: CD = f.qsel ? { cats: ["Qtr" + (f.qsel[1] + 1)], vals: [q[f.qsel[0] * 4 + f.qsel[1]]], groups: [{ label: String(2025 + f.qsel[0]), from: 0, to: 0 }] } : { cats: [1, 2, 3, 4, 1, 2, 3, 4].map((n) => "Qtr" + n), vals: q, groups: [{ label: "2025", from: 0, to: 3 }, { label: "2026", from: 4, to: 7 }] };
  return { c1, c2: { cats: PN, vals: aggP(c, f) }, c3: { cats: f.br.map((b) => BR[b]), vals: aggB(c, f) } };
};
const tween = (a: CD, b: CD, t: number): CD & { growth: number } => (a.cats.join() === b.cats.join() ? { ...b, vals: b.vals.map((v, i) => lerp(a.vals[i], v, t)), growth: 1 } : { ...b, growth: t });
const dashAt = (c: Cube, stages: { T: number; flt: Flt }[], f: number): { c1: CD & { growth: number }; c2: CD & { growth: number }; c3: CD & { growth: number }; cur: number; since: number } => {
  let cur = 0; stages.forEach((s, i) => { if (f >= s.T) cur = i; });
  const nx = dashOf(c, stages[cur].flt); if (cur === 0) return { c1: { ...nx.c1, growth: 1 }, c2: { ...nx.c2, growth: 1 }, c3: { ...nx.c3, growth: 1 }, cur, since: 9999 };
  const pv = dashOf(c, stages[cur - 1].flt); const t = prog(f, stages[cur].T, 38);
  return { c1: tween(pv.c1, nx.c1, t), c2: tween(pv.c2, nx.c2, t), c3: tween(pv.c3, nx.c3, t), cur, since: f - stages[cur].T };
};
const ALL: Flt = { br: [0, 1, 2, 3, 4] };

// ================= SC01: date grouping =================
export const Scene1: React.FC = () => {
  const f = useCurrentFrame(); const A = A1;
  const rv = Array.from({ length: 27 }, (_, i) => 1 - prog(f, 935 + i * 1.3, 14));
  const rs = stack(rv, 3);
  const raw: GRow[] = rv.map((v, i) => ({ id: "r" + i, hdr: 0, slot: rs[i], h: v, cells: [{ v: fmtDate(i) }, { v: num(DAYSUMS[i]), al: "r" as const }] }));
  const sumFull = pivRows(itemsOf("quarters"), (i) => prog(f, 975 + i * 3, 10), "s");
  const menuT = win(800, 842, f, 8);
  const dlgT = win(842, 938, f, 12);
  const sel = f < 856 ? ["Months"] : f < 884 ? ["Months", "Quarters"] : ["Months", "Quarters", "Years"];
  const cam = camAt(f, [{ f: 0, ...camAll }, { f: 780, ...camAll }, { f: 835, z: 1.4, cx: 700, cy: 360 }, { f: 940, z: 1.4, cx: 700, cy: 360 }, { f: 975, ...camAll }, { f: 1200, ...camAll }]);
  const cur = path2(f, [{ f: 770, x: 420, y: 520 }, { f: 798, x: colX(cols, 0) + 70, y: slotY(7) + 10 }, { f: 826, x: colX(cols, 0) + 70 + 100, y: slotY(5) + 197 }]);
  return (
    <SceneFx f={f} dur={1200} kind="fade">
      <Sheet cam={cam} tab="pivotanalyze" nameBox="A8" formula={f < 935 ? fmtDate(4) : "2025"} rows={[pivHead, ...raw, ...sumFull]} active={{ c: 0, slot: 7 }} glow={{ id: "groupfield", color: C.blue, t: win(A.engine, 842, f, 10) * 0.9 }}>
        <PaneS grouped={f >= 935} glow={{ area: "rows", color: C.blue, t: win(938, 1060, f, 10) }} />
        <Chip x={400} y={slotY(4)} text="Thousands of daily dates → one row per day" color={C.amber} t={win(A.dates, 800, f, 10)} />
        <CtxMenu x={colX(cols, 0) + 60} y={slotY(5)} t={menuT} hover={f >= 818 ? "group" : undefined} w={230}
          items={[{ label: "Copy" }, { label: "Format Cells..." }, { label: "Refresh" }, { sep: true, label: "" }, { label: "Sort", arrow: true }, { label: "Filter", arrow: true }, { label: 'Subtotal "Date"' }, { label: "Expand/Collapse", arrow: true }, { sep: true, label: "" }, { label: "Group...", id: "group" }, { label: "Ungroup..." }, { sep: true, label: "" }, { label: "Move", arrow: true }, { label: 'Remove "Date"' }, { label: "Field Settings..." }, { label: "PivotTable Options..." }, { label: "Hide Field List" }]} />
        <GroupingDialog x={600} y={190} t={dlgT} sel={sel} glow={f >= A.years - 10 && f < 930 ? C.blue : undefined} ok={f >= 925 && f < 938 ? 1 : 0} startAt="1/1/2025" endAt="12/31/2026" />
        <Chip x={400} y={slotY(4)} text="Daily dates → Years · Quarters · Months" color={C.green} t={prog(f, A.end - 20, 12)} />
        {f >= 770 && f < 940 ? <Cursor x={cur.x} y={cur.y} f={f} clicks={[800, 912]} /> : null}
      </Sheet>
      <TopStrip f={f} badge={badge} lines={[{ from: 60, to: 540, text: "الدرس 30 من 76 | الوحدة 6 من 14 → Pivot Charts & Grouping Engine", ar: true }, { from: 660, to: 1140, text: "Temporal Grouping → Right-Click → Group → Years, Quarters, Months", color: C.blue }]} />
    </SceneFx>
  );
};

// ================= SC02: PivotChart + Hide field buttons =================
const Q8 = [1, 2, 3, 4, 1, 2, 3, 4].map((n) => "Qtr" + n);
const QG = [{ label: "2025", from: 0, to: 3 }, { label: "2026", from: 4, to: 7 }];
export const Scene2: React.FC = () => {
  const f = useCurrentFrame(); const A = A2;
  const vals = aggQ(CUBE, ALL);
  const tabNow = f >= A.tab ? "pivotchart" : "pivotanalyze";
  const fbp = ribbonPos("pivotchart", "cfbtn"), pcp = ribbonPos("pivotanalyze", "pchart");
  const cam = camAt(f, [{ f: 0, ...camAll }, { f: 215, ...camAll }, { f: 245, z: 1.6, cx: pcp.x, cy: 150 }, { f: 268, z: 1.6, cx: pcp.x, cy: 150 }, { f: 290, z: 1.35, cx: 768, cy: 360 }, { f: 420, z: 1.35, cx: 768, cy: 360 }, { f: 450, ...camAll }, { f: A.tab - 20, ...camAll }, { f: A.tab + 20, z: 1.6, cx: fbp.x, cy: 150 }, { f: 880, z: 1.6, cx: fbp.x, cy: 150 }, { f: 915, ...camAll }, { f: 1350, ...camAll }]);
  const chartT = prog(f, 420, 14), gr = prog(f, 430, 50);
  const btnT = prog(f, 440, 12) * (1 - prog(f, 862, 20));
  const clutter = f >= A.clean && f < 862 ? C.red : undefined;
  const glow = f >= 885 ? C.blue : f >= A.link && f < A.clean ? C.blue : undefined;
  const items = itemsOf("quarters");
  const ch = { w: 640, h: 360 };
  return (
    <SceneFx f={f} dur={1350} kind="zoom">
      <Sheet cam={cam} tab={tabNow} glow={f < 270 ? { id: "pchart", color: C.blue, t: win(A.pc - 10, 270, f, 10) } : { id: "cfbtn", color: C.blue, t: win(A.tab + 10, 868, f, 10) }} nameBox="A4" formula="2025" rows={[pivHead, ...pivRows(items, () => 1)]} active={{ c: 0, slot: 3 }}
        cellFx={(id, c) => (f >= A.link && f < A.clean && String(id)[0] === "p" ? `rgba(56,189,248,${0.25 * win(A.link, A.clean, f, 10)})` : undefined)}>
        <PaneS grouped />
        <ChartBox x={380} y={252} w={ch.w} h={ch.h} t={chartT} title="Sales by Quarter" cats={Q8} vals={vals} groups={QG} growth={gr} glow={glow} sel
          btns={[{ label: "Sum of Amount", x: 6, y: 6 }, { label: "Years", x: 6, y: ch.h - 28 }, { label: "Quarters", x: 66, y: ch.h - 28 }]} btnT={btnT} btnColor={clutter} />
        <InsertChartDialog x={560} y={190} t={win(270, 424, f, 12)} pick={f >= A.pick} glow={f >= A.pick ? C.blue : undefined} ok={f >= 405 && f < 418 ? 1 : 0} />
        <Chip x={380} y={206} text="PivotChart ↔ PivotTable: same numbers, always linked" color={C.blue} t={win(A.link, A.clean - 20, f, 10)} />
        <Chip x={380} y={620} text="Field buttons = visual clutter" color={C.red} t={win(A.clean + 10, 850, f, 10)} />
        <CtxMenu x={fbp.x - 30} y={fbp.y + 26} t={win(A.fb, 872, f, 8)} hover={f >= A.fb + 30 ? "hide" : undefined} w={280}
          items={[{ label: "Show All", id: "all" }, { label: "Hide All", id: "hide" }, { sep: true, label: "" }, { label: "Show Report Filter Field Buttons" }, { label: "Show Legend Field Buttons" }, { label: "Show Axis Field Buttons" }, { label: "Show Value Field Buttons" }]} />
        <Chip x={380} y={620} text="Clean, executive-ready chart" color={C.green} t={prog(f, A.clutter, 12)} />
      </Sheet>
      <TopStrip f={f} badge={badge} lines={[{ from: 60, to: 600, text: "Dynamic Pivot Charts → Linked directly to PivotTable aggregation arrays", color: C.blue }, { from: 720, to: 1260, text: "Executive Presentation → PivotChart Analyze → Field Buttons → Hide All", color: C.green }]} />
    </SceneFx>
  );
};

// ================= SC03: Slicer + Report Connections =================
export const Scene3: React.FC = () => {
  const f = useCurrentFrame(); const A = A3;
  const d = dashAt(CUBE, [{ T: 0, flt: ALL }, { T: 756, flt: { br: [2] } }, { T: 1085, flt: { br: [0, 2] } }], f);
  const sel = d.cur === 0 ? BR : d.cur === 1 ? ["Cairo"] : ["Alex", "Cairo"];
  const pulse = (T: number): string | undefined => (win(T + 10, T + 130, f, 10) > 0.05 ? C.green : undefined);
  const gl = f >= 756 && f < 886 ? pulse(756) : f >= 1085 && f < 1215 ? pulse(1085) : undefined;
  const pos = [{ x: 30, y: 172, w: 470, h: 550 }, { x: 510, y: 172, w: 430, h: 270 }, { x: 510, y: 452, w: 430, h: 270 }];
  const cam = camAt(f, [{ f: 0, ...camAll }, { f: 495, ...camAll }, { f: 525, z: 1.35, cx: 770, cy: 360 }, { f: 700, z: 1.35, cx: 770, cy: 360 }, { f: 730, ...camAll }, { f: 1350, ...camAll }]);
  const cur = path2(f, [{ f: 450, x: 700, y: 560 }, { f: 480, x: 1030, y: 300 }, { f: 515, x: 1090, y: 345 }, { f: 700, x: 1090, y: 345 }, { f: 740, x: 1040, y: 292 }, { f: 1070, x: 1040, y: 292 }, { f: 1084, x: 1040, y: 258 }]);
  return (
    <SceneFx f={f} dur={1350} kind="left">
      <Excel cam={cam} file="manzooma_sales_2026.xlsx" tab={f >= A.rc - 10 ? "slicer" : "pivotchart"} glow={{ id: "slconn", color: C.purple, t: win(A.rc, 560, f, 10) }} nameBox="A1" formula="" statusLeft="Ready" sheets={["Data", "Pivots", "Dashboard"]} sheet="Dashboard"
        grid={{ cols, rows: [], fixedHdr: true, lines: true, active: null }}>
        <ChartBox {...pos[0]} t={prog(f, 5, 14)} title="Sales by Quarter" cats={d.c1.cats} vals={d.c1.vals} groups={d.c1.groups} growth={d.c1.growth} glow={gl} />
        <ChartBox {...pos[1]} t={prog(f, 20, 14)} title="Sales by Product" cats={d.c2.cats} vals={d.c2.vals} horiz color="#ED7D31" growth={d.c2.growth} glow={gl} />
        <ChartBox {...pos[2]} t={prog(f, 35, 14)} title="Sales by Branch" cats={d.c3.cats} vals={d.c3.vals} color="#70AD47" growth={d.c3.growth} glow={gl} />
        <Slicer x={960} y={172} t={prog(f, A.sl, 14)} title="Branch" items={BR} sel={sel} glow={f >= A.rc - 20 && f < 700 ? C.purple : undefined} hover={f >= 740 && f < 756 ? "Cairo" : f >= 1070 && f < 1085 ? "Alex" : undefined} />
        <CtxMenu x={1000} y={300} t={win(A.rc - 10, 520, f, 8)} hover={f >= A.rc + 8 ? "rc" : undefined} w={240}
          items={[{ label: "Cut" }, { label: "Copy" }, { label: 'Remove "Branch"' }, { sep: true, label: "" }, { label: "Slicer Settings..." }, { label: "Report Connections...", id: "rc" }, { label: "Size and Properties..." }]} />
        <ReportConnDialog x={560} y={230} t={win(522, 702, f, 12)} title="Report Connections (Branch)" names={["PivotTable1", "PivotTable2", "PivotTable3"]} checked={[true, f >= A.chk, f >= A.chk + 25]} glow={f >= A.chk - 10 ? C.purple : undefined} ok={f >= 690 && f < 702 ? 1 : 0} />
        <Chip x={560} y={578} text="Connect PivotTables from other sheets (same data source)" color={C.purple} t={win(A.sheets, 700, f, 10)} />
        <Chip x={960} y={400} text="3 charts update together" color={C.green} t={win(A.jump, 970, f, 10)} />
        <Chip x={960} y={400} text="One slicer → many pivot charts & tables" color={C.purple} t={win(A.sync, 1090, f, 10)} />
        <Chip x={960} y={450} text="Ctrl + click = multi-select" color={C.green} t={win(1060, 1200, f, 10)} />
        {(f >= 450 && f < 705) || (f >= 735 && f < 770) || (f >= 1065 && f < 1100) ? <Cursor x={cur.x} y={cur.y} f={f} clicks={[A.rc - 4, 700, 756, 1086]} /> : null}
      </Excel>
      <TopStrip f={f} badge={badge} lines={[{ from: 90, to: 630, text: "Dynamic Dashboard Sync → Slicer Right-Click → Report Connections", color: C.purple }, { from: 750, to: 1290, text: "Multi-Chart Control → Single Slicer Filters Multiple Pivot Charts & Tables Simultaneously", color: C.purple }]} />
    </SceneFx>
  );
};

// ================= SC04: drill-down + expand/collapse =================
const MONS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dcols = buildCols([84, 76, 90, 100, 92]);
export const Scene4: React.FC = () => {
  const f = useCurrentFrame(); const A = A4;
  const mode: "quarters" | "months" | "years" = f < 595 ? "quarters" : f < 660 ? "months" : "years";
  const T = mode === "quarters" ? 0 : mode === "months" ? 595 : 660;
  const items = itemsOf(mode);
  const gr = mode === "quarters" ? 1 : prog(f, T + 4, 30);
  const hs = (i: number): number => (mode === "quarters" ? 1 : prog(f, T + i * 1.2, 8));
  const chart = mode === "quarters" ? { cats: Q8, vals: aggQ(CUBE, ALL), groups: QG } : mode === "months" ? { cats: [...MONS, ...MONS], vals: [...MONTHSUMS[0], ...MONTHSUMS[1]], groups: QG.map((g) => ({ ...g, from: g.from * 3, to: g.to * 3 + 2 })).map((g, i) => ({ label: g.label, from: i * 12, to: i * 12 + 11 })) } : { cats: ["2025", "2026"], vals: [yearSum(0), yearSum(1)], groups: undefined };
  const detail = detailRows(1, 1); const dSum = detail.reduce((a, o) => a + o.amount, 0);
  const showDetail = f >= 380 && f < 545;
  const dl = win(250, 380, f, 10);
  const cellY = slotY(10) + 10;
  const expMenu = win(560, 600, f, 8), colMenu = win(628, 668, f, 8);
  const cur = path2(f, [{ f: 240, x: 700, y: 560 }, { f: 262, x: colX(cols, 1) + 60, y: cellY }, { f: 548, x: colX(cols, 1) + 60, y: cellY }, { f: 560, x: colX(cols, 0) + 50, y: slotY(4) + 10 }, { f: 590, x: colX(cols, 0) + 200, y: slotY(4) + 190 }, { f: 628, x: colX(cols, 0) + 40, y: slotY(3) + 10 }, { f: 652, x: colX(cols, 0) + 200, y: slotY(3) + 150 }]);
  const ec = [{ label: "Copy" }, { label: "Format Cells..." }, { label: "Refresh" }, { sep: true, label: "" }, { label: "Sort", arrow: true }, { label: "Filter", arrow: true }, { label: "Subtotal", arrow: false }, { label: "Expand/Collapse", arrow: true, id: "ec" }, { sep: true, label: "" }, { label: "Group..." }, { label: "Ungroup..." }];
  const cam = camAll;
  const detRows: GRow[] = [
    { id: "dh", hdr: 1, slot: 0, h: 1, cells: ["Order ID", "Date", "Branch", "Product", "Amount"].map((t, i) => ({ v: t, b: true, fill: "#4472C4", fg: "#fff", al: i === 4 ? "r" as const : "l" as const })) },
    ...detail.slice(0, 26).map((o, i) => ({ id: "d" + i, hdr: i + 2, slot: i + 1, h: prog(f, 385 + i * 3, 8), cells: [o.id, fmtDate(o.day), BR[o.b], PN[o.p], num(o.amount)].map((v, k) => ({ v, fill: i % 2 ? undefined : "#D9E1F2", al: k === 4 ? "r" as const : "l" as const })) })),
  ];
  return (
    <SceneFx f={f} dur={1200} kind="down">
      {showDetail ? (
        <Excel cam={cam} file="manzooma_sales_2026.xlsx" tab="home" nameBox="A1" formula="Order ID" statusLeft="Ready" sheets={["Data", "Pivots", "Sheet4"]} sheet="Sheet4" grid={{ cols: dcols, rows: detRows, fixedHdr: true, lines: true, active: { c: 0, slot: 0 } }}>
          <Chip x={560} y={slotY(2)} text={`${num(detail.length)} source rows behind ONE number · Sum = ${num(dSum)}`} color={C.amber} t={prog(f, A.rows, 12)} />
          <Chip x={560} y={slotY(5)} text="Opens in a separate sheet (Show Details)" color={C.amber} t={prog(f, A.sep, 12)} />
        </Excel>
      ) : (
        <Sheet cam={cam} tab="pivotanalyze" glow={{ id: f < 626 ? "expandf" : "collapsef", color: C.amber, t: win(A.exp - 8, 700, f, 10) }} nameBox={f < 380 ? "B11" : "A4"} formula={f < 380 ? num(qTotal(CUBE, 1, 1)) : "Qtr1"} rows={[pivHead, ...pivRows(items, hs)]} active={{ c: f < 380 ? 1 : 0, slot: f < 380 ? 10 : 4 }}
          cellFx={(id, c) => (f >= 270 && f < 380 && String(id) === "p7" ? `rgba(245,158,11,${0.55 * win(270, 380, f, 8)})` : undefined)}>
          <PaneS grouped />
          <ChartBox x={400} y={210} w={640} h={380} t={1} title={mode === "years" ? "Sales by Year" : mode === "months" ? "Sales by Month" : "Sales by Quarter"} cats={chart.cats} vals={chart.vals} groups={chart.groups} growth={gr} pm hi={mode === "quarters" && f >= 270 && f < 380 ? 5 : undefined} />
          <Chip x={400} y={620} text="Drill-Down → double-click a PivotTable value" color={C.amber} t={win(A.dd, 380, f, 10)} />
          <Chip x={400} y={620} text="One click = a whole level (all quarters / all years)" color={C.amber} t={win(A.one, 1000, f, 10)} />
          <Chip x={400} y={670} text="Navigate every level: Expand ↔ Collapse Entire Field" color={C.green} t={win(A.nav, 1160, f, 10)} />
          <CtxMenu x={colX(cols, 0) + 60} y={slotY(4)} t={expMenu} hover="ec" w={220} items={ec} />
          <CtxMenu x={colX(cols, 0) + 284} y={slotY(4) + 154} t={expMenu} hover={f >= A.exp + 14 ? "ee" : undefined} w={210} items={[{ label: "Expand" }, { label: "Expand Entire Field", id: "ee" }, { label: "Collapse" }, { label: "Collapse Entire Field", id: "ce" }]} />
          <CtxMenu x={colX(cols, 0) + 60} y={slotY(3)} t={colMenu} hover="ec" w={220} items={ec} />
          <CtxMenu x={colX(cols, 0) + 284} y={slotY(3) + 154} t={colMenu} hover={f >= A.col + 14 ? "ce" : undefined} w={210} items={[{ label: "Expand" }, { label: "Expand Entire Field" }, { label: "Collapse" }, { label: "Collapse Entire Field", id: "ce" }]} />
          {(f >= 240 && f < 380) || (f >= 548 && f < 668) ? <Cursor x={cur.x} y={cur.y} f={f} clicks={[262, 300, 590, 652]} /> : null}
        </Sheet>
      )}
      <TopStrip f={f} badge={badge} lines={[{ from: 60, to: 540, text: "Visual Drill-Down → Double-Click PivotTable Values to Inspect Underlying Data Rows", color: C.amber }, { from: 660, to: 1140, text: "Hierarchical Navigation → Expand / Collapse Entire Field for Multi-Level Data Visuals", color: C.green }]} />
      <KeyCaps keys={["Double click"]} f={f} from={286} hold={50} accent={C.amber} />
    </SceneFx>
  );
};

// ================= SC05: 50,000 rows dashboard =================
const W5 = buildCols([76, 72, 84, 100, 84]);
export const Scene5: React.FC = () => {
  const f = useCurrentFrame(); const A = A5;
  const big = bigCube();
  const dash = f >= A.build;
  const bottom = f >= 440 && f < 492;
  const off = bottom ? BIG_N - 26 : 0;
  const rows: GRow[] = [
    { id: "h", hdr: 1, slot: 0, h: 1, cells: ["Order ID", "Date", "Branch", "Product", "Amount"].map((t, i) => ({ v: t, b: true, fill: "#E2EFDA", al: i === 4 ? "r" as const : "l" as const })) },
    ...Array.from({ length: 26 }, (_, k) => { const o = bigOrder(off + k); return { id: "o" + k, hdr: o.n + 2, slot: k + 1, h: 1, cells: [o.id, fmtDate(o.day), BR[o.b], PN[o.p], num(o.amount)].map((v, i) => ({ v, al: i === 1 || i === 4 ? "r" as const : "l" as const })) }; }),
  ];
  const d = dashAt(big, [{ T: 0, flt: ALL }, { T: 640, flt: { br: [2] } }, { T: 672, flt: { br: [2], qsel: [1, 1] } }], f);
  const gl = (T: number): string | undefined => (win(T + 10, T + 110, f, 10) > 0.05 ? C.green : undefined);
  const g = f >= 672 ? gl(672) : f >= 640 ? gl(640) : undefined;
  const sel = d.cur === 0 ? BR : ["Cairo"];
  const count = Math.round(BIG_N * prog(f, A.file, 130));
  const cam = camAt(f, [{ f: 0, z: 1, cx: 668, cy: 340 }, { f: 432, z: 1, cx: 668, cy: 340 }, { f: 442, z: 1, cx: 668, cy: 380 }, { f: 490, z: 1, cx: 668, cy: 380 }, { f: 500, ...camAll }, { f: 1200, ...camAll }]);
  const tl = d.cur >= 2 ? ([3, 5] as [number, number]) : ([0, 11] as [number, number]);
  return (
    <SceneFx f={f} dur={1200} kind="expand">
      <Excel cam={cam} file={XLSX_NAME} tab={dash ? "pivotchart" : "home"} nameBox={bottom ? "A50001" : "A1"} formula={bottom ? bigOrder(BIG_N - 1).id : dash ? "" : "Order ID"} statusLeft="Ready" sheets={["Data", "Pivots", "Dashboard"]} sheet={dash ? "Dashboard" : "Data"}
        grid={{ cols: dash ? cols : W5, rows: dash ? [] : rows, fixedHdr: dash, lines: true, active: dash ? null : bottom ? { c: 0, slot: 26 } : { c: 0, slot: 0 } }}>
        {dash ? (
          <div>
            <ChartBox x={30} y={172} w={470} h={550} t={prog(f, A.build + 6, 14)} title="Sales by Quarter · 50,000 rows" cats={d.c1.cats} vals={d.c1.vals} groups={d.c1.groups} growth={d.c1.growth} glow={g} />
            <ChartBox x={510} y={172} w={430} h={270} t={prog(f, A.build + 30, 14)} title="Sales by Product" cats={d.c2.cats} vals={d.c2.vals} horiz color="#ED7D31" growth={d.c2.growth} glow={g} />
            <ChartBox x={510} y={452} w={430} h={270} t={prog(f, A.build + 54, 14)} title="Sales by Branch" cats={d.c3.cats} vals={d.c3.vals} color="#70AD47" growth={d.c3.growth} glow={g} />
            <Slicer x={960} y={172} t={prog(f, A.build + 80, 14)} title="Branch" items={BR} sel={sel} hover={f >= 628 && f < 640 ? "Cairo" : undefined} />
            <Timeline x={960} y={420} t={prog(f, A.build + 100, 14)} range={tl} glow={d.cur >= 2 ? C.blue : undefined} />
            <Chip x={960} y={546} text="Slicer + Timeline → every chart & table" color={C.green} t={win(A.ms, 900, f, 10)} />
          </div>
        ) : null}
      </Excel>
      <div style={{ position: "absolute", right: 28, top: 92, background: "rgba(15,23,42,.92)", border: `1.5px solid ${C.blue}`, borderRadius: 12, padding: "8px 18px", fontFamily: F.mono, fontSize: 19, color: C.text, opacity: prog(f, A.file, 12), zIndex: 60 }}>manzooma_sales_2026 · <span style={{ color: C.blue, fontWeight: 700 }}>{num(count)}</span> rows</div>
      <Seal t={prog(f, A.resp + 10, 26)} line1="Enterprise Dashboard" line2={`${num(BIG_N)} صف · استجابة فورية`} />
      <KeyCaps keys={["Ctrl", "↓"]} f={f} from={426} hold={34} accent={C.blue} />
      <TopStrip f={f} badge={badge} lines={[{ from: 60, to: 540, text: "Enterprise Interactive Dashboards → Synchronize Multiple Pivot Charts Across 50,000 Sales Rows", color: C.blue }, { from: 660, to: 1140, text: "Real-Time Response → Temporal Grouping & Report Connections on 50,000 Rows", color: C.green }]} />
    </SceneFx>
  );
};

// ================= SC06: outro =================
export const Scene6: React.FC = () => {
  const f = useCurrentFrame(); const A = A6;
  const pr = prog(f, 60, 110);
  const pct = (30 / 76) * 100;
  const skills = ["Group dates · Years, Quarters, Months", "PivotChart + Field Buttons → Hide All", "Slicer → Report Connections", "Drill-Down + Expand / Collapse Entire Field"];
  const fadeOut = 1 - prog(f, 850, 50);
  const card: React.CSSProperties = { background: "rgba(30,41,59,.72)", border: "1.5px solid rgba(148,163,184,.35)", borderRadius: 28 };
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 20% 10%, #16324a 0%, ${C.slate} 55%)`, opacity: Math.min(prog(f, 0, 20), fadeOut) }}>
      <div style={{ position: "absolute", left: 90, top: 60, display: "flex", alignItems: "center", gap: 20, opacity: prog(f, 0, 20) }}>
        <Logo s={120} />
        <div><div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 46, color: C.text }}>منظومة أكاديمي | Manzooma Excel Masterclass</div><div style={{ fontFamily: F.ui, fontSize: 22, color: "#94A3B8", marginTop: 4 }}>Excel From Zero to Professional</div></div>
      </div>
      <div style={{ ...card, position: "absolute", left: 90, top: 200, width: 1010, height: 700, padding: 44, boxSizing: "border-box", opacity: prog(f, 20, 20), transform: `translateY(${(1 - prog(f, 20, 20)) * 24}px)` }}>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 38, color: C.text }}>Lesson 30 · Pivot Charts & Grouping</div>
        <div style={{ fontFamily: F.ar, fontSize: 28, color: "#CBD5E1", marginTop: 8, direction: "rtl", textAlign: "left" }}>الدرس الثلاثون | الوحدة السادسة</div>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.text }}><span>Course progress · Lesson 30 of 76</span><span style={{ color: C.green }}>{Math.round(pr * pct)}%</span></div>
        <div style={{ marginTop: 12, height: 26, borderRadius: 13, background: "#0B1220", overflow: "hidden", border: "1px solid #334155" }}><div style={{ width: `${pr * pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, #34D399)`, boxShadow: `0 0 18px ${C.green}` }} /></div>
        <div style={{ marginTop: 10, fontFamily: F.ui, fontSize: 20, color: "#94A3B8" }}>Unit 6 of 14 · Pivot Tables & Aggregation · Lesson 3 of the unit</div>
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
          <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: C.green, lineHeight: "38px" }}>Pivot Charts & Grouping<div style={{ fontWeight: 500, fontSize: 21, color: "#CBD5E1" }}>Lesson 30 mastered</div></div>
        </div>
        <div style={{ ...card, height: 440, padding: 34, boxSizing: "border-box", opacity: prog(f, A.l31 - 20, 20), transform: `translateY(${(1 - prog(f, A.l31 - 20, 20)) * 30}px)`, border: `1.5px solid ${C.blue}` }}>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.blue, letterSpacing: 1 }}>NEXT · LESSON 31 · UNIT 6</div>
          <div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 34, color: C.text, marginTop: 10, direction: "rtl", textAlign: "right", lineHeight: "48px" }}>الدرس 31: لوحات القيادة التفاعلية والـ Dashboards المحورية</div>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: "#CBD5E1", marginTop: 8 }}>Pivot Dashboards · Dynamic KPI Cards</div>
          <div style={{ marginTop: 22, display: "flex", gap: 12 }}>{["Slicers", "Timelines", "KPI Cards"].map((t) => <div key={t} style={{ flex: 1, height: 56, borderRadius: 8, background: "#fff", border: `2px solid ${C.xGreen}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontSize: 21, fontWeight: 700, color: C.ink }}>{t}</div>)}</div>
        </div>
      </div>
    </div>
  );
};
