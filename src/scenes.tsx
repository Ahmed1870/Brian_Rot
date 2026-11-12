import React from "react";
import { useCurrentFrame } from "remotion";
import { A1, A2, A3, A4, A5, A6, SCENES } from "./sync";
import { BRANCH_COLS, CUST_COLS, N_BRANCH, N_CUST, N_PROD, N_SALES, N_TOTAL, PROD_COLS, SALES_COLS, branch, cust, num, prod, sale } from "./data";
import { Excel, F, TABS, buildCols, camAt, lerp, path, prog, ribbonPos, slotY, type Box, type Cell, type GRow } from "./kit";
import { Cursor, Dialog, KpiCard, Logo, Neon, SceneFx, TopStrip } from "./kit_ui";
import { ColumnStore, DIAG_POS, ImportDialog, PPWindow, PQWindow, PP, QCPane, ppBtn, pqBtn, type PPTbl } from "./kit_pp";
import { C, M, WIN_H, WIN_W, XLSX_NAME } from "./theme";

const badge = "Lesson 52 / 76 · Unit 11 / 14";
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
const HF = "#E2EFDA";
const SC = buildCols([84, 76, 86, 86, 76, 44, 84]);
const salesRows = (n: number): GRow[] => [
  { id: "h", hdr: 1, slot: 0, h: 1, cells: SALES_COLS.map((t) => cell(t, { b: true, fill: HF })) },
  ...Array.from({ length: n }, (_, i) => ({ id: "r" + i, hdr: i + 2, slot: i + 1, h: 1, cells: sale(i).map((v, c) => cell(v, { al: c >= 5 ? ("r" as const) : ("l" as const) })) })),
];
type SP = { f: number; tab?: string; hot?: { tab: string; color: string; t: number }; nameBox?: string; formula?: string; glow?: { id: string; color: string; t: number }; sel?: { c1: number; c2: number; s1: number; s2: number } | null; children?: React.ReactNode; stats?: string[] };
const camA = { z: 1, cx: 768, cy: 403 };
const Sheet: React.FC<SP> = (p) => (
  <Excel cam={camAt(p.f, [{ f: 0, ...camA }, { f: 9999, ...camA }])} file={XLSX_NAME} tab={p.tab ?? "home"} hotTab={p.hot} glow={p.glow} nameBox={p.nameBox ?? "A1"} formula={p.formula ?? "SalesID"} stats={p.stats}
    sheets={["Sales", "Customers", "Products", "Branches"]} sheet="Sales" grid={{ cols: SC, rows: salesRows(26), fixedHdr: true, lines: true, active: p.sel ? null : { c: 0, slot: 0 }, sel: p.sel ?? null }}>{p.children}</Excel>
);
const tabPos = (name: string): { x: number; y: number } => { let x = 10; for (const t of TABS) { const w = t.length * 7.2 + 26; if (t === name) return { x: x + w / 2, y: M.titleBar + 15 }; x += w; } return { x: 0, y: 0 }; };
const T_SALES: PPTbl = { name: "Sales", cols: SALES_COLS, widths: [100, 90, 100, 100, 90, 60, 110], row: sale, total: N_SALES, right: [5, 6] };
const T_CUST: PPTbl = { name: "Customers", cols: CUST_COLS, widths: [110, 180, 130, 130], row: (i) => cust(i + 1), total: N_CUST };
const T_PROD: PPTbl = { name: "Products", cols: PROD_COLS, widths: [110, 200, 140, 110], row: (i) => prod(i + 1), total: N_PROD, right: [3] };
const T_BR: PPTbl = { name: "Branches", cols: BRANCH_COLS, widths: [110, 180, 160], row: (i) => branch(i + 1), total: N_BRANCH };
const TABS_PP = ["Sales", "Customers", "Products", "Branches"];
const TBLS = [T_SALES, T_CUST, T_PROD, T_BR];

