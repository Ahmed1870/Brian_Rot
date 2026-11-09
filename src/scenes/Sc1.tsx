import {useCurrentFrame} from "remotion";
import {CalcDlg, Cap, Cursor, ExcelApp, FIS, Glow, Menu, PivotPane, Sheet, Tag, TopBadge, eo, prog, rgba} from "../kit";
import {C, F, M} from "../theme";
import {BRN, FIELDS, PW, block, int, pvCells} from "../data";
import {CUR, Chip, Stage, anchor, win} from "./common";

const a = (k: number) => anchor(0, k);
const BEF = [["Branch", "Product", "Sales", "Profit", "Commission", "Margin", "Net %"], ...Array.from({length: 9}, (_, i) => ["Cairo", "Laptop", 12000 + i * 350, 2400 + i * 70, "=C" + (i + 2) + "*0.05", "=D" + (i + 2) + "/C" + (i + 2), "=D" + (i + 2) + "/…"])];
const AFT = [["Branch", "Product", "Sales", "Profit"], ...Array.from({length: 9}, (_, i) => ["Cairo", "Laptop", 12000 + i * 350, 2400 + i * 70])];
const MENU: [string, string][] = [["fis", "Calculated Field..."], ["fis", "Calculated Item..."], ["fis", "Solve Order..."], ["fis", "List Formulas"]];
const Card = ({x, color, title, rows, bad, k, w}: {x: number; color: string; title: string; rows: (string | number)[][]; bad: boolean; k: number; w: number[]}) => (
  <div style={{position: "absolute", left: x, top: 196, width: 600, opacity: k, transform: `translateY(${(1 - k) * 22}px)`}}>
    <Chip x={0} y={0} w={600} h={32} color={color} size={17}>{title}</Chip>
    <div style={{position: "absolute", left: 0, top: 40, width: 600, height: 232, overflow: "hidden", border: `2px solid ${color}`, borderRadius: 8, boxShadow: `0 0 18px ${rgba(color, 0.45)}`, boxSizing: "border-box", background: "#fff"}}>
      <div style={{position: "absolute", left: 0, top: -M.hdrTop, width: M.W, height: M.H}}>
        <Sheet cells={block(1, 1, rows, {hdr: true}).map((c) => (bad && c.c >= 5 ? {...c, bg: c.r === 1 ? C.red : "#FDECEC", color: c.r === 1 ? "#fff" : "#B91C1C"} : c))} widths={w} />
      </div>
    </div>
  </div>
);

export const Sc1 = () => {
  const f = useCurrentFrame();
  const swap = f >= a(4) + 14, open = a(5) + 76, close = a(6) - 4;
  const dK = eo(prog(f, open, 12)) * (1 - eo(prog(f, close, 8)));
  const mk = f >= a(5) + 24 && f < open ? 1 : 0;
  const {cells} = pvCells({rows: BRN});
  const cmp = f >= a(6) + 6 ? eo(prog(f, a(6) + 6, 20)) : 0;
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(5)}><TopBadge ar="الدرس 29 من 76 | الوحدة 6 من 14" en="Pivot Calculation Engine" /></Cap>,
      <Cap key="1" f={f} a={a(5)} b={9999}><Tag label="Calculated Fields" color={C.blue} parts={[{t: "Dynamic Custom Columns without Altering Source Data"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Pivot", "Data"]} tab={swap ? "PivotTable Analyze" : "Home"} ribbon={swap ? "pivot" : "home"} pivotTabs name="B5" fx={int(BRN[1].s)}
        sheet={{cells: [...cells, {r: 1, c: 1, t: "Product", bold: true}, {r: 1, c: 2, t: "(All)"}], widths: PW, active: {r: 5, c: 2}, sel: {r1: 5, c1: 2, r2: 5, c2: 2}}}>
        <PivotPane fields={FIELDS.map((n) => ({n, on: ["Branch", "Sales_Amount", "Net_Profit"].includes(n)}))} areas={{f: ["Product"], c: [], r: ["Branch"], v: ["Sum of Sales_Amount", "Sum of Net_Profit"]}} />
        {f >= a(5) && f < a(5) + 90 ? <Glow x={FIS.x} y={FIS.y} w={FIS.w} h={FIS.h} color={C.blue} k={win(f, a(5), a(5) + 90)} /> : null}
        {mk ? <Menu x={FIS.x - 30} y={138} items={MENU} hot={f >= a(5) + 50 ? 0 : -1} /> : null}
        {dK > 0 ? <CalcDlg x={300} y={196} k={dK} kind="field" name="Field1" formula="= 0" list={["Date", "Branch", "Product", "Units", "Sales_Amount", "Net_Profit"]} glow={f >= open + 20 ? "name" : undefined} /> : null}
        {f >= a(4) + 14 && f < a(5) ? <Glow x={650} y={32} w={150} h={26} color={C.blue} k={win(f, a(4) + 14, a(5))} fill={0.05} /> : null}
        {cmp > 0 ? (
          <div style={{position: "absolute", left: 0, top: 0, width: M.W, height: M.H}}>
            <div style={{position: "absolute", left: 0, top: 0, width: M.W, height: M.H, background: rgba(C.slate, 0.8 * cmp)}} />
            <Card x={24} color={C.red} title="BEFORE · helper columns in the source" rows={BEF} bad k={cmp} w={[56, 56, 52, 52, 76, 72, 60]} />
            <Card x={656} color={C.emerald} title="AFTER · clean source + Pivot calculations" rows={AFT} bad={false} k={cmp} w={[60, 60, 62, 62]} />
            {f >= a(6) + 40 ? <Chip x={24} y={486} w={600} h={34} color={C.red} k={eo(prog(f, a(6) + 40, 14))} size={16}>50,000 rows × 3 helper columns = 150,000 extra formulas</Chip> : null}
            {f >= a(6) + 70 ? <Chip x={656} y={486} w={600} h={34} color={C.emerald} k={eo(prog(f, a(6) + 70, 14))} size={16}>0 extra cells · calculated inside the Pivot cache</Chip> : null}
          </div>
        ) : null}
        <Cursor keys={[{f: a(4) - 20, x: 640, y: 420}, {f: a(4), x: CUR.tab.x, y: CUR.tab.y, click: true}, {f: a(5) + 14, x: CUR.fis.x, y: CUR.fis.y, click: true}, {f: a(5) + 46, x: CUR.menu(0).x, y: CUR.menu(0).y}, {f: a(5) + 62, x: CUR.menu(0).x, y: CUR.menu(0).y, click: true}, {f: close - 20, x: 640, y: 430}, {f: close, x: 380, y: 468, click: true}, {f: close + 40, x: 900, y: 560}]} />
      </ExcelApp>
    </Stage>
  );
};
