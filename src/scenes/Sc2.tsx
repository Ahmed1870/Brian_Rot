import {useCurrentFrame} from "remotion";
import {CalcDlg, Cap, Cursor, ExcelApp, FIS, Menu, PivotPane, Tag, cellRect, eo, prog, rgba, typed} from "../kit";
import {C} from "../theme";
import {BRN, FIELDS, PW, int, pvCells} from "../data";
import {CUR, Chip, Stage, anchor, win} from "./common";

const a = (k: number) => anchor(1, k);
const MENU: [string, string][] = [["fis", "Calculated Field..."], ["fis", "Calculated Item..."], ["fis", "Solve Order..."], ["fis", "List Formulas"]];
const FL = ["Date", "Branch", "Product", "Units", "Sales_Amount", "Net_Profit"];
const FAC: [number, number] = [0.35, 0.42];

export const Sc2 = () => {
  const f = useCurrentFrame();
  // dialog 1 (Commission)
  const o1 = a(3) + 70, ok1 = a(4) + 178, o2 = a(5) + 8, ok2 = a(5) + 94;
  const d1 = eo(prog(f, o1, 12)) * (1 - eo(prog(f, ok1 + 6, 8)));
  const d2 = eo(prog(f, o2, 10)) * (1 - eo(prog(f, ok2 + 6, 8)));
  const n1 = typed("Commission", f, a(4), 8), n2 = typed("Margin %", f, a(5) + 12, 14);
  const F1 = "= Sales_Amount * 0.05", F2 = "= Net_Profit / Sales_Amount";
  const f1 = f < a(4) + 50 ? "= 0" : F1.slice(0, Math.min(F1.length, Math.floor((f - a(4) - 50) * 0.35) + 1)), f2 = f < a(5) + 36 ? "= 0" : F2.slice(0, Math.min(F2.length, Math.floor((f - a(5) - 36) * 0.62) + 1));
  const comm = prog(f, ok1 + 8, 40) > 0 ? prog(f, ok1 + 8, 36) : 0, marg = prog(f, ok2 + 8, 36);
  const filt = f >= a(6) + 150;
  const {cells} = pvCells({rows: BRN, fac: filt ? FAC : [1, 1], comm, marg});
  const fil = f >= a(6) + 70 && f < a(6) + 150;
  const pane = FL.map((n) => ({n, on: ["Branch", "Sales_Amount", "Net_Profit"].includes(n)})).concat(comm > 0 ? [{n: "Commission", on: true, calc: true} as never] : [], marg > 0 ? [{n: "Margin %", on: true, calc: true} as never] : []);
  const menuOn = (f >= a(3) + 24 && f < o1) || (f >= a(5) - 30 && f < o2);
  const hotIdx = 0;
  const tabAct = f >= a(2) + 14;
  const B1 = cellRect(2, 1, PW);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(4)} b={a(5)}><Tag label="Calculated Field Formula" color={C.emerald} parts={[{t: "Name: "}, {t: "Commission", c: C.emerald}, {t: " | Formula: "}, {t: "= Sales_Amount * 0.05", c: C.emerald}]} /></Cap>,
      <Cap key="1" f={f} a={a(5)} b={9999}><Tag label="Dynamic Margin KPI" color={C.blue} parts={[{t: "Formula: "}, {t: "= Net_Profit / Sales_Amount", c: C.blue}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Pivot", "Data"]} tab={tabAct ? "PivotTable Analyze" : "Home"} ribbon={tabAct ? "pivot" : "home"} pivotTabs name="B5" fx={int(Math.round(BRN[1].s * (filt ? FAC[0] : 1)))}
        sheet={{cells: [...cells, {r: 1, c: 1, t: "Product", bold: true}, {r: 1, c: 2, t: filt ? "Laptop ▾" : "(All) ▾", bg: fil ? rgba(C.blue, 0.2) : undefined}], widths: PW, active: {r: 5, c: 2}, sel: {r1: 5, c1: 2, r2: 5, c2: 2}}}>
        <PivotPane fields={pane} areas={{f: ["Product"], c: [], r: ["Branch"], v: ["Sum of Sales_Amount", "Sum of Net_Profit", ...(comm > 0 ? ["Sum of Commission"] : []), ...(marg > 0 ? ["Sum of Margin %"] : [])]}} />
        {menuOn ? <Menu x={FIS.x - 30} y={138} items={MENU} hot={hotIdx} /> : null}
        {d1 > 0 ? <CalcDlg x={300} y={196} k={d1} kind="field" name={n1} formula={f1} list={FL} sel={f >= a(4) + 90 && f < a(4) + 120 ? 4 : -1} hot={f >= a(4) + 100 && f < a(4) + 118 ? "insert" : f >= a(4) + 150 && f < a(4) + 166 ? "add" : f >= ok1 - 8 ? "ok" : undefined} glow={f < a(4) + 50 ? "name" : "formula"} /> : null}
        {d2 > 0 ? <CalcDlg x={300} y={196} k={d2} kind="field" name={n2} formula={f2} list={[...FL, "Commission"]} hot={f >= ok2 - 14 && f < ok2 - 4 ? "add" : f >= ok2 - 4 ? "ok" : undefined} glow={f < a(5) + 36 ? "name" : "formula"} /> : null}
        {comm > 0 && comm < 1 ? <Chip x={640} y={228} w={250} color={C.emerald} k={win(f, ok1 + 8, ok1 + 100)} size={14}>New column flows in ✓</Chip> : null}
        {f >= a(6) + 10 && f < a(6) + 60 ? <Chip x={640} y={228} w={300} color={C.blue} k={win(f, a(6) + 10, a(6) + 60)} size={14}>Percent format · ratio of the SUMS</Chip> : null}
        {fil ? <div style={{position: "absolute", left: B1.x, top: B1.y + 20, width: 150, background: "#fff", border: "1px solid #8A8A8A", boxShadow: "0 4px 12px rgba(0,0,0,.3)", fontSize: 13, boxSizing: "border-box"}}>{["(All)", "Laptop", "Phone", "Tablet"].map((s, i) => <div key={s} style={{height: 20, lineHeight: "20px", padding: "0 8px", background: f >= a(6) + 120 && i === 1 ? "#CCE8FF" : "transparent"}}>{s}</div>)}</div> : null}
        {filt && f < a(6) + 260 ? <Chip x={640} y={228} w={330} color={C.emerald} k={win(f, a(6) + 150, a(6) + 260)} size={14}>Filter = Laptop → every column recalculated ✓</Chip> : null}
        <Cursor keys={[{f: a(2) - 20, x: 640, y: 420}, {f: a(2) + 4, x: CUR.tab.x, y: CUR.tab.y, click: true}, {f: a(3) + 14, x: CUR.fis.x, y: CUR.fis.y, click: true}, {f: a(3) + 40, x: CUR.menu(0).x, y: CUR.menu(0).y}, {f: o1 - 8, x: CUR.menu(0).x, y: CUR.menu(0).y, click: true}, {f: a(4) + 104, x: 380, y: 330}, {f: a(4) + 156, x: 596, y: 300, click: true}, {f: ok1 - 6, x: 388, y: 468, click: true}, {f: a(5) - 40, x: CUR.fis.x, y: CUR.fis.y, click: true}, {f: o2 - 14, x: CUR.menu(0).x, y: CUR.menu(0).y}, {f: o2 - 8, x: CUR.menu(0).x, y: CUR.menu(0).y, click: true}, {f: ok2 - 4, x: 388, y: 468, click: true}, {f: a(6) + 60, x: B1.x + 60, y: B1.y + 8}, {f: a(6) + 70, x: B1.x + 60, y: B1.y + 8, click: true}, {f: a(6) + 120, x: B1.x + 40, y: B1.y + 40, click: true}, {f: a(6) + 200, x: 900, y: 520}]} />
      </ExcelApp>
    </Stage>
  );
};
void C;
