import {useCurrentFrame} from "remotion";
import {CalcDlg, Cap, Cursor, ExcelApp, FIS, Glow, Menu, PivotPane, SolveDlg, Tag, cellRect, eo, prog, rangeRect, typed} from "../kit";
import {C} from "../theme";
import {BRN, FIELDS, PW, int, pvCells} from "../data";
import {CUR, Chip, Stage, anchor, win} from "./common";

const a = (k: number) => anchor(2, k);
const MENU: [string, string][] = [["fis", "Calculated Field..."], ["fis", "Calculated Item..."], ["fis", "Solve Order..."], ["fis", "List Formulas"]];
const NAME = "Variance (Cairo vs Alex)", FRM = "= Cairo - Alexandria";
const ORD = ["Commission — Calculated Field", "Margin % — Calculated Field", "Variance — Calculated Item"];

export const Sc3 = () => {
  const f = useCurrentFrame();
  const o1 = a(1) + 70, ok1 = a(3) + 190, o2 = a(5) + 40, up1 = a(5) + 100, up2 = a(5) + 125, cl = a(5) + 175;
  const d1 = eo(prog(f, o1, 12)) * (1 - eo(prog(f, ok1 + 6, 8)));
  const d2 = eo(prog(f, o2, 12)) * (1 - eo(prog(f, cl + 6, 8)));
  const nm = typed(NAME, f, a(2) + 6, 12);
  const fm = f < a(3) + 60 ? "= 0" : FRM.slice(0, Math.min(FRM.length, Math.floor((f - a(3) - 60) * 0.2) + 1));
  const vrK = prog(f, ok1 + 10, 20), late = f >= cl + 8;
  const rows = f >= up2 ? [ORD[2], ORD[0], ORD[1]] : f >= up1 ? [ORD[0], ORD[2], ORD[1]] : ORD;
  const sel = f >= up2 ? 0 : f >= up1 ? 1 : 2;
  const {cells, total} = pvCells({rows: BRN, comm: 1, marg: 1, vr: {a: 0, b: 1, name: NAME, solve: late ? "late" : "early", k: vrK}, flash: f / 10});
  const menuOn = (f >= a(1) + 40 && f < o1) || (f >= a(5) - 10 && f < o2);
  const hot = f >= a(5) - 10 ? 2 : 1;
  const A4 = cellRect(1, 4, PW);
  const vq = rangeRect(9, 1, 9, 5, PW);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(1)} b={a(5)}><Tag label="Calculated Item" color={C.purple} parts={[{t: "= Cairo - Alexandria", c: C.purple}, {t: " (Compare Items Within the Same Field)"}]} /></Cap>,
      <Cap key="1" f={f} a={a(5)} b={9999}><Tag label="Solve Order Audit" color={C.purple} parts={[{t: "Fields, Items, & Sets → Solve Order "}, {t: "(Resolves Formula Collisions)", c: C.purple}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Pivot", "Data"]} tab="PivotTable Analyze" ribbon="pivot" pivotTabs name="A4" fx="Cairo"
        sheet={{cells: [...cells, {r: 1, c: 1, t: "Product", bold: true}, {r: 1, c: 2, t: "(All) ▾"}], widths: PW, active: {r: 4, c: 1}, sel: {r1: 4, c1: 1, r2: 4, c2: 1}}}>
        <PivotPane fields={[...FIELDS, "Commission", "Margin %"].map((n) => ({n, on: ["Branch", "Sales_Amount", "Net_Profit", "Commission", "Margin %"].includes(n), calc: n === "Commission" || n === "Margin %"}))} areas={{f: ["Product"], c: [], r: ["Branch"], v: ["Sum of Sales_Amount", "Sum of Net_Profit", "Sum of Commission", "Sum of Margin %"]}} />
        {menuOn ? <Menu x={FIS.x - 30} y={138} items={MENU} hot={hot} /> : null}
        {f >= a(1) && f < o1 ? <Glow x={A4.x} y={A4.y} w={A4.w - 1} h={A4.h - 1} color={C.purple} k={win(f, a(1), o1)} /> : null}
        {d1 > 0 ? <CalcDlg x={300} y={176} k={d1} kind="item" name={nm} formula={fm} list={["Branch"]} items={BRN.map((r) => r.n)} sel={f >= a(3) + 70 && f < a(3) + 90 ? 100 : f >= a(3) + 110 && f < a(3) + 130 ? 101 : -1} hot={f >= a(3) + 76 && f < a(3) + 88 || f >= a(3) + 116 && f < a(3) + 128 ? "insert" : f >= a(3) + 160 && f < a(3) + 176 ? "add" : f >= ok1 - 8 ? "ok" : undefined} glow={f < a(3) + 60 ? "name" : "formula"} /> : null}
        {vrK > 0 && f < ok1 + 150 ? <Glow x={vq.x} y={vq.y} w={vq.w - 1} h={vq.h - 1} color={C.purple} k={win(f, ok1 + 10, ok1 + 150)} fill={0.1} /> : null}
        {f >= a(4) && f < a(5) ? <Chip x={40} y={404} w={460} h={32} color={C.red} k={win(f, a(4), a(5))} size={15}>Margin % = 3.0% ✗ (20.0% − 17.0%: percentages subtracted)</Chip> : null}
        {f >= a(4) + 60 && f < a(5) ? <Chip x={40} y={442} w={460} h={32} color={C.amber} k={win(f, a(4) + 60, a(5))} size={14}>Grand Total includes the calculated item</Chip> : null}
        {d2 > 0 ? <SolveDlg x={300} y={196} k={d2} rows={rows} sel={sel} hot={f >= up1 - 8 && f < up1 + 8 || f >= up2 - 8 && f < up2 + 8 ? "up" : f >= cl - 8 ? "close" : undefined} /> : null}
        {late && f < cl + 140 ? <Glow x={vq.x + vq.w - 126} y={vq.y} w={125} h={19} color={C.purple} k={win(f, cl + 8, cl + 140)} /> : null}
        {late ? <Chip x={40} y={404} w={520} h={32} color={C.purple} k={eo(prog(f, cl + 14, 14))} size={14}>Margin % solved last → 345,200 ÷ 1,180,000 = 29.3% ✓</Chip> : null}
        <Cursor keys={[{f: a(1) - 20, x: 700, y: 440}, {f: a(1), x: A4.x + 30, y: A4.y + 8, click: true}, {f: a(1) + 24, x: CUR.fis.x, y: CUR.fis.y, click: true}, {f: a(1) + 50, x: CUR.menu(1).x, y: CUR.menu(1).y}, {f: o1 - 8, x: CUR.menu(1).x, y: CUR.menu(1).y, click: true}, {f: a(3) + 66, x: 360, y: 280, click: true}, {f: a(3) + 82, x: 596, y: 316, click: true}, {f: a(3) + 122, x: 380, y: 300, click: true}, {f: a(3) + 166, x: 596, y: 232, click: true}, {f: ok1 - 6, x: 388, y: 458, click: true}, {f: a(5) - 20, x: CUR.fis.x, y: CUR.fis.y, click: true}, {f: o2 - 14, x: CUR.menu(2).x, y: CUR.menu(2).y, click: true}, {f: up1, x: 640, y: 262, click: true}, {f: up2, x: 640, y: 262, click: true}, {f: cl, x: 640, y: 446, click: true}, {f: cl + 40, x: 900, y: 560}]} />
      </ExcelApp>
    </Stage>
  );
};
void int; void total0();
function total0() { return 0; }
