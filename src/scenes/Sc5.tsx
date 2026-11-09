import {useCurrentFrame} from "remotion";
import {Cap, Cursor, ExcelApp, Glow, PivotPane, Tag, eo, prog, rangeRect, rgba} from "../kit";
import {C, F} from "../theme";
import {FIELDS, PW, REG, int, pvCells} from "../data";
import {CUR, Chip, Stage, anchor, win} from "./common";

const a = (k: number) => anchor(4, k);

export const Sc5 = () => {
  const f = useCurrentFrame();
  const comm = prog(f, a(3), 30), marg = prog(f, a(3) + 40, 30), vk = prog(f, a(3) + 90, 20);
  const {cells} = pvCells({rows: REG, comm, marg, vr: {a: 0, b: 1, name: "East vs West", solve: "late", k: vk}, flash: f / 10});
  const seal = eo(prog(f, a(4), 24));
  const vq = rangeRect(8, 1, 8, 5, PW);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(4)}><Tag label="Enterprise Pivot Formulas" color={C.emerald} parts={[{t: "Calculate Commissions & Margins Dynamically Across 50,000 Rows"}]} /></Cap>,
      <Cap key="1" f={f} a={a(4)} b={9999}><Tag label="Zero File Bloat" color={C.emerald} parts={[{t: "In-Memory Custom Pivot Calculations & Variance Analysis"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Pivot", "Data"]} tab="PivotTable Analyze" ribbon="pivot" pivotTabs name="A4" fx="East"
        sheet={{cells: [...cells, {r: 1, c: 1, t: "Product", bold: true}, {r: 1, c: 2, t: "(All) ▾"}], widths: PW, active: {r: 4, c: 1}, sel: {r1: 4, c1: 1, r2: 4, c2: 1}}}>
        <PivotPane fields={[...FIELDS, "Region", "Commission", "Margin %"].map((n) => ({n, on: ["Region", "Sales_Amount", "Net_Profit", ...(comm > 0.5 ? ["Commission"] : []), ...(marg > 0.5 ? ["Margin %"] : [])].includes(n), calc: n === "Commission" || n === "Margin %"}))} areas={{f: ["Product"], c: [], r: ["Region"], v: ["Sum of Sales_Amount", "Sum of Net_Profit", ...(comm > 0.5 ? ["Sum of Commission"] : []), ...(marg > 0.5 ? ["Sum of Margin %"] : [])]}} />
        {f >= a(0) && f < a(1) ? <Chip x={330} y={420} w={520} color={C.emerald} k={win(f, a(0), a(1))} size={15}>manzooma_sales_2026.xlsx · loaded</Chip> : null}
        {f >= a(1) && f < a(3) ? <Chip x={330} y={420} w={560} color={C.blue} k={win(f, a(1), a(3))} size={15}>tbl_Sales2026 · 50,000 rows · helper columns: 0</Chip> : null}
        {f >= a(3) && f < a(4) ? <Chip x={330} y={420} w={560} color={C.purple} k={win(f, a(3), a(4))} size={15}>Commission · Margin % · East vs West → one Pivot</Chip> : null}
        {vk > 0 && f < a(4) ? <Glow x={vq.x} y={vq.y} w={vq.w - 1} h={vq.h - 1} color={C.purple} k={win(f, a(3) + 90, a(4))} fill={0.1} /> : null}
        {seal > 0 ? (
          <div style={{position: "absolute", left: 300, top: 400, width: 440, height: 190, opacity: seal, transform: `scale(${0.8 + 0.2 * seal})`, background: C.slate, border: `3px solid ${C.emerald}`, borderRadius: 18, boxShadow: `0 0 ${30 * seal}px ${rgba(C.emerald, 0.6)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, boxSizing: "border-box", fontFamily: F.ui}}>
            <svg width="78" height="78" viewBox="0 0 84 84"><circle cx="42" cy="42" r="38" fill={rgba(C.emerald, 0.2)} stroke={C.emerald} strokeWidth="5" /><path d="M24 43 L37 56 L61 28" fill="none" stroke={C.emerald} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div><div style={{color: C.emerald, fontWeight: 700, fontSize: 26}}>Enterprise Pivot</div><div style={{color: C.ink, fontSize: 17, marginTop: 6}}>Fields + Items · 50,000 rows<br />zero file bloat</div></div>
          </div>
        ) : null}
        <Cursor keys={[{f: a(3) - 20, x: 700, y: 440}, {f: a(3) + 40, x: 600, y: 300}, {f: a(4) + 40, x: 900, y: 560}]} />
      </ExcelApp>
    </Stage>
  );
};
void int;
