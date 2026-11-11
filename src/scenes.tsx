import React from "react";
import { useCurrentFrame } from "remotion";
import { A1, A2, A3, A4, A5, A6, SCENES } from "./sync";
import { BIG_N, MATRIX, PRICES, PRICES2, REGIONS, TAXES, TAXES2, bigNetTotal, bigRow, calcNet, colMax, colMaxRow, fmt2, num, pct, rowSum } from "./data";
import { Excel, F, buildCols, camAt, colX, lerp, prog, ribbonPos, slotY, typed, type Box, type Cell, type Col, type GRow } from "./kit";
import { CellEditor, FuncTip, KeyCaps, Logo, NameManager, NewNameDialog, SceneFx, TopStrip, argIndex, type Seg } from "./kit_ui";
import { C, XLSX_NAME } from "./theme";

const badge = "Lesson 42 / 76 · Unit 8 / 14";
const BLUE = "#2B7CD3", AMB = "#B45309", GRN = "#0B7A4B";
const win = (a: number, b: number, f: number, r = 8): number => prog(f, a, r) * (1 - prog(f, b, r));
const D = SCENES.map((s) => s.end - s.start);
const sl = (d: number, f: number, a: string, b: string, ca: string, cb: string, arAr = false): React.ReactNode => (
  <TopStrip f={f} badge={badge} lines={[{ from: 60, to: Math.round(d * 0.45), text: a, color: ca, ar: arAr }, { from: Math.round(d * 0.55), to: Math.round(d * 0.95), text: b, color: cb }]} />
);
const Chip: React.FC<{ x: number; y: number; text: string; color: string; t: number; mono?: boolean }> = ({ x, y, text, color, t, mono }) => (
  t <= 0 ? null : <div style={{ position: "absolute", left: x, top: y, opacity: t, transform: `translateY(${(1 - t) * 8}px)`, background: C.slate, color: C.text, border: `2px solid ${color}`, borderRadius: 8, padding: "6px 12px", boxShadow: `0 0 14px ${color}88`, fontFamily: mono ? F.mono : F.ui, fontWeight: 600, fontSize: mono ? 14 : 15, whiteSpace: "nowrap", zIndex: 45 }}>{text}</div>
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
const cell = (v: string | number, o: Partial<Cell> = {}): Cell => ({ v, ...o });
const HF = "#E2EFDA";
const sliceSegs = (full: Seg[], n: number): Seg[] => { let left = n; const out: Seg[] = []; for (const s of full) { if (left <= 0) break; out.push({ ...s, t: s.t.slice(0, left) }); left -= s.t.length; } return out; };
const segText = (s: Seg[]): string => s.map((x) => x.t).join("");
type SP = { cam: ReturnType<typeof camAt>; tab?: string; nameBox: string; formula: string; editing?: boolean; cols: Col[]; rows: GRow[]; active: { c: number; slot: number } | null; boxes?: Box[]; cellFx?: (id: string | number, c: number) => string | undefined; sheet?: string; glow?: { id: string; color: string; t: number }; children?: React.ReactNode; fixedHdr?: boolean };
const Sheet: React.FC<SP> = (p) => (
  <Excel cam={p.cam} file="manzooma_sales_2026.xlsx" tab={p.tab ?? "formulas"} glow={p.glow} nameBox={p.nameBox} formula={p.formula} editing={p.editing} statusLeft={p.editing ? "Enter" : "Ready"} sheets={["Sales", "Invoices"]} sheet={p.sheet ?? "Sales"}
    grid={{ cols: p.cols, rows: p.rows, fixedHdr: p.fixedHdr ?? true, lines: true, active: p.active, boxes: p.boxes, cellFx: p.cellFx }}>{p.children}</Excel>
);
const colsPT = buildCols([90, 70, 120]);
const ptRows = (prices: number[], taxes: number[], net: (i: number) => string | undefined, h: (i: number) => number = () => 1): GRow[] => [
  { id: "h", hdr: 1, slot: 0, h: 1, cells: [cell("Price", { b: true, fill: HF, al: "r" }), cell("Tax", { b: true, fill: HF, al: "r" }), cell("Net", { b: true, fill: HF, al: "r" })] },
  ...prices.map((p, i) => { const n = net(i); const cs: Cell[] = [cell(num(p), { al: "r" }), cell(pct(taxes[i]), { al: "r" })]; if (n !== undefined) cs[2] = cell(n, { al: "r" }); return { id: "r" + i, hdr: i + 2, slot: i + 1, h: h(i), cells: cs }; }),
];
const cx = (cols: Col[], c: number, slot: number): { x: number; y: number } => ({ x: colX(cols, c), y: slotY(slot) });
const camA = { z: 1, cx: 768, cy: 403 };

// ================= SC01: LAMBDA basics =================
const L1: Seg[] = [{ t: "=LAMBDA(" }, { t: "price, tax", c: BLUE }, { t: ", " }, { t: "price*(1+tax)", c: AMB }, { t: ")(" }, { t: "A2, B2", c: GRN }, { t: ")" }];
export const Scene1: React.FC = () => {
  const f = useCurrentFrame(); const A = A1;
  const n = Math.max(0, Math.floor((f - 860) * 0.5));
  const typing = f >= 860 && f < 956, done = f >= 956;
  const segs = sliceSegs(L1, n);
  const c2 = cx(colsPT, 2, 1);
  const cam = camAt(f, [{ f: 0, ...camA }, { f: 540, ...camA }, { f: 580, z: 1.3, cx: 520, cy: 340 }, { f: 1200, z: 1.3, cx: 520, cy: 340 }]);
  const boxes: Box[] = [{ c1: 0, c2: 0, s1: 1, s2: 1, color: C.green, t: done ? win(956, 1100, f, 10) : 0 }, { c1: 1, c2: 1, s1: 1, s2: 1, color: C.green, t: done ? win(956, 1100, f, 10) : 0 }, { c1: 2, c2: 2, s1: 1, s2: 1, color: C.blue, t: done ? prog(f, 956, 12) : 0, w: 3 }];
  return (
    <SceneFx f={f} dur={D[0]} kind="fade">
      <Sheet cam={cam} nameBox="C2" formula={done ? segText(L1) : typing ? segText(segs) : ""} editing={typing} cols={colsPT} rows={ptRows(PRICES, TAXES, (i) => (i === 0 && done ? fmt2(calcNet(PRICES[0], TAXES[0])) : undefined))} active={{ c: 2, slot: 1 }} boxes={boxes}
        glow={{ id: "insfn", color: C.blue, t: win(A.lambda, A.instead, f, 10) * 0.8 }}>
        <Chip x={420} y={slotY(1)} text="=LAMBDA( parameters… , calculation )" color={C.blue} t={win(A.lambda, A.instead, f, 10)} mono />
        <Chip x={420} y={slotY(1)} text="=IF(B2=0.14, A2*1.14, IF(B2=0.05, A2*1.05, A2))  ← long & repeated" color={C.amber} t={win(A.instead, A.vba, f, 10)} mono />
        <div style={{ position: "absolute", left: 420, top: slotY(1), width: 420, background: C.slate, border: `2px solid ${C.red}`, borderRadius: 10, padding: "10px 14px", boxShadow: `0 0 16px ${C.red}88`, opacity: win(A.vba, 880, f, 10), fontFamily: F.mono, fontSize: 14, color: "#FCA5A5", lineHeight: "21px", zIndex: 45 }}>
          Sub CalcNet()<br />&nbsp;&nbsp;For i = 2 To 11<br />&nbsp;&nbsp;&nbsp;&nbsp;Cells(i, 3) = Cells(i, 1) * (1 + Cells(i, 2))<br />&nbsp;&nbsp;Next i<br />End Sub
          <div style={{ fontFamily: F.ui, fontWeight: 700, color: C.text, marginTop: 6 }}>VBA macro = more code to maintain</div>
        </div>
        {typing ? <CellEditor x={c2.x} y={c2.y} segs={segs} /> : null}
        {typing ? <FuncTip x={c2.x} y={c2.y + 24} name="LAMBDA" params={["[parameter1]", "[parameter2]", "…", "calculation"]} active={Math.min(3, argIndex(segText(segs)))} /> : null}
        <Chip x={420} y={slotY(4)} text="(…)(A2, B2) → test the function right inside the cell" color={C.blue} t={prog(f, A.end - 10, 12)} />
        <Chip x={420} y={slotY(7)} text="Result = 1,200 × (1 + 14%) = 1,368.00" color={C.green} t={prog(f, 980, 12)} />
      </Sheet>
      {sl(D[0], f, "الدرس 42 من 76 | الوحدة 8 من 14 → LAMBDA & MAP Engine", "Native Functions → =LAMBDA(x, y, x*(1+y))(A2, B2) (Zero VBA Required)", C.blue, C.blue, true)}
      <KeyCaps keys={["Enter"]} f={f} from={940} hold={40} accent={C.blue} />
    </SceneFx>
  );
};

// ================= SC02: Name Manager =================
export const Scene2: React.FC = () => {
  const f = useCurrentFrame(); const A = A2;
  const nmT = win(235, 462, f, 12), nnT = win(270, 428, f, 12);
  const nameTxt = typed("CalculateNet", f, 276, 0.25);
  const REF = "=LAMBDA(price, tax, price*(1+tax))";
  const refTxt = typed(REF, f, 330, 0.5);
  const saved = f >= 428;
  const call = "=CalculateNet(A2, B2)";
  const ct = typed(call, f, 470, 0.45);
  const typing = f >= 470 && f < 545;
  const net = (i: number): string | undefined => (f >= 545 + (i === 0 ? 0 : 30 + i * 5) ? fmt2(calcNet(PRICES[i], TAXES[i])) : undefined);
  const inv = f >= 900;
  const np = ribbonPos("formulas", "namemgr");
  const cam = camAt(f, [{ f: 0, ...camA }, { f: 150, ...camA }, { f: 175, z: 1.6, cx: np.x, cy: 150 }, { f: 228, z: 1.6, cx: np.x, cy: 150 }, { f: 255, z: 1.3, cx: 768, cy: 330 }, { f: 462, z: 1.3, cx: 768, cy: 330 }, { f: 495, z: 1.3, cx: 520, cy: 340 }, { f: 1173, z: 1.3, cx: 520, cy: 340 }]);
  const c2 = cx(colsPT, 2, 1);
  const rows = inv ? ptRows(PRICES2, TAXES2, (i) => fmt2(calcNet(PRICES2[i], TAXES2[i])), (i) => prog(f, 905 + i * 4, 8)) : ptRows(PRICES, TAXES, net);
  return (
    <SceneFx f={f} dur={D[1]} kind="left">
      <Sheet cam={cam} nameBox="C2" formula={typing ? ct : f >= 545 ? "=CalculateNet(A2, B2)" : ""} editing={typing} cols={colsPT} rows={rows} active={{ c: 2, slot: 1 }} sheet={inv ? "Invoices" : "Sales"}
        glow={{ id: "namemgr", color: C.green, t: win(A.nm - 6, 236, f, 10) }}
        boxes={[{ c1: 2, c2: 2, s1: 1, s2: 10, color: C.green, t: f >= 575 && !inv ? win(575, 760, f, 10) : 0, fill: "rgba(16,185,129,.08)", w: 3 }]}>
        <Chip x={420} y={slotY(1)} text="Save the LAMBDA once → reuse it everywhere" color={C.blue} t={win(A.save, 175, f, 10)} />
        <NameManager x={420} y={170} t={nmT} newPress={f >= 256 && f < 270 ? 1 : 0} closePress={f >= 452 && f < 462 ? 1 : 0} names={saved ? [{ name: "CalculateNet", refers: REF, hi: f < 460 ? C.green : undefined }] : []} />
        <NewNameDialog x={530} y={240} t={nnT} name={nameTxt} refers={[{ t: refTxt }]} hiName={f < 330 ? C.green : undefined} hiRefers={f >= 330 ? C.green : undefined} ok={f >= 414 && f < 428 ? 1 : 0} />
        {typing ? <CellEditor x={c2.x} y={c2.y} segs={[{ t: ct }]} /> : null}
        {typing ? <FuncTip x={c2.x} y={c2.y + 24} name="CalculateNet" params={["price", "tax"]} active={Math.min(1, argIndex(ct))} /> : null}
        <Chip x={420} y={slotY(2)} text="CalculateNet = a real, official function in this workbook" color={C.green} t={win(A.native, 470, f, 10)} />
        <Chip x={420} y={slotY(4)} text="Pass the variables directly: =CalculateNet(A2, B2)" color={C.amber} t={win(A.vars, 760, f, 10)} />
        <Chip x={420} y={slotY(8)} text="Cleaner sheets · easier to maintain" color={C.green} t={win(A.arch, 900, f, 10)} />
        <Chip x={420} y={slotY(1)} text="Same function in the Invoices sheet — no code copied" color={C.green} t={prog(f, 920, 12)} />
      </Sheet>
      {sl(D[1], f, "Custom Function Storage → Name Manager → CalculateNet = LAMBDA(price, tax, ...)", "Native Call → =CalculateNet(A2, B2) Invokes Custom Logic Across the Workbook", C.green, C.green)}
    </SceneFx>
  );
};

// ================= SC03: MAP =================
export const Scene3: React.FC = () => {
  const f = useCurrentFrame(); const A = A3;
  const M = "=MAP(A2:A11, B2:B11, LAMBDA(p, t, CalculateNet(p, t)))";
  const mt = typed(M, f, 331, 0.45);
  const typing = f >= 331 && f < 612, done = f >= 612;
  const edit = f >= 1160 && f < 1215, edited = f >= 1215;
  const price = (i: number): number => (edited && i === 2 ? 5000 : PRICES[i]);
  const hit = (i: number): number => 612 + i * 9;
  const net = (i: number): string | undefined => (done && f >= hit(i) + 4 ? fmt2(calcNet(price(i), TAXES[i])) : undefined);
  const tr = done && f < 612 + 10 * 9 ? Math.min(9, Math.floor((f - 612) / 9)) : -1;
  const c2 = cx(colsPT, 2, 1);
  const rows = ptRows(PRICES.map((_, i) => price(i)), TAXES, net);
  const boxes: Box[] = [
    { c1: 0, c2: 1, s1: Math.max(0, tr) + 1, s2: Math.max(0, tr) + 1, color: C.purple, t: tr >= 0 ? 1 : 0, w: 3 },
    { c1: 2, c2: 2, s1: 1, s2: 10, color: C.amber, t: f >= 700 ? prog(f, 700, 14) : 0, fill: "rgba(245,158,11,.08)", w: 3 },
  ];
  const cam = camAt(f, [{ f: 0, z: 1.3, cx: 520, cy: 340 }, { f: 1356, z: 1.3, cx: 520, cy: 340 }]);
  return (
    <SceneFx f={f} dur={D[2]} kind="down">
      <Sheet cam={cam} nameBox={edit ? "A4" : "C2"} formula={edit ? typed("5000", f, 1160, 0.12) : done ? M : typing ? mt : ""} editing={typing || edit} cols={colsPT} rows={rows} active={edit ? { c: 0, slot: 3 } : { c: 2, slot: 1 }} boxes={boxes}
        cellFx={(id, c) => { const k = Number(String(id).slice(1)); if (c === 2 && f >= hit(k) + 4 && f < hit(k) + 40 && String(id)[0] === "r") return `rgba(245,158,11,${0.5 * win(hit(k) + 4, hit(k) + 40, f, 6)})`; if (c === 2 && edited && k === 2) return `rgba(245,158,11,${0.5 * win(1215, 1280, f, 8)})`; return undefined; }}>
        {typing ? <CellEditor x={c2.x} y={c2.y} segs={[{ t: mt }]} /> : null}
        {typing ? <FuncTip x={c2.x} y={c2.y + 24} name="MAP" params={["array1", "lambda_or_array2", "[lambda_or_array3]", "…"]} active={Math.min(2, argIndex(mt))} /> : null}
        {edit ? <CellEditor x={cx(colsPT, 0, 3).x} y={cx(colsPT, 0, 3).y} segs={[{ t: typed("5000", f, 1160, 0.12) }]} /> : null}
        <Chip x={640} y={slotY(1)} text="Arrays in → arrays out, element by element" color={C.purple} t={win(A.arrays, 453, f, 10)} />
        <Chip x={640} y={slotY(1)} text="MAP walks BOTH arrays: (p, t) = (price, tax) for each row" color={C.purple} t={win(470, 610, f, 10)} />
        <Chip x={640} y={slotY(3)} text="Each pair → LAMBDA → CalculateNet(p, t)" color={C.amber} t={win(A.each, 780, f, 10)} />
        <Chip x={640} y={slotY(5)} text="Output = same size as the inputs (10 × 1)" color={C.amber} t={win(A.dims, 931, f, 10)} />
        <Chip x={640} y={slotY(7)} text="No fill-down · no manual copying" color={C.green} t={win(A.manual, 1100, f, 10)} />
        <Chip x={640} y={slotY(5)} text="Change one input → the whole spill recalculates" color={C.green} t={prog(f, 1220, 12)} />
      </Sheet>
      {sl(D[2], f, "Iterative Array Engine → =MAP(A2:A11, B2:B11, LAMBDA(p, t, CalculateNet(p, t)))", "Element-Wise Processing → Applies Custom Logic to Every Array Element Seamlessly", C.purple, C.purple)}
      <KeyCaps keys={["Enter"]} f={f} from={596} hold={40} accent={C.amber} />
    </SceneFx>
  );
};

// ================= SC04: BYROW / BYCOL =================
const cols4 = buildCols([100, 50, 72, 72, 72, 72, 22, 96]);
export const Scene4: React.FC = () => {
  const f = useCurrentFrame(); const A = A4;
  const BR = "=BYROW(C2:F10, LAMBDA(r, SUM(r)))", BC = "=BYCOL(C2:F10, LAMBDA(c, MAX(c)))";
  const bt = typed(BR, f, 338, 0.45), ct = typed(BC, f, 771, 0.45);
  const t1 = f >= 338 && f < 440, t2 = f >= 771 && f < 855;
  const rk = (k: number): number => 445 + k * 13, ck = (q: number): number => 860 + q * 25;
  const rows: GRow[] = [
    { id: "h", hdr: 1, slot: 0, h: 1, cells: [cell("Region", { b: true, fill: HF }), cell("Year", { b: true, fill: HF, al: "r" }), ...["Q1", "Q2", "Q3", "Q4"].map((q) => cell(q, { b: true, fill: HF, al: "r" as const }))].concat([]) },
    ...REGIONS.map((r, i) => ({ id: "m" + i, hdr: i + 2, slot: i + 1, h: 1, cells: [cell(r), cell(2026, { al: "r" }), ...MATRIX[i].map((v) => cell(num(v), { al: "r" as const }))] })),
  ];
  rows[0].cells[7] = cell("Row total", { b: true, fill: HF, al: "r" });
  REGIONS.forEach((_, i) => { if (f >= rk(i) + 4) rows[i + 1].cells[7] = cell(num(rowSum(i)), { al: "r", b: true }); });
  const bycolRow: GRow = { id: "bc", hdr: 12, slot: 11, h: 1, cells: [cell("Column max", { b: f >= 855 })] };
  [0, 1, 2, 3].forEach((q) => { if (f >= ck(q) + 4) bycolRow.cells[2 + q] = cell(num(colMax(q)), { al: "r", b: true }); });
  rows.push(bycolRow);
  const rr = f >= 445 && f < rk(8) + 13 ? Math.min(8, Math.floor((f - 445) / 13)) : -1;
  const cc = f >= 860 && f < ck(3) + 25 ? Math.min(3, Math.floor((f - 860) / 25)) : -1;
  const boxes: Box[] = [
    { c1: 2, c2: 5, s1: Math.max(0, rr) + 1, s2: Math.max(0, rr) + 1, color: C.green, t: rr >= 0 ? 1 : 0, w: 3 },
    { c1: 7, c2: 7, s1: 1, s2: 9, color: C.green, t: f >= rk(8) + 13 ? prog(f, rk(8) + 13, 12) : 0, fill: "rgba(16,185,129,.08)", w: 3 },
    { c1: 2 + Math.max(0, cc), c2: 2 + Math.max(0, cc), s1: 1, s2: 9, color: C.blue, t: cc >= 0 ? 1 : 0, w: 3 },
    { c1: 2, c2: 5, s1: 11, s2: 11, color: C.blue, t: f >= ck(3) + 25 ? prog(f, ck(3) + 25, 12) : 0, fill: "rgba(56,189,248,.08)", w: 3 },
    ...[0, 1, 2, 3].map((q) => ({ c1: 2 + q, c2: 2 + q, s1: colMaxRow(q) + 1, s2: colMaxRow(q) + 1, color: C.blue, t: f >= 975 ? win(975, 1300, f, 10) : 0, w: 3 })),
  ];
  const h2 = cx(cols4, 7, 1), c12 = cx(cols4, 2, 11);
  const cam = camAt(f, [{ f: 0, z: 1.15, cx: 668, cy: 400 }, { f: 1347, z: 1.15, cx: 668, cy: 400 }]);
  return (
    <SceneFx f={f} dur={D[3]} kind="expand">
      <Sheet cam={cam} nameBox={t2 || f >= 855 ? "C12" : "H2"} formula={t2 ? ct : f >= 855 ? BC : t1 ? bt : f >= 440 ? BR : ""} editing={t1 || t2} cols={cols4} rows={rows} active={f >= 771 ? { c: 2, slot: 11 } : { c: 7, slot: 1 }} boxes={boxes}>
        {t1 ? <CellEditor x={h2.x} y={h2.y} segs={[{ t: bt }]} /> : null}
        {t1 ? <FuncTip x={h2.x} y={h2.y + 24} name="BYROW" params={["array", "lambda(row)"]} active={Math.min(1, argIndex(bt))} /> : null}
        {t2 ? <CellEditor x={c12.x} y={c12.y} segs={[{ t: ct }]} /> : null}
        {t2 ? <FuncTip x={c12.x} y={c12.y + 24} name="BYCOL" params={["array", "lambda(column)"]} active={Math.min(1, argIndex(ct))} /> : null}
        <Chip x={790} y={slotY(1)} text="2-D array  C2:F10  (9 rows × 4 columns)" color={C.amber} t={win(A.two, 440, f, 10)} />
        <Chip x={790} y={slotY(3)} text="BYROW → one result per ROW  ↓" color={C.green} t={win(A.sum, 760, f, 10)} />
        <Chip x={790} y={slotY(5)} text="Each row arrives as a sub-array  r = {Q1, Q2, Q3, Q4}" color={C.green} t={win(A.sub, 760, f, 10)} />
        <Chip x={790} y={slotY(7)} text="BYCOL → one result per COLUMN  →" color={C.blue} t={win(A.bycol, 1100, f, 10)} />
        <Chip x={790} y={slotY(9)} text="No array-dimension conflicts · no #VALUE!" color={C.green} t={win(A.conflict, 1300, f, 10)} />
        <Chip x={790} y={slotY(13)} text="Blue boxes = the maximum of each column" color={C.blue} t={win(990, 1300, f, 10)} />
      </Sheet>
      {sl(D[3], f, "Row-Wise Aggregation → =BYROW(C2:F10, LAMBDA(r, SUM(r))) (No #VALUE! Errors)", "Column-Wise Aggregation → =BYCOL(C2:F10, LAMBDA(c, MAX(c)))", C.green, C.blue)}
      <KeyCaps keys={["Enter"]} f={f} from={424} hold={36} accent={C.green} />
      <KeyCaps keys={["Enter"]} f={f} from={839} hold={36} accent={C.blue} />
    </SceneFx>
  );
};

// ================= SC05: 50,000 rows =================
const cols5 = buildCols([84, 84, 64, 130]);
const VIEW = 26;
export const Scene5: React.FC = () => {
  const f = useCurrentFrame(); const A = A5;
  const BM = '=MAP(B2:B50001, C2:C50001, LAMBDA(p, t, CalculateNet(p, t)))';
  const bottom = f >= 455 && f < 500;
  const off = bottom ? BIG_N - VIEW : 0;
  const bt = typed(BM, f, 523, 1.0);
  const typing = f >= 523 && f < 626, done = f >= 626;
  const rows: GRow[] = [
    { id: "h", hdr: 1, slot: 0, h: 1, cells: ["Order ID", "Price", "Tax", "Net"].map((t, i) => cell(t, { b: true, fill: HF, al: i === 0 ? "l" as const : "r" as const })) },
    ...Array.from({ length: VIEW }, (_, k) => { const r = bigRow(off + k); const cs: Cell[] = [cell(r.id), cell(num(r.price), { al: "r" }), cell(pct(r.tax), { al: "r" })]; if (done && !bottom) cs[3] = cell(fmt2(r.net), { al: "r" }); return { id: "o" + k, hdr: off + k + 2, slot: k + 1, h: done && !bottom ? 1 : 1, cells: cs }; }),
  ];
  const count = Math.round(BIG_N * prog(f, A.file, 130));
  const d2 = cx(cols5, 3, 1);
  const cam = camAt(f, [{ f: 0, z: 1.15, cx: 668, cy: 340 }, { f: 449, z: 1.15, cx: 668, cy: 340 }, { f: 459, z: 1.15, cx: 668, cy: 456 }, { f: 496, z: 1.15, cx: 668, cy: 456 }, { f: 506, z: 1.15, cx: 668, cy: 340 }, { f: 1194, z: 1.15, cx: 668, cy: 340 }]);
  return (
    <SceneFx f={f} dur={D[4]} kind="expand">
      <Sheet cam={cam} nameBox={bottom ? "A50001" : typing || done ? "D2" : "A1"} formula={done ? BM : typing ? bt : bottom ? bigRow(BIG_N - 1).id : "Order ID"} editing={typing} cols={cols5} rows={rows} fixedHdr={false}
        active={bottom ? { c: 0, slot: VIEW } : typing || done ? { c: 3, slot: 1 } : { c: 0, slot: 0 }}
        boxes={[{ c1: 3, c2: 3, s1: 1, s2: VIEW + 1, color: C.blue, t: done && !bottom ? prog(f, 626, 14) : 0, fill: "rgba(16,185,129,.09)", w: 3 }]}
        cellFx={(id, c) => (c === 3 && done && String(id)[0] === "o" ? `rgba(245,158,11,${0.4 * win(626 + Number(String(id).slice(1)) * 2, 700, f, 8)})` : undefined)}>
        {typing ? <CellEditor x={d2.x} y={d2.y} segs={[{ t: bt }]} /> : null}
        {typing ? <FuncTip x={d2.x} y={d2.y + 24} name="MAP" params={["array1", "lambda_or_array2", "[lambda_or_array3]", "…"]} active={Math.min(2, argIndex(bt))} /> : null}
        <Chip x={colX(cols5, 4) + 30} y={slotY(2)} text={`Spilled: ${num(BIG_N)} rows · SUM(D2#) = ${num(bigNetTotal())}`} color={C.green} t={prog(f, 660, 12)} />
        <Chip x={colX(cols5, 4) + 30} y={slotY(5)} text="Custom logic once · applied to every row · no VBA" color={C.blue} t={win(A.days, 1000, f, 10)} />
        <Chip x={colX(cols5, 4) + 30} y={slotY(8)} text="Tip: for plain math use B2:B50001*(1+C2:C50001); LAMBDA/MAP shine for custom logic" color={C.amber} t={prog(f, 880, 12)} />
      </Sheet>
      <div style={{ position: "absolute", right: 28, top: 92, background: "rgba(15,23,42,.92)", border: `1.5px solid ${C.blue}`, borderRadius: 12, padding: "8px 18px", fontFamily: F.mono, fontSize: 19, color: C.text, opacity: prog(f, A.file, 12), zIndex: 60 }}>manzooma_sales_2026 · <span style={{ color: C.blue, fontWeight: 700 }}>{num(count)}</span> rows</div>
      <Seal t={prog(f, A.days + 10, 26)} line1="Enterprise LAMBDA & MAP" line2={`${num(BIG_N)} صف · بدون VBA`} />
      <KeyCaps keys={["Ctrl", "↓"]} f={f} from={440} hold={34} accent={C.blue} />
      <KeyCaps keys={["Enter"]} f={f} from={610} hold={36} accent={C.green} />
      {sl(D[4], f, "Enterprise LAMBDA & MAP → Custom Functional Logic Across 50,000 Rows Instantly", "Zero VBA Overhead → Functional Array Iteration Across 50,000 Rows", C.blue, C.green)}
    </SceneFx>
  );
};

// ================= SC06: outro =================
export const Scene6: React.FC = () => {
  const f = useCurrentFrame(); const A = A6;
  const pr = prog(f, 60, 110);
  const pct2 = (42 / 76) * 100;
  const skills = ["LAMBDA(params, calculation) · test in the cell", "Name Manager → CalculateNet", "MAP · element-wise on spilled arrays", "BYROW & BYCOL · row / column aggregation"];
  const fadeOut = 1 - prog(f, 880, 50);
  const card: React.CSSProperties = { background: "rgba(30,41,59,.72)", border: "1.5px solid rgba(148,163,184,.35)", borderRadius: 28 };
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 20% 10%, #16324a 0%, ${C.slate} 55%)`, opacity: Math.min(prog(f, 0, 20), fadeOut) }}>
      <div style={{ position: "absolute", left: 90, top: 60, display: "flex", alignItems: "center", gap: 20, opacity: prog(f, 0, 20) }}>
        <Logo s={120} />
        <div><div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 46, color: C.text }}>منظومة أكاديمي | Manzooma Excel Masterclass</div><div style={{ fontFamily: F.ui, fontSize: 22, color: "#94A3B8", marginTop: 4 }}>Excel From Zero to Professional</div></div>
      </div>
      <div style={{ ...card, position: "absolute", left: 90, top: 200, width: 1010, height: 700, padding: 44, boxSizing: "border-box", opacity: prog(f, 20, 20), transform: `translateY(${(1 - prog(f, 20, 20)) * 24}px)` }}>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 38, color: C.text }}>Lesson 42 · LAMBDA & MAP Engine</div>
        <div style={{ fontFamily: F.ar, fontSize: 28, color: "#CBD5E1", marginTop: 8, direction: "rtl", textAlign: "left" }}>الدرس الثاني والأربعون | الوحدة الثامنة</div>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.text }}><span>Course progress · Lesson 42 of 76</span><span style={{ color: C.green }}>{(pr * pct2).toFixed(1)}%</span></div>
        <div style={{ marginTop: 12, height: 26, borderRadius: 13, background: "#0B1220", overflow: "hidden", border: "1px solid #334155" }}><div style={{ width: `${pr * pct2}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, #34D399)`, boxShadow: `0 0 18px ${C.green}` }} /></div>
        <div style={{ marginTop: 10, fontFamily: F.ui, fontSize: 20, color: "#94A3B8" }}>Unit 8 of 14 · Dynamic Search & Advanced Sorting · Lesson 5 of the unit</div>
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
          <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: C.green, lineHeight: "38px" }}>LAMBDA & MAP Engine<div style={{ fontWeight: 500, fontSize: 21, color: "#CBD5E1" }}>Lesson 42 mastered</div></div>
        </div>
        <div style={{ ...card, height: 440, padding: 34, boxSizing: "border-box", opacity: prog(f, A.l43 - 20, 20), transform: `translateY(${(1 - prog(f, A.l43 - 20, 20)) * 30}px)`, border: `1.5px solid ${C.blue}` }}>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.blue, letterSpacing: 1 }}>NEXT · LESSON 43 · UNIT 8 FINALE</div>
          <div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 34, color: C.text, marginTop: 10, direction: "rtl", textAlign: "right", lineHeight: "48px" }}>الدرس 43: دوال تجميع وتقليص المصفوفات المنسابة</div>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: "#CBD5E1", marginTop: 8 }}>REDUCE & SCAN Engine</div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>{["=REDUCE(0, A2:A11, LAMBDA(a, x, a + x))", "=SCAN(0, A2:A11, LAMBDA(a, x, a + x))"].map((t) => <div key={t} style={{ height: 46, borderRadius: 8, background: "#fff", border: `2px solid ${C.xGreen}`, display: "flex", alignItems: "center", padding: "0 14px", fontFamily: F.cell, fontSize: 21, fontWeight: 700, color: C.ink }}>{t}</div>)}</div>
        </div>
      </div>
    </div>
  );
};
void lerp;