// ================= SC01: architecture =================
const Card: React.FC<{ x: number; y: number; w: number; h: number; color: string; t: number; title: string; sub: string; children?: React.ReactNode }> = ({ x, y, w, h, color, t, title, sub, children }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y + (1 - t) * 20, width: w, height: h, opacity: t, background: "rgba(15,23,42,.96)", border: `2.5px solid ${color}`, borderRadius: 18, boxShadow: `0 0 28px ${color}77`, zIndex: 30, boxSizing: "border-box", padding: 22 }}>
      <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 25, color: C.text }}>{title}</div>
      <div style={{ fontFamily: F.ui, fontSize: 16, color, marginTop: 2 }}>{sub}</div>
      {children}
    </div>
  )
);
export const Scene1: React.FC = () => {
  const f = useCurrentFrame(); const A = A1;
  const comp = prog(f, A.vp + 20, 150);
  const pulse = win(A.mil, A.slow + 90, f, 10);
  return (
    <SceneFx f={f} dur={D[0]} kind="fade">
      <Sheet f={f} nameBox="A1">
        <Chip x={470} y={300} big text="Data Model & Power Pivot Engine" color={C.blue} t={win(A.hello, A.unit + 40, f, 14)} />
        <Chip x={470} y={360} text="Lesson 52 of 76 · Unit 11 of 14 · Level 4 — Enterprise Data Modeling" color={C.green} t={win(A.hello + 20, A.unit + 40, f, 14)} />
        <Card x={60} y={168} w={680} h={520} color={C.red} t={prog(f, A.strat, 20)} title="Worksheet — Row-Oriented Grid" sub="Classic sheet storage">
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 8 }}>
            {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ display: "flex", gap: 4, opacity: prog(f, A.strat + 10 + i * 3, 10) }}>{Array.from({ length: 7 }, (_, c) => <div key={c} style={{ flex: 1, height: 20, background: `rgba(239,68,68,${0.25 + 0.35 * pulse})`, border: "1px solid #7F1D1D", borderRadius: 3 }} />)}</div>)}
          </div>
          <div style={{ marginTop: 22, display: "flex", gap: 14, alignItems: "center", opacity: prog(f, A.mil, 12) }}>
            <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: C.red, background: "#1B0B0B", border: `2px solid ${C.red}`, borderRadius: 10, padding: "6px 16px", boxShadow: `0 0 ${10 + 16 * pulse}px ${C.red}` }}>1,048,576 rows max</div>
          </div>
          <div style={{ marginTop: 16, fontFamily: F.ui, fontSize: 20, color: C.amber, opacity: prog(f, A.slow, 12) }}>Heavy formulas → slow recalculation</div>
        </Card>
        <Card x={796} y={168} w={680} h={520} color={C.blue} t={prog(f, A.vp - 20, 20)} title="Data Model — VertiPaq Engine" sub="In-memory · columnar · compressed">
          <div style={{ marginTop: 26, height: 300, position: "relative" }}>
            <ColumnStore x={0} y={0} w={630} h={300} t={comp} color={C.blue} names={SALES_COLS} />
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 14, opacity: prog(f, A.millions, 12) }}>
            <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 22, color: C.text, background: C.slate2, border: `2px solid ${C.blue}`, borderRadius: 10, padding: "6px 16px" }}>Millions of rows · stored in RAM</div>
          </div>
          <div style={{ marginTop: 14, height: 22, borderRadius: 11, background: "#0B1220", border: "1px solid #334155", overflow: "hidden", opacity: prog(f, A.ram, 12) }}><div style={{ width: `${100 - 90 * prog(f, A.ram, 40)}%`, height: "100%", background: `linear-gradient(90deg, ${C.blue}, #7DD3FC)` }} /></div>
          <div style={{ marginTop: 8, fontFamily: F.mono, fontSize: 16, color: "#94A3B8", opacity: prog(f, A.ram, 12) }}>RAM footprint · up to −90%</div>
        </Card>
        <Chip x={560} y={706} text="Aggregates in fractions of a second" color={C.green} t={win(A.fast, 1340, f, 10)} />
      </Sheet>
      {sl(D[0], f, "الدرس 52 من 76 | الوحدة 11 من 14 ──► Data Model & Power Pivot Engine", "Enterprise In-Memory Architecture ──► VertiPaq Engine vs. Legacy Row Grid", C.blue, C.green, true)}
    </SceneFx>
  );
};

