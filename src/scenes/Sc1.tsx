import {useCurrentFrame} from "remotion";
import {Cap, Cursor, DataGrid, Glow, PPWindow, Tag, TableCard, TopBadge, eo, lerp, prog} from "../kit";
import {C} from "../theme";
import {CUST_F, FACT_F, FLAT, PROD_F, STORE_F} from "../data";
import {Chip, Root, Stage, anchor, win} from "./common";

const a = (k: number) => anchor(0, k);
const COLS = [{h: "OrderID", w: 70}, {h: "Customer", w: 110}, {h: "City", w: 90}, {h: "Product", w: 100}, {h: "Category", w: 100}, {h: "Store", w: 120}, {h: "Qty", w: 50, num: true}, {h: "Amount", w: 90, num: true}];
const CARDS = [
  {n: "Fact_Sales", x: 500, y: 40, w: 250, f: FACT_F, c: C.emerald, rows: "50,000 rows"}, {n: "Dim_Product", x: 130, y: 40, w: 230, f: PROD_F, c: C.blue, rows: ""},
  {n: "Dim_Customer", x: 930, y: 40, w: 230, f: CUST_F, c: C.blue, rows: ""}, {n: "Dim_Store", x: 520, y: 270, w: 210, f: STORE_F, c: C.blue, rows: ""},
];

export const Sc1 = () => {
  const f = useCurrentFrame();
  const dec = a(7);
  const diagram = f >= dec;
  const flatK = 1 - prog(f, dec, 26);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(6)}><TopBadge ar="الدرس 53 من 76 | الوحدة 11 من 14" en="Fact & Dimension Tables Architecture" /></Cap>,
      <Cap key="1" f={f} a={a(6)} b={9999}><Tag label="Relational Data Modeling" color={C.blue} parts={[{t: "Fact (Transactions & Metrics)", c: C.emerald}, {t: " vs. "}, {t: "Dimension (Descriptive Context)", c: C.blue}]} /></Cap>,
    ]}>
      <Root>
        <PPWindow view={diagram ? "diagram" : "data"} tabs={["Flat_Sales"]} activeTab="Flat_Sales" status={diagram ? "" : "Record: 1 of 50,000"} fx="">
          {flatK > 0 ? (
            <div style={{position: "absolute", left: 0, top: 0, width: 1280, height: 426, opacity: flatK}}>
              <DataGrid x={40} y={24} cols={COLS} rows={FLAT} colHl={f >= a(6) ? {1: C.amber, 3: C.amber, 5: C.amber} : {}} />
              {f >= a(6) && f < dec ? <Glow x={40} y={24} w={730} h={180} color={C.red} k={win(f, a(6), dec)} fill={0.03} /> : null}
            </div>
          ) : null}
          {diagram ? CARDS.map((c, i) => {
            const k = eo(prog(f, dec + 6 + i * 12, 34));
            const sx = 300, sy = 90;
            return <div key={c.n} style={{position: "absolute", left: 0, top: 0, opacity: k}}><TableCard x={lerp(sx, c.x, k)} y={lerp(sy, c.y, k)} w={c.w} name={c.n} fields={c.f} glow={f > dec + 70 ? c.c : undefined} rows={c.rows} /></div>;
          }) : null}
          {f >= a(8) ? <div style={{position: "absolute", left: 0, top: 0}}>
            <Chip x={470} y={250} w={300} color={C.emerald} k={eo(prog(f, a(8), 14))} size={14}>Fact · transactions & metrics</Chip>
            <Chip x={780} y={150} w={300} color={C.blue} k={eo(prog(f, a(8) + 30, 14))} size={14}>Dimensions · descriptive context</Chip>
          </div> : null}
        </PPWindow>
        {f >= a(6) && f < dec ? <Chip x={330} y={420} w={640} h={34} color={C.red} k={win(f, a(6), dec)} size={15}>One wide table → customer & product text repeated on every row ✗</Chip> : null}
        {f < a(6) ? <Chip x={330} y={420} w={520} color={C.blue} k={win(f, a(0) + 20, a(6))} size={15}>Power Pivot · Data Model · Flat_Sales (50,000 rows)</Chip> : null}
        <Cursor keys={[{f: dec - 40, x: 640, y: 440}, {f: dec - 14, x: 1138, y: 104, click: true}, {f: dec + 80, x: 900, y: 460}]} />
      </Root>
    </Stage>
  );
};
void eo;
