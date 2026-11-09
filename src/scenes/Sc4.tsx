import {useCurrentFrame} from "remotion";
import {CalcDlg, Cap, Cursor, ExcelApp, FIS, Glow, Menu, PivotPane, Tag, eo, prog, typed} from "../kit";
import {C, F} from "../theme";
import {BRN, FIELDS, PW, block, pvCells} from "../data";
import {CUR, Chip, Stage, anchor, win} from "./common";

const a = (k: number) => anchor(3, k);
const MENU: [string, string][] = [["fis", "Calculated Field..."], ["fis", "Calculated Item..."], ["fis", "Solve Order..."], ["fis", "List Formulas"]];
const DW = [132, 220, 260, 64, 64, 64];
const DOC = [["Calculated Field"], ["Solve Order", "Field", "Formula"], [2, "Commission", "= Sales_Amount * 0.05"], [3, "Margin %", "= Net_Profit / Sales_Amount"], [""], ["Calculated Item"], ["Solve Order", "Item", "Formula"], [1, "Variance (Cairo vs Alex)", "= Cairo - Alexandria"], [""], ["Note: when a cell is updated by more than one formula, the formula with the last solve order wins."]];

export const Sc4 = () => {
  const f = useCurrentFrame();
  const oA = a(2), cA = a(3) - 30, mk = a(3) + 24, clk = a(4), gen = a(4) + 26;
  const dK = eo(prog(f, oA, 12)) * (1 - eo(prog(f, cA, 8)));
  const fm = typed("= A1 * 0.05", f, oA + 20, 7);
  const onDoc = f >= gen + 14;
  const shown = onDoc ? Math.min(DOC.length, Math.floor((f - gen - 14) / 8) + 1) : 0;
  const {cells} = pvCells({rows: BRN, comm: 1, marg: 1, vr: {a: 0, b: 1, name: "Variance (Cairo vs Alex)", solve: "late", k: 1}});
  const docCells = DOC.slice(0, shown).flatMap((row, i) => block(i + 1, 1, [row], {color: i === 0 || i === 5 ? "#107C41" : undefined, bg: i === 1 || i === 6 ? "#DCE6F1" : "#FFFFFF"}).map((c) => ({...c, bold: i === 0 || i === 5 || i === 1 || i === 6, a: "l" as const, style: i === 0 || i === 5 || i === 9 ? {overflow: "visible", zIndex: 2} : undefined})));
  const cardK = [0, 1].map((i) => win(f, a(1) + 20 + i * 70, a(3) - 30, 12));
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(1)} b={a(3)}><Tag label="Rules & Constraints" color={C.red} parts={[{t: "Uses "}, {t: "SUM", c: C.amber}, {t: " Aggregation Only; Cell References (A1) Are Restricted"}]} /></Cap>,
      <Cap key="1" f={f} a={a(3)} b={9999}><Tag label="List Formulas Audit" color={C.emerald} parts={[{t: "Generates Automatic Documentation Sheet of All Pivot Formulas"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={onDoc || f >= gen ? ["Pivot", "Data", "Pivot Formulas"] : ["Pivot", "Data"]} activeSheet={onDoc ? "Pivot Formulas" : "Pivot"} tab="PivotTable Analyze" ribbon="pivot" pivotTabs name={onDoc ? "A1" : "B5"} fx={onDoc ? "Calculated Field" : "345200"}
        sheet={{cells: onDoc ? docCells : [...cells, {r: 1, c: 1, t: "Product", bold: true}, {r: 1, c: 2, t: "(All) ▾"}], widths: onDoc ? DW : PW, active: onDoc ? {r: 1, c: 1} : {r: 5, c: 2}, sel: onDoc ? {r1: 1, c1: 1, r2: 1, c2: 1} : {r1: 5, c1: 2, r2: 5, c2: 2}}}>
        {!onDoc ? <PivotPane fields={[...FIELDS, "Commission", "Margin %"].map((n) => ({n, on: ["Branch", "Sales_Amount", "Net_Profit", "Commission", "Margin %"].includes(n), calc: n === "Commission" || n === "Margin %"}))} areas={{f: ["Product"], c: [], r: ["Branch"], v: ["Sum of Sales_Amount", "Sum of Net_Profit", "Sum of Commission", "Sum of Margin %"]}} /> : null}
        {cardK[0] > 0 ? <div style={{position: "absolute", left: 40, top: 396, width: 470, height: 76, opacity: cardK[0], background: C.slate, border: `2.5px solid ${C.amber}`, borderRadius: 12, boxShadow: `0 0 16px ${C.amber}`, boxSizing: "border-box", padding: "10px 16px", fontFamily: F.ui, color: "#fff"}}><div style={{fontWeight: 700, fontSize: 20, color: C.amber}}>Σ Calculated Field = SUM only</div><div style={{fontSize: 14, marginTop: 4}}>Works on the sum of each field, never on single rows</div></div> : null}
        {cardK[1] > 0 ? <div style={{position: "absolute", left: 40, top: 484, width: 470, height: 76, opacity: cardK[1], background: C.slate, border: `2.5px solid ${C.red}`, borderRadius: 12, boxShadow: `0 0 16px ${C.red}`, boxSizing: "border-box", padding: "10px 16px", fontFamily: F.ui, color: "#fff"}}><div style={{fontWeight: 700, fontSize: 20, color: C.red}}>A1 ✗ direct cell references</div><div style={{fontSize: 14, marginTop: 4}}>Use field names: Sales_Amount, Net_Profit …</div></div> : null}
        {dK > 0 ? <CalcDlg x={560} y={196} k={dK} kind="field" name="Test" formula={<span style={{color: C.red}}>{fm}</span>} list={["Date", "Branch", "Product", "Units", "Sales_Amount", "Net_Profit"]} glow="formula" /> : null}
        {dK > 0.9 && fm.length >= 7 ? <Glow x={640} y={268} w={226} h={24} color={C.red} k={win(f, oA + 50, cA)} fill={0.06} /> : null}
        {f >= mk && f < clk + 10 ? <Menu x={FIS.x - 30} y={138} items={MENU} hot={f >= clk - 20 ? 3 : -1} /> : null}
        {f >= clk && f < gen + 20 ? <Glow x={FIS.x} y={FIS.y} w={FIS.w} h={FIS.h} color={C.emerald} k={win(f, clk, gen + 20)} /> : null}
        {onDoc && shown >= 3 ? <Chip x={620} y={230} w={440} color={C.emerald} k={win(f, gen + 30, 9999, 14)} size={15}>New sheet · every formula + solve order documented ✓</Chip> : null}
        <Cursor keys={[{f: oA - 30, x: 700, y: 440}, {f: cA - 8, x: 780, y: 470}, {f: cA + 6, x: 880, y: 470, click: true}, {f: a(3) - 6, x: CUR.fis.x, y: CUR.fis.y, click: true}, {f: clk - 20, x: CUR.menu(3).x, y: CUR.menu(3).y}, {f: clk, x: CUR.menu(3).x, y: CUR.menu(3).y, click: true}, {f: gen + 80, x: 900, y: 520}]} />
      </ExcelApp>
    </Stage>
  );
};
void C;