// ================= SC02: Power Pivot window =================
export const Scene2: React.FC = () => {
  const f = useCurrentFrame(); const A = A2;
  const tp = tabPos("Power Pivot"), mg = ribbonPos("powerpivot", "manage"), dv = ppBtn("dataview"), dg = ppBtn("diagview");
  const onPP = f >= A.pp + 18;
  const view: "data" | "diagram" = f >= A.dgv + 16 ? "diagram" : "data";
  const wt = prog(f, A.manage + 14, 22);
  const cur = path(f, [{ f: 0, x: 900, y: 420 }, { f: A.pp - 14, x: 900, y: 420 }, { f: A.pp + 6, x: tp.x, y: tp.y + 6 }, { f: A.manage - 8, x: mg.x, y: mg.y }, { f: A.manage + 70, x: 760, y: 500 }, { f: A.dv - 6, x: dv.x, y: dv.y }, { f: A.dgv - 14, x: dg.x, y: dg.y }, { f: A.dgv + 60, x: 760, y: 520 }, { f: 1216, x: 760, y: 520 }]);
  const blocks = ["Customers", "Sales", "Products", "Branches"];
  const hl = f >= A.blocks ? blocks[Math.floor((f - A.blocks) / 42) % 4] : undefined;
  return (
    <SceneFx f={f} dur={D[1]} kind="left">
      <Sheet f={f} tab={onPP ? "powerpivot" : "home"} hot={{ tab: "Power Pivot", color: C.blue, t: win(A.pp - 6, A.pp + 24, f, 8) }} glow={{ id: "manage", color: C.blue, t: win(A.manage - 10, A.manage + 40, f, 8) }}>
        <PPWindow t={wt} view={view} tbl={T_SALES} tabs={TABS_PP} tab={0} top={0} sel={{ r: 2, c: 6 }} dgT={prog(f, A.dgv + 16, 24)} relT={prog(f, A.blocks - 40, 90)} dgHl={hl} fx="" recordNo={1}
          glow={{ id: view === "data" ? "dataview" : "diagview", color: view === "data" ? C.blue : C.purple, t: win(A.env + 20, A.dgv - 30, f, 10) * (view === "data" ? 1 : 0) + win(A.dgv + 20, A.ctrl + 160, f, 10) * (view === "diagram" ? 1 : 0) }} />
        {wt > 0.9 && f >= A.env ? <Neon x={dv.x - 31} y={dv.y - 36} w={dg.x - dv.x + 62} h={66} color={C.blue} t={win(A.env, A.dgv - 20, f, 12)} label="Data View | Diagram View" labelPos="bottom" /> : null}
        <Chip x={720} y={640} text="Data View · browse each table as tabs" color={C.blue} t={win(A.dv, A.dgv - 20, f, 10)} />
        <Chip x={300} y={672} text="Diagram View · relational schema of the model" color={C.purple} t={win(A.dgv + 20, A.blocks + 160, f, 10)} />
        <Chip x={300} y={672} text="Table blocks + relationships · 1 → *" color={C.purple} t={win(A.blocks + 160, A.ctrl - 20, f, 10)} />
        <Chip x={300} y={672} text="Full control over your data structure" color={C.green} t={prog(f, A.ctrl, 12)} />
        <Cursor x={cur.x} y={cur.y} f={f} clicks={[A.pp + 2, A.manage - 2, A.dv, A.dgv - 8]} />
      </Sheet>
      {sl(D[1], f, "Launching Power Pivot ──► Power Pivot Tab ──► Manage", "Dual Model Views ──► Data View (Tabular Data) vs. Diagram View (Relational Schema)", C.blue, C.green)}
    </SceneFx>
  );
};

