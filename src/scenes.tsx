import React from "react";
import { useCurrentFrame } from "remotion";
import { A1, A2, A3, A4, A5, A6 } from "./sync";
import { BIG_N, EDIT_AMT_ROW, EDIT_DUP_ROW, ROWS, bigDeal, bigPend, bigRows, dupSet, isAnd, isCairo, isOr, num, top10Set, withOv, type Row } from "./data";
import { Excel, F, buildCols, camAt, colX, lerp, prog, ribbonPos, slotY, typed, type Box, type Cell, type GRow } from "./kit";
import { CFMenu, CellEditor, KeyCaps, Logo, NewRuleDialog, RulesManager, SceneFx, Shield, TopStrip, type CFRule, type Seg } from "./kit_ui";
import { C, XLSX_NAME } from "./theme";

const W = [76, 72, 84, 76, 84];
const cols = buildCols(W);
const badge = "Lesson 23 / 76 · Unit 5 / 14";
const HEAD = ["Order ID", "Date", "Branch", "Amount", "Status"];
const AL = ["l", "r", "l", "r", "l"];
const win = (a: number, b: number, f: number, r = 8): number => prog(f, a, r) * (1 - prog(f, b, r));
const mkCells = (vals: (string | number)[], head?: boolean): Cell[] => vals.map((v, i) => ({ v, b: head, fill: head ? "#E2EFDA" : undefined, al: AL[i] === "r" ? "r" : "l" }));
const vals = (r: Row): (string | number)[] => [r.id, r.date, r.branch, num(r.amount), r.status];
const head: GRow = { id: "hd", hdr: 1, cells: mkCells(HEAD, true), slot: 0, h: 1 };
const tableRows = (data: Row[]): GRow[] => [head, ...data.slice(0, 30).map((r, i) => ({ id: "a" + r.n, hdr: i + 2, cells: mkCells(vals(r)), slot: i + 1, h: 1 }))];
const rgba = (c: string, a: number): string => { const m: Record<string, string> = { green: "16,185,129", amber: "245,158,11", blue: "56,189,248", purple: "168,85,247" }; return `rgba(${m[c]},${Math.max(0, Math.min(1, a))})`; };
const sweep = (f: number, start: number, n: number, c: number): number => prog(f, start + n * 2 + c * 4, 12);
const rowNum = (id: string | number): number => Number(String(id).slice(1));
const Chip: React.FC<{ x: number; y: number; text: string; color: string; t: number }> = ({ x, y, text, color, t }) => (
  t <= 0 ? null : <div style={{ position: "absolute", left: x, top: y, opacity: t, transform: `translateY(${(1 - t) * 8}px)`, background: C.slate, color: C.text, border: `2px solid ${color}`, borderRadius: 8, padding: "6px 12px", boxShadow: `0 0 14px ${color}88`, fontFamily: F.ui, fontWeight: 600, fontSize: 15, whiteSpace: "nowrap", zIndex: 45 }}>{text}</div>
);
const selBox = (t: number): Box => ({ c1: 0, c2: 4, s1: 1, s2: 99, color: C.xGreen, fill: "rgba(16,124,65,.08)", w: 2, t });
type SProps = { f: number; cam: ReturnType<typeof camAt>; tab?: string; nameBox: string; formula: string; rows: GRow[]; active: { c: number; slot: number }; boxes?: Box[]; cellFx?: (id: string | number, c: number) => string | undefined; children?: React.ReactNode };
const Sheet: React.FC<SProps> = (p) => (
  <Excel cam={p.cam} file="manzooma_sales_2026.xlsx" tab={p.tab ?? "home"} nameBox={p.nameBox} formula={p.formula} statusLeft="Ready"
    grid={{ cols, rows: p.rows, fixedHdr: true, lines: true, active: p.active, boxes: p.boxes, cellFx: p.cellFx }}>{p.children}</Excel>
);
const Seal: React.FC<{ t: number; line1: string; line2: string }> = ({ t, line1, line2 }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", right: 50, top: 300, width: 340, opacity: t, transform: `scale(${0.7 + 0.3 * t})`, zIndex: 60, textAlign: "center" }}>
      <div style={{ width: 170, height: 170, margin: "0 auto", borderRadius: 85, background: `radial-gradient(circle, ${C.green}33, ${C.slate})`, border: `4px solid ${C.green}`, boxShadow: `0 0 40px ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 92, color: C.green }}>✓</div>
      <div style={{ marginTop: 12, background: C.slate, border: `1.5px solid ${C.green}`, borderRadius: 12, padding: "8px 12px", fontFamily: F.ui, fontWeight: 700, fontSize: 21, color: C.text }}>{line1}</div>
      <div style={{ marginTop: 8, fontFamily: F.ar, fontWeight: 600, fontSize: 19, color: C.green, background: C.slate, borderRadius: 10, padding: "4px 10px" }}>{line2}</div>
    </div>
  )
);
const fSegs = (t: string, glow?: { s: string; bg: string; c: string }): Seg[] => {
  if (!glow) return [{ t }];
  const i = t.indexOf(glow.s);
  return i < 0 ? [{ t }] : [{ t: t.slice(0, i) }, { t: glow.s, bg: glow.bg, c: glow.c, b: true }, { t: t.slice(i + glow.s.length) }];
};
const NRX = 514, NRY = 150;
const camTable = { z: 1.2, cx: 560, cy: 420 }, camDlg = { z: 1.35, cx: 768, cy: 340 };

// ================= SC01: mixed references =================
export const Scene1: React.FC = () => {
  const f = useCurrentFrame(); const A = A1;
  const F1 = '=$C2="Cairo"';
  const tx = typed(F1, f, 745, 0.3);
  const dlg = win(738, 905, f, 12);
  const legacy = f >= A.instead && f < 892;
  const cp = ribbonPos("home", "cf");
  const cam = camAt(f, [{ f: 0, z: 1, cx: 768, cy: 403 }, { f: 480, z: 1, cx: 768, cy: 403 }, { f: 515, z: 1.6, cx: cp.x, cy: 150 }, { f: 700, z: 1.6, cx: cp.x, cy: 150 }, { f: 735, ...camDlg }, { f: 895, ...camDlg }, { f: 935, ...camTable }, { f: 1200, ...camTable }]);
  return (
    <SceneFx f={f} dur={1200} kind="fade">
      <Sheet f={f} cam={cam} nameBox="A2" formula={f >= 745 && f < 892 ? "" : "S-1001"} rows={tableRows(ROWS)} active={{ c: 0, slot: 1 }}
        boxes={[selBox(win(470, 900, f, 12))]}
        cellFx={(id, c) => {
          const n = rowNum(id); const r = ROWS[n]; if (!r) return undefined;
          if (legacy && c === 2 && isCairo(r)) return "rgba(250,204,21,.55)";
          if (f >= 892 && isCairo(r)) return rgba("green", 0.4 * sweep(f, 892, n, c));
          return undefined;
        }}>
        <CFMenu x={cp.x - 60} y={cp.y + 40} t={Math.max(win(A.cf + 30, 630, f, 10), win(690, 735, f, 8))} hover={f >= 570 && f < 630 ? "hl" : f >= 700 ? "new" : undefined} />
        <NewRuleDialog x={NRX} y={NRY} t={dlg} segs={fSegs(tx, f >= A.lock - 30 ? { s: "$", bg: "#38BDF8", c: "#0F172A" } : undefined)} preview="rgba(16,185,129,.55)" ok={f >= 880 && f < 892 ? 1 : 0} hiFormula={f >= A.lock - 30 && f < 900 ? C.blue : undefined} />
        <Chip x={colX(cols, 5) + 40} y={slotY(3)} text="Old way → colors only the cell" color={C.amber} t={win(A.instead + 6, 735, f, 10)} />
        <Chip x={NRX} y={NRY + 490} text="$C = lock the column   ·   2 = row moves down" color={C.blue} t={win(A.lock, 900, f, 10)} />
        <Chip x={colX(cols, 5) + 40} y={slotY(3)} text="Full row highlighted → easy visual review" color={C.green} t={prog(f, A.review - 20, 12)} />
      </Sheet>
      <TopStrip f={f} badge={badge} lines={[{ from: 60, to: 540, text: "الدرس 23 من 76 | الوحدة 5 من 14 → Conditional Formatting Formulas", ar: true }, { from: 660, to: 1140, text: 'Mixed References in CF → =$C2="Cairo" (Lock Column with $, Keep Row Dynamic)', color: C.blue }]} />
    </SceneFx>
  );
};

// ================= SC02: AND / OR =================
export const Scene2: React.FC = () => {
  const f = useCurrentFrame(); const A = A2;
  const T1 = '=AND($E2="Pending", $D2>=5000)', T2 = '=OR($C2="Cairo", $C2="Alex")';
  const d1 = win(300, 548, f, 12), d2 = win(625, 800, f, 12);
  const pulse = 1 + 0.12 * Math.sin(f / 9);
  const nAnd = ROWS.filter(isAnd).length, nOr = ROWS.filter(isOr).length;
  const cam = camAt(f, [{ f: 0, ...camTable }, { f: 290, ...camTable }, { f: 315, ...camDlg }, { f: 548, ...camDlg }, { f: 575, ...camTable }, { f: 620, ...camTable }, { f: 645, ...camDlg }, { f: 800, ...camDlg }, { f: 830, ...camTable }, { f: 1350, ...camTable }]);
  return (
    <SceneFx f={f} dur={1350} kind="zoom">
      <Sheet f={f} cam={cam} nameBox="A2" formula="S-1001" rows={tableRows(ROWS)} active={{ c: 0, slot: 1 }} boxes={[selBox(Math.max(win(290, 552, f, 10), win(615, 805, f, 10)))]}
        cellFx={(id, c) => {
          const n = rowNum(id); const r = ROWS[n]; if (!r) return undefined;
          if (f >= 800 && isOr(r)) return rgba("blue", 0.4 * sweep(f, 800, n, c) * (f > A.risk ? pulse : 1));
          if (f >= 556 && isAnd(r)) return rgba("amber", 0.5 * sweep(f, 556, n, c) * (f > A.risk ? pulse : 1));
          return undefined;
        }}>
        <Chip x={colX(cols, 5) + 40} y={slotY(1)} text="AND → ALL conditions true   ·   OR → ANY condition true" color={C.green} t={win(A.andor, 330, f, 10) * (1 - d1)} />
        <NewRuleDialog x={NRX} y={NRY} t={d1} segs={fSegs(typed(T1, f, 330, 0.3), { s: "AND", bg: "#F59E0B", c: "#0F172A" })} preview="rgba(245,158,11,.6)" ok={f >= 538 && f < 548 ? 1 : 0} hiFormula={C.amber} />
        <NewRuleDialog x={NRX} y={NRY} t={d2} segs={fSegs(typed(T2, f, A.orfn, 0.35), { s: "OR", bg: "#38BDF8", c: "#0F172A" })} preview="rgba(56,189,248,.6)" ok={f >= 790 && f < 800 ? 1 : 0} hiFormula={C.blue} />
        <Chip x={colX(cols, 5) + 40} y={slotY(3)} text={`AND → ${nAnd} of 99 rows are Pending and ≥ 5,000`} color={C.amber} t={prog(f, 580, 12) * (1 - d2)} />
        <Chip x={colX(cols, 5) + 40} y={slotY(6)} text={`OR → ${nOr} of 99 rows are Cairo or Alex`} color={C.blue} t={prog(f, 820, 12)} />
        <Chip x={colX(cols, 5) + 40} y={slotY(9)} text="Newest rule = highest priority (blue wins on overlap)" color={C.green} t={prog(f, A.risk + 20, 12)} />
      </Sheet>
      <TopStrip f={f} badge={badge} lines={[{ from: 60, to: 600, text: 'Multi-Condition CF Formulas → =AND($E2="Pending", $D2>=5000)', color: C.amber }, { from: 720, to: 1260, text: "Complex Highlighting → Combines Multiple Logical Criteria for Precision Visual Auditing", color: C.green }]} />
    </SceneFx>
  );
};

// ================= SC03: COUNTIF & LARGE =================
export const Scene3: React.FC = () => {
  const f = useCurrentFrame(); const A = A3;
  const T1 = "=COUNTIF($A$2:$A$100, $A2)>1", T2 = "=$D2>=LARGE($D$2:$D$100, 10)";
  const idDone = f >= A.enter + 40, amtDone = f >= A.edit + 40;
  const dupId = ROWS[3].id;
  const data = withOv({ idAt: idDone ? [EDIT_DUP_ROW, dupId] : undefined, amtAt: amtDone ? [EDIT_AMT_ROW, 99999] : undefined });
  const dupBase = dupSet(ROWS), dupNew = dupSet(withOv({ idAt: [EDIT_DUP_ROW, dupId] }));
  const topBase = top10Set(ROWS), topNew = top10Set(withOv({ amtAt: [EDIT_AMT_ROW, 99999] }));
  const dupA = (n: number): number => { const b = dupBase.has(n), w = dupNew.has(n); return !idDone ? (b ? 1 : 0) : b ? 1 : w ? prog(f, A.enter + 40, 14) : 0; };
  const topA = (n: number): number => { const b = topBase.has(n), w = topNew.has(n); return !amtDone ? (b ? 1 : 0) : b && w ? 1 : w ? prog(f, A.edit + 40, 14) : b ? 1 - prog(f, A.edit + 40, 14) : 0; };
  const d1 = win(310, 448, f, 12), d2 = win(625, 765, f, 12);
  const cam = camAt(f, [{ f: 0, ...camTable }, { f: 300, ...camTable }, { f: 320, ...camDlg }, { f: 448, ...camDlg }, { f: 478, ...camTable }, { f: 620, ...camTable }, { f: 640, ...camDlg }, { f: 765, ...camDlg }, { f: 795, ...camTable }, { f: 1350, ...camTable }]);
  const edRow = EDIT_DUP_ROW + 1, amRow = EDIT_AMT_ROW + 1;
  const typingId = f >= A.enter && f < A.enter + 40, typingAmt = f >= A.edit && f < A.edit + 40;
  return (
    <SceneFx f={f} dur={1350} kind="left">
      <Sheet f={f} cam={cam} nameBox={typingId ? "A13" : typingAmt ? "D" + (EDIT_AMT_ROW + 2) : "A2"} formula={typingId ? typed(dupId, f, A.enter, 0.2) : typingAmt ? typed("99999", f, A.edit, 0.15) : "S-1001"}
        rows={tableRows(data)} active={typingId ? { c: 0, slot: edRow } : typingAmt ? { c: 3, slot: amRow } : { c: 0, slot: 1 }} boxes={[selBox(Math.max(win(300, 452, f, 10), win(615, 770, f, 10)))]}
        cellFx={(id, c) => {
          const n = rowNum(id); if (!data[n]) return undefined;
          const g = f >= 770 ? topA(n) * 0.5 * sweep(f, 770, n, c) : 0;
          const p = f >= 450 ? dupA(n) * 0.5 * sweep(f, 450, n, c) : 0;
          if (g > 0.02 && g >= p * 0.9) return rgba("green", g);
          if (p > 0.02) return rgba("purple", p);
          return g > 0.02 ? rgba("green", g) : undefined;
        }}>
        {typingId ? <CellEditor x={colX(cols, 0)} y={slotY(edRow)} segs={[{ t: typed(dupId, f, A.enter, 0.2) }]} /> : null}
        {typingAmt ? <CellEditor x={colX(cols, 3)} y={slotY(amRow)} segs={[{ t: typed("99999", f, A.edit, 0.15) }]} /> : null}
        <NewRuleDialog x={NRX} y={NRY} t={d1} segs={fSegs(typed(T1, f, 335, 0.3), { s: "COUNTIF", bg: "#A855F7", c: "#fff" })} preview="rgba(168,85,247,.55)" ok={f >= 438 && f < 448 ? 1 : 0} hiFormula={C.purple} />
        <NewRuleDialog x={NRX} y={NRY} t={d2} segs={fSegs(typed(T2, f, 650, 0.3), { s: "LARGE", bg: "#10B981", c: "#0F172A" })} preview="rgba(16,185,129,.55)" ok={f >= 755 && f < 765 ? 1 : 0} hiFormula={C.green} />
        <Chip x={NRX} y={NRY + 490} text="$A$2:$A$100 stays fixed   ·   $A2 moves with each row" color={C.purple} t={win(350, 445, f, 10)} />
        <Chip x={colX(cols, 5) + 40} y={slotY(2)} text={`Duplicate Order IDs → ${dupBase.size} rows`} color={C.purple} t={win(470, 560, f, 10)} />
        <Chip x={colX(cols, 5) + 40} y={slotY(2)} text="Type a duplicate ID → the row lights up instantly" color={C.purple} t={win(A.enter + 20, A.enter + 140, f, 10)} />
        <Chip x={colX(cols, 5) + 40} y={slotY(5)} text="LARGE(range, 10) = the 10th biggest amount" color={C.green} t={win(A.top10, 880, f, 10) * (1 - d2)} />
        <Chip x={colX(cols, 5) + 40} y={slotY(8)} text="Colors update automatically as numbers change" color={C.green} t={win(A.auto, 1080, f, 10)} />
      </Sheet>
      <TopStrip f={f} badge={badge} lines={[{ from: 90, to: 630, text: "Dynamic Duplicate Formatting → =COUNTIF($A$2:$A$100, $A2)>1 Highlights Full Duplicate Rows", color: C.purple }, { from: 750, to: 1290, text: "Top 10 Dynamic Ranking → =$D2>=LARGE($D$2:$D$100, 10) Highlights Top Performers Dynamically", color: C.green }]} />
    </SceneFx>
  );
};

// ================= SC04: Rules Manager =================
export const Scene4: React.FC = () => {
  const f = useCurrentFrame(); const A = A4;
  const topS = top10Set(ROWS), dupS = dupSet(ROWS);
  const fixed1 = f >= 600, fixedAll = f >= 612;
  const typedRange = f < 565 ? "=$A:$A" : f < 600 ? typed("=$A$2:$E$1000", f, 565, 0.45) : "=$A$2:$E$1000";
  const bad = win(A.biggest, 600, f, 10);
  const rules: CFRule[] = [
    { formula: "=$D2>=LARGE($D$2:$D$100,10)", color: "rgba(16,185,129,.55)", applies: fixed1 ? "=$A$2:$E$1000" : typedRange, appliesHi: fixed1 ? C.green : f >= A.biggest ? C.red : undefined, stop: f >= 700, stopHi: f >= A.stop && f < A.stop + 90 ? C.green : undefined },
    { formula: "=COUNTIF($A$2:$A$100,$A2)>1", color: "rgba(168,85,247,.55)", applies: fixedAll ? "=$A$2:$E$1000" : "=$A:$A", appliesHi: fixedAll ? C.green : f >= A.biggest ? C.red : undefined, stop: f >= 715, stopHi: f >= A.stop + 20 && f < A.stop + 90 ? C.green : undefined },
    { formula: '=OR($C2="Cairo",$C2="Alex")', color: "rgba(56,189,248,.55)", applies: fixedAll ? "=$A$2:$E$1000" : "=$A:$A", appliesHi: fixedAll ? C.green : f >= A.biggest ? C.red : undefined, stop: false },
  ];
  const mT = Math.max(win(A.rm - 36, A.rm + 24, f, 8), 0);
  const cam = camAt(f, [{ f: 0, ...camTable }, { f: A.rm - 40, ...camTable }, { f: A.rm + 20, z: 1.25, cx: 768, cy: 400 }, { f: 1200, z: 1.25, cx: 768, cy: 400 }]);
  const cp = ribbonPos("home", "cf");
  return (
    <SceneFx f={f} dur={1200} kind="down">
      <Sheet f={f} cam={cam} nameBox="A2" formula="S-1001" rows={tableRows(ROWS)} active={{ c: 0, slot: 1 }}
        cellFx={(id, c) => { const n = rowNum(id); const r = ROWS[n]; if (!r) return undefined; if (topS.has(n)) return rgba("green", 0.45); if (dupS.has(n)) return rgba("purple", 0.45); if (isOr(r)) return rgba("blue", 0.3); return c < 0 ? undefined : undefined; }}>
        <CFMenu x={cp.x - 60} y={cp.y + 40} t={mT} hover="mgr" />
        <RulesManager x={408} y={190} t={win(A.rm + 24, 1190, f, 12)} rules={rules} selected={0} arrows={f >= A.clash && f < A.clash + 100 ? C.amber : undefined} />
        <Chip x={408} y={590} text="=$A:$A → 1,048,576 rows checked by every rule" color={C.red} t={win(A.cola, A.fix, f, 10) * (1 - prog(f, 600, 6))} />
        <Chip x={408} y={590} text="Whole-column rules make the file heavier and slower to scroll" color={C.red} t={win(A.ram, A.fix, f, 10)} />
        <Chip x={408} y={590} text="Exact range: rows 2–1000 × columns A–E only" color={C.green} t={win(A.range, 700, f, 10)} />
        <Chip x={408} y={636} text="Range starts at row 2 → matches the row in $C2" color={C.green} t={win(A.range + 40, 700, f, 10)} />
        <Chip x={408} y={590} text="Stop If True → lower rules are skipped once this one matches" color={C.green} t={win(A.stop + 10, A.clash, f, 10)} />
        <Chip x={408} y={590} text="Top rule wins · ▲ ▼ change the priority order" color={C.amber} t={win(A.clash, 880, f, 10)} />
        <Shield x={408} y={676} t={prog(f, A.rocket, 14)} label="Optimized rules: exact ranges + clear priority" color={C.green} />
      </Sheet>
      <TopStrip f={f} badge={badge} lines={[{ from: 60, to: 540, text: "Rules Manager Control → Avoid Full Column References (e.g. A:A) to Prevent Workbook Lag", color: C.red }, { from: 660, to: 1140, text: "Stop If True & Priority → Set Specific Ranges ($A$2:$E$1000) & Control Rule Execution Hierarchy", color: C.green }]} />
    </SceneFx>
  );
};

// ================= SC05: 50,000 rows =================
const VIEW = 26;
export const Scene5: React.FC = () => {
  const f = useCurrentFrame(); const A = A5;
  const all = bigRows();
  const bottom = (f >= 430 && f < 480) || (f >= 606 && f < 660);
  const off = bottom ? BIG_N - VIEW : 0;
  const view = all.slice(off, off + VIEW);
  const nDeal = React.useMemo(() => all.filter(bigDeal).length, [all]);
  const nPend = React.useMemo(() => all.filter(bigPend).length, [all]);
  const rows: GRow[] = [head, ...view.map((r, k) => ({ id: "s" + k, hdr: r.n + 2, cells: mkCells(vals(r)), slot: k + 1, h: 1 }))];
  const count = Math.round(BIG_N * prog(f, A.file, 130));
  const seal = prog(f, A.light + 10, 26);
  const cam = camAt(f, [{ f: 0, z: 1.15, cx: 668, cy: 340 }, { f: 424, z: 1.15, cx: 668, cy: 340 }, { f: 434, z: 1.15, cx: 668, cy: 456 }, { f: 476, z: 1.15, cx: 668, cy: 456 }, { f: 486, z: 1.15, cx: 668, cy: 340 }, { f: 600, z: 1.15, cx: 668, cy: 340 }, { f: 610, z: 1.15, cx: 668, cy: 456 }, { f: 656, z: 1.15, cx: 668, cy: 456 }, { f: 666, z: 1.15, cx: 668, cy: 340 }, { f: 1200, z: 1.15, cx: 668, cy: 340 }]);
  const x0 = colX(cols, 5) + 40;
  return (
    <SceneFx f={f} dur={1200} kind="expand">
      <Sheet f={f} cam={cam} nameBox={bottom ? "A50001" : "A2"} formula={bottom ? all[BIG_N - 1].id : all[0].id} rows={rows} active={bottom ? { c: 0, slot: VIEW } : { c: 0, slot: 1 }}
        cellFx={(id, c) => {
          const k = Number(String(id).slice(1)); const r = view[k]; if (!r || f < A.codes) return undefined;
          const a = sweep(f, A.codes, k, c);
          if (bigDeal(r)) return rgba("green", 0.42 * a);
          if (bigPend(r)) return rgba("amber", 0.5 * a);
          return undefined;
        }}>
        <Chip x={x0} y={slotY(1)} text='Rule 1 → =$D2>=10000   (big deals)' color={C.green} t={prog(f, A.codes, 12)} />
        <Chip x={x0} y={slotY(4)} text='Rule 2 → =AND($E2="Pending", $D2>=5000)' color={C.amber} t={prog(f, A.codes + 20, 12)} />
        <Chip x={x0} y={slotY(7)} text="Applies to → $A$2:$E$50001  (exact range)" color={C.blue} t={prog(f, A.codes + 40, 12)} />
        <Chip x={x0} y={slotY(11)} text={`Rule 1 matches ${num(nDeal)} rows   ·   Rule 2 matches ${num(nPend)} rows`} color={C.green} t={prog(f, A.ms - 20, 12)} />
      </Sheet>
      <div style={{ position: "absolute", right: 28, top: 92, background: "rgba(15,23,42,.92)", border: `1.5px solid ${C.blue}`, borderRadius: 12, padding: "8px 18px", fontFamily: F.mono, fontSize: 19, color: C.text, opacity: prog(f, A.file, 12), zIndex: 60 }}>manzooma_sales_2026 · <span style={{ color: C.blue, fontWeight: 700 }}>{num(count)}</span> rows</div>
      <Seal t={seal} line1="Enterprise Formatting" line2={`${num(BIG_N)} صف · تلوين فوري`} />
      <KeyCaps keys={["Ctrl", "↓"]} f={f} from={414} hold={34} accent={C.blue} />
      <KeyCaps keys={["Ctrl", "↓"]} f={f} from={590} hold={34} accent={C.blue} />
      <TopStrip f={f} badge={badge} lines={[{ from: 60, to: 540, text: "Enterprise Visual Auditing → Highlight 50,000 Sales Rows Dynamically via Formulas", color: C.blue }, { from: 660, to: 1140, text: "Zero Performance Lag → Optimized Formatting Rules & Fast Visual Scanning Across 50,000 Rows", color: C.green }]} />
    </SceneFx>
  );
};

// ================= SC06: outro =================
export const Scene6: React.FC = () => {
  const f = useCurrentFrame(); const A = A6;
  const pr = prog(f, 60, 110);
  const pct = (23 / 76) * 100;
  const skills = ["Full-row rules with mixed references · $C2", "AND / OR formula rules", "COUNTIF duplicates + LARGE Top 10", "Rules Manager · exact ranges + Stop If True"];
  const fadeOut = 1 - prog(f, 850, 50);
  const card: React.CSSProperties = { background: "rgba(30,41,59,.72)", border: "1.5px solid rgba(148,163,184,.35)", borderRadius: 28 };
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 20% 10%, #16324a 0%, ${C.slate} 55%)`, opacity: Math.min(prog(f, 0, 20), fadeOut) }}>
      <div style={{ position: "absolute", left: 90, top: 60, display: "flex", alignItems: "center", gap: 20, opacity: prog(f, 0, 20) }}>
        <Logo s={120} />
        <div><div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 46, color: C.text }}>منظومة أكاديمي | Manzooma Excel Masterclass</div><div style={{ fontFamily: F.ui, fontSize: 22, color: "#94A3B8", marginTop: 4 }}>Excel From Zero to Professional</div></div>
      </div>
      <div style={{ ...card, position: "absolute", left: 90, top: 200, width: 1010, height: 700, padding: 44, boxSizing: "border-box", opacity: prog(f, 20, 20), transform: `translateY(${(1 - prog(f, 20, 20)) * 24}px)` }}>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 38, color: C.text }}>Lesson 23 · Conditional Formatting Formulas</div>
        <div style={{ fontFamily: F.ar, fontSize: 28, color: "#CBD5E1", marginTop: 8, direction: "rtl", textAlign: "left" }}>الدرس الثالث والعشرون | الوحدة الخامسة</div>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.text }}><span>Course progress · Lesson 23 of 76</span><span style={{ color: C.green }}>{Math.round(pr * pct)}%</span></div>
        <div style={{ marginTop: 12, height: 26, borderRadius: 13, background: "#0B1220", overflow: "hidden", border: "1px solid #334155" }}><div style={{ width: `${pr * pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, #34D399)`, boxShadow: `0 0 18px ${C.green}` }} /></div>
        <div style={{ marginTop: 10, fontFamily: F.ui, fontSize: 20, color: "#94A3B8" }}>Unit 5 of 14 · Data Quality & Conditional Rules · Lesson 2 of the unit</div>
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
          <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: C.green, lineHeight: "38px" }}>CF Formulas Engine<div style={{ fontWeight: 500, fontSize: 21, color: "#CBD5E1" }}>Lesson 23 mastered</div></div>
        </div>
        <div style={{ ...card, height: 440, padding: 34, boxSizing: "border-box", opacity: prog(f, A.l24 - 20, 20), transform: `translateY(${(1 - prog(f, A.l24 - 20, 20)) * 30}px)`, border: `1.5px solid ${C.blue}` }}>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.blue, letterSpacing: 1 }}>NEXT · LESSON 24 · UNIT 5</div>
          <div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 36, color: C.text, marginTop: 10, direction: "rtl", textAlign: "right", lineHeight: "50px" }}>الدرس 24: أدوات التنظيف السريع</div>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: "#CBD5E1", marginTop: 8 }}>Flash Fill · Text to Columns · Remove Duplicates</div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>{["Flash Fill  Ctrl + E", "Text to Columns", "Remove Duplicates"].map((t) => <div key={t} style={{ height: 46, borderRadius: 8, background: "#fff", border: `2px solid ${C.xGreen}`, display: "flex", alignItems: "center", padding: "0 16px", fontFamily: F.ui, fontSize: 22, fontWeight: 700, color: C.ink }}>{t}</div>)}</div>
        </div>
      </div>
    </div>
  );
};
