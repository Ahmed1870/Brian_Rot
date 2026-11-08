import React from "react";
import { useCurrentFrame } from "remotion";
import { A1, A2, A3, A4, A5, A6 } from "./sync";
import { BIG_N, SALES, andRows, bigRows, isAlex, isCairo, num, orRows, sumAmt, vipRows, type Sale } from "./data";
import { Excel, F, buildCols, camAt, colX, lerp, prog, slotY, typed, type Box, type Col, type GRow, type Cell } from "./kit";
import { CellEditor, ErrTag, FuncTip, KeyCaps, KpiCard, LogicMatrix, Logo, Neon, SceneFx, Shield, TopStrip, argIndex, argSegs, type Seg } from "./kit_ui";
import { C, XLSX_NAME } from "./theme";

const BLUE = "#2B7CD3", AMB = "#B45309", PUR = "#7E22CE";
const W = [70, 68, 78, 90, 70, 22, 70, 68, 78, 90, 70, 22, 70, 68, 78, 90, 70];
const cols = buildCols(W);
const HEAD = ["Order ID", "Date", "Branch", "Product", "Amount"];
const badge = "Lesson 16 / 76 · Unit 4 / 14";
const win = (a: number, b: number, f: number, r = 8): number => prog(f, a, r) * (1 - prog(f, b, r));
const cellsAt = (c0: number, vals: (string | number)[], head?: boolean, al: string[] = ["l", "r", "l", "l", "r"]): Cell[] => {
  const arr: Cell[] = [];
  vals.forEach((v, i) => { arr[c0 + i] = { v, b: head, fill: head ? "#E2EFDA" : undefined, al: al[i] === "r" ? "r" : "l" }; });
  return arr;
};
const saleVals = (s: Sale): (string | number)[] => [s.id, s.date, s.branch, s.product, num(s.amount)];
const hdrRow = (id: string, c0: number): GRow => ({ id, hdr: 1, cells: cellsAt(c0, HEAD, true), slot: 0, h: 1 });
const srcRows = (): GRow[] => [hdrRow("hd0", 0), ...SALES.slice(0, 30).map((s, i) => ({ id: "a" + i, hdr: i + 2, cells: cellsAt(0, saleVals(s)), slot: i + 1, h: 1 }))];
const spill = (pre: string, list: Sale[], c0: number, hs: (i: number) => number): GRow[] => list.map((s, i) => ({ id: pre + i, hdr: 0, cells: cellsAt(c0, saleVals(s)), slot: i + 1, h: hs(i) }));
const ctr = (c: number, slot: number): { x: number; y: number } => ({ x: colX(cols, c), y: slotY(slot) });
const Chip: React.FC<{ x: number; y: number; text: string; color: string; t: number; strike?: boolean }> = ({ x, y, text, color, t, strike }) => (
  t <= 0 ? null : <div style={{ position: "absolute", left: x, top: y, opacity: t, transform: `translateY(${(1 - t) * 8}px)`, background: C.slate, color: C.text, border: `2px solid ${color}`, borderRadius: 8, padding: "6px 12px", boxShadow: `0 0 14px ${color}88`, fontFamily: F.ui, fontWeight: 600, fontSize: 15, whiteSpace: "nowrap", zIndex: 45, textDecoration: strike ? "line-through" : "none" }}>{text}</div>
);
type SheetProps = { cam: ReturnType<typeof camAt>; tab?: string; nameBox: string; formula: string; editing?: boolean; rows: GRow[]; active: { c: number; slot: number }; boxes?: Box[]; cellFx?: (id: string | number, c: number) => string | undefined; cols?: Col[]; children?: React.ReactNode };
const Sheet: React.FC<SheetProps> = (p) => (
  <Excel cam={p.cam} file="manzooma_sales_2026.xlsx" tab={p.tab ?? "formulas"} nameBox={p.nameBox} formula={p.formula} editing={p.editing} statusLeft={p.editing ? "Enter" : "Ready"}
    grid={{ cols: p.cols ?? cols, rows: p.rows, fixedHdr: true, lines: true, active: p.active, boxes: p.boxes, cellFx: p.cellFx }}>{p.children}</Excel>
);
const opSegs = (text: string, op: string, color: string): Seg[] => {
  const i = text.indexOf(` ${op} `);
  if (i < 0 || text.length <= i + 1) return [{ t: text }];
  return [{ t: text.slice(0, i + 1) }, { t: op, bg: color, c: "#fff", b: true }, { t: text.slice(i + 2) }];
};
const Seal: React.FC<{ t: number; line1: string; line2: string }> = ({ t, line1, line2 }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", right: 50, top: 300, width: 340, opacity: t, transform: `scale(${0.7 + 0.3 * t})`, zIndex: 60, textAlign: "center" }}>
      <div style={{ width: 170, height: 170, margin: "0 auto", borderRadius: 85, background: `radial-gradient(circle, ${C.green}33, ${C.slate})`, border: `4px solid ${C.green}`, boxShadow: `0 0 40px ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 92, color: C.green }}>✓</div>
      <div style={{ marginTop: 12, background: C.slate, border: `1.5px solid ${C.green}`, borderRadius: 12, padding: "8px 12px", fontFamily: F.ui, fontWeight: 700, fontSize: 21, color: C.text }}>{line1}</div>
      <div style={{ marginTop: 8, fontFamily: F.ar, fontWeight: 600, fontSize: 19, color: C.green, background: C.slate, borderRadius: 10, padding: "4px 10px" }}>{line2}</div>
    </div>
  )
);

// ================= SC01: FILTER anatomy =================
export const Scene1: React.FC = () => {
  const f = useCurrentFrame(); const A = A1;
  const FORMULA = '=FILTER(A2:E100, C2:C100="Cairo", "No Sales")';
  const cairo = SALES.filter(isCairo);
  const txt = typed(FORMULA, f, A.fn, 0.32);
  const typing = f >= A.fn && f < A.flex + 4;
  const done = f >= A.flex + 4;
  const rank = (n: number): number => cairo.findIndex((s) => s.n === n);
  const rows = [...srcRows(), hdrRow("hd1", 6), ...spill("sp", cairo, 6, (i) => (done ? prog(f, A.flex + 8 + i * 3, 8) : 0))];
  const boxes: Box[] = [
    { c1: 0, c2: 4, s1: 1, s2: 99, color: C.blue, dash: true, t: prog(f, A.arr, 10) * (1 - prog(f, A.flex, 10)) },
    { c1: 2, c2: 2, s1: 1, s2: 99, color: C.amber, dash: true, t: prog(f, A.inc, 10) * (1 - prog(f, A.flex, 10)), w: 3 },
    { c1: 6, c2: 10, s1: 1, s2: cairo.length, color: C.blue, t: done ? prog(f, A.flex + 8, 14) : 0, fill: "rgba(16,185,129,.10)", w: 3 },
  ];
  const shown = done ? FORMULA : typing ? txt : "";
  const ap = (t: number): React.CSSProperties => ({ opacity: t, transform: `translateY(${(1 - t) * 10}px)` });
  const chip = (bg: string, label: string, code: string, ar: string, t: number): React.ReactNode => (
    <div style={{ ...ap(t), width: 230 }}>
      <div style={{ fontFamily: F.mono, fontSize: 15, fontWeight: 700, color: C.text, background: C.slate2, border: `2px solid ${bg}`, borderRadius: 8, padding: "7px 10px", boxShadow: `0 0 16px ${bg}`, whiteSpace: "nowrap" }}>{code}</div>
      <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 14, color: bg, marginTop: 6 }}>{label}</div>
      <div style={{ fontFamily: F.ar, fontSize: 14, color: "#CBD5E1", direction: "rtl", textAlign: "left" }}>{ar}</div>
    </div>
  );
  return (
    <SceneFx f={f} dur={1200} kind="fade">
      <Sheet cam={camAt(f, [{ f: 0, z: 1, cx: 768, cy: 403 }, { f: 300, z: 1, cx: 768, cy: 403 }, { f: 345, z: 1.2, cx: 560, cy: 420 }, { f: 1200, z: 1.2, cx: 560, cy: 420 }])}
        nameBox={f >= A.free ? "G2" : "A1"} formula={shown} editing={typing} rows={rows} active={f >= A.free ? { c: 6, slot: 1 } : { c: 0, slot: 0 }} boxes={boxes}
        cellFx={(id, c) => { const s = String(id); if (s[0] !== "a" || c > 4) return undefined; const r = rank(Number(s.slice(1))); if (r < 0) return undefined; return `rgba(245,158,11,${prog(f, A.flex + 4 + r * 3, 14) * (1 - prog(f, A.flex + 60 + r * 3, 30)) * 0.45})`; }}>
        {typing ? <CellEditor x={ctr(6, 1).x} y={ctr(6, 1).y} segs={argSegs(shown, [BLUE, AMB, PUR])} /> : null}
        {typing ? <FuncTip x={ctr(6, 2).x} y={ctr(6, 2).y + 4} name="FILTER" params={["array", "include", "[if_empty]"]} active={argIndex(txt)} /> : null}
        {f >= A.three - 20 && f < A.flex + 30 ? (
          <div style={{ position: "absolute", left: ctr(6, 17).x - 8, top: ctr(6, 17).y, width: 780, background: "rgba(15,23,42,.94)", border: `1.5px solid ${C.blue}`, borderRadius: 14, padding: "14px 18px", zIndex: 40, opacity: win(A.three - 20, A.flex + 20, f, 12) }}>
            <div style={{ fontFamily: F.mono, fontSize: 18, color: C.text, marginBottom: 10 }}>=FILTER( <span style={{ color: C.blue }}>array</span> , <span style={{ color: C.amber }}>include</span> , <span style={{ color: C.purple }}>[if_empty]</span> )</div>
            <div style={{ display: "flex", gap: 14 }}>
              {chip(C.blue, "array", "A2:E100", "النطاق اللي هتفلتره", prog(f, A.arr, 10))}
              {chip(C.amber, "include", 'C2:C100="Cairo"', "شرط TRUE / FALSE لكل صف", prog(f, A.inc, 10))}
              {chip(C.purple, "if_empty", '"No Sales"', "رسالة لو مفيش نتائج", prog(f, A.ife, 10))}
            </div>
          </div>
        ) : null}
      </Sheet>
      <KeyCaps keys={["Enter"]} f={f} from={A.flex - 12} hold={45} accent={C.green} />
      <TopStrip f={f} badge={badge} lines={[{ from: 60, to: 540, text: "الدرس 16 من 76 | الوحدة 4 من 14 → Dynamic FILTER Engine", ar: true }, { from: 660, to: 1140, text: "FILTER Syntax → =FILTER(array, include, [if_empty])", color: C.blue }]} />
    </SceneFx>
  );
};

// ================= SC02: AND / OR =================
export const Scene2: React.FC = () => {
  const f = useCurrentFrame(); const A = A2;
  const T1 = '=FILTER(Data, (Branch="Cairo") * (Amount>5000))';
  const T2 = '=FILTER(Data, (Branch="Cairo") + (Branch="Alex"))';
  const t1 = typed(T1, f, 350, 0.35), t2 = typed(T2, f, 644, 0.4);
  const e1 = f >= 350 && f < A.andl + 6, e2 = f >= 644 && f < A.orl + 6;
  const d1 = f >= A.andl + 6, d2 = f >= A.orl + 6;
  const rows = [...srcRows(), hdrRow("hd1", 6), hdrRow("hd2", 12), ...spill("sp", andRows, 6, (i) => (d1 ? prog(f, A.andl + 8 + i * 3, 8) : 0)), ...spill("so", orRows, 12, (i) => (d2 ? prog(f, A.orl + 8 + i * 2, 8) : 0))];
  const boxes: Box[] = [
    { c1: 6, c2: 10, s1: 1, s2: andRows.length, color: C.green, t: d1 ? prog(f, A.andl + 8, 14) : 0, fill: "rgba(16,185,129,.12)", w: 3 },
    { c1: 12, c2: 16, s1: 1, s2: orRows.length, color: "#06B6D4", t: d2 ? prog(f, A.orl + 8, 14) : 0, fill: "rgba(6,182,212,.12)", w: 3 },
  ];
  const cur = e2 ? t2 : e1 ? t1 : d2 ? T2 : d1 ? T1 : "";
  const sample = SALES.slice(0, 8);
  return (
    <SceneFx f={f} dur={1350} kind="zoom">
      <Sheet cam={camAt(f, [{ f: 0, z: 1.2, cx: 640, cy: 430 }, { f: 1350, z: 1.2, cx: 640, cy: 430 }])}
        nameBox={f >= 644 ? "M2" : f >= 340 ? "G2" : "A1"} formula={cur} editing={e1 || e2} rows={rows} active={f >= 644 ? { c: 12, slot: 1 } : f >= 340 ? { c: 6, slot: 1 } : { c: 0, slot: 0 }} boxes={boxes}>
        <Chip x={ctr(6, 26).x} y={ctr(6, 26).y} text="Data = A2:E100  ·  Branch = C2:C100  ·  Amount = E2:E100" color={C.blue} t={win(A.logic, 560, f, 12)} />
        {e1 ? <CellEditor x={ctr(6, 1).x} y={ctr(6, 1).y} segs={opSegs(t1, "*", "#D97706")} /> : null}
        {e1 ? <FuncTip x={ctr(6, 2).x} y={ctr(6, 2).y + 4} name="FILTER" params={["array", "include", "[if_empty]"]} active={argIndex(t1)} /> : null}
        {e2 ? <CellEditor x={ctr(12, 1).x} y={ctr(12, 1).y} segs={opSegs(t2, "+", "#0891B2")} /> : null}
        {e2 ? <FuncTip x={ctr(12, 2).x} y={ctr(12, 2).y + 4} name="FILTER" params={["array", "include", "[if_empty]"]} active={argIndex(t2)} /> : null}
        <LogicMatrix x={ctr(6, 14).x - 8} y={ctr(6, 14).y} t={win(A.and - 20, A.plus - 8, f, 12)} f={f - (A.and - 20)} mode="and" rows={sample} color={C.amber} />
        <LogicMatrix x={ctr(6, 14).x - 8} y={ctr(6, 14).y} t={prog(f, A.plus - 8, 12)} f={f - (A.plus - 8)} mode="or" rows={sample} color="#06B6D4" />
        <Chip x={ctr(6, 12).x} y={ctr(6, 12).y - 30} text={`AND → ${andRows.length} of ${SALES.filter(isCairo).length} Cairo rows are above 5,000`} color={C.amber} t={win(A.andl + 40, A.plus - 20, f, 12)} />
        <Chip x={ctr(12, 25).x - 120} y={ctr(12, 25).y} text={`OR → ${SALES.filter(isCairo).length} Cairo + ${SALES.filter(isAlex).length} Alex = ${orRows.length} rows`} color="#06B6D4" t={prog(f, A.orl + 40, 12)} />
      </Sheet>
      <KeyCaps keys={["Enter"]} f={f} from={A.andl - 12} hold={40} accent={C.amber} />
      <KeyCaps keys={["Enter"]} f={f} from={A.orl - 12} hold={40} accent="#06B6D4" />
      <TopStrip f={f} badge={badge} lines={[{ from: 60, to: 600, text: "AND Logic (*) → Multiply Conditions: (Condition 1) * (Condition 2) Requires ALL True", color: C.amber }, { from: 720, to: 1260, text: "OR Logic (+) → Add Conditions: (Condition 1) + (Condition 2) Requires ANY True", color: "#06B6D4" }]} />
    </SceneFx>
  );
};

// ================= SC03: #CALC! and if_empty =================
export const Scene3: React.FC = () => {
  const f = useCurrentFrame(); const A = A3;
  const Ta = '=FILTER(Data, Branch="Giza")';
  const tb = '=FILTER(Data, Branch="Giza"';
  const extra = typed(', "No Matching Records"', f, A.third + 10, 0.4);
  const Tb = '=FILTER(Data, Branch="Giza", "No Matching Records")';
  const ta = typed(Ta, f, A.nof - 14, 0.3);
  const e1 = f >= A.nof - 14 && f < A.calc + 6;
  const err = f >= A.calc + 6 && f < A.third;
  const e2 = f >= A.third && f < A.nm + 8;
  const ok = f >= A.nm + 8;
  const edit2 = tb + extra + (extra.length >= 22 ? ")" : "");
  const shown = ok ? Tb : e2 ? edit2 : err ? Ta : e1 ? ta : "";
  const g = ctr(6, 1);
  return (
    <SceneFx f={f} dur={1350} kind="left">
      <Sheet cam={camAt(f, [{ f: 0, z: 1.3, cx: 500, cy: 340 }, { f: 1350, z: 1.3, cx: 500, cy: 340 }])}
        nameBox={f >= A.nof - 30 ? "G2" : "A1"} formula={shown} editing={e1 || e2} rows={srcRows()} active={f >= A.nof - 30 ? { c: 6, slot: 1 } : { c: 0, slot: 0 }}>
        <Neon x={ctr(2, 1).x} y={ctr(2, 1).y} w={78} h={27 * 20} color={C.blue} t={win(A.nof - 10, A.calc + 20, f, 10)} label="Branches here: Cairo · Alex · Mansoura · Aswan · Tanta" labelPos="top" />
        {e1 ? <CellEditor x={g.x} y={g.y} segs={argSegs(ta, [BLUE, AMB])} /> : null}
        {e1 ? <FuncTip x={g.x} y={g.y + 24} name="FILTER" params={["array", "include", "[if_empty]"]} active={argIndex(ta)} /> : null}
        {e2 ? <CellEditor x={g.x} y={g.y} segs={argSegs(edit2, [BLUE, AMB, PUR])} /> : null}
        {e2 && !ok ? <FuncTip x={g.x} y={g.y + 24} name="FILTER" params={["array", "include", "[if_empty]"]} active={Math.min(2, argIndex(edit2))} /> : null}
        {err ? (
          <div>
            <div style={{ position: "absolute", left: g.x, top: g.y, width: 70, height: 20, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.cell, fontSize: 14.67, color: C.ink, zIndex: 20 }}>#CALC!</div>
            <Neon x={g.x} y={g.y} w={70} h={20} color={C.red} t={prog(f, A.calc + 6, 10)} />
            <ErrTag x={g.x - 22} y={g.y} t={prog(f, A.calc + 14, 10)} />
            <div style={{ position: "absolute", left: g.x + 90, top: g.y - 6, background: C.slate, color: C.text, border: `2px solid ${C.red}`, borderRadius: 8, padding: "6px 12px", boxShadow: `0 0 16px ${C.red}`, fontFamily: F.ui, fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", zIndex: 45, opacity: prog(f, A.calc + 14, 10) }}>#CALC! → no rows matched "Giza"</div>
          </div>
        ) : null}
        {ok ? (
          <div>
            <div style={{ position: "absolute", left: g.x + 3, top: g.y, height: 20, display: "flex", alignItems: "center", fontFamily: F.cell, fontSize: 14.67, fontWeight: 700, color: PUR, whiteSpace: "nowrap", zIndex: 20, opacity: prog(f, A.nm + 8, 10) }}>No Matching Records</div>
            <Neon x={g.x} y={g.y} w={160} h={20} color={C.purple} t={prog(f, A.nm + 8, 12)} />
          </div>
        ) : null}
        <Shield x={g.x + 200} y={g.y + 50} t={prog(f, A.gone, 14)} label="Native error shield — no IFERROR needed" color={C.purple} />
        <Chip x={g.x} y={g.y + 130} text='=IFERROR( FILTER( ... ), "No Matching Records" )' color={C.red} t={prog(f, A.iferr, 12)} strike />
        <Chip x={g.x} y={g.y + 176} text="✓  FILTER(…, [if_empty]) already handles it" color={C.green} t={prog(f, A.iferr + 24, 12)} />
      </Sheet>
      <KeyCaps keys={["Enter"]} f={f} from={A.calc - 12} hold={40} accent={C.red} />
      <KeyCaps keys={["Enter"]} f={f} from={A.nm - 12} hold={40} accent={C.purple} />
      <TopStrip f={f} badge={badge} lines={[{ from: 90, to: 630, text: "#CALC! Error Prevention → Triggers When No Records Match Filter Criteria", color: C.red }, { from: 750, to: 1290, text: "Parameter #3 [if_empty] → Returns Custom Text/Zero Natively Without IFERROR", color: C.purple }]} />
    </SceneFx>
  );
};

// ================= SC04: spill reference # =================
export const Scene4: React.FC = () => {
  const f = useCurrentFrame(); const A = A4;
  const cairo = SALES.filter(isCairo), alex = SALES.filter(isAlex);
  const S = '=SUM(INDEX(G2#,,5))';
  const ts = typed(S, f, A.sum, 0.25);
  const typingS = f >= A.sum && f < A.g2 + 6;
  const shrink = prog(f, A.shr, 30);
  const afterEnter = f >= A.shr - 4;
  const F1 = (b: string): string => `=FILTER(A2:E100, C2:C100="${b}", "No Sales")`;
  const n1 = (f - A.chg) * 0.3;
  const nm = n1 < 0 ? "Cairo" : n1 < 5 ? "Cairo".slice(0, 5 - Math.floor(n1)) : "Alex".slice(0, Math.max(0, Math.floor((f - A.chg - 17) * 0.25)));
  const editing2 = f >= A.chg && f < A.shr - 4;
  const fedit = F1(nm);
  const val = Math.round(lerp(sumAmt(cairo), sumAmt(alex), shrink));
  const cnt = Math.round(lerp(cairo.length, alex.length, shrink));
  const hs = (i: number): number => (i < alex.length ? 1 : afterEnter ? 1 - prog(f, A.shr + (14 - i) * 3, 10) : 1);
  const list = (i: number): Sale => (afterEnter && i < alex.length ? alex[i] : cairo[i]);
  const rows: GRow[] = [...srcRows(), hdrRow("hd1", 6), ...cairo.map((_, i) => ({ id: "sp" + i, hdr: 0, cells: cellsAt(6, saleVals(list(i))), slot: i + 1, h: hs(i) }))];
  const kShown = f >= A.g2 + 6;
  rows.push({ id: "k0", hdr: 0, slot: 0, h: 1, cells: ((): Cell[] => { const a: Cell[] = []; if (kShown) { a[12] = { v: "Total", b: true, fill: "#E2EFDA" }; a[13] = { v: "Rows", b: true, fill: "#E2EFDA", al: "r" }; } return a; })() });
  rows.push({ id: "k1", hdr: 0, slot: 1, h: 1, cells: ((): Cell[] => { const a: Cell[] = []; if (kShown) { a[12] = { v: num(val), al: "r" }; a[13] = { v: cnt, al: "r" }; } return a; })() });
  const boxes: Box[] = [
    { c1: 6, c2: 10, s1: 1, s2: lerp(cairo.length, alex.length, shrink), color: C.blue, fill: "rgba(16,185,129,.08)", w: 3 },
    { c1: 6, c2: 10, s1: 1, s2: lerp(cairo.length, alex.length, shrink) + 0.0, color: C.amber, dash: true, w: 3, t: win(A.hash, A.sum - 10, f, 12) * 0.9 + win(A.g2 - 20, A.g2 + 60, f, 10) },
    { c1: 12, c2: 13, s1: 0, s2: 1, color: C.green, t: win(A.shr + 10, A.shr + 80, f, 10) + win(A.sumup, A.sumup + 70, f, 10) },
  ];
  const segs: Seg[] = ((): Seg[] => { const i = ts.indexOf("#"); return i < 0 ? [{ t: ts }] : [{ t: ts.slice(0, i) }, { t: "#", bg: "#D97706", c: "#fff", b: true }, { t: ts.slice(i + 1) }]; })();
  const flash = win(A.shr + 10, A.shr + 90, f, 10) + win(A.kpi, A.kpi + 90, f, 10);
  return (
    <SceneFx f={f} dur={1200} kind="down">
      <Sheet cam={camAt(f, [{ f: 0, z: 1.2, cx: 640, cy: 430 }, { f: 1200, z: 1.2, cx: 640, cy: 430 }])}
        nameBox={editing2 ? "G2" : typingS || kShown ? "M2" : "G2"} formula={editing2 ? fedit : typingS ? ts : kShown ? S : F1("Cairo")} editing={typingS || editing2} rows={rows}
        active={kShown && !editing2 ? { c: 12, slot: 1 } : { c: 6, slot: 1 }} boxes={boxes}>
        <Chip x={ctr(12, 4).x} y={ctr(12, 4).y} text="G2#  =  the whole spill range" color={C.amber} t={win(A.hash, A.sum - 10, f, 12)} />
        {typingS ? <CellEditor x={ctr(12, 1).x} y={ctr(12, 1).y} segs={segs} /> : null}
        {typingS ? <FuncTip x={ctr(12, 2).x} y={ctr(12, 2).y + 4} name={ts.includes("INDEX(") ? "INDEX" : "SUM"} params={ts.includes("INDEX(") ? ["array", "row_num", "[column_num]"] : ["number1", "[number2]", "..."]} active={ts.includes("INDEX(") ? Math.min(2, argIndex(ts.slice(ts.indexOf("INDEX")))) : 0} /> : null}
        {editing2 ? <CellEditor x={ctr(6, 1).x} y={ctr(6, 1).y} segs={argSegs(fedit, [BLUE, AMB, PUR])} /> : null}
        <KpiCard x={ctr(6, 18).x} y={ctr(6, 18).y} label="RECORDS" value={String(cnt)} color={C.green} t={prog(f, A.g2 + 14, 12)} flash={flash} />
        <KpiCard x={ctr(6, 18).x + 190} y={ctr(6, 18).y} label="TOTAL AMOUNT" value={num(val)} color={C.blue} t={prog(f, A.g2 + 20, 12)} flash={flash} />
      </Sheet>
      <KeyCaps keys={["Enter"]} f={f} from={A.g2 - 12} hold={40} accent={C.amber} />
      <KeyCaps keys={["Enter"]} f={f} from={A.shr - 18} hold={40} accent={C.green} />
      <TopStrip f={f} badge={badge} lines={[{ from: 60, to: 540, text: "Dynamic Synergy → Link FILTER Output to Downstream Calculations using # Operator", color: C.amber }, { from: 660, to: 1140, text: "Real-time Recalculation → Summary KPI Cards Update Automatically as Filter Criteria Change", color: C.green }]} />
    </SceneFx>
  );
};

// ================= SC05: 50,000 rows =================
const W5 = [70, 66, 76, 84, 44, 70, 22, 70, 66, 76, 84, 44, 70];
const cols5 = buildCols(W5);
const VIEW = 26;
export const Scene5: React.FC = () => {
  const f = useCurrentFrame(); const A = A5;
  const BIGF = '=FILTER(tbl_Sales2026, (tbl_Sales2026[Region]="Cairo") * (tbl_Sales2026[Total]>10000), "No VIP Sales")';
  const all = bigRows(), vip = vipRows();
  const bottom = f >= 420 && f < 470;
  const off = bottom ? BIG_N - VIEW : 0;
  const tf = typed(BIGF, f, A.formula + 4, 1.0);
  const typing = f >= A.formula + 4 && f < A.ms + 6;
  const done = f >= A.ms + 6;
  const H = ["Order ID", "Date", "Region", "Product", "Units", "Total"];
  const al = ["l", "r", "l", "l", "r", "r"];
  const hd = (id: string, c0: number): GRow => ({ id, hdr: 1, cells: cellsAt(c0, H, true, al), slot: 0, h: 1 });
  const rows: GRow[] = [hd("h0", 0), ...(done ? [hd("h1", 7)] : [])];
  for (let k = 0; k < VIEW; k++) {
    const r = all[off + k];
    rows.push({ id: "s" + k, hdr: r.n + 2, slot: k + 1, h: 1, cells: cellsAt(0, [r.id, r.date, r.region, r.product, r.units, num(r.total)], false, al) });
    if (done && !bottom) { const v = vip[k]; rows.push({ id: "v" + k, hdr: r.n + 2, slot: k + 1, h: prog(f, A.ms + 8 + k, 6), cells: cellsAt(7, [v.id, v.date, v.region, v.product, v.units, num(v.total)], false, al) }); }
  }
  const boxes: Box[] = [{ c1: 7, c2: 12, s1: 1, s2: VIEW + 1, color: C.blue, t: done ? prog(f, A.ms + 8, 14) : 0, fill: "rgba(16,185,129,.09)", w: 3 }];
  const count = Math.round(BIG_N * prog(f, A.file, 130));
  const seal = prog(f, A.speed + 10, 26);
  return (
    <SceneFx f={f} dur={1200} kind="expand">
      <Excel cam={camAt(f, [{ f: 0, z: 1.15, cx: 668, cy: 340 }, { f: 415, z: 1.15, cx: 668, cy: 340 }, { f: 425, z: 1.15, cx: 668, cy: 456 }, { f: 465, z: 1.15, cx: 668, cy: 456 }, { f: 475, z: 1.15, cx: 668, cy: 340 }, { f: 1200, z: 1.15, cx: 668, cy: 340 }])}
        file={XLSX_NAME} tab="formulas" nameBox={bottom ? "A50001" : f >= A.formula ? "H2" : "A1"} formula={done ? BIGF : typing ? tf : bottom ? all[BIG_N - 1].id : "Order ID"} editing={typing} statusLeft={typing ? "Enter" : "Ready"}
        grid={{ cols: cols5, rows, fixedHdr: false, lines: true, active: bottom ? { c: 0, slot: VIEW } : f >= A.formula ? { c: 7, slot: 1 } : { c: 0, slot: 0 }, boxes }}>
        {typing ? <CellEditor x={colX(cols5, 7)} y={slotY(1)} segs={argSegs(tf, [BLUE, AMB, PUR])} /> : null}
        {typing ? <FuncTip x={colX(cols5, 7)} y={slotY(2) + 4} name="FILTER" params={["array", "include", "[if_empty]"]} active={argIndex(tf)} /> : null}
        <Chip x={colX(cols5, 7)} y={slotY(29) - 52} text={`Spilled: ${num(vip.length)} rows × 6 columns  (Cairo AND Total > 10,000)`} color={C.green} t={prog(f, A.ms + 40, 12)} />
      </Excel>
      <div style={{ position: "absolute", right: 28, top: 92, background: "rgba(15,23,42,.92)", border: `1.5px solid ${C.blue}`, borderRadius: 12, padding: "8px 18px", fontFamily: F.mono, fontSize: 19, color: C.text, opacity: prog(f, A.file, 12), zIndex: 60 }}>tbl_Sales2026 · <span style={{ color: C.blue, fontWeight: 700 }}>{num(count)}</span> rows</div>
      <Seal t={seal} line1="Enterprise FILTER" line2={`${num(BIG_N)} صف · استخراج فوري`} />
      <KeyCaps keys={["Ctrl", "↓"]} f={f} from={404} hold={34} accent={C.blue} />
      <KeyCaps keys={["Enter"]} f={f} from={A.ms - 14} hold={40} accent={C.green} />
      <TopStrip f={f} badge={badge} lines={[{ from: 60, to: 540, text: "Enterprise FILTER Deployment → Extract Multi-Condition Records Across 50,000 Sales Rows", color: C.blue }, { from: 660, to: 1140, text: "Instant Dynamic Filtering → High-Speed Data Extraction Across 50,000 Rows", color: C.green }]} />
    </SceneFx>
  );
};

// ================= SC06: outro =================
export const Scene6: React.FC = () => {
  const f = useCurrentFrame(); const A = A6;
  const pr = prog(f, 60, 110);
  const skills = ["FILTER(array, include, [if_empty])", "AND (*) and OR (+) array logic", "if_empty → no #CALC! errors", "G2# spill reference + live KPIs"];
  const fadeOut = 1 - prog(f, 850, 50);
  const card: React.CSSProperties = { background: "rgba(30,41,59,.72)", border: "1.5px solid rgba(148,163,184,.35)", borderRadius: 28 };
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 20% 10%, #16324a 0%, ${C.slate} 55%)`, opacity: Math.min(prog(f, 0, 20), fadeOut) }}>
      <div style={{ position: "absolute", left: 90, top: 60, display: "flex", alignItems: "center", gap: 20, opacity: prog(f, 0, 20) }}>
        <Logo s={120} />
        <div><div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 46, color: C.text }}>منظومة أكاديمي | Manzooma Excel Masterclass</div><div style={{ fontFamily: F.ui, fontSize: 22, color: "#94A3B8", marginTop: 4 }}>Excel From Zero to Professional</div></div>
      </div>
      <div style={{ ...card, position: "absolute", left: 90, top: 200, width: 1010, height: 700, padding: 44, boxSizing: "border-box", opacity: prog(f, 20, 20), transform: `translateY(${(1 - prog(f, 20, 20)) * 24}px)` }}>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 38, color: C.text }}>Lesson 16 · Dynamic FILTER Engine</div>
        <div style={{ fontFamily: F.ar, fontSize: 28, color: "#CBD5E1", marginTop: 8, direction: "rtl", textAlign: "left" }}>الدرس السادس عشر | الوحدة الرابعة</div>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.text }}><span>Course progress · Lesson 16 of 76</span><span style={{ color: C.green }}>{Math.round(pr * (1600 / 76))}%</span></div>
        <div style={{ marginTop: 12, height: 26, borderRadius: 13, background: "#0B1220", overflow: "hidden", border: "1px solid #334155" }}><div style={{ width: `${pr * (1600 / 76)}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, #34D399)`, boxShadow: `0 0 18px ${C.green}` }} /></div>
        <div style={{ marginTop: 10, fontFamily: F.ui, fontSize: 20, color: "#94A3B8" }}>Unit 4 of 14 · Dynamic Arrays Engine · Lesson 2 of the unit</div>
        <div style={{ marginTop: 28 }}>
          {skills.map((s, i) => { const t = prog(f, 110 + i * 28, 16); return <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20, opacity: t, transform: `translateX(${(1 - t) * 30}px)`, fontFamily: F.ui, fontSize: 29, color: C.text }}><span style={{ color: C.green, fontWeight: 700, fontSize: 34 }}>✓</span>{s}</div>; })}
        </div>
        <div style={{ marginTop: 22, display: "flex", gap: 18, opacity: prog(f, A.sheet, 16) }}>
          <div style={{ background: C.slate, border: `1.5px solid ${C.blue}`, borderRadius: 12, padding: "10px 18px", fontFamily: F.mono, fontSize: 21, color: C.text }}>{XLSX_NAME}</div>
          <div style={{ background: C.slate, border: `1.5px solid ${C.green}`, borderRadius: 12, padding: "10px 18px", fontFamily: F.mono, fontSize: 21, color: C.green, opacity: prog(f, A.link, 16) }}>solutions.gomaaintelligence.me</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1150, top: 200, width: 680, display: "flex", flexDirection: "column", gap: 30 }}>
        <div style={{ ...card, height: 230, display: "flex", alignItems: "center", justifyContent: "center", gap: 28, opacity: prog(f, 190, 20), transform: `scale(${0.85 + 0.15 * prog(f, 190, 20)})` }}>
          <div style={{ width: 130, height: 130, borderRadius: 65, background: `radial-gradient(circle, ${C.green}, #047857)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76, color: C.slate, boxShadow: `0 0 40px ${C.green}88` }}>✓</div>
          <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: C.green, lineHeight: "38px" }}>Dynamic FILTER Engine<div style={{ fontWeight: 500, fontSize: 21, color: "#CBD5E1" }}>Lesson 16 mastered</div></div>
        </div>
        <div style={{ ...card, height: 440, padding: 34, boxSizing: "border-box", opacity: prog(f, A.l17 - 20, 20), transform: `translateY(${(1 - prog(f, A.l17 - 20, 20)) * 30}px)`, border: `1.5px solid ${C.blue}` }}>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.blue, letterSpacing: 1 }}>NEXT · LESSON 17 · UNIT 4</div>
          <div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 36, color: C.text, marginTop: 10, direction: "rtl", textAlign: "right", lineHeight: "50px" }}>الدرس 17: استخراج القيم الفريدة والفرز الديناميكي</div>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: "#CBD5E1", marginTop: 8 }}>UNIQUE · SORT · SORTBY</div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>{["=UNIQUE(C2:C100)", "=SORT(E2:E100, -1)", "=SORTBY(A2:E100, E2:E100, -1)"].map((t) => <div key={t} style={{ height: 46, borderRadius: 8, background: "#fff", border: `2px solid ${C.xGreen}`, display: "flex", alignItems: "center", padding: "0 16px", fontFamily: F.cell, fontSize: 24, fontWeight: 700, color: C.ink }}>{t}</div>)}</div>
        </div>
      </div>
    </div>
  );
};