// ================= SC03: ingestion pathways =================
const Flow: React.FC<{ f: number; from: number; color: string; x0: number; y0: number; x1: number; y1: number }> = ({ f, from, color, x0, y0, x1, y1 }) => (
  <>{Array.from({ length: 14 }, (_, i) => { const t = prog(f, from + i * 5, 40); const a = t > 0 && t < 1 ? 1 : 0; return a ? <div key={i} style={{ position: "absolute", left: lerp(x0, x1, t), top: lerp(y0, y1, t) + Math.sin(i * 1.7) * 18, width: 12, height: 12, borderRadius: 3, background: color, boxShadow: `0 0 10px ${color}`, opacity: 1 - Math.abs(t - 0.5) * 0.6, zIndex: 48 }} /> : null; })}</>
);
export const Scene3: React.FC = () => {
  const f = useCurrentFrame(); const A = A3;
  const tp = tabPos("Power Pivot"), ad = ribbonPos("powerpivot", "adddm");
  const phaseB = f >= 428;
  const inB = f >= 428 && f < 600;
  const tab = phaseB ? (f < 700 ? "data" : "data") : f >= A.add - 70 ? "powerpivot" : "home";
  const cl = pqBtn("closeload");
  const DX = 553, DY = 200;
  const radio = { x: DX + 100, y: DY + 30 + 131 }, chk = { x: DX + 90, y: DY + 30 + 249 }, ok = { x: DX + 278, y: DY + 30 + 280 };
  const menuHover = f >= 578 ? "loadto" : "closeload";
  const cur = path(f, [{ f: 0, x: 400, y: 200 }, { f: 90, x: colXc(0), y: slotY(1) + 8 }, { f: 170, x: colXc(6), y: slotY(26) + 8 }, { f: A.add - 70, x: tp.x, y: tp.y + 6 }, { f: A.add - 8, x: ad.x, y: ad.y }, { f: 380, x: ad.x, y: ad.y }, { f: 470, x: 700, y: 500 }, { f: 540, x: cl.x, y: cl.y }, { f: 572, x: cl.x + 20, y: cl.y + 78 }, { f: 590, x: cl.x + 40, y: cl.y + 100 }, { f: 604, x: radio.x, y: radio.y }, { f: 622, x: chk.x, y: chk.y }, { f: 690, x: ok.x, y: ok.y }, { f: 760, x: 700, y: 450 }, { f: 1198, x: 700, y: 450 }]);
  const sel = f >= 90 && f < 428 ? { c1: 0, c2: 6, s1: 0, s2: 26 } : null;
  const qc = prog(f, 712, 20);
  return (
    <SceneFx f={f} dur={D[2]} kind="down">
      <Sheet f={f} tab={tab} sel={sel} nameBox={sel ? "A1:G27" : "A1"} hot={{ tab: "Power Pivot", color: C.green, t: win(A.add - 70, A.add - 30, f, 8) }} glow={f < 428 ? { id: "adddm", color: C.green, t: win(A.add - 20, A.add + 80, f, 10) } : undefined} stats={sel ? ["Average: 11,420", "Count: 189", "Sum: 2,158,800"] : undefined}>
        <QCPane x={WIN_W - 290} y={M.titleBar + M.tabs + M.ribbon} h={WIN_H - 52 - M.titleBar - M.tabs - M.ribbon} t={qc} items={[{ name: "Customers", note: `Connection only · ${num(N_CUST)} rows loaded to the Data Model`, hi: C.amber }]} />
        {f < 428 ? <Flow f={f} from={316} color={C.green} x0={500} y0={300} x1={1200} y1={160} /> : null}
        {f < 428 ? <Chip x={1010} y={110} text="VertiPaq · Data Model (RAM)" color={C.green} t={prog(f, 322, 12) * (1 - prog(f, 410, 14))} /> : null}
        {f < 428 ? <Chip x={640} y={640} text="Path 1 · Excel table → Power Pivot → Add to Data Model" color={C.green} t={win(A.p1, 420, f, 12)} /> : null}
        <PQWindow t={prog(f, 428, 18) * (1 - prog(f, 592, 6))} query="Customers" menu={f >= 556 && f < 592 ? prog(f, 556, 8) : 0} hover={menuHover} glow={{ id: "closeload", color: C.amber, t: win(A.cl - 14, A.cl + 40, f, 8) }} tbl={T_CUST} queries={TABS_PP} steps={["Source", "Promoted Headers", "Changed Type"]}>
          {inB && f > 440 ? <Chip x={600} y={640} text="Path 2 · Power Query → Close & Load To…" color={C.amber} t={win(A.p2 - 4, 592, f, 12)} /> : null}
        </PQWindow>
        <ImportDialog x={DX} y={DY} t={prog(f, 596, 14) * (1 - prog(f, 702, 8))} only={f >= 606} model={f >= 626} hiOnly={f >= 604 && f < 626 ? C.amber : undefined} hiModel={f >= A.adt - 8 && f < 700 ? C.amber : undefined} ok={prog(f, 694, 4) > 0.5 ? 1 : 0} />
        <Chip x={420} y={640} text={`${num(N_CUST)} rows → Data Model · 0 rows on the sheet`} color={C.green} t={win(A.rows, A.light - 10, f, 10)} />
        <Chip x={420} y={640} text="Light workbook · opens fast everywhere" color={C.blue} t={prog(f, A.light, 12)} />
        {f > A.rows - 4 && f < A.light ? <Flow f={f} from={A.rows} color={C.amber} x0={420} y0={420} x1={1230} y1={300} /> : null}
        <Cursor x={cur.x} y={cur.y} f={f} clicks={[A.add + 8, 552, 590, 606, 626, 696, 92]} />
      </Sheet>
      {sl(D[2], f, "Ingesting to Data Model ──► Power Pivot ──► Add to Data Model", "Power Query Model Pipeline ──► Close & Load To… + Add this data to the Data Model", C.green, C.amber)}
    </SceneFx>
  );
};
function colXc(c: number): number { let x = M.rowHdr; for (let i = 0; i < c; i++) x += SC[i].w; return x + SC[c].w / 2; }

