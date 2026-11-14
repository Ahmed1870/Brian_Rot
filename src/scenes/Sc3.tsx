import {useCurrentFrame} from "remotion";
import {Cap, Cursor, DataGrid, Glow, PPWindow, Tag, TableCard, eo, prog, rgba} from "../kit";
import {C, F} from "../theme";
import {CUST_F, DIMP, PROD_F, STORE_F} from "../data";
import {Chip, Root, Stage, anchor, win} from "./common";

const a = (k: number) => anchor(2, k);
const COLS = [{h: "ProductKey", w: 100}, {h: "ProductName", w: 140}, {h: "Category", w: 120}, {h: "Subcategory", w: 120}, {h: "Brand", w: 90}];

export const Sc3 = () => {
  const f = useCurrentFrame();
  const at = prog(f, a(5), 20), pk = prog(f, a(6), 20);
  const col: Record<number, string> = {};
  if (at > 0) { col[1] = C.amber; col[2] = C.amber; col[3] = C.amber; col[4] = C.amber; }
  if (pk > 0) col[0] = C.purple;
  const P = PROD_F.map((x) => ({...x, k: x.kind === "pk" ? pk : at}));
  const Cc = CUST_F.map((x) => ({...x, k: x.kind === "pk" ? pk : at}));
  const S = STORE_F.map((x) => ({...x, k: x.kind === "pk" ? pk : at}));
  const show = eo(prog(f, a(1), 20));
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(1)} b={a(6)}><Tag label="Dimension Table Architecture" color={C.amber} parts={[{t: "Contains Descriptive Attributes & Unique Primary Keys "}, {t: "(Short & Wide)", c: C.amber}]} /></Cap>,
      <Cap key="1" f={f} a={a(6)} b={9999}><Tag label="Strict Uniqueness" color={C.purple} parts={[{t: "Primary Key Column Must Contain Zero Duplicates"}]} /></Cap>,
    ]}>
      <Root>
        <PPWindow view="data" tabs={["Fact_Sales", "Dim_Product", "Dim_Customer", "Dim_Store"]} activeTab="Dim_Product" status="Record: 1 of 1,200" fx="">
          <DataGrid x={24} y={16} cols={COLS} rows={DIMP} colHl={col} />
          <div style={{position: "absolute", left: 0, top: 0, opacity: show}}>
            <TableCard x={620} y={16} w={200} name="Dim_Customer" fields={Cc} glow={pk > 0 ? C.purple : undefined} rows="8,400 rows" />
            <TableCard x={836} y={16} w={190} name="Dim_Store" fields={S} glow={pk > 0 ? C.purple : undefined} rows="24 rows" />
            <TableCard x={1042} y={16} w={218} name="Dim_Product" fields={P} glow={pk > 0 ? C.purple : undefined} rows="1,200" />
          </div>
          {f >= a(4) ? <div style={{position: "absolute", left: 24, top: 200, opacity: eo(prog(f, a(4), 14)), fontFamily: F.ui, fontWeight: 700, fontSize: 16}}>
            <div style={{color: C.amber}}>↔ WIDE · many descriptive columns</div><div style={{color: C.blue, marginTop: 6}}>↕ SHORT · one row per product / customer / store</div>
          </div> : null}
          {pk > 0 ? <div style={{position: "absolute", left: 24, top: 270, padding: "8px 14px", borderRadius: 10, background: C.slate, border: `2px solid ${C.purple}`, color: "#fff", fontFamily: F.mono, fontSize: 15, fontWeight: 700, boxShadow: `0 0 16px ${rgba(C.purple, 0.6)}`, opacity: pk}}>🔒 DISTINCT(ProductKey) = 7 · ROWS = 7 ✓ unique</div> : null}
        </PPWindow>
        {f >= a(1) && f < a(4) ? <Chip x={24} y={420} w={560} color={C.blue} k={win(f, a(1), a(4))} size={15}>Dim_Product · Dim_Customer · Dim_Store → context for the facts</Chip> : null}
        {f >= a(5) && f < a(6) ? <Chip x={24} y={420} w={560} color={C.amber} k={win(f, a(5), a(6))} size={15}>ProductName · Category · Subcategory · Brand → filter & slice reports</Chip> : null}
        {pk > 0 && f < a(7) ? <Glow x={24} y={196} w={100} h={19 + 20 * 7} color={C.purple} k={win(f, a(6), a(7))} fill={0.06} /> : null}
        {f >= a(7) ? (
          <div style={{position: "absolute", left: 640, top: 396, width: 620, height: 64, background: C.slate, border: `2px solid ${C.red}`, borderRadius: 12, boxShadow: `0 0 16px ${rgba(C.red, 0.5)}`, boxSizing: "border-box", padding: "8px 14px", color: "#fff", fontFamily: F.ui, opacity: eo(prog(f, a(7), 14))}}>
            <div style={{color: C.red, fontWeight: 700, fontSize: 16}}>ProductKey 12 appears twice ✗ → relationships break</div><div style={{fontSize: 13.5, marginTop: 3}}>A dimension key must be unique — one row per entity</div>
          </div>
        ) : null}
        <Cursor keys={[{f: a(0) + 20, x: 640, y: 480}, {f: a(5), x: 380, y: 260, click: true}, {f: a(6), x: 80, y: 260, click: true}, {f: a(7) + 40, x: 900, y: 520}]} />
      </Root>
    </Stage>
  );
};
