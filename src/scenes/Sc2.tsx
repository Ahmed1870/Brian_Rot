import {useCurrentFrame} from "remotion";
import {Cap, Cursor, DataGrid, Glow, PPWindow, Tag, TableCard, eo, prog} from "../kit";
import {C} from "../theme";
import {FACT, FACT_F} from "../data";
import {Chip, Root, Stage, anchor, win} from "./common";

const a = (k: number) => anchor(1, k);
const COLS = [{h: "OrderLineID", w: 100}, {h: "DateKey", w: 96}, {h: "CustomerKey", w: 110}, {h: "ProductKey", w: 100}, {h: "StoreKey", w: 90}, {h: "Quantity", w: 90, num: true}, {h: "SalesAmount", w: 110, num: true}, {h: "Discount", w: 90, num: true}];

export const Sc2 = () => {
  const f = useCurrentFrame();
  const met = prog(f, a(3), 20), fk = prog(f, a(4), 20);
  const col: Record<number, string> = {};
  if (met > 0) { col[5] = C.emerald; col[6] = C.emerald; col[7] = C.emerald; }
  if (fk > 0) { col[1] = C.blue; col[2] = C.blue; col[3] = C.blue; col[4] = C.blue; }
  const row = f >= a(5) ? 3 : -1;
  const fields = FACT_F.map((x) => ({...x, k: x.kind === "metric" ? met : x.kind === "fk" ? fk : 0}));
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(1)} b={a(5)}><Tag label="Fact Table Architecture" color={C.emerald} parts={[{t: "Contains Aggregatable Metrics & Foreign Keys "}, {t: "(Tall & Narrow)", c: C.emerald}]} /></Cap>,
      <Cap key="1" f={f} a={a(5)} b={9999}><Tag label="Data Granularity" color={C.emerald} parts={[{t: "Defines Transaction Depth Level (Single Item Line vs. Daily Summary)"}]} /></Cap>,
    ]}>
      <Root>
        <PPWindow view="data" tabs={["Fact_Sales", "Dim_Product", "Dim_Customer", "Dim_Store"]} activeTab="Fact_Sales" status="Record: 1 of 50,000" fx="">
          <DataGrid x={24} y={16} cols={COLS} rows={FACT.slice(0, 9)} colHl={col} hl={row >= 0 ? {[row]: "#C9F1E0"} : {}} />
          <TableCard x={960} y={16} w={260} name="Fact_Sales" fields={fields} glow={met > 0 || fk > 0 ? C.emerald : undefined} rows="50,000 rows" />
          {f >= a(2) ? <div style={{position: "absolute", left: 24, top: 270, opacity: eo(prog(f, a(2), 14)), fontFamily: "Lato, sans-serif"}}>
            <div style={{color: C.emerald, fontWeight: 700, fontSize: 16}}>↕ TALL · 50,000 rows (one row per event)</div>
            <div style={{color: C.blue, fontWeight: 700, fontSize: 16, marginTop: 6}}>↔ NARROW · 8 columns only: keys + numbers</div>
          </div> : null}
        </PPWindow>
        {f >= a(1) && f < a(2) ? <Chip x={330} y={412} w={520} color={C.blue} k={win(f, a(1), a(2))} size={15}>Fact_Sales · records every sale / movement</Chip> : null}
        {f >= a(3) && f < a(4) ? <Chip x={330} y={412} w={520} color={C.emerald} k={win(f, a(3), a(4))} size={15}>Σ Quantity · SalesAmount · Discount = measures</Chip> : null}
        {f >= a(4) && f < a(5) ? <Chip x={330} y={412} w={560} color={C.blue} k={win(f, a(4), a(5))} size={15}>↗ DateKey · CustomerKey · ProductKey · StoreKey = Foreign Keys</Chip> : null}
        {row >= 0 ? <Glow x={24} y={180 + 16 + 20 * 4} w={840} h={19} color={C.emerald} k={f < a(6) + 100 ? win(f, a(5), a(6) + 100) : 0.85} fill={0.1} /> : null}
        {f >= a(5) && f < a(6) ? <Chip x={330} y={412} w={520} color={C.emerald} k={win(f, a(5), a(6))} size={15}>Granularity: 1 row = 1 order line (finest level)</Chip> : null}
        {f >= a(6) ? <div><Chip x={330} y={412} w={400} h={30} color={C.emerald} k={eo(prog(f, a(6), 14))} size={14}>Single item line ✓ finest detail</Chip><Chip x={750} y={412} w={400} h={30} color={C.amber} k={eo(prog(f, a(6) + 30, 14))} size={14}>Daily summary → coarser, less detail</Chip></div> : null}
        <Cursor keys={[{f: a(3) - 20, x: 640, y: 480}, {f: a(3), x: 760, y: 220, click: true}, {f: a(4), x: 360, y: 220, click: true}, {f: a(5), x: 120, y: 280, click: true}, {f: a(6) + 40, x: 900, y: 500}]} />
      </Root>
    </Stage>
  );
};