// ================= SC04: columnar mechanics =================
const CITY = ["Cairo", "Cairo", "Cairo", "Giza", "Giza", "Alexandria", "Alexandria", "Alexandria", "Alexandria", "Alexandria"];
const DICT = ["Cairo", "Giza", "Alexandria"];
const ENC = CITY.map((c) => DICT.indexOf(c));
const Pane: React.FC<{ x: number; y: number; w: number; h: number; color: string; title: string; t: number; children?: React.ReactNode }> = ({ x, y, w, h, color, title, t, children }) => (
  t <= 0 ? null : <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: t, background: "rgba(30,41,59,.96)", border: `2px solid ${color}`, borderRadius: 16, boxShadow: `0 0 22px ${color}66`, boxSizing: "border-box", padding: "14px 18px", zIndex: 30 }}><div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 21, color: C.text, marginBottom: 10 }}>{title}</div>{children}</div>
);
const Mono: React.FC<{ children: React.ReactNode; c?: string; w?: number }> = ({ children, c = C.text, w }) => <div style={{ fontFamily: F.mono, fontSize: 18, color: c, height: 30, lineHeight: "30px", width: w, whiteSpace: "nowrap" }}>{children}</div>;
export const Scene4: React.FC = () => {
  const f = useCurrentFrame(); const A = A4;
  const phase1 = f < 420, phase2 = f >= 420 && f < A.target - 10, phase3 = f >= A.target - 10;
  const cols7 = SALES_COLS;
  const scanT = prog(f, A.target + 30, 140);
  return (
    <SceneFx f={f} dur={D[3]} kind="expand">
      <Sheet f={f} tab="powerpivot">
        <div style={{ position: "absolute", left: 30, top: 70, width: WIN_W - 60, height: WIN_H - 130, background: "rgba(15,23,42,.97)", border: `2px solid ${C.slate2}`, borderRadius: 20, zIndex: 25 }} />
        {phase1 ? (
          <>
            <Pane x={60} y={100} w={690} h={600} color={C.amber} title="Row storage — reads every column of every row" t={prog(f, A.rowst - 10, 16) * (1 - prog(f, 410, 10))}>
              {Array.from({ length: 12 }, (_, r) => <div key={r} style={{ display: "flex", gap: 4, marginBottom: 8 }}>{cols7.map((c, i) => <div key={c} style={{ flex: 1, height: 26, borderRadius: 3, background: `rgba(245,158,11,${0.22 + 0.5 * prog(f, A.rowst + 20 + r * 6, 10)})`, border: "1px solid #92400E", boxShadow: i === 6 ? `0 0 8px ${C.amber}` : undefined }} />)}</div>)}
              <div style={{ fontFamily: F.mono, fontSize: 17, color: C.amber, marginTop: 10 }}>SUM(Amount) → scans all {cols7.length} columns</div>
            </Pane>
            <Pane x={786} y={100} w={690} h={600} color={C.blue} title="Columnar storage — VertiPaq" t={prog(f, A.col - 6, 16) * (1 - prog(f, 410, 10))}>
              <div style={{ position: "relative", height: 400, marginTop: 20 }}><ColumnStore x={0} y={0} w={640} h={400} t={prog(f, A.vp, 80)} color={C.blue} names={cols7} /></div>
              <div style={{ fontFamily: F.mono, fontSize: 17, color: C.blue, marginTop: 6 }}>Each column is compressed on its own</div>
            </Pane>
          </>
        ) : null}
        {phase2 ? (
          <Pane x={60} y={100} w={1416} h={500} color={C.blue} title="VertiPaq compression for the City column" t={prog(f, 420, 14) * (1 - prog(f, A.target - 22, 12))}>
            <div style={{ display: "flex", gap: 40, marginTop: 8 }}>
              <div style={{ width: 280 }}><div style={{ fontFamily: F.ui, fontSize: 16, color: "#94A3B8", marginBottom: 6 }}>RAW VALUES</div>{CITY.map((c, i) => <Mono key={i}>{c}</Mono>)}</div>
              <div style={{ width: 300, opacity: prog(f, A.dict, 14) }}>
                <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 16, color: C.green, marginBottom: 6 }}>DICTIONARY ENCODING</div>
                {DICT.map((d, i) => <Mono key={d} c={C.green}>{i} → {d}</Mono>)}
                <div style={{ fontFamily: F.ui, fontSize: 16, color: "#94A3B8", margin: "18px 0 6px" }}>ENCODED</div>
                {ENC.map((e, i) => <Mono key={i} c={C.blue}>{e}</Mono>)}
              </div>
              <div style={{ width: 360, opacity: prog(f, A.rle, 14) }}>
                <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 16, color: C.amber, marginBottom: 6 }}>RUN-LENGTH ENCODING (RLE)</div>
                {[[0, 3], [1, 2], [2, 5]].map(([v, n]) => <Mono key={v} c={C.amber}>({v} × {n}) → {CITY.length - 0 >= 0 ? DICT[v] : ""}</Mono>)}
                <div style={{ fontFamily: F.ui, fontSize: 16, color: "#CBD5E1", margin: "18px 0 0" }}>10 values → 3 runs</div>
              </div>
              <div style={{ flex: 1, opacity: prog(f, A.ninety - 30, 14) }}>
                <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 16, color: C.blue, marginBottom: 10 }}>RAM FOOTPRINT</div>
                <div style={{ height: 34, borderRadius: 8, background: "#7F1D1D", border: `1px solid ${C.red}`, width: "100%", display: "flex", alignItems: "center", padding: "0 10px", fontFamily: F.mono, fontSize: 16, color: C.text }}>Uncompressed · 100%</div>
                <div style={{ height: 34, borderRadius: 8, background: C.blue, width: `${100 - 90 * prog(f, A.ninety, 40)}%`, minWidth: 90, marginTop: 12, display: "flex", alignItems: "center", padding: "0 10px", fontFamily: F.mono, fontWeight: 700, fontSize: 16, color: C.slate }}>{Math.round(100 - 90 * prog(f, A.ninety, 40))}%</div>
                <div style={{ marginTop: 16, fontFamily: F.ui, fontWeight: 700, fontSize: 24, color: C.green, opacity: prog(f, A.ninety + 30, 14) }}>up to −90% RAM</div>
              </div>
            </div>
          </Pane>
        ) : null}
        {phase3 ? (
          <Pane x={60} y={100} w={1416} h={600} color={C.green} title="Columnar query: SUM(Sales[Amount])" t={prog(f, A.target - 10, 16)}>
            <div style={{ position: "relative", height: 420, marginTop: 20 }}><ColumnStore x={20} y={0} w={1000} h={420} t={0.3} color={C.blue} names={cols7} dim={[0, 1, 2, 3, 4, 5]} focus={6} scan={scanT} /></div>
            <Chip x={1060} y={150} text="Reads only the target column" color={C.green} t={prog(f, A.target + 10, 12)} />
            <Chip x={1060} y={210} text="Ignores all other columns" color={C.amber} t={prog(f, A.target + 40, 12)} />
            <Chip x={1060} y={270} text={scanT >= 1 ? "SUM(Amount) ✓ done" : "SUM(Amount) scanning…"} color={C.green} mono t={prog(f, A.target + 90, 12)} />
          </Pane>
        ) : null}
      </Sheet>
      {sl(D[3], f, "Columnar Storage Mechanics ──► Reads Only Target Columns (Ignores Unneeded Rows)", "VertiPaq Compression ──► Dictionary Encoding & RLE Reduces RAM Footprint by 90%", C.blue, C.green)}
    </SceneFx>
  );
};

