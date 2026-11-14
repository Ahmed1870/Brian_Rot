import {useCurrentFrame} from "remotion";
import {Cap, Cursor, PPWindow, Tag, TableCard, eo, lerp, prog, rgba} from "../kit";
import {C, F} from "../theme";
import {CUST_F, FACT_F, PROD_F, STORE_F} from "../data";
import {Chip, Root, Stage, anchor, win} from "./common";

const a = (k: number) => anchor(4, k);
const T = [
  {n: "Fact_Sales", x: 640, y: 40, w: 240, f: FACT_F, rows: "50,000 rows"}, {n: "Dim_Product", x: 400, y: 40, w: 220, f: PROD_F, rows: "1,200"},
  {n: "Dim_Customer", x: 960, y: 40, w: 220, f: CUST_F, rows: "8,400"}, {n: "Dim_Store", x: 700, y: 260, w: 200, f: STORE_F, rows: "24"},
];

export const Sc5 = () => {
  const f = useCurrentFrame();
  const sp = a(2), md = a(3);
  const seal = eo(prog(f, a(4), 24));
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(4)}><Tag label="Enterprise Schema Architecture" color={C.emerald} parts={[{t: "Segregate 50,000 Rows into Fact & Dimension Tables"}]} /></Cap>,
      <Cap key="1" f={f} a={a(4)} b={9999}><Tag label="Zero Latency Modeling" color={C.emerald} parts={[{t: "Star-Ready Schema Processing in the Data Model"}]} /></Cap>,
    ]}>
      <Root>
        <PPWindow view="diagram" status="">
          {f >= a(1) ? <div style={{position: "absolute", left: 24, top: 40, width: 330, height: 200, opacity: eo(prog(f, a(1), 20)) * (1 - 0.6 * prog(f, sp + 30, 30)), background: C.slate, border: `2.5px solid ${C.red}`, borderRadius: 14, boxShadow: `0 0 18px ${rgba(C.red, 0.4)}`, boxSizing: "border-box", padding: 16, fontFamily: F.ui, color: "#fff"}}>
            <div style={{fontWeight: 700, fontSize: 19, color: C.red}}>manzooma_sales_2026.xlsx</div>
            <div style={{fontSize: 34, fontWeight: 700, marginTop: 10}}>50,000 rows</div><div style={{fontSize: 15, color: "#CBD5E1", marginTop: 6}}>one wide table · 8 columns</div>
          </div> : null}
          {f >= sp ? T.map((t, i) => {
            const k = eo(prog(f, sp + i * 14, 40));
            const glow = f >= md ? C.emerald : undefined;
            return <div key={t.n} style={{position: "absolute", left: 0, top: 0, opacity: k}}><TableCard x={lerp(190, t.x, k)} y={lerp(180, t.y, k)} w={t.w} name={t.n} fields={t.f} glow={glow} rows={t.rows} /></div>;
          }) : null}
          {f >= md ? <div style={{position: "absolute", left: 380, top: 10, width: 820, height: 398, border: `2.5px dashed ${C.emerald}`, borderRadius: 14, opacity: eo(prog(f, md, 20))}}><div style={{position: "absolute", left: 14, top: -2, fontSize: 13, fontWeight: 700, color: C.green, fontFamily: F.ui, background: "#F2F4F7", padding: "0 6px"}}>Data Model</div></div> : null}
        </PPWindow>
        {f >= a(0) && f < a(1) ? <Chip x={440} y={560} w={520} color={C.emerald} k={win(f, a(0), a(1))} size={15}>manzooma_sales_2026.xlsx · loaded</Chip> : null}
        {f >= a(2) && f < md ? <Chip x={440} y={560} w={620} color={C.blue} k={win(f, a(2), md)} size={15}>50,000 rows → Fact_Sales + 3 dimension tables</Chip> : null}
        {f >= md && f < a(4) + 20 ? <Chip x={440} y={560} w={620} color={C.emerald} k={win(f, md, a(4) + 20)} size={15}>Schema sent to the Data Model · star-ready ✓</Chip> : null}
        {seal > 0 ? (
          <div style={{position: "absolute", left: 40, top: 452, width: 380, height: 140, opacity: seal, transform: `scale(${0.8 + 0.2 * seal})`, background: C.slate, border: `3px solid ${C.emerald}`, borderRadius: 18, boxShadow: `0 0 ${30 * seal}px ${rgba(C.emerald, 0.6)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, boxSizing: "border-box", fontFamily: F.ui}}>
            <svg width="62" height="62" viewBox="0 0 84 84"><circle cx="42" cy="42" r="38" fill={rgba(C.emerald, 0.2)} stroke={C.emerald} strokeWidth="5" /><path d="M24 43 L37 56 L61 28" fill="none" stroke={C.emerald} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div><div style={{color: C.emerald, fontWeight: 700, fontSize: 22}}>Fact & Dim Seal</div><div style={{color: C.ink, fontSize: 15, marginTop: 4}}>1 fact · 3 dimensions<br />ready for relationships</div></div>
          </div>
        ) : null}
        <Cursor keys={[{f: sp - 30, x: 640, y: 480}, {f: sp, x: 190, y: 300}, {f: md + 20, x: 800, y: 400}, {f: a(4) + 60, x: 900, y: 560}]} />
      </Root>
    </Stage>
  );
};