// ================= SC05: 50,000 rows =================
export const Scene5: React.FC = () => {
  const f = useCurrentFrame(); const A = A5;
  const ld = prog(f, A.file, 150);
  const tabIdx = f < 700 ? 0 : f < 745 ? 1 : f < 790 ? 2 : f < 835 ? 3 : 0;
  const tbl = TBLS[tabIdx];
  const top = tabIdx === 0 ? Math.floor((f < 700 ? N_SALES * 0.9 * prog(f, 600, 90) : f >= 835 ? N_SALES * 0.4 * prog(f, 835, 120) : 0)) : 0;
  const mg = ribbonPos("powerpivot", "manage"), tp = tabPos("Power Pivot");
  const cur = path(f, [{ f: 0, x: 700, y: 450 }, { f: A.open - 70, x: 700, y: 450 }, { f: A.open - 50, x: tp.x, y: tp.y + 6 }, { f: A.open - 18, x: mg.x, y: mg.y }, { f: A.open + 40, x: 760, y: 560 }, { f: 1243, x: 760, y: 560 }]);
  const wt = prog(f, A.open + 10, 20);
  const ms = prog(f, A.ms, 12);
  return (
    <SceneFx f={f} dur={D[4]} kind="expand">
      <Sheet f={f} tab={f >= A.open - 48 ? "powerpivot" : "home"} glow={{ id: "manage", color: C.green, t: win(A.open - 30, A.open + 20, f, 8) }}>
        <QCPane x={WIN_W - 290} y={M.titleBar + M.tabs + M.ribbon} h={WIN_H - 52 - M.titleBar - M.tabs - M.ribbon} t={prog(f, A.file + 20, 16) * (1 - prog(f, A.open, 12))} items={[{ name: "Sales", note: `${num(N_SALES * ld)} rows · Data Model` }, { name: "Customers", note: `${num(N_CUST * ld)} rows · Data Model` }, { name: "Products", note: `${num(N_PROD * ld)} rows · Data Model` }, { name: "Branches", note: `${num(N_BRANCH * ld)} rows · Data Model` }]} />
        <Chip x={420} y={200} text={`${XLSX_NAME} · 4 related tables`} color={C.blue} mono t={win(A.file, A.fifty + 60, f, 10)} />
        <KpiCard x={700} y={160} label="ROWS IN DATA MODEL" value={num(N_TOTAL * ld)} color={C.blue} t={win(A.fifty - 20, A.open + 30, f, 10)} flash={ld < 1 ? 1 : 0} />
        <PPWindow t={wt} view="data" tbl={tbl} tabs={TABS_PP} tab={tabIdx} top={top} sel={{ r: 3, c: 0 }} recordNo={top + 1} />
        <KpiCard x={760} y={620} label="RESPONSE" value="< 2 ms" color={C.green} t={ms} flash={win(A.ms, A.perf, f, 10)} />
        <Chip x={720} y={572} text="Instant scrolling & table switching · no lag" color={C.green} t={win(A.open + 20, A.ms + 40, f, 10)} />
        <Seal t={prog(f, A.perf + 20, 26)} line1="Enterprise Data Model" line2="سرعة لحظية على 50,000 صف" />
        <Cursor x={cur.x} y={cur.y} f={f} clicks={[A.open - 46, A.open - 14, 700, 745, 790, 835]} />
      </Sheet>
      {sl(D[4], f, "Enterprise Data Model Pipeline ──► Load & Store 50,000 Multi-Table Rows in RAM", "Sub-Millisecond Model Querying ──► High-Speed VertiPaq In-Memory Processing in <2ms", C.blue, C.green)}
    </SceneFx>
  );
};

// ================= SC06: outro =================
export const Scene6: React.FC = () => {
  const f = useCurrentFrame(); const A = A6;
  const pr = prog(f, 60, 110), pct2 = (52 / 76) * 100;
  const skills = ["Data Model & VertiPaq · in-memory columnar engine", "Power Pivot → Manage · Data View & Diagram View", "Add to Data Model · from sheet & Power Query", "Dictionary Encoding & RLE · up to −90% RAM"];
  const fadeOut = 1 - prog(f, D[5] - 50, 50);
  const card: React.CSSProperties = { background: "rgba(30,41,59,.72)", border: "1.5px solid rgba(148,163,184,.35)", borderRadius: 28 };
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 20% 10%, #16324a 0%, ${C.slate} 55%)`, opacity: Math.min(prog(f, 0, 20), fadeOut) }}>
      <div style={{ position: "absolute", left: 90, top: 60, display: "flex", alignItems: "center", gap: 20, opacity: prog(f, 0, 20) }}>
        <Logo s={120} />
        <div><div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 46, color: C.text }}>منظومة أكاديمي | Manzooma Excel Masterclass</div><div style={{ fontFamily: F.ui, fontSize: 22, color: "#94A3B8", marginTop: 4 }}>Excel From Zero to Professional</div></div>
      </div>
      <div style={{ ...card, position: "absolute", left: 90, top: 200, width: 1010, height: 700, padding: 44, boxSizing: "border-box", opacity: prog(f, 20, 20), transform: `translateY(${(1 - prog(f, 20, 20)) * 24}px)` }}>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 38, color: C.text }}>Lesson 52 · Data Model & Power Pivot Engine</div>
        <div style={{ fontFamily: F.ar, fontSize: 28, color: "#CBD5E1", marginTop: 8, direction: "rtl", textAlign: "left" }}>الدرس الثاني والخمسون | الوحدة الحادية عشرة</div>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.text }}><span>Course progress · Lesson 52 of 76</span><span style={{ color: C.green }}>{(pr * pct2).toFixed(1)}%</span></div>
        <div style={{ marginTop: 12, height: 26, borderRadius: 13, background: "#0B1220", overflow: "hidden", border: "1px solid #334155" }}><div style={{ width: `${pr * pct2}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, #34D399)`, boxShadow: `0 0 18px ${C.green}` }} /></div>
        <div style={{ marginTop: 10, fontFamily: F.ui, fontSize: 20, color: "#94A3B8" }}>Unit 11 of 14 · Data Model & Power Pivot · Lesson 1 of the unit</div>
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
          <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: C.green, lineHeight: "38px" }}>Data Model & Power Pivot<div style={{ fontWeight: 500, fontSize: 21, color: "#CBD5E1" }}>Lesson 52 mastered</div></div>
        </div>
        <div style={{ ...card, height: 440, padding: 34, boxSizing: "border-box", opacity: prog(f, A.l53 - 20, 20), transform: `translateY(${(1 - prog(f, A.l53 - 20, 20)) * 30}px)`, border: `1.5px solid ${C.blue}` }}>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.blue, letterSpacing: 1 }}>NEXT · LESSON 53 · UNIT 11</div>
          <div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 34, color: C.text, marginTop: 10, direction: "rtl", textAlign: "right", lineHeight: "48px" }}>الدرس 53: تصميم جداول الحقائق والأبعاد</div>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: "#CBD5E1", marginTop: 8 }}>Fact & Dimension Tables Architecture</div>
          <div style={{ marginTop: 22, display: "flex", gap: 14 }}>{[["Dim", C.purple], ["Fact", C.green], ["Dim", C.purple]].map(([t, c], i) => <div key={i} style={{ flex: 1, height: 96, borderRadius: 10, background: C.slate, border: `2px solid ${c}`, boxShadow: `0 0 14px ${c}66`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 700, fontSize: 24, color: C.text }}>{t}</div>)}</div>
        </div>
      </div>
    </div>
  );
};
void Dialog; void PP; void pqBtn; void lerp;
